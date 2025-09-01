-- NBA Draft Buddy Seed Data
-- Realistic player data for testing the Draft Engine

-- Disable triggers temporarily for bulk insert
SET session_replication_role = replica;

-- Insert comprehensive player data for testing
INSERT INTO players (player_id, yahoo_player_id, name, team, positions, age, experience, adp, 
                    current_season_stats, projected_stats, advanced_stats, team_stats) VALUES 

-- Elite Tier (ADP 1-5)
('giannis_antetokounmpo', 'yahoo_giannis', 'Giannis Antetokounmpo', 'MIL', ARRAY['PF', 'C'], 29, 11, 1.0,
 '{"games_played": 73, "minutes": 35.2, "points": 31.1, "rebounds": 11.8, "assists": 5.7, "steals": 1.2, "blocks": 1.4, "field_goal_pct": 0.553, "free_throw_pct": 0.728, "three_pointers": 0.8, "turnovers": 3.9}',
 '{"games_played": 75, "minutes": 35.0, "points": 31.5, "rebounds": 12.0, "assists": 6.0, "steals": 1.3, "blocks": 1.5, "field_goal_pct": 0.560, "free_throw_pct": 0.750, "three_pointers": 1.0, "turnovers": 3.8}',
 '{"per": 31.9, "usage_rate": 36.0, "true_shooting_pct": 0.614, "effective_field_goal_pct": 0.573}',
 '{"pace": 99.8, "offensive_rating": 117.2, "defensive_rating": 112.1}'),

('luka_doncic', 'yahoo_luka', 'Luka Doncic', 'DAL', ARRAY['PG', 'SG'], 25, 6, 2.0,
 '{"games_played": 70, "minutes": 37.0, "points": 32.4, "rebounds": 8.6, "assists": 8.0, "steals": 1.4, "blocks": 0.5, "field_goal_pct": 0.473, "free_throw_pct": 0.786, "three_pointers": 2.8, "turnovers": 4.1}',
 '{"games_played": 72, "minutes": 36.5, "points": 33.0, "rebounds": 8.8, "assists": 8.2, "steals": 1.5, "blocks": 0.6, "field_goal_pct": 0.480, "free_throw_pct": 0.800, "three_pointers": 3.0, "turnovers": 4.0}',
 '{"per": 27.6, "usage_rate": 37.2, "true_shooting_pct": 0.583, "effective_field_goal_pct": 0.533}',
 '{"pace": 98.1, "offensive_rating": 116.8, "defensive_rating": 115.2}'),

('nikola_jokic', 'yahoo_jokic', 'Nikola Jokic', 'DEN', ARRAY['C'], 29, 9, 3.0,
 '{"games_played": 79, "minutes": 34.6, "points": 26.4, "rebounds": 12.4, "assists": 9.0, "steals": 1.3, "blocks": 0.7, "field_goal_pct": 0.583, "free_throw_pct": 0.827, "three_pointers": 1.2, "turnovers": 3.8}',
 '{"games_played": 78, "minutes": 35.0, "points": 27.0, "rebounds": 12.8, "assists": 9.5, "steals": 1.4, "blocks": 0.8, "field_goal_pct": 0.590, "free_throw_pct": 0.840, "three_pointers": 1.4, "turnovers": 3.6}',
 '{"per": 31.3, "usage_rate": 31.8, "true_shooting_pct": 0.669, "effective_field_goal_pct": 0.624}',
 '{"pace": 99.2, "offensive_rating": 115.6, "defensive_rating": 113.8}'),

('stephen_curry', 'yahoo_curry', 'Stephen Curry', 'GSW', ARRAY['PG'], 36, 15, 4.0,
 '{"games_played": 74, "minutes": 34.7, "points": 29.5, "rebounds": 6.1, "assists": 6.3, "steals": 1.6, "blocks": 0.4, "field_goal_pct": 0.493, "free_throw_pct": 0.915, "three_pointers": 4.8, "turnovers": 3.2}',
 '{"games_played": 72, "minutes": 34.0, "points": 28.5, "rebounds": 6.0, "assists": 6.5, "steals": 1.7, "blocks": 0.5, "field_goal_pct": 0.500, "free_throw_pct": 0.920, "three_pointers": 4.5, "turnovers": 3.1}',
 '{"per": 27.1, "usage_rate": 32.8, "true_shooting_pct": 0.673, "effective_field_goal_pct": 0.625}',
 '{"pace": 100.9, "offensive_rating": 116.3, "defensive_rating": 114.5}'),

('lebron_james', 'yahoo_lebron', 'LeBron James', 'LAL', ARRAY['SF', 'PF'], 39, 21, 5.0,
 '{"games_played": 71, "minutes": 35.3, "points": 25.7, "rebounds": 7.3, "assists": 8.3, "steals": 1.3, "blocks": 0.5, "field_goal_pct": 0.540, "free_throw_pct": 0.750, "three_pointers": 2.1, "turnovers": 3.5}',
 '{"games_played": 68, "minutes": 34.0, "points": 24.0, "rebounds": 7.0, "assists": 8.0, "steals": 1.2, "blocks": 0.6, "field_goal_pct": 0.535, "free_throw_pct": 0.765, "three_pointers": 2.0, "turnovers": 3.3}',
 '{"per": 25.8, "usage_rate": 29.7, "true_shooting_pct": 0.630, "effective_field_goal_pct": 0.589}',
 '{"pace": 100.1, "offensive_rating": 114.8, "defensive_rating": 115.6}'),

-- Tier 1 Guards (ADP 6-15)
('shai_gilgeous_alexander', 'yahoo_shai', 'Shai Gilgeous-Alexander', 'OKC', ARRAY['PG', 'SG'], 25, 6, 6.0,
 '{"games_played": 75, "minutes": 34.0, "points": 30.1, "rebounds": 5.5, "assists": 6.2, "steals": 2.0, "blocks": 0.9, "field_goal_pct": 0.535, "free_throw_pct": 0.874, "three_pointers": 1.3, "turnovers": 2.8}',
 '{"games_played": 76, "minutes": 34.5, "points": 31.0, "rebounds": 5.8, "assists": 6.5, "steals": 2.1, "blocks": 1.0, "field_goal_pct": 0.540, "free_throw_pct": 0.880, "three_pointers": 1.5, "turnovers": 2.7}',
 '{"per": 27.8, "usage_rate": 33.5, "true_shooting_pct": 0.635, "effective_field_goal_pct": 0.566}',
 '{"pace": 97.8, "offensive_rating": 118.4, "defensive_rating": 111.7}'),

('jayson_tatum', 'yahoo_tatum', 'Jayson Tatum', 'BOS', ARRAY['SF', 'PF'], 26, 7, 7.0,
 '{"games_played": 74, "minutes": 36.9, "points": 26.9, "rebounds": 8.1, "assists": 4.9, "steals": 1.0, "blocks": 0.6, "field_goal_pct": 0.471, "free_throw_pct": 0.831, "three_pointers": 3.4, "turnovers": 2.5}',
 '{"games_played": 75, "minutes": 37.0, "points": 27.5, "rebounds": 8.3, "assists": 5.2, "steals": 1.1, "blocks": 0.7, "field_goal_pct": 0.480, "free_throw_pct": 0.840, "three_pointers": 3.6, "turnovers": 2.4}',
 '{"per": 22.4, "usage_rate": 29.6, "true_shooting_pct": 0.605, "effective_field_goal_pct": 0.548}',
 '{"pace": 98.2, "offensive_rating": 118.2, "defensive_rating": 111.8}'),

('anthony_davis', 'yahoo_ad', 'Anthony Davis', 'LAL', ARRAY['PF', 'C'], 31, 12, 8.0,
 '{"games_played": 76, "minutes": 35.5, "points": 24.7, "rebounds": 12.6, "assists": 3.5, "steals": 1.2, "blocks": 2.3, "field_goal_pct": 0.563, "free_throw_pct": 0.814, "three_pointers": 0.6, "turnovers": 2.0}',
 '{"games_played": 74, "minutes": 35.0, "points": 25.5, "rebounds": 13.0, "assists": 3.8, "steals": 1.3, "blocks": 2.5, "field_goal_pct": 0.570, "free_throw_pct": 0.825, "three_pointers": 0.8, "turnovers": 1.9}',
 '{"per": 26.1, "usage_rate": 28.4, "true_shooting_pct": 0.611, "effective_field_goal_pct": 0.576}',
 '{"pace": 100.1, "offensive_rating": 114.8, "defensive_rating": 115.6}'),

-- High-Value Guards and Wings (ADP 16-30)
('damian_lillard', 'yahoo_dame', 'Damian Lillard', 'MIL', ARRAY['PG'], 34, 13, 16.0,
 '{"games_played": 73, "minutes": 35.3, "points": 24.3, "rebounds": 4.4, "assists": 7.0, "steals": 1.0, "blocks": 0.3, "field_goal_pct": 0.424, "free_throw_pct": 0.920, "three_pointers": 3.6, "turnovers": 3.0}',
 '{"games_played": 70, "minutes": 34.5, "points": 25.0, "rebounds": 4.5, "assists": 7.2, "steals": 1.1, "blocks": 0.4, "field_goal_pct": 0.440, "free_throw_pct": 0.925, "three_pointers": 3.8, "turnovers": 2.9}',
 '{"per": 20.8, "usage_rate": 30.2, "true_shooting_pct": 0.571, "effective_field_goal_pct": 0.522}',
 '{"pace": 99.8, "offensive_rating": 117.2, "defensive_rating": 112.1}'),

('tyrese_haliburton', 'yahoo_hali', 'Tyrese Haliburton', 'IND', ARRAY['PG'], 24, 4, 18.0,
 '{"games_played": 69, "minutes": 32.7, "points": 20.1, "rebounds": 3.9, "assists": 10.9, "steals": 1.2, "blocks": 0.7, "field_goal_pct": 0.473, "free_throw_pct": 0.851, "three_pointers": 3.1, "turnovers": 2.3}',
 '{"games_played": 72, "minutes": 33.5, "points": 21.5, "rebounds": 4.2, "assists": 11.5, "steals": 1.3, "blocks": 0.8, "field_goal_pct": 0.485, "free_throw_pct": 0.865, "three_pointers": 3.3, "turnovers": 2.4}',
 '{"per": 22.1, "usage_rate": 23.8, "true_shooting_pct": 0.632, "effective_field_goal_pct": 0.605}',
 '{"pace": 101.2, "offensive_rating": 118.1, "defensive_rating": 116.4}'),

-- Elite Centers (ADP 20-40)
('victor_wembanyama', 'yahoo_wemby', 'Victor Wembanyama', 'SAS', ARRAY['PF', 'C'], 20, 1, 22.0,
 '{"games_played": 71, "minutes": 29.7, "points": 21.4, "rebounds": 10.6, "assists": 3.9, "steals": 1.2, "blocks": 3.6, "field_goal_pct": 0.463, "free_throw_pct": 0.794, "three_pointers": 1.4, "turnovers": 3.7}',
 '{"games_played": 75, "minutes": 32.0, "points": 24.0, "rebounds": 11.5, "assists": 4.2, "steals": 1.4, "blocks": 4.0, "field_goal_pct": 0.480, "free_throw_pct": 0.810, "three_pointers": 1.8, "turnovers": 3.5}',
 '{"per": 23.5, "usage_rate": 28.1, "true_shooting_pct": 0.548, "effective_field_goal_pct": 0.508}',
 '{"pace": 97.6, "offensive_rating": 110.2, "defensive_rating": 113.8}'),

('joel_embiid', 'yahoo_embiid', 'Joel Embiid', 'PHI', ARRAY['C'], 30, 8, 25.0,
 '{"games_played": 39, "minutes": 34.7, "points": 34.7, "rebounds": 11.0, "assists": 5.6, "steals": 1.2, "blocks": 1.7, "field_goal_pct": 0.531, "free_throw_pct": 0.884, "three_pointers": 1.4, "turnovers": 4.0}',
 '{"games_played": 60, "minutes": 34.0, "points": 32.0, "rebounds": 11.5, "assists": 5.2, "steals": 1.3, "blocks": 1.9, "field_goal_pct": 0.540, "free_throw_pct": 0.890, "three_pointers": 1.6, "turnovers": 3.8}',
 '{"per": 31.2, "usage_rate": 36.8, "true_shooting_pct": 0.651, "effective_field_goal_pct": 0.571}',
 '{"pace": 96.8, "offensive_rating": 113.4, "defensive_rating": 112.9}'),

-- Value Picks and Sleepers (ADP 40-80)
('alperen_sengun', 'yahoo_sengun', 'Alperen Sengun', 'HOU', ARRAY['C'], 22, 3, 45.0,
 '{"games_played": 63, "minutes": 32.5, "points": 21.1, "rebounds": 9.3, "assists": 5.0, "steals": 0.9, "blocks": 0.7, "field_goal_pct": 0.533, "free_throw_pct": 0.693, "three_pointers": 0.4, "turnovers": 3.4}',
 '{"games_played": 70, "minutes": 33.0, "points": 22.5, "rebounds": 10.0, "assists": 5.5, "steals": 1.0, "blocks": 0.8, "field_goal_pct": 0.545, "free_throw_pct": 0.720, "three_pointers": 0.6, "turnovers": 3.2}',
 '{"per": 21.8, "usage_rate": 27.3, "true_shooting_pct": 0.575, "effective_field_goal_pct": 0.547}',
 '{"pace": 99.4, "offensive_rating": 112.3, "defensive_rating": 114.7}'),

('scottie_barnes', 'yahoo_scottie', 'Scottie Barnes', 'TOR', ARRAY['SF', 'PF'], 23, 3, 48.0,
 '{"games_played": 60, "minutes": 34.1, "points": 19.9, "rebounds": 8.2, "assists": 6.1, "steals": 1.3, "blocks": 1.5, "field_goal_pct": 0.472, "free_throw_pct": 0.739, "three_pointers": 0.8, "turnovers": 3.2}',
 '{"games_played": 65, "minutes": 34.5, "points": 21.0, "rebounds": 8.5, "assists": 6.5, "steals": 1.4, "blocks": 1.6, "field_goal_pct": 0.485, "free_throw_pct": 0.760, "three_pointers": 1.0, "turnovers": 3.0}',
 '{"per": 18.9, "usage_rate": 24.8, "true_shooting_pct": 0.531, "effective_field_goal_pct": 0.489}',
 '{"pace": 97.1, "offensive_rating": 109.8, "defensive_rating": 115.2}');

-- Insert some injury-prone players for testing injury risk calculations
INSERT INTO players (player_id, yahoo_player_id, name, team, positions, age, experience, adp, 
                    injury_status, injury_history, current_season_stats) VALUES 
('zion_williamson', 'yahoo_zion', 'Zion Williamson', 'NOP', ARRAY['PF'], 24, 5, 35.0, 'questionable',
 '[{"injury_type": "hamstring", "games_missed": 12, "severity": "moderate"}, {"injury_type": "foot", "games_missed": 43, "severity": "major"}]',
 '{"games_played": 70, "minutes": 33.1, "points": 22.9, "rebounds": 5.8, "assists": 5.3, "steals": 1.1, "blocks": 0.6, "field_goal_pct": 0.570, "free_throw_pct": 0.701, "three_pointers": 0.3, "turnovers": 3.6}'),

('kawhi_leonard', 'yahoo_kawhi', 'Kawhi Leonard', 'LAC', ARRAY['SF', 'SG'], 33, 13, 40.0, 'out',
 '[{"injury_type": "knee", "games_missed": 25, "severity": "major"}, {"injury_type": "quad", "games_missed": 18, "severity": "moderate"}]',
 '{"games_played": 68, "minutes": 34.0, "points": 23.7, "rebounds": 6.1, "assists": 3.6, "steals": 1.6, "blocks": 0.9, "field_goal_pct": 0.523, "free_throw_pct": 0.880, "three_pointers": 2.4, "turnovers": 2.0}');

-- Create some sample user strategies for testing
DO $$
DECLARE
    test_user_id uuid;
BEGIN
    -- Insert a test user
    INSERT INTO users (user_id, email, username, display_name) 
    VALUES (uuid_generate_v4(), 'test@example.com', 'testuser', 'Test User')
    RETURNING user_id INTO test_user_id;
    
    -- Insert sample strategies
    INSERT INTO user_strategies (user_id, name, strategy_type, category_weights, target_positions) VALUES
    (test_user_id, 'Balanced Build', 'balanced', 
     '{"points": 1.0, "rebounds": 1.0, "assists": 1.0, "steals": 1.0, "blocks": 1.0, "field_goal_pct": 1.0, "free_throw_pct": 1.0, "three_pointers": 1.0, "turnovers": 1.0}',
     '[{"position": "PG", "min": 1, "max": 2, "priority": "medium"}, {"position": "SG", "min": 1, "max": 2, "priority": "medium"}, {"position": "SF", "min": 1, "max": 2, "priority": "medium"}, {"position": "PF", "min": 1, "max": 2, "priority": "medium"}, {"position": "C", "min": 1, "max": 2, "priority": "medium"}]'),
     
    (test_user_id, 'Punt FG% Build', 'punt_fg',
     '{"points": 1.2, "rebounds": 1.0, "assists": 1.3, "steals": 1.2, "blocks": 1.0, "field_goal_pct": 0.1, "free_throw_pct": 1.1, "three_pointers": 1.2, "turnovers": 1.1}',
     '[{"position": "PG", "min": 2, "max": 3, "priority": "high"}, {"position": "SG", "min": 1, "max": 2, "priority": "high"}, {"position": "SF", "min": 1, "max": 2, "priority": "medium"}, {"position": "PF", "min": 1, "max": 2, "priority": "medium"}, {"position": "C", "min": 1, "max": 1, "priority": "low"}]');
END $$;

-- Insert some recent player news for testing
INSERT INTO player_news (player_id, headline, content, source, impact_score, published_at) VALUES
('victor_wembanyama', 'Wembanyama shows improved 3-point shooting in practice', 'Victor Wembanyama has been working extensively on his three-point shot during the offseason, showing marked improvement in shooting drills.', 'ESPN', 3, NOW() - INTERVAL '2 hours'),
('zion_williamson', 'Williamson dealing with minor hamstring tightness', 'Zion Williamson experienced some hamstring tightness after practice and is listed as questionable for upcoming games.', 'The Athletic', -2, NOW() - INTERVAL '4 hours'),
('joel_embiid', 'Embiid cleared for full basketball activities', 'Joel Embiid has been medically cleared and is expected to return to full basketball activities without restrictions.', 'Philadelphia Inquirer', 5, NOW() - INTERVAL '1 day');

-- Re-enable triggers
SET session_replication_role = DEFAULT;