'use client'

import { useState, useEffect } from 'react'
import { DraftBoard } from './draft-board'
import { PlayerRecommendations } from './player-recommendations'
import { DraftSettings } from './draft-settings'

export interface DraftState {
  sessionId: string
  leagueId: string
  currentPick: number
  totalPicks: number
  userPicks: any[]
  allPicks: any[]
  availablePlayers: any[]
  recentPicks: any[]
  draftStarted: boolean
  draftCompleted: boolean
  isLive: boolean
}

export interface UserStrategy {
  strategy_id: string
  name: string
  strategy_type: 'balanced' | 'punt_fg' | 'punt_ft' | 'punt_to' | 'big_man' | 'guard_heavy'
  category_weights: {
    points: number
    rebounds: number
    assists: number
    steals: number
    blocks: number
    field_goal_pct: number
    free_throw_pct: number
    three_pointers: number
    turnovers: number
  }
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive'
}

export function DraftAssistant() {
  const [draftState, setDraftState] = useState<DraftState>({
    sessionId: '',
    leagueId: '',
    currentPick: 1,
    totalPicks: 156,
    userPicks: [],
    allPicks: [],
    availablePlayers: [],
    recentPicks: [],
    draftStarted: false,
    draftCompleted: false,
    isLive: false
  })

  const [userStrategy, setUserStrategy] = useState<UserStrategy>({
    strategy_id: 'balanced-strategy',
    name: 'Balanced Strategy',
    strategy_type: 'balanced',
    category_weights: {
      points: 1.0,
      rebounds: 1.0,
      assists: 1.0,
      steals: 1.0,
      blocks: 1.0,
      field_goal_pct: 1.0,
      free_throw_pct: 1.0,
      three_pointers: 1.0,
      turnovers: 1.0
    },
    risk_tolerance: 'moderate'
  })

  // Initialize draft session
  useEffect(() => {
    const sessionId = `draft-${Date.now()}`
    setDraftState(prev => ({
      ...prev,
      sessionId,
      leagueId: 'demo-league',
      draftStarted: true
    }))
  }, [])

  const handlePickUpdate = (pickNumber: number, player: any) => {
    setDraftState(prev => ({
      ...prev,
      currentPick: pickNumber + 1,
      allPicks: [...prev.allPicks, { pickNumber, playerId: player.player_id, player }],
      availablePlayers: prev.availablePlayers.filter(p => p.player_id !== player.player_id),
      recentPicks: [{ pickNumber, player }, ...prev.recentPicks.slice(0, 4)]
    }))
  }

  const handleStrategyChange = (newStrategy: Partial<UserStrategy>) => {
    setUserStrategy(prev => ({ ...prev, ...newStrategy }))
  }

  return (
    <div className="draft-board rounded-xl p-6 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Draft Settings & Strategy */}
        <div className="lg:col-span-1">
          <DraftSettings 
            strategy={userStrategy}
            onStrategyChange={handleStrategyChange}
            draftState={draftState}
          />
        </div>

        {/* Main Draft Board */}
        <div className="lg:col-span-1">
          <DraftBoard 
            draftState={draftState}
            onPickUpdate={handlePickUpdate}
          />
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-1">
          <PlayerRecommendations 
            draftState={draftState}
            userStrategy={userStrategy}
            onPlayerSelect={handlePickUpdate}
          />
        </div>
      </div>
    </div>
  )
}