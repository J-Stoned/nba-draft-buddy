import { Player, DraftContext, UserStrategy, DraftState, LeagueSettings } from '@shared/types';

/**
 * Mock Data for Draft Engine Testing
 * 
 * Realistic test data that mirrors actual fantasy basketball
 * draft scenarios, player stats, and league configurations.
 */

export const createMockPlayer = (overrides: Partial<Player> = {}): Player => ({
  playerId: `player_${Math.random().toString(36).substr(2, 9)}`,
  yahooPlayerId: `yahoo_${Math.random().toString(36).substr(2, 9)}`,
  name: 'Mock Player',
  team: 'LAL',
  positions: ['SF'],
  isActive: true,
  injuryStatus: 'healthy' as const,
  age: 26,
  experience: 5,
  adp: 50,
  currentSeasonStats: {
    gamesPlayed: 75,
    minutes: 32.5,
    points: 20.2,
    rebounds: 7.1,
    assists: 4.3,
    steals: 1.2,
    blocks: 0.8,
    fieldGoalPct: 0.485,
    freeThrowPct: 0.825,
    threePointers: 2.1,
    turnovers: 2.8,
    fieldGoalsMade: 8.2,
    fieldGoalsAttempted: 16.9,
    freeThrowsMade: 4.1,
    freeThrowsAttempted: 5.0,
    threePointsMade: 2.1,
    threePointsAttempted: 5.8
  },
  projectedStats: {
    gamesPlayed: 78,
    minutes: 33.0,
    points: 21.0,
    rebounds: 7.3,
    assists: 4.5,
    steals: 1.3,
    blocks: 0.9,
    fieldGoalPct: 0.490,
    freeThrowPct: 0.830,
    threePointers: 2.3,
    turnovers: 2.6
  },
  advancedStats: {
    per: 18.5,
    usageRate: 24.2,
    trueShootingPct: 0.578,
    effectiveFieldGoalPct: 0.521
  },
  teamStats: {
    pace: 102.3,
    offensiveRating: 112.5,
    defensiveRating: 108.2
  },
  injuryHistory: [],
  contractStatus: 'signed',
  isContractYear: false,
  gameLog: Array.from({ length: 20 }, (_, i) => ({
    gameId: `game_${i}`,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    minutes: 30 + Math.random() * 10,
    points: 15 + Math.random() * 15,
    rebounds: 5 + Math.random() * 8,
    assists: 2 + Math.random() * 6
  })),
  lastUpdated: new Date(),
  ...overrides
});

// Elite NBA Players for Testing
export const mockPlayers: Player[] = [
  createMockPlayer({
    name: 'Giannis Antetokounmpo',
    positions: ['PF', 'C'],
    team: 'MIL',
    adp: 1,
    currentSeasonStats: {
      gamesPlayed: 73,
      minutes: 35.2,
      points: 31.1,
      rebounds: 11.8,
      assists: 5.7,
      steals: 1.2,
      blocks: 1.4,
      fieldGoalPct: 0.553,
      freeThrowPct: 0.728,
      threePointers: 0.8,
      turnovers: 3.9
    },
    advancedStats: {
      per: 31.9,
      usageRate: 36.0,
      trueShootingPct: 0.614,
      effectiveFieldGoalPct: 0.573
    }
  }),
  
  createMockPlayer({
    name: 'Luka Doncic',
    positions: ['PG', 'SG'],
    team: 'DAL',
    adp: 2,
    currentSeasonStats: {
      gamesPlayed: 70,
      minutes: 37.0,
      points: 32.4,
      rebounds: 8.6,
      assists: 8.0,
      steals: 1.4,
      blocks: 0.5,
      fieldGoalPct: 0.473,
      freeThrowPct: 0.786,
      threePointers: 2.8,
      turnovers: 4.1
    },
    advancedStats: {
      per: 27.6,
      usageRate: 37.2,
      trueShootingPct: 0.583,
      effectiveFieldGoalPct: 0.533
    }
  }),

  createMockPlayer({
    name: 'Nikola Jokic',
    positions: ['C'],
    team: 'DEN',
    adp: 3,
    currentSeasonStats: {
      gamesPlayed: 79,
      minutes: 34.6,
      points: 26.4,
      rebounds: 12.4,
      assists: 9.0,
      steals: 1.3,
      blocks: 0.7,
      fieldGoalPct: 0.583,
      freeThrowPct: 0.827,
      threePointers: 1.2,
      turnovers: 3.8
    },
    advancedStats: {
      per: 31.3,
      usageRate: 31.8,
      trueShootingPct: 0.669,
      effectiveFieldGoalPct: 0.624
    }
  }),

  createMockPlayer({
    name: 'Stephen Curry',
    positions: ['PG'],
    team: 'GSW',
    adp: 4,
    currentSeasonStats: {
      gamesPlayed: 74,
      minutes: 34.7,
      points: 29.5,
      rebounds: 6.1,
      assists: 6.3,
      steals: 1.6,
      blocks: 0.4,
      fieldGoalPct: 0.493,
      freeThrowPct: 0.915,
      threePointers: 4.8,
      turnovers: 3.2
    },
    advancedStats: {
      per: 27.1,
      usageRate: 32.8,
      trueShootingPct: 0.673,
      effectiveFieldGoalPct: 0.625
    }
  }),

  createMockPlayer({
    name: 'LeBron James',
    positions: ['SF', 'PF'],
    team: 'LAL',
    adp: 5,
    age: 39,
    currentSeasonStats: {
      gamesPlayed: 71,
      minutes: 35.3,
      points: 25.7,
      rebounds: 7.3,
      assists: 8.3,
      steals: 1.3,
      blocks: 0.5,
      fieldGoalPct: 0.540,
      freeThrowPct: 0.750,
      threePointers: 2.1,
      turnovers: 3.5
    },
    advancedStats: {
      per: 25.8,
      usageRate: 29.7,
      trueShootingPct: 0.630,
      effectiveFieldGoalPct: 0.589
    }
  }),

  // Add more players for comprehensive testing
  ...Array.from({ length: 200 }, (_, i) => 
    createMockPlayer({
      name: `Player ${i + 6}`,
      adp: i + 6,
      currentSeasonStats: {
        gamesPlayed: 65 + Math.random() * 17,
        minutes: 20 + Math.random() * 20,
        points: 8 + Math.random() * 20,
        rebounds: 3 + Math.random() * 8,
        assists: 1 + Math.random() * 6,
        steals: 0.5 + Math.random() * 1.5,
        blocks: 0.2 + Math.random() * 1.5,
        fieldGoalPct: 0.40 + Math.random() * 0.15,
        freeThrowPct: 0.65 + Math.random() * 0.25,
        threePointers: Math.random() * 3,
        turnovers: 1 + Math.random() * 3
      }
    })
  )
];

export const mockUserStrategy: UserStrategy = {
  strategyId: 'strategy_123',
  userId: 'user_456',
  name: 'Balanced Attack',
  strategyType: 'balanced',
  categoryWeights: {
    points: 1.0,
    rebounds: 1.0,
    assists: 1.0,
    steals: 1.0,
    blocks: 1.0,
    fieldGoalPct: 1.0,
    freeThrowPct: 1.0,
    threePointers: 1.0,
    turnovers: 1.0
  },
  riskTolerance: 'moderate',
  targetPositions: [
    { position: 'PG', min: 1, max: 2 },
    { position: 'SG', min: 1, max: 2 },
    { position: 'SF', min: 1, max: 2 },
    { position: 'PF', min: 1, max: 2 },
    { position: 'C', min: 1, max: 2 }
  ],
  isActive: true,
  createdAt: new Date()
};

export const mockLeagueSettings: LeagueSettings = {
  leagueId: 'league_789',
  leagueType: 'roto',
  teamCount: 12,
  rosterSize: 13,
  startingLineup: {
    PG: 1,
    SG: 1,
    SF: 1,
    PF: 1,
    C: 1,
    G: 1,
    F: 1,
    UTIL: 3,
    BENCH: 3
  },
  scoringCategories: [
    'points',
    'rebounds', 
    'assists',
    'steals',
    'blocks',
    'fieldGoalPct',
    'freeThrowPct',
    'threePointers',
    'turnovers'
  ],
  playoffSettings: {
    playoffTeams: 6,
    playoffWeeks: 3,
    championshipWeek: 16
  },
  draftSettings: {
    draftType: 'snake',
    draftDate: new Date(),
    pickTimeLimit: 90
  }
};

export const mockDraftState: DraftState = {
  sessionId: 'draft_session_123',
  leagueId: 'league_789',
  currentPick: 12,
  totalPicks: 156, // 12 teams * 13 rounds
  round: 1,
  isUserTurn: true,
  timeRemaining: 85,
  draftOrder: [
    'user_1', 'user_2', 'user_3', 'user_4', 'user_5', 'user_6',
    'user_7', 'user_8', 'user_9', 'user_10', 'user_11', 'user_456'
  ],
  availablePlayers: mockPlayers.slice(0, 180), // First 180 players available
  userPicks: [], // User hasn't picked yet
  allPicks: [
    {
      pickNumber: 1,
      userId: 'user_1',
      playerId: mockPlayers[0].playerId,
      player: mockPlayers[0],
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      pickNumber: 2,
      userId: 'user_2', 
      playerId: mockPlayers[1].playerId,
      player: mockPlayers[1],
      timestamp: new Date(Date.now() - 240000) // 4 minutes ago
    }
  ],
  recentPicks: [],
  remainingPicks: 154,
  pickHistory: [],
  draftStarted: true,
  draftCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockOpponentProfiles = [
  {
    userId: 'user_1',
    draftingTendencies: {
      preferredPositions: ['PG', 'SG'],
      reachThreshold: 1.2, // Reaches 20% above ADP
      valueThreshold: 0.8,  // Takes value at 20% below ADP
      categoryPreferences: ['points', 'assists', 'threePointers']
    },
    historicalPicks: [],
    predictedStrategy: 'guard_heavy'
  },
  {
    userId: 'user_2',
    draftingTendencies: {
      preferredPositions: ['PF', 'C'],
      reachThreshold: 1.1,
      valueThreshold: 0.9,
      categoryPreferences: ['rebounds', 'blocks', 'fieldGoalPct']
    },
    historicalPicks: [],
    predictedStrategy: 'big_man_focus'
  }
];

export const mockDraftContext: DraftContext = {
  draftState: mockDraftState,
  userStrategy: mockUserStrategy,
  leagueSettings: mockLeagueSettings,
  opponentProfiles: mockOpponentProfiles
};

// Utility functions for creating test scenarios
export const createDraftScenario = (
  overrides: Partial<DraftContext> = {}
): DraftContext => ({
  ...mockDraftContext,
  ...overrides
});

export const createPlayerWithStats = (
  name: string,
  positions: string[],
  stats: Partial<any>
): Player => 
  createMockPlayer({
    name,
    positions,
    currentSeasonStats: {
      ...createMockPlayer().currentSeasonStats,
      ...stats
    }
  });

// Common test scenarios
export const testScenarios = {
  earlyDraft: createDraftScenario({
    draftState: {
      ...mockDraftState,
      currentPick: 5,
      round: 1
    }
  }),

  midDraft: createDraftScenario({
    draftState: {
      ...mockDraftState,
      currentPick: 65,
      round: 6
    }
  }),

  lateDraft: createDraftScenario({
    draftState: {
      ...mockDraftState,
      currentPick: 145,
      round: 12
    }
  }),

  puntFgStrategy: createDraftScenario({
    userStrategy: {
      ...mockUserStrategy,
      strategyType: 'punt_fg',
      categoryWeights: {
        ...mockUserStrategy.categoryWeights,
        fieldGoalPct: 0.1,
        assists: 1.3,
        steals: 1.2,
        threePointers: 1.2
      }
    }
  }),

  needCenter: createDraftScenario({
    draftState: {
      ...mockDraftState,
      userPicks: [
        createMockPlayer({ positions: ['PG'] }),
        createMockPlayer({ positions: ['SG'] }),
        createMockPlayer({ positions: ['SF'] })
      ]
    }
  })
};