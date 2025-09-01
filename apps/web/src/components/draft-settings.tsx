'use client'

import { UserStrategy, DraftState } from './draft-assistant'

interface DraftSettingsProps {
  strategy: UserStrategy
  onStrategyChange: (strategy: Partial<UserStrategy>) => void
  draftState: DraftState
}

export function DraftSettings({ strategy, onStrategyChange, draftState }: DraftSettingsProps) {
  const strategyTypes = [
    { value: 'balanced', label: 'Balanced' },
    { value: 'punt_fg', label: 'Punt FG%' },
    { value: 'punt_ft', label: 'Punt FT%' },
    { value: 'punt_to', label: 'Punt Turnovers' },
    { value: 'big_man', label: 'Big Man Build' },
    { value: 'guard_heavy', label: 'Guard Heavy' }
  ]

  const riskLevels = [
    { value: 'conservative', label: 'Conservative' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'aggressive', label: 'Aggressive' }
  ]

  return (
    <div className="space-y-6">
      <div className="player-card p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">⚙️ Draft Settings</h2>
        
        {/* Draft Info */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-purple-200">Current Pick:</span>
            <span className="text-white font-semibold">#{draftState.currentPick}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-200">Your Picks:</span>
            <span className="text-white font-semibold">{draftState.userPicks.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-200">Total Drafted:</span>
            <span className="text-white font-semibold">{draftState.allPicks.length}</span>
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Draft Strategy
            </label>
            <select
              value={strategy.strategy_type}
              onChange={(e) => onStrategyChange({ strategy_type: e.target.value as any })}
              className="w-full p-3 rounded-lg bg-slate-800 border border-purple-500/20 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              {strategyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Risk Tolerance
            </label>
            <select
              value={strategy.risk_tolerance}
              onChange={(e) => onStrategyChange({ risk_tolerance: e.target.value as any })}
              className="w-full p-3 rounded-lg bg-slate-800 border border-purple-500/20 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              {riskLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Weights Preview */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-purple-200 mb-3">Category Weights</h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {Object.entries(strategy.category_weights).map(([category, weight]) => (
              <div key={category} className="flex justify-between p-2 bg-slate-800/50 rounded">
                <span className="text-purple-200 capitalize">
                  {category.replace('_', ' ')}:
                </span>
                <span className="text-white font-semibold">
                  {weight.toFixed(1)}x
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Draft Status */}
      <div className="player-card p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${draftState.draftStarted ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <span className="text-white text-sm">
            {draftState.draftStarted ? 'Draft Active' : 'Draft Not Started'}
          </span>
        </div>
      </div>
    </div>
  )
}