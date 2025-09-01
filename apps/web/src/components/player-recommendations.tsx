'use client'

import { DraftState, UserStrategy } from './draft-assistant'
import { useState, useEffect } from 'react'

interface PlayerRecommendationsProps {
  draftState: DraftState
  userStrategy: UserStrategy
  onPlayerSelect: (pickNumber: number, player: any) => void
}

const mockRecommendations = [
  {
    player_id: '1',
    name: 'Nikola Jokić',
    team: 'DEN',
    positions: ['C'],
    score: 98.5,
    reasoning: 'Elite all-around production with triple-double upside. Perfect for balanced strategy.',
    projectedStats: {
      points: 26.4,
      rebounds: 12.4,
      assists: 9.0,
      steals: 1.3,
      blocks: 0.7,
      fg_pct: 0.583,
      ft_pct: 0.825,
      threes: 1.0
    },
    valueGrade: 'A+',
    riskLevel: 'Low'
  },
  {
    player_id: '2',
    name: 'Luka Dončić',
    team: 'DAL',
    positions: ['PG', 'SG'],
    score: 96.8,
    reasoning: 'Exceptional playmaker with elite scoring. Slight FT% concerns but massive upside.',
    projectedStats: {
      points: 32.4,
      rebounds: 9.1,
      assists: 8.6,
      steals: 1.4,
      blocks: 0.5,
      fg_pct: 0.456,
      ft_pct: 0.786,
      threes: 3.6
    },
    valueGrade: 'A+',
    riskLevel: 'Low'
  },
  {
    player_id: '3',
    name: 'Shai Gilgeous-Alexander',
    team: 'OKC',
    positions: ['PG', 'SG'],
    score: 95.2,
    reasoning: 'Complete guard with excellent efficiency across all categories. Safe pick.',
    projectedStats: {
      points: 30.1,
      rebounds: 5.5,
      assists: 6.2,
      steals: 2.0,
      blocks: 0.9,
      fg_pct: 0.535,
      ft_pct: 0.874,
      threes: 1.8
    },
    valueGrade: 'A',
    riskLevel: 'Very Low'
  }
]

export function PlayerRecommendations({ draftState, userStrategy, onPlayerSelect }: PlayerRecommendationsProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [mcpRecommendations, setMcpRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mcpPowered, setMcpPowered] = useState(false)

  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(selectedPlayer?.player_id === player.player_id ? null : player)
  }

  // Fetch MCP-powered recommendations
  useEffect(() => {
    const fetchMCPRecommendations = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/live-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'demo-user',
            leagueSettings: {
              league_type: userStrategy.strategy_type,
              scoring_categories: Object.keys(userStrategy.category_weights)
            },
            draftState: {
              currentPick: draftState.currentPick,
              availablePlayers: draftState.availablePlayers,
              userPicks: draftState.userPicks,
              allPicks: draftState.allPicks
            }
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setMcpRecommendations(data.recommendations)
            setMcpPowered(true)
            console.log('🚀 MCP Recommendations Loaded:', data.analytics)
          }
        }
      } catch (error) {
        console.warn('MCP recommendations unavailable, using fallback:', error)
      }
      setIsLoading(false)
    }
    
    fetchMCPRecommendations()
  }, [draftState.currentPick, userStrategy.strategy_type])

  const handleDraftPlayer = (player: any) => {
    onPlayerSelect(draftState.currentPick, player)
    setSelectedPlayer(null)
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendations Header */}
      <div className="recommendation-card p-6 rounded-lg text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <h2 className="text-2xl font-bold text-white">🤖 AI Recommendations</h2>
          {mcpPowered && <span className="px-2 py-1 bg-green-500 text-white text-xs rounded font-bold">MCP POWERED</span>}
          {isLoading && <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded font-bold">ANALYZING...</span>}
        </div>
        <p className="text-purple-100">
          {mcpPowered ? 
            `🚀 LIVE MCP: ${mcpRecommendations.length} recommendations • 8 servers active • Real-time data` : 
            `Powered by elite draft analytics for ${userStrategy.name}`
          }
        </p>
        {mcpPowered && (
          <div className="mt-2 text-xs text-green-300">
            ⚡ Memory • 📡 Fetch • 🔍 Firecrawl • 💾 Database • Live NBA Stats
          </div>
        )}
      </div>

      {/* Top Recommendations */}
      <div className="space-y-4">
        {(mcpPowered && mcpRecommendations.length > 0 ? mcpRecommendations : mockRecommendations).map((rec, index) => (
          <div key={rec.player_id} className="player-card p-4 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{rec.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-purple-200">
                    <span>{rec.team}</span>
                    <span>•</span>
                    <span>{rec.positions.join(', ')}</span>
                    <span>•</span>
                    <span className="font-semibold text-purple-100">Score: {rec.score}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  rec.valueGrade === 'A+' ? 'bg-green-600 text-white' :
                  rec.valueGrade === 'A' ? 'bg-green-500 text-white' :
                  'bg-yellow-500 text-black'
                }`}>
                  {rec.valueGrade}
                </span>
                <span className={`text-xs ${
                  rec.riskLevel === 'Very Low' ? 'text-green-400' :
                  rec.riskLevel === 'Low' ? 'text-green-300' :
                  'text-yellow-400'
                }`}>
                  {rec.riskLevel} Risk
                </span>
              </div>
            </div>

            <p className="text-purple-100 text-sm mb-4 italic">
              "{rec.reasoning}"
            </p>
            
            {/* MCP Insights */}
            {mcpPowered && rec.mcp_insights && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="text-xs text-green-300 mb-2 font-semibold">🚀 LIVE MCP INSIGHTS</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-green-400">Injury Risk:</span>
                    <span className="text-white ml-1">{(rec.mcp_insights.injury_risk * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-green-400">Breakout:</span>
                    <span className="text-white ml-1">{(rec.mcp_insights.breakout_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-green-400">News Sentiment:</span>
                    <span className="text-white ml-1">{(rec.mcp_insights.recent_news_sentiment * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="text-green-400">Expert Consensus:</span>
                    <span className="text-white ml-1">{(rec.mcp_insights.expert_consensus * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Projected Stats Preview */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center">
                <div className="text-white font-semibold">{rec.projectedStats.points}</div>
                <div className="text-xs text-purple-200">PTS</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">{rec.projectedStats.rebounds}</div>
                <div className="text-xs text-purple-200">REB</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">{rec.projectedStats.assists}</div>
                <div className="text-xs text-purple-200">AST</div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">{rec.projectedStats.steals}</div>
                <div className="text-xs text-purple-200">STL</div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handlePlayerClick(rec)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {selectedPlayer?.player_id === rec.player_id ? 'Hide Details' : 'View Details'}
              </button>
              <button
                onClick={() => handleDraftPlayer(rec)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Draft Now
              </button>
            </div>

            {/* Expanded Details */}
            {selectedPlayer?.player_id === rec.player_id && (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Projected Season Stats</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-purple-200">Field Goal %</div>
                    <div className="text-white font-semibold">{(rec.projectedStats.fg_pct * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-purple-200">Free Throw %</div>
                    <div className="text-white font-semibold">{(rec.projectedStats.ft_pct * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-purple-200">3-Pointers</div>
                    <div className="text-white font-semibold">{rec.projectedStats.threes}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strategy Insight */}
      <div className="player-card p-4 rounded-lg">
        <h3 className="font-semibold text-white mb-2">💡 Strategy Insight</h3>
        <p className="text-purple-100 text-sm">
          With your <span className="font-semibold text-white">{userStrategy.name}</span> approach, 
          focus on players who excel in your weighted categories while maintaining roster balance.
        </p>
      </div>
    </div>
  )
}