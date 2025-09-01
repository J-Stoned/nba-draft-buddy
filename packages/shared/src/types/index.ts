/**
 * Shared TypeScript Types for NBA Draft Buddy
 * 
 * These types ensure consistency across frontend and backend,
 * providing end-to-end type safety for the entire application.
 */

// Core Player Types
export interface Player {
  playerId: string;
  yahooPlayerId: string;
  name: string;
  team: string;
  positions: string[];
  isActive: boolean;
  injuryStatus: 'healthy' | 'questionable' | 'doubtful' | 'out' | 'injured_reserve';
  age: number;
  experience: number;
  adp: number; // Average Draft Position
  currentSeasonStats: PlayerStats;
  projectedStats: PlayerStats;
  advancedStats?: AdvancedStats;
  teamStats?: TeamStats;
  injuryHistory?: InjuryRecord[];
  contractStatus: 'signed' | 'expiring' | 'rookie' | 'extension';
  isContractYear: boolean;
  gameLog?: GameLog[];
  lastUpdated: Date;
  photoUrl?: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fieldGoalPct: number;
  freeThrowPct: number;
  threePointers: number;
  turnovers: number;
  fieldGoalsMade?: number;
  fieldGoalsAttempted?: number;
  freeThrowsMade?: number;
  freeThrowsAttempted?: number;
  threePointsMade?: number;
  threePointsAttempted?: number;
}

export interface AdvancedStats {
  per: number; // Player Efficiency Rating
  usageRate: number; // Percentage of team possessions used
  trueShootingPct: number; // Shooting efficiency metric
  effectiveFieldGoalPct: number; // FG% adjusted for 3-pointers
  offensiveRating?: number;
  defensiveRating?: number;
  winShares?: number;
  valueOverReplacement?: number;
}

export interface TeamStats {
  pace: number; // Possessions per 48 minutes
  offensiveRating: number; // Points per 100 possessions
  defensiveRating: number; // Points allowed per 100 possessions
  netRating?: number;
}

export interface GameLog {
  gameId: string;
  date: string;
  opponent: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals?: number;
  blocks?: number;
  fieldGoalPct?: number;
  threePointers?: number;
  turnovers?: number;
}

export interface InjuryRecord {
  injuryId: string;
  injuryType: string;
  dateInjured: Date;
  dateReturned?: Date;
  gamesmissed: number;
  severity: 'minor' | 'moderate' | 'major' | 'career_threatening';
}

// Draft Types
export interface DraftSession {
  sessionId: string;
  leagueId: string;
  userId: string;
  leagueSettings: LeagueSettings;
  currentPick: number;
  totalPicks: number;
  round: number;
  isUserTurn: boolean;
  timeRemaining: number;
  draftOrder: string[];
  availablePlayers: Player[];
  userPicks: Player[];
  allPicks: DraftPick[];
  recentPicks: DraftPick[];
  remainingPicks: number;
  pickHistory: DraftPick[];
  draftStarted: boolean;
  draftCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DraftPick {
  pickNumber: number;
  userId: string;
  playerId: string;
  player: Player;
  timestamp: Date;
  isKeeper?: boolean;
  pickValue?: number;
}

export interface DraftState {
  sessionId: string;
  leagueId: string;
  currentPick: number;
  totalPicks: number;
  round: number;
  isUserTurn: boolean;
  timeRemaining: number;
  draftOrder: string[];
  availablePlayers: Player[];
  userPicks: Player[];
  allPicks: DraftPick[];
  recentPicks: DraftPick[];
  remainingPicks: number;
  pickHistory: DraftPick[];
  draftStarted: boolean;
  draftCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Strategy Types
export interface UserStrategy {
  strategyId: string;
  userId: string;
  name: string;
  strategyType: StrategyType;
  categoryWeights: Record<StatCategory, number>;
  riskTolerance: RiskLevel;
  targetPositions: PositionTarget[];
  isActive: boolean;
  createdAt: Date;
}

export type StrategyType = 
  | 'balanced'
  | 'punt_fg'
  | 'punt_ft'
  | 'punt_assists'
  | 'punt_turnovers'
  | 'stars_and_scrubs'
  | 'custom';

export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';

export type StatCategory = 
  | 'points'
  | 'rebounds'
  | 'assists'
  | 'steals'
  | 'blocks'
  | 'fieldGoalPct'
  | 'freeThrowPct'
  | 'threePointers'
  | 'turnovers';

export interface PositionTarget {
  position: string;
  min: number;
  max: number;
  priority: 'low' | 'medium' | 'high';
}

// Recommendation Types
export interface DraftRecommendation {
  recommendationId: string;
  player: Player;
  confidence: number; // 0-100
  strategicFit: number; // 0-100
  valueScore: number; // Difference from ADP
  reasoning: RecommendationReason[];
  alternativeOptions: Player[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  expectedAvailability: number; // Rounds likely to remain available
  generatedAt: Date;
  expiresAt: Date;
}

export interface RecommendationReason {
  category: 'value' | 'strategy' | 'scarcity' | 'opportunity' | 'risk';
  weight: number; // 0-1
  explanation: string;
  data: Record<string, any>;
}

// League Types
export interface LeagueSettings {
  leagueId: string;
  leagueType: 'roto' | 'head_to_head' | 'points';
  teamCount: number;
  rosterSize: number;
  startingLineup: Record<string, number>;
  scoringCategories: string[];
  playoffSettings: PlayoffSettings;
  draftSettings: DraftSettings;
  customScoring?: Record<string, number>;
}

export interface PlayoffSettings {
  playoffTeams: number;
  playoffWeeks: number;
  championshipWeek: number;
  playoffFormat: 'single_elimination' | 'bracket' | 'roto';
}

export interface DraftSettings {
  draftType: 'snake' | 'auction' | 'linear';
  draftDate: Date;
  pickTimeLimit: number; // seconds
  maxKeepers?: number;
  keeperDeadline?: Date;
}

// Context Types for Draft Engine
export interface DraftContext {
  draftState: DraftState;
  userStrategy: UserStrategy;
  leagueSettings: LeagueSettings;
  opponentProfiles: OpponentProfile[];
}

export interface OpponentProfile {
  userId: string;
  draftingTendencies: DraftingTendencies;
  historicalPicks: DraftPick[];
  predictedStrategy: string;
  confidenceScore: number;
}

export interface DraftingTendencies {
  preferredPositions: string[];
  reachThreshold: number; // Willingness to reach (1.0 = ADP, 1.2 = 20% reach)
  valueThreshold: number; // Value threshold (0.8 = 20% below ADP)
  categoryPreferences: StatCategory[];
  riskTolerance: RiskLevel;
  pickSpeed: 'fast' | 'medium' | 'slow';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: Date;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User Types
export interface User {
  userId: string;
  email: string;
  username: string;
  displayName?: string;
  yahooUserId?: string;
  preferences: UserPreferences;
  subscription: SubscriptionInfo;
  createdAt: Date;
  lastLogin: Date;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  defaultStrategy?: string;
  favoriteTeams: string[];
  timeZone: string;
  darkMode: boolean;
}

export interface NotificationSettings {
  draftReminders: boolean;
  pickNotifications: boolean;
  playerNews: boolean;
  injuryAlerts: boolean;
  tradeAnalysis: boolean;
  email: boolean;
  push: boolean;
}

export interface SubscriptionInfo {
  plan: 'free' | 'premium' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: Date;
  features: string[];
}

// Yahoo API Types
export interface YahooLeague {
  leagueId: string;
  name: string;
  gameCode: string;
  season: string;
  isFinished: boolean;
  currentWeek: number;
  startWeek: number;
  endWeek: number;
  teams: YahooTeam[];
}

export interface YahooTeam {
  teamId: string;
  name: string;
  logoUrl?: string;
  managerId: string;
  managerName: string;
  draftPosition: number;
}

export interface YahooPlayer {
  playerId: string;
  name: string;
  positions: string[];
  team: string;
  status: string;
  stats?: Record<string, number>;
  ownership?: {
    ownerId?: string;
    ownerName?: string;
  };
}

// Cache Types
export interface CacheEntry<T = any> {
  key: string;
  value: T;
  expiry: number;
  tags?: string[];
}

export interface CacheStats {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  averageResponseTime: number;
  memoryUsage: number;
}

// Event Types for Real-time Updates
export interface DraftEvent {
  eventId: string;
  eventType: DraftEventType;
  sessionId: string;
  data: Record<string, any>;
  timestamp: Date;
  userId?: string;
}

export type DraftEventType = 
  | 'pick_made'
  | 'pick_timeout'
  | 'user_joined'
  | 'user_left'
  | 'draft_started'
  | 'draft_paused'
  | 'draft_completed'
  | 'recommendation_update'
  | 'player_update';

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  userId?: string;
  stack?: string;
}

export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'EXTERNAL_API_ERROR'
  | 'DATABASE_ERROR'
  | 'CACHE_ERROR'
  | 'DRAFT_NOT_FOUND'
  | 'PLAYER_NOT_FOUND'
  | 'INVALID_PICK'
  | 'DRAFT_ALREADY_COMPLETED';

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Type Guards
export const isPlayer = (obj: any): obj is Player => {
  return obj && typeof obj.playerId === 'string' && typeof obj.name === 'string';
};

export const isDraftRecommendation = (obj: any): obj is DraftRecommendation => {
  return obj && typeof obj.confidence === 'number' && isPlayer(obj.player);
};

export const isApiError = (obj: any): obj is AppError => {
  return obj && typeof obj.code === 'string' && typeof obj.message === 'string';
};

// Constants
export const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL'] as const;
export const STAT_CATEGORIES = [
  'points', 'rebounds', 'assists', 'steals', 'blocks',
  'fieldGoalPct', 'freeThrowPct', 'threePointers', 'turnovers'
] as const;
export const STRATEGY_TYPES = [
  'balanced', 'punt_fg', 'punt_ft', 'punt_assists', 
  'punt_turnovers', 'stars_and_scrubs', 'custom'
] as const;

export type Position = typeof POSITIONS[number];
export type StatCategoryConst = typeof STAT_CATEGORIES[number];
export type StrategyTypeConst = typeof STRATEGY_TYPES[number];