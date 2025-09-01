'use client'

import { DraftState } from './draft-assistant'

interface DraftBoardProps {
  draftState: DraftState
  onPickUpdate: (pickNumber: number, player: any) => void
}

const mockPlayers = [
  { player_id: '1', name: 'Nikola Jokić', team: 'DEN', positions: ['C'], adp: 1.2 },
  { player_id: '2', name: 'Luka Dončić', team: 'DAL', positions: ['PG', 'SG'], adp: 2.8 },
  { player_id: '3', name: 'Shai Gilgeous-Alexander', team: 'OKC', positions: ['PG', 'SG'], adp: 3.1 },
  { player_id: '4', name: 'Giannis Antetokounmpo', team: 'MIL', positions: ['PF', 'C'], adp: 4.2 },
  { player_id: '5', name: 'Anthony Davis', team: 'LAL', positions: ['PF', 'C'], adp: 5.8 },
  { player_id: '6', name: 'Jayson Tatum', team: 'BOS', positions: ['SF', 'PF'], adp: 6.1 },
  { player_id: '7', name: 'Victor Wembanyama', team: 'SAS', positions: ['PF', 'C'], adp: 7.3 },
  { player_id: '8', name: 'Stephen Curry', team: 'GSW', positions: ['PG'], adp: 8.5 },
  { player_id: '9', name: 'Damian Lillard', team: 'MIL', positions: ['PG'], adp: 9.2 },
  { player_id: '10', name: 'Anthony Edwards', team: 'MIN', positions: ['SG', 'SF'], adp: 10.1 }
]

export function DraftBoard({ draftState, onPickUpdate }: DraftBoardProps) {
  const availablePlayers = draftState.availablePlayers.length > 0 
    ? draftState.availablePlayers 
    : mockPlayers.slice(draftState.allPicks.length)

  const handlePlayerDraft = (player: any) => {
    onPickUpdate(draftState.currentPick, player)
  }

  return (
    <div className="space-y-6">
      {/* Current Pick Info */}
      <div className="recommendation-card p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Pick #{draftState.currentPick}</h2>
        <p className="text-purple-100">
          {draftState.currentPick <= 12 ? 'Early Round' : 
           draftState.currentPick <= 60 ? 'Mid Round' : 'Late Round'} Selection
        </p>
      </div>

      {/* Available Players */}
      <div className="player-card p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Available Players</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {availablePlayers.slice(0, 10).map((player, index) => (
            <div
              key={player.player_id}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
              onClick={() => handlePlayerDraft(player)}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-purple-300 font-mono w-8">
                    #{(draftState.allPicks.length + index + 1)}
                  </span>
                  <div>
                    <h4 className="font-semibold text-white">{player.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-purple-200">
                      <span>{player.team}</span>
                      <span>•</span>
                      <span>{player.positions?.join(', ') || 'Multi'}</span>
                      {player.adp && (
                        <>
                          <span>•</span>
                          <span>ADP: {player.adp}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                Draft
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Picks */}
      {draftState.recentPicks.length > 0 && (
        <div className="player-card p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Recent Picks</h3>
          <div className="space-y-2">
            {draftState.recentPicks.map((pick, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                <span className="text-sm font-mono text-purple-300">#{pick.pickNumber}</span>
                <span className="text-white font-medium">{pick.player.name}</span>
                <span className="text-sm text-purple-200">{pick.player.team}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}