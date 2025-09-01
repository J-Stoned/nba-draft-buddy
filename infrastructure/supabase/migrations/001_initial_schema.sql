-- NBA Draft Buddy Database Schema
-- Production-ready schema optimized for fantasy basketball drafts

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Players table with comprehensive stats
CREATE TABLE players (
    player_id TEXT PRIMARY KEY,
    yahoo_player_id TEXT UNIQUE,
    name TEXT NOT NULL,
    team TEXT NOT NULL,
    positions TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT true,
    injury_status TEXT DEFAULT 'healthy',
    age INTEGER,
    experience INTEGER DEFAULT 0,
    adp DECIMAL(5,2), -- Average Draft Position
    
    -- Current season stats (JSON for flexibility)
    current_season_stats JSONB NOT NULL DEFAULT '{}',
    projected_stats JSONB DEFAULT '{}',
    advanced_stats JSONB DEFAULT '{}',
    team_stats JSONB DEFAULT '{}',
    
    -- Metadata
    photo_url TEXT,
    contract_status TEXT DEFAULT 'signed',
    is_contract_year BOOLEAN DEFAULT false,
    injury_history JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for fast lookups
    CONSTRAINT valid_injury_status CHECK (injury_status IN ('healthy', 'questionable', 'doubtful', 'out', 'injured_reserve')),
    CONSTRAINT valid_positions CHECK (array_length(positions, 1) > 0)
);

-- Optimized indexes for player queries
CREATE INDEX idx_players_name ON players USING GIN (name gin_trgm_ops);
CREATE INDEX idx_players_team ON players (team);
CREATE INDEX idx_players_positions ON players USING GIN (positions);
CREATE INDEX idx_players_active ON players (is_active) WHERE is_active = true;
CREATE INDEX idx_players_adp ON players (adp) WHERE adp IS NOT NULL;
CREATE INDEX idx_players_updated ON players (updated_at);

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    display_name TEXT,
    yahoo_user_id TEXT UNIQUE,
    
    -- User preferences
    preferences JSONB DEFAULT '{}',
    subscription_info JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ DEFAULT NOW()
);

-- User strategies table
CREATE TABLE user_strategies (
    strategy_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    strategy_type TEXT NOT NULL,
    category_weights JSONB NOT NULL DEFAULT '{}',
    risk_tolerance TEXT DEFAULT 'moderate',
    target_positions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_strategy_type CHECK (strategy_type IN ('balanced', 'punt_fg', 'punt_ft', 'punt_assists', 'punt_turnovers', 'stars_and_scrubs', 'custom')),
    CONSTRAINT valid_risk_tolerance CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive'))
);

CREATE INDEX idx_user_strategies_user_id ON user_strategies (user_id);
CREATE INDEX idx_user_strategies_active ON user_strategies (is_active) WHERE is_active = true;

-- League settings table
CREATE TABLE league_settings (
    league_id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    league_type TEXT NOT NULL DEFAULT 'roto',
    team_count INTEGER DEFAULT 12,
    roster_size INTEGER DEFAULT 13,
    starting_lineup JSONB NOT NULL DEFAULT '{}',
    scoring_categories TEXT[] NOT NULL,
    playoff_settings JSONB DEFAULT '{}',
    draft_settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_league_type CHECK (league_type IN ('roto', 'head_to_head', 'points')),
    CONSTRAINT valid_team_count CHECK (team_count BETWEEN 4 AND 20),
    CONSTRAINT valid_roster_size CHECK (roster_size BETWEEN 8 AND 20)
);

-- Draft sessions table for live drafts
CREATE TABLE draft_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    league_id TEXT REFERENCES league_settings(league_id),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Draft state
    current_pick INTEGER DEFAULT 1,
    total_picks INTEGER NOT NULL,
    round_number INTEGER DEFAULT 1,
    is_user_turn BOOLEAN DEFAULT false,
    time_remaining INTEGER DEFAULT 90, -- seconds
    
    -- Draft configuration
    draft_order TEXT[] NOT NULL,
    draft_type TEXT DEFAULT 'snake',
    pick_time_limit INTEGER DEFAULT 90,
    
    -- Draft status
    is_live BOOLEAN DEFAULT false,
    draft_started BOOLEAN DEFAULT false,
    draft_completed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_draft_type CHECK (draft_type IN ('snake', 'auction', 'linear'))
);

CREATE INDEX idx_draft_sessions_user_id ON draft_sessions (user_id);
CREATE INDEX idx_draft_sessions_league_id ON draft_sessions (league_id);
CREATE INDEX idx_draft_sessions_live ON draft_sessions (is_live) WHERE is_live = true;

-- Draft picks table
CREATE TABLE draft_picks (
    pick_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES draft_sessions(session_id) ON DELETE CASCADE,
    pick_number INTEGER NOT NULL,
    round_number INTEGER NOT NULL,
    user_id UUID REFERENCES users(user_id),
    player_id TEXT REFERENCES players(player_id),
    
    -- Pick metadata
    pick_value DECIMAL(5,2), -- Calculated value at time of pick
    is_keeper BOOLEAN DEFAULT false,
    pick_time INTERVAL, -- How long the pick took
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(session_id, pick_number)
);

CREATE INDEX idx_draft_picks_session_id ON draft_picks (session_id);
CREATE INDEX idx_draft_picks_player_id ON draft_picks (player_id);
CREATE INDEX idx_draft_picks_user_id ON draft_picks (user_id);

-- Draft recommendations table (for caching and analysis)
CREATE TABLE draft_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES draft_sessions(session_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    pick_position INTEGER NOT NULL,
    
    -- Recommendation data
    player_id TEXT REFERENCES players(player_id),
    confidence DECIMAL(5,2) NOT NULL, -- 0-100
    strategic_fit DECIMAL(5,2) NOT NULL, -- 0-100
    value_score DECIMAL(5,2), -- Difference from ADP
    reasoning JSONB NOT NULL DEFAULT '[]',
    urgency TEXT DEFAULT 'medium',
    
    -- Metadata
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    
    CONSTRAINT valid_confidence CHECK (confidence BETWEEN 0 AND 100),
    CONSTRAINT valid_strategic_fit CHECK (strategic_fit BETWEEN 0 AND 100),
    CONSTRAINT valid_urgency CHECK (urgency IN ('low', 'medium', 'high', 'critical'))
);

CREATE INDEX idx_recommendations_session_pick ON draft_recommendations (session_id, pick_position);
CREATE INDEX idx_recommendations_expires ON draft_recommendations (expires_at);
CREATE INDEX idx_recommendations_confidence ON draft_recommendations (confidence DESC);

-- Player news and updates table
CREATE TABLE player_news (
    news_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id TEXT REFERENCES players(player_id) ON DELETE CASCADE,
    headline TEXT NOT NULL,
    content TEXT,
    source TEXT,
    news_type TEXT DEFAULT 'general',
    impact_score INTEGER DEFAULT 0, -- -10 to 10 (negative = bad news)
    
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_impact_score CHECK (impact_score BETWEEN -10 AND 10)
);

CREATE INDEX idx_player_news_player_id ON player_news (player_id);
CREATE INDEX idx_player_news_published ON player_news (published_at DESC);
CREATE INDEX idx_player_news_impact ON player_news (impact_score);

-- Yahoo API tokens table (encrypted storage)
CREATE TABLE yahoo_tokens (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_type TEXT DEFAULT 'Bearer',
    expires_at TIMESTAMPTZ NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game logs for player performance tracking
CREATE TABLE player_game_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id TEXT REFERENCES players(player_id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    game_date DATE NOT NULL,
    opponent TEXT NOT NULL,
    
    -- Game stats
    minutes DECIMAL(4,1),
    points INTEGER DEFAULT 0,
    rebounds INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    steals INTEGER DEFAULT 0,
    blocks INTEGER DEFAULT 0,
    field_goals_made INTEGER DEFAULT 0,
    field_goals_attempted INTEGER DEFAULT 0,
    three_pointers_made INTEGER DEFAULT 0,
    three_pointers_attempted INTEGER DEFAULT 0,
    free_throws_made INTEGER DEFAULT 0,
    free_throws_attempted INTEGER DEFAULT 0,
    turnovers INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(player_id, game_id)
);

CREATE INDEX idx_game_logs_player_date ON player_game_logs (player_id, game_date DESC);
CREATE INDEX idx_game_logs_date ON player_game_logs (game_date DESC);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_league_settings_updated_at BEFORE UPDATE ON league_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_draft_sessions_updated_at BEFORE UPDATE ON draft_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_yahoo_tokens_updated_at BEFORE UPDATE ON yahoo_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE VIEW active_players AS
SELECT 
    player_id,
    name,
    team,
    positions,
    adp,
    current_season_stats,
    injury_status,
    updated_at
FROM players 
WHERE is_active = true
ORDER BY adp NULLS LAST;

CREATE VIEW live_draft_sessions AS
SELECT 
    ds.*,
    ls.league_type,
    ls.scoring_categories,
    COUNT(dp.pick_id) as picks_made
FROM draft_sessions ds
LEFT JOIN league_settings ls ON ds.league_id = ls.league_id
LEFT JOIN draft_picks dp ON ds.session_id = dp.session_id
WHERE ds.is_live = true
GROUP BY ds.session_id, ls.league_type, ls.scoring_categories;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE league_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE yahoo_tokens ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own strategies" ON user_strategies
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own league settings" ON league_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own draft sessions" ON draft_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendations" ON draft_recommendations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tokens" ON yahoo_tokens
    FOR ALL USING (auth.uid() = user_id);

-- Players and news are publicly readable
CREATE POLICY "Players are publicly readable" ON players
    FOR SELECT USING (true);

CREATE POLICY "Player news is publicly readable" ON player_news
    FOR SELECT USING (true);

CREATE POLICY "Game logs are publicly readable" ON player_game_logs
    FOR SELECT USING (true);

-- Insert some sample data for testing
INSERT INTO players (player_id, yahoo_player_id, name, team, positions, adp, current_season_stats) VALUES 
('giannis_antetokounmpo', 'yahoo_giannis', 'Giannis Antetokounmpo', 'MIL', ARRAY['PF', 'C'], 1.0, 
 '{"games_played": 73, "minutes": 35.2, "points": 31.1, "rebounds": 11.8, "assists": 5.7, "steals": 1.2, "blocks": 1.4, "field_goal_pct": 0.553, "free_throw_pct": 0.728, "three_pointers": 0.8, "turnovers": 3.9}'),
('luka_doncic', 'yahoo_luka', 'Luka Doncic', 'DAL', ARRAY['PG', 'SG'], 2.0,
 '{"games_played": 70, "minutes": 37.0, "points": 32.4, "rebounds": 8.6, "assists": 8.0, "steals": 1.4, "blocks": 0.5, "field_goal_pct": 0.473, "free_throw_pct": 0.786, "three_pointers": 2.8, "turnovers": 4.1}'),
('nikola_jokic', 'yahoo_jokic', 'Nikola Jokic', 'DEN', ARRAY['C'], 3.0,
 '{"games_played": 79, "minutes": 34.6, "points": 26.4, "rebounds": 12.4, "assists": 9.0, "steals": 1.3, "blocks": 0.7, "field_goal_pct": 0.583, "free_throw_pct": 0.827, "three_pointers": 1.2, "turnovers": 3.8}');

-- Create function to clean up expired recommendations
CREATE OR REPLACE FUNCTION cleanup_expired_recommendations() 
RETURNS void AS $$
BEGIN
    DELETE FROM draft_recommendations WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup every hour
SELECT cron.schedule('cleanup-recommendations', '0 * * * *', 'SELECT cleanup_expired_recommendations();');