import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DraftEngine } from '../../src/services/draftEngine';
import { PlayerValuationService } from '../../src/services/playerValuation';
import { StrategyEngine } from '../../src/services/strategyEngine';
import { OpponentModelingService } from '../../src/services/opponentModeling';
import { CacheService } from '../../src/utils/cache';
import { 
  mockDraftContext, 
  mockPlayers, 
  mockUserStrategy,
  mockDraftState,
  createMockPlayer 
} from '../__mocks__/draftData';

/**
 * Elite Test Suite for Draft Engine
 * 
 * These tests ensure the Draft Engine performs flawlessly during
 * high-pressure draft scenarios. Each test simulates real draft
 * conditions and validates critical business logic.
 */
describe('DraftEngine - Core Functionality', () => {
  let draftEngine: DraftEngine;
  let mockPlayerValuation: PlayerValuationService;
  let mockStrategyEngine: StrategyEngine;
  let mockOpponentModeling: OpponentModelingService;
  let mockCache: CacheService;

  beforeEach(() => {
    // Create mocked dependencies
    mockPlayerValuation = {
      calculateBaseValue: vi.fn(),
    } as any;

    mockStrategyEngine = {
      calculateStrategicFit: vi.fn(),
    } as any;

    mockOpponentModeling = {
      predictPlayerAvailability: vi.fn(),
    } as any;

    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
    } as any;

    draftEngine = new DraftEngine(
      mockPlayerValuation,
      mockStrategyEngine,
      mockOpponentModeling,
      mockCache
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generateRecommendations', () => {
    it('should generate top-tier recommendations for early draft picks', async () => {
      // Arrange
      const context = {
        ...mockDraftContext,
        draftState: {
          ...mockDraftState,
          currentPick: 1,
          availablePlayers: mockPlayers.slice(0, 50) // Top 50 players available
        }
      };

      mockPlayerValuation.calculateBaseValue = vi.fn()
        .mockImplementation(async (player) => {
          // Simulate elite players having high base values
          if (player.name.includes('LeBron')) return 95;
          if (player.name.includes('Curry')) return 93;
          if (player.name.includes('Giannis')) return 96;
          return 75;
        });

      mockStrategyEngine.calculateStrategicFit = vi.fn()
        .mockReturnValue(88);

      mockOpponentModeling.predictPlayerAvailability = vi.fn()
        .mockResolvedValue({
          expectedRounds: 1.2,
          riskScore: 0.8,
          competingTeams: ['team2', 'team3']
        });

      mockCache.get = vi.fn().mockResolvedValue(null); // No cache hit

      // Act
      const recommendations = await draftEngine.generateRecommendations(context);

      // Assert
      expect(recommendations).toHaveLength(10);
      expect(recommendations[0].confidence).toBeGreaterThan(85);
      expect(recommendations[0].player.name).toContain('Giannis'); // Highest value player
      expect(recommendations[0].reasoning).toHaveLength.greaterThan(0);
      expect(recommendations[0].urgency).toBe('high');
    });

    it('should prioritize value picks in middle rounds', async () => {
      // Arrange
      const context = {
        ...mockDraftContext,
        draftState: {
          ...mockDraftState,
          currentPick: 45, // Mid-draft
          availablePlayers: mockPlayers.slice(40, 120) // Players ranked 40-120
        }
      };

      // Mock a value player (high value, low ADP)
      const valuePick = createMockPlayer({
        name: 'Value Player',
        adp: 65,
        currentSeasonStats: {
          points: 18.5,
          rebounds: 8.2,
          assists: 5.1,
          steals: 1.4,
          blocks: 0.9
        }
      });

      mockPlayerValuation.calculateBaseValue = vi.fn()
        .mockImplementation(async (player) => {
          if (player.name === 'Value Player') return 85; // High value
          return 60; // Average value
        });

      mockCache.get = vi.fn().mockResolvedValue(null);

      // Act
      const recommendations = await draftEngine.generateRecommendations(context);

      // Assert
      expect(recommendations[0].valueScore).toBeGreaterThan(15); // Significant value
      expect(recommendations[0].reasoning).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ category: 'value' })
        ])
      );
    });

    it('should handle cache hits efficiently', async () => {
      // Arrange
      const context = mockDraftContext;
      const cachedRecommendations = [
        {
          player: mockPlayers[0],
          confidence: 92,
          strategicFit: 89,
          valueScore: 12,
          reasoning: [{ category: 'value', weight: 0.3, explanation: 'Cached result' }],
          urgency: 'high'
        }
      ];

      mockCache.get = vi.fn().mockResolvedValue(cachedRecommendations);

      // Act
      const recommendations = await draftEngine.generateRecommendations(context);

      // Assert
      expect(recommendations).toEqual(cachedRecommendations);
      expect(mockPlayerValuation.calculateBaseValue).not.toHaveBeenCalled();
      expect(mockCache.get).toHaveBeenCalledTimes(1);
    });

    it('should adjust for punt strategies', async () => {
      // Arrange
      const puntFgStrategy = {
        ...mockUserStrategy,
        strategyType: 'punt_fg' as const,
        categoryWeights: {
          points: 1.2,
          assists: 1.3,
          steals: 1.3,
          threePointers: 1.2,
          fieldGoalPct: 0.1, // Punting FG%
          freeThrowPct: 1.1,
          rebounds: 1.0,
          blocks: 1.0,
          turnovers: 1.1
        }
      };

      const context = {
        ...mockDraftContext,
        userStrategy: puntFgStrategy
      };

      // Mock high-volume, low-efficiency player
      mockPlayerValuation.calculateBaseValue = vi.fn().mockResolvedValue(82);
      mockStrategyEngine.calculateStrategicFit = vi.fn()
        .mockImplementation((player, roster, strategy) => {
          if (strategy.strategyType === 'punt_fg' && player.currentSeasonStats.fieldGoalPct < 0.42) {
            return 95; // Perfect fit for punt FG strategy
          }
          return 70;
        });

      mockCache.get = vi.fn().mockResolvedValue(null);

      // Act
      const recommendations = await draftEngine.generateRecommendations(context);

      // Assert
      expect(recommendations[0].strategicFit).toBeGreaterThan(90);
      expect(recommendations[0].reasoning).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ category: 'strategy' })
        ])
      );
    });
  });

  describe('Performance & Edge Cases', () => {
    it('should handle concurrent recommendation requests', async () => {
      // Arrange
      const contexts = Array.from({ length: 10 }, (_, i) => ({
        ...mockDraftContext,
        draftState: {
          ...mockDraftState,
          currentPick: i + 1
        }
      }));

      mockPlayerValuation.calculateBaseValue = vi.fn().mockResolvedValue(80);
      mockStrategyEngine.calculateStrategicFit = vi.fn().mockReturnValue(85);
      mockOpponentModeling.predictPlayerAvailability = vi.fn().mockResolvedValue({
        expectedRounds: 2,
        riskScore: 0.5,
        competingTeams: []
      });
      mockCache.get = vi.fn().mockResolvedValue(null);

      // Act
      const startTime = Date.now();
      const promises = contexts.map(context => 
        draftEngine.generateRecommendations(context)
      );
      const results = await Promise.all(promises);
      const endTime = Date.now();

      // Assert
      expect(results).toHaveLength(10);
      results.forEach(recommendations => {
        expect(recommendations).toHaveLength(10);
        expect(recommendations[0].confidence).toBeGreaterThan(50);
      });
      expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
    });

    it('should handle empty player pool gracefully', async () => {
      // Arrange
      const context = {
        ...mockDraftContext,
        draftState: {
          ...mockDraftState,
          availablePlayers: [] // No players available
        }
      };

      mockCache.get = vi.fn().mockResolvedValue(null);

      // Act
      const recommendations = await draftEngine.generateRecommendations(context);

      // Assert
      expect(recommendations).toHaveLength(0);
    });

    it('should maintain consistency with identical inputs', async () => {
      // Arrange
      const context = mockDraftContext;
      
      mockPlayerValuation.calculateBaseValue = vi.fn().mockResolvedValue(85);
      mockStrategyEngine.calculateStrategicFit = vi.fn().mockReturnValue(88);
      mockOpponentModeling.predictPlayerAvailability = vi.fn().mockResolvedValue({
        expectedRounds: 3,
        riskScore: 0.3,
        competingTeams: []
      });
      mockCache.get = vi.fn().mockResolvedValue(null);

      // Act
      const recommendations1 = await draftEngine.generateRecommendations(context);
      // Clear cache to force recalculation
      mockCache.get = vi.fn().mockResolvedValue(null);
      const recommendations2 = await draftEngine.generateRecommendations(context);

      // Assert
      expect(recommendations1[0].player.playerId).toBe(recommendations2[0].player.playerId);
      expect(recommendations1[0].confidence).toBeCloseTo(recommendations2[0].confidence, 1);
    });

    it('should prioritize scarcity in late rounds', async () => {
      // Arrange
      const lateRoundContext = {
        ...mockDraftContext,
        draftState: {
          ...mockDraftState,
          currentPick: 120, // Very late pick
          availablePlayers: mockPlayers.slice(100, 150) // Dregs
        }
      };

      // Mock a blocks specialist (scarce category)
      const blocksSpecialist = createMockPlayer({
        name: 'Blocks Specialist',
        currentSeasonStats: {
          points: 8.2,
          rebounds: 6.1,
          assists: 1.2,
          steals: 0.4,
          blocks: 2.3, // Elite blocks
          fieldGoalPct: 0.48
        }
      });

      mockPlayerValuation.calculateBaseValue = vi.fn()
        .mockImplementation(async (player) => {
          if (player.name === 'Blocks Specialist') return 65;
          return 45; // Low value late round players
        });

      mockCache.get = vi.fn().mockResolvedValue(null);

      // Act
      const recommendations = await draftEngine.generateRecommendations(lateRoundContext);

      // Assert
      expect(recommendations[0].reasoning).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ category: 'scarcity' })
        ])
      );
    });
  });

  describe('Real Draft Scenarios', () => {
    it('should handle "Best Player Available vs Need" decisions', async () => {
      // Arrange - User needs a center but best player is a guard
      const context = {
        ...mockDraftContext,
        draftState: {
          ...mockDraftState,
          userPicks: [
            createMockPlayer({ name: 'Guard 1', positions: ['PG'] }),
            createMockPlayer({ name: 'Guard 2', positions: ['SG'] }),
            createMockPlayer({ name: 'Forward 1', positions: ['SF'] }),
          ] // User has no centers
        }
      };

      const bestGuard = createMockPlayer({
        name: 'Elite Guard',
        positions: ['PG'],
        adp: 40
      });

      const solidCenter = createMockPlayer({
        name: 'Solid Center', 
        positions: ['C'],
        adp: 55
      });

      mockPlayerValuation.calculateBaseValue = vi.fn()
        .mockImplementation(async (player) => {
          if (player.name === 'Elite Guard') return 88;
          if (player.name === 'Solid Center') return 75;
          return 60;
        });

      mockStrategyEngine.calculateStrategicFit = vi.fn()
        .mockImplementation((player) => {
          if (player.positions.includes('C')) return 92; // High positional need
          return 70;
        });

      mockCache.get = vi.fn().mockResolvedValue(null);

      // Act
      const recommendations = await draftEngine.generateRecommendations(context);

      // Assert - Should balance value vs need
      const topRec = recommendations[0];
      expect(topRec.reasoning).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            category: expect.stringMatching(/value|strategy|scarcity/)
          })
        ])
      );
    });

    it('should detect position runs and adjust urgency', async () => {
      // Arrange - Multiple centers taken recently
      const context = {
        ...mockDraftContext,
        draftState: {
          ...mockDraftState,
          recentPicks: [
            { player: createMockPlayer({ positions: ['C'] }), pickNumber: 35 },
            { player: createMockPlayer({ positions: ['C'] }), pickNumber: 36 },
            { player: createMockPlayer({ positions: ['C'] }), pickNumber: 37 },
          ] // Center run happening
        }
      };

      const availableCenter = createMockPlayer({
        name: 'Last Good Center',
        positions: ['C']
      });

      mockOpponentModeling.predictPlayerAvailability = vi.fn()
        .mockImplementation(async (player) => {
          if (player.positions.includes('C')) {
            return {
              expectedRounds: 0.5, // Won't last long
              riskScore: 0.9,
              competingTeams: ['team1', 'team2', 'team3']
            };
          }
          return {
            expectedRounds: 2,
            riskScore: 0.2,
            competingTeams: []
          };
        });

      mockCache.get = vi.fn().mockResolvedValue(null);

      // Act
      const recommendations = await draftEngine.generateRecommendations(context);

      // Assert
      const centerRecs = recommendations.filter(r => 
        r.player.positions.includes('C')
      );
      expect(centerRecs[0]?.urgency).toBe('critical');
    });
  });

  describe('Strategy Integration', () => {
    it('should adjust recommendations for balanced strategy', async () => {
      // Arrange
      const balancedStrategy = {
        ...mockUserStrategy,
        strategyType: 'balanced' as const,
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
        }
      };

      const context = {
        ...mockDraftContext,
        userStrategy: balancedStrategy
      };

      mockStrategyEngine.calculateStrategicFit = vi.fn()
        .mockImplementation((player, roster, strategy) => {
          if (strategy.strategyType === 'balanced') {
            // Reward well-rounded players
            const statsCount = Object.values(player.currentSeasonStats)
              .filter(stat => typeof stat === 'number' && stat > 1).length;
            return Math.min(95, 60 + statsCount * 5);
          }
          return 70;
        });

      mockCache.get = vi.fn().mockResolvedValue(null);

      // Act
      const recommendations = await draftEngine.generateRecommendations(context);

      // Assert
      expect(recommendations[0].strategicFit).toBeGreaterThan(75);
      expect(recommendations[0].reasoning.some(r => r.category === 'strategy')).toBe(true);
    });
  });
});

/**
 * Load Testing Suite
 * 
 * Tests performance under realistic draft traffic conditions
 */
describe('DraftEngine - Performance Tests', () => {
  let draftEngine: DraftEngine;

  beforeEach(() => {
    // Use real implementations for performance testing
    const playerValuation = new PlayerValuationService();
    const strategyEngine = new StrategyEngine();
    const opponentModeling = new OpponentModelingService();
    const cache = new CacheService();

    draftEngine = new DraftEngine(
      playerValuation,
      strategyEngine, 
      opponentModeling,
      cache
    );
  });

  it('should generate recommendations within 500ms', async () => {
    // Arrange
    const context = mockDraftContext;

    // Act
    const startTime = performance.now();
    const recommendations = await draftEngine.generateRecommendations(context);
    const endTime = performance.now();

    // Assert
    expect(endTime - startTime).toBeLessThan(500); // Sub-500ms requirement
    expect(recommendations).toHaveLength.greaterThan(0);
  });

  it('should handle 100 concurrent users without degradation', async () => {
    // Arrange
    const contexts = Array.from({ length: 100 }, (_, i) => ({
      ...mockDraftContext,
      draftState: {
        ...mockDraftState,
        sessionId: `session_${i}`,
        currentPick: Math.floor(i / 12) + 1
      }
    }));

    // Act
    const startTime = performance.now();
    const promises = contexts.map(context => 
      draftEngine.generateRecommendations(context)
    );
    const results = await Promise.allSettled(promises);
    const endTime = performance.now();

    // Assert
    const successful = results.filter(r => r.status === 'fulfilled').length;
    expect(successful).toBe(100); // All requests successful
    expect(endTime - startTime).toBeLessThan(3000); // Complete within 3 seconds
    
    // Check that individual responses are still fast
    const avgResponseTime = (endTime - startTime) / 100;
    expect(avgResponseTime).toBeLessThan(800); // Average under 800ms
  }, 10000); // 10 second timeout for load test
});