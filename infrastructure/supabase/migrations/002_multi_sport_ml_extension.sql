-- Fantasy AI Multi-Sport & ML Training Database Extension
-- Extends NBA Draft Buddy to support multiple sports and ML model training
-- Author: NBA Draft Buddy Team
-- Date: 2025-11-12

-- ========================================
-- SPORTS & LEAGUE CONFIGURATION
-- ========================================

-- Sports catalog table
CREATE TABLE sports (
    sport_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    abbreviation TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,

    -- Sport-specific configuration
    default_positions TEXT[] NOT NULL,
    default_stat_categories TEXT[] NOT NULL,
    season_structure JSONB DEFAULT '{}', -- Regular season, playoffs, etc.

    -- ML configuration
    ml_model_version TEXT,
    ml_features JSONB DEFAULT '[]',
    prediction_accuracy DECIMAL(5,2), -- Historical accuracy %

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert supported sports
INSERT INTO sports (sport_id, abbreviation, name, default_positions, default_stat_categories) VALUES
('nba', 'NBA', 'Basketball',
 ARRAY['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'],
 ARRAY['points', 'rebounds', 'assists', 'steals', 'blocks', 'fg_pct', 'ft_pct', 'three_pointers', 'turnovers']),
('nfl', 'NFL', 'Football',
 ARRAY['QB', 'RB', 'WR', 'TE', 'K', 'DST', 'FLEX'],
 ARRAY['passing_yards', 'passing_tds', 'rushing_yards', 'rushing_tds', 'receptions', 'receiving_yards', 'receiving_tds']),
('mlb', 'MLB', 'Baseball',
 ARRAY['C', '1B', '2B', '3B', 'SS', 'OF', 'SP', 'RP', 'UTIL'],
 ARRAY['avg', 'runs', 'hr', 'rbi', 'sb', 'era', 'whip', 'k', 'wins', 'saves']),
('nhl', 'NHL', 'Hockey',
 ARRAY['C', 'LW', 'RW', 'D', 'G', 'UTIL'],
 ARRAY['goals', 'assists', 'plus_minus', 'pim', 'ppp', 'sog', 'wins', 'gaa', 'sv_pct']),
('soccer', 'SOCCER', 'Soccer',
 ARRAY['GK', 'DEF', 'MID', 'FWD'],
 ARRAY['goals', 'assists', 'clean_sheets', 'saves', 'bonus_points']);

-- ========================================
-- MULTI-SPORT PLAYER SCHEMA
-- ========================================

-- Extend players table to support multiple sports
ALTER TABLE players ADD COLUMN IF NOT EXISTS sport_id TEXT REFERENCES sports(sport_id) DEFAULT 'nba';
ALTER TABLE players ADD COLUMN IF NOT EXISTS sport_specific_data JSONB DEFAULT '{}';
ALTER TABLE players ADD COLUMN IF NOT EXISTS ml_rating DECIMAL(5,2); -- ML-generated overall rating
ALTER TABLE players ADD COLUMN IF NOT EXISTS breakout_probability DECIMAL(5,4); -- 0.0000 to 1.0000
ALTER TABLE players ADD COLUMN IF NOT EXISTS injury_risk_score DECIMAL(5,4); -- 0.0000 to 1.0000

CREATE INDEX idx_players_sport ON players (sport_id);
CREATE INDEX idx_players_ml_rating ON players (ml_rating DESC) WHERE ml_rating IS NOT NULL;

-- ========================================
-- ML TRAINING DATA TABLES
-- ========================================

-- ML Training Dataset table - Stores historical data for model training
CREATE TABLE ml_training_data (
    training_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id TEXT REFERENCES sports(sport_id) ON DELETE CASCADE,
    player_id TEXT REFERENCES players(player_id) ON DELETE CASCADE,

    -- Training features (input)
    season TEXT NOT NULL,
    week_or_game_number INTEGER,
    features JSONB NOT NULL, -- All input features for ML model

    -- Training labels (output/target)
    actual_performance JSONB NOT NULL, -- What actually happened
    fantasy_points DECIMAL(6,2), -- Actual fantasy points scored

    -- Context
    opponent TEXT,
    is_home_game BOOLEAN,
    rest_days INTEGER,
    weather_conditions JSONB, -- For outdoor sports

    -- Model metadata
    data_quality_score DECIMAL(3,2), -- 0.00 to 1.00
    is_outlier BOOLEAN DEFAULT false,
    training_set TEXT DEFAULT 'train', -- 'train', 'validation', 'test'

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(player_id, season, week_or_game_number)
);

CREATE INDEX idx_ml_training_sport ON ml_training_data (sport_id);
CREATE INDEX idx_ml_training_player ON ml_training_data (player_id);
CREATE INDEX idx_ml_training_season ON ml_training_data (season);
CREATE INDEX idx_ml_training_set ON ml_training_data (training_set);

-- ML Model Predictions table - Stores model predictions for validation
CREATE TABLE ml_predictions (
    prediction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    sport_id TEXT REFERENCES sports(sport_id),
    player_id TEXT REFERENCES players(player_id) ON DELETE CASCADE,

    -- Prediction details
    prediction_date DATE NOT NULL,
    game_date DATE NOT NULL,
    predicted_stats JSONB NOT NULL,
    predicted_fantasy_points DECIMAL(6,2),
    confidence_score DECIMAL(5,4), -- 0.0000 to 1.0000

    -- Feature importance for explainability
    feature_importance JSONB DEFAULT '{}',

    -- Actual results (populated after game)
    actual_stats JSONB,
    actual_fantasy_points DECIMAL(6,2),
    prediction_error DECIMAL(6,2), -- Absolute error

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    evaluated_at TIMESTAMPTZ
);

CREATE INDEX idx_predictions_player_game ON ml_predictions (player_id, game_date);
CREATE INDEX idx_predictions_model ON ml_predictions (model_name, model_version);
CREATE INDEX idx_predictions_date ON ml_predictions (game_date DESC);
CREATE INDEX idx_predictions_unevaluated ON ml_predictions (evaluated_at) WHERE evaluated_at IS NULL;

-- ML Model Performance table - Tracks model accuracy over time
CREATE TABLE ml_model_performance (
    performance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    sport_id TEXT REFERENCES sports(sport_id),

    -- Performance metrics
    evaluation_period_start DATE NOT NULL,
    evaluation_period_end DATE NOT NULL,
    total_predictions INTEGER NOT NULL,

    -- Accuracy metrics
    mean_absolute_error DECIMAL(6,2),
    root_mean_squared_error DECIMAL(6,2),
    r_squared DECIMAL(5,4),
    accuracy_by_position JSONB DEFAULT '{}',
    accuracy_by_stat JSONB DEFAULT '{}',

    -- Model details
    hyperparameters JSONB DEFAULT '{}',
    training_dataset_size INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(model_name, model_version, evaluation_period_start, evaluation_period_end)
);

CREATE INDEX idx_model_performance_sport ON ml_model_performance (sport_id);
CREATE INDEX idx_model_performance_model ON ml_model_performance (model_name, model_version);

-- ========================================
-- PLAYER SIMILARITY & COMPARISONS (for ML)
-- ========================================

-- Player similarity matrix for comparable players analysis
CREATE TABLE player_similarity (
    similarity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id TEXT REFERENCES sports(sport_id),
    player_id TEXT REFERENCES players(player_id) ON DELETE CASCADE,
    similar_player_id TEXT REFERENCES players(player_id) ON DELETE CASCADE,

    similarity_score DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
    similarity_method TEXT DEFAULT 'cosine', -- cosine, euclidean, correlation

    -- Why they're similar
    similar_features JSONB DEFAULT '{}',

    -- Season/context
    season TEXT,
    as_of_date DATE DEFAULT CURRENT_DATE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT no_self_similarity CHECK (player_id != similar_player_id),
    CONSTRAINT valid_similarity_score CHECK (similarity_score BETWEEN 0 AND 1)
);

CREATE INDEX idx_player_similarity_player ON player_similarity (player_id, similarity_score DESC);
CREATE INDEX idx_player_similarity_sport ON player_similarity (sport_id);

-- ========================================
-- ADVANCED ANALYTICS & FEATURES
-- ========================================

-- Player trends table - Track statistical trends for ML features
CREATE TABLE player_trends (
    trend_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id TEXT REFERENCES sports(sport_id),
    player_id TEXT REFERENCES players(player_id) ON DELETE CASCADE,

    -- Trend data
    stat_category TEXT NOT NULL,
    trend_period TEXT NOT NULL, -- 'last_5_games', 'last_10_games', 'last_30_days', 'season'

    -- Statistical measures
    trend_direction TEXT, -- 'improving', 'declining', 'stable'
    slope DECIMAL(8,4), -- Rate of change
    moving_average DECIMAL(8,2),
    volatility DECIMAL(6,4), -- Standard deviation

    -- Time context
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    calculated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_trend_direction CHECK (trend_direction IN ('improving', 'declining', 'stable'))
);

CREATE INDEX idx_player_trends_player_stat ON player_trends (player_id, stat_category);
CREATE INDEX idx_player_trends_period ON player_trends (trend_period);

-- Team performance context (affects player projections)
CREATE TABLE team_context (
    context_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id TEXT REFERENCES sports(sport_id),
    team_code TEXT NOT NULL,
    season TEXT NOT NULL,

    -- Team performance metrics
    win_loss_record JSONB DEFAULT '{}',
    offensive_rating DECIMAL(6,2),
    defensive_rating DECIMAL(6,2),
    pace DECIMAL(6,2), -- Possessions per game

    -- Strength of schedule
    strength_of_schedule DECIMAL(5,4),
    remaining_schedule_difficulty DECIMAL(5,4),

    -- Context for ML
    injury_impact_score DECIMAL(5,4), -- How injured the team is
    coaching_stability BOOLEAN DEFAULT true,
    recent_trades JSONB DEFAULT '[]',

    as_of_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(sport_id, team_code, season, as_of_date)
);

CREATE INDEX idx_team_context_sport_team ON team_context (sport_id, team_code);
CREATE INDEX idx_team_context_season ON team_context (season);

-- ========================================
-- MULTI-SPORT DRAFT ENHANCEMENTS
-- ========================================

-- Update league_settings to support multiple sports
ALTER TABLE league_settings ADD COLUMN IF NOT EXISTS sport_id TEXT REFERENCES sports(sport_id) DEFAULT 'nba';
CREATE INDEX idx_league_settings_sport ON league_settings (sport_id);

-- Update draft_sessions to track sport
ALTER TABLE draft_sessions ADD COLUMN IF NOT EXISTS sport_id TEXT REFERENCES sports(sport_id) DEFAULT 'nba';
CREATE INDEX idx_draft_sessions_sport ON draft_sessions (sport_id);

-- Draft pick analysis - Post-draft ML analysis
CREATE TABLE draft_pick_analysis (
    analysis_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pick_id UUID REFERENCES draft_picks(pick_id) ON DELETE CASCADE,

    -- Value analysis
    expected_value DECIMAL(6,2), -- Based on ML model
    actual_pick_position INTEGER,
    expected_pick_position DECIMAL(5,1), -- ADP
    value_over_replacement DECIMAL(6,2), -- VORP

    -- Risk assessment
    injury_risk DECIMAL(5,4),
    bust_probability DECIMAL(5,4),
    ceiling_projection DECIMAL(6,2),
    floor_projection DECIMAL(6,2),

    -- Post-season evaluation
    season_performance JSONB,
    was_good_pick BOOLEAN, -- Evaluated at end of season

    created_at TIMESTAMPTZ DEFAULT NOW(),
    evaluated_at TIMESTAMPTZ
);

CREATE INDEX idx_draft_analysis_pick ON draft_pick_analysis (pick_id);

-- ========================================
-- ML FEATURE ENGINEERING VIEWS
-- ========================================

-- Recent performance view (common ML feature)
CREATE VIEW player_recent_performance AS
SELECT
    pgl.player_id,
    p.sport_id,
    COUNT(*) as games_played,
    AVG(pgl.points) as avg_points,
    AVG(pgl.rebounds) as avg_rebounds,
    AVG(pgl.assists) as avg_assists,
    AVG(pgl.steals) as avg_steals,
    AVG(pgl.blocks) as avg_blocks,
    STDDEV(pgl.points) as points_volatility,
    MAX(pgl.game_date) as last_game_date
FROM player_game_logs pgl
JOIN players p ON pgl.player_id = p.player_id
WHERE pgl.game_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY pgl.player_id, p.sport_id;

-- Player career trajectory (for ML aging curves)
CREATE VIEW player_career_trajectory AS
SELECT
    p.player_id,
    p.sport_id,
    p.age,
    p.experience,
    p.current_season_stats,
    pt.trend_direction,
    pt.slope as performance_trend_slope,
    ps.similarity_score as comparable_player_similarity
FROM players p
LEFT JOIN player_trends pt ON p.player_id = pt.player_id
    AND pt.stat_category = 'points'
    AND pt.trend_period = 'season'
LEFT JOIN player_similarity ps ON p.player_id = ps.player_id
WHERE p.is_active = true;

-- ========================================
-- ML DATA QUALITY & VALIDATION
-- ========================================

-- Data quality checks table
CREATE TABLE data_quality_checks (
    check_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id TEXT REFERENCES sports(sport_id),
    table_name TEXT NOT NULL,

    -- Check details
    check_type TEXT NOT NULL, -- 'completeness', 'accuracy', 'consistency', 'timeliness'
    check_description TEXT,

    -- Results
    records_checked INTEGER,
    records_passed INTEGER,
    records_failed INTEGER,
    pass_rate DECIMAL(5,2),

    -- Issue details
    issues_found JSONB DEFAULT '[]',

    checked_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_check_type CHECK (check_type IN ('completeness', 'accuracy', 'consistency', 'timeliness'))
);

CREATE INDEX idx_data_quality_sport ON data_quality_checks (sport_id);
CREATE INDEX idx_data_quality_table ON data_quality_checks (table_name);

-- ========================================
-- TRIGGERS & FUNCTIONS
-- ========================================

-- Update sport updated_at trigger
CREATE TRIGGER update_sports_updated_at BEFORE UPDATE ON sports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_context_updated_at BEFORE UPDATE ON team_context
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate fantasy points (sport-specific)
CREATE OR REPLACE FUNCTION calculate_fantasy_points(
    sport TEXT,
    stats JSONB,
    scoring_settings JSONB
) RETURNS DECIMAL(6,2) AS $$
DECLARE
    total_points DECIMAL(6,2) := 0;
    stat_key TEXT;
    stat_value NUMERIC;
    point_value NUMERIC;
BEGIN
    -- Iterate through stats and apply scoring
    FOR stat_key, stat_value IN SELECT * FROM jsonb_each_text(stats)
    LOOP
        point_value := (scoring_settings->>stat_key)::NUMERIC;
        IF point_value IS NOT NULL THEN
            total_points := total_points + (stat_value * point_value);
        END IF;
    END LOOP;

    RETURN total_points;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update ML ratings after predictions
CREATE OR REPLACE FUNCTION update_player_ml_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update player's ML rating based on recent predictions
    UPDATE players
    SET ml_rating = (
        SELECT AVG(predicted_fantasy_points)
        FROM ml_predictions
        WHERE player_id = NEW.player_id
          AND game_date >= CURRENT_DATE - INTERVAL '30 days'
    )
    WHERE player_id = NEW.player_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ml_rating_after_prediction
AFTER INSERT ON ml_predictions
FOR EACH ROW EXECUTE FUNCTION update_player_ml_rating();

-- ========================================
-- SAMPLE ML TRAINING DATA VIEWS
-- ========================================

-- View: Complete ML feature set for a player
CREATE VIEW ml_player_features AS
SELECT
    p.player_id,
    p.sport_id,
    p.name,
    p.age,
    p.experience,
    p.positions,
    p.current_season_stats,
    p.injury_status,
    p.ml_rating,
    prp.avg_points as recent_avg_points,
    prp.points_volatility,
    tc.pace as team_pace,
    tc.offensive_rating as team_offensive_rating,
    pt.trend_direction,
    pt.slope as performance_slope,
    p.breakout_probability,
    p.injury_risk_score
FROM players p
LEFT JOIN player_recent_performance prp ON p.player_id = prp.player_id
LEFT JOIN team_context tc ON p.team = tc.team_code AND p.sport_id = tc.sport_id
LEFT JOIN player_trends pt ON p.player_id = pt.player_id AND pt.trend_period = 'season'
WHERE p.is_active = true;

-- View: Training/validation data split
CREATE VIEW ml_training_validation_split AS
SELECT
    sport_id,
    training_set,
    COUNT(*) as record_count,
    AVG(fantasy_points) as avg_fantasy_points,
    MIN(season) as earliest_season,
    MAX(season) as latest_season
FROM ml_training_data
GROUP BY sport_id, training_set;

-- ========================================
-- PERMISSIONS & RLS
-- ========================================

-- Sports table is publicly readable
CREATE POLICY "Sports are publicly readable" ON sports
    FOR SELECT USING (true);

-- ML data is readable for analysis but write-protected
CREATE POLICY "ML training data is readable" ON ml_training_data
    FOR SELECT USING (true);

CREATE POLICY "ML predictions are readable" ON ml_predictions
    FOR SELECT USING (true);

-- Grant appropriate permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE sports IS 'Catalog of supported sports with default configurations';
COMMENT ON TABLE ml_training_data IS 'Historical player performance data for ML model training';
COMMENT ON TABLE ml_predictions IS 'ML model predictions with actual outcomes for validation';
COMMENT ON TABLE ml_model_performance IS 'Model accuracy metrics and performance tracking';
COMMENT ON TABLE player_similarity IS 'Player similarity matrix for comparable player analysis';
COMMENT ON TABLE player_trends IS 'Statistical trends for ML feature engineering';
COMMENT ON TABLE team_context IS 'Team-level context affecting player performance';
COMMENT ON TABLE draft_pick_analysis IS 'Post-draft ML analysis of pick value';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Fantasy AI Multi-Sport & ML Extension installed successfully!';
    RAISE NOTICE 'Supported sports: NBA, NFL, MLB, NHL, Soccer';
    RAISE NOTICE 'ML training tables: ml_training_data, ml_predictions, ml_model_performance';
    RAISE NOTICE 'Ready for multi-sport fantasy analytics and ML model training!';
END $$;
