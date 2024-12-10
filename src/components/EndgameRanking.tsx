import React, { useState } from 'react';
import { Player } from '../data/types/player';
import { Card } from '../data/types/card';
import { calculateSciencePoints } from '../game-logic/utils/gameEnd';
import { militaryResults } from '../game-logic/utils/ageEnd';

interface GameEndResultsProps {
  players: Player[];
  onPlayAgain: () => void;
}

interface PlayerResultsPanelProps {
  player: Player;
  isUser: boolean;
  rank: number;
}

const PlayerResultsPanel: React.FC<PlayerResultsPanelProps> = ({ player, isUser, rank }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCardsByType = (type: string): Card[] => {
    return Array.from(player.playerBoard).filter(card => 
      card.cardColor === type
    );
  };

  const blueCards = getCardsByType('Blue');
  const yellowCards = getCardsByType('Yellow');
  const greenCards = getCardsByType('Green');
  const purpleCards = getCardsByType('Purple');

  const sciencePoints = calculateSciencePoints(player.science);

  const militaryResult = militaryResults.get(player.name) || { points: 0, wins: 0, losses: 0 };

  return (
    <div className={`rounded-lg p-6 mb-4 ${isUser ? 'bg-blue-900' : 'bg-gray-800'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">
            {isUser ? 'You' : `Player ${rank}`}
          </h3>
          <p className="text-xl text-white/80">
            Total Points: {player.victoryPoints} | Remaining Gold: {player.gold}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/60 hover:text-white"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Gold Points */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Points from Gold</h4>
            <p className="text-white/80">
              {Math.floor(player.gold / 3)} points ({player.gold} gold)
            </p>
          </div>

          {/* Blue Cards */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Civilian Structures (Blue)</h4>
            <p className="text-white/80">
              {blueCards.reduce((sum, card) => sum + (card.victoryPoints || 0), 0)} points
            </p>
            <div className="mt-2 text-sm text-white/60">
              {blueCards.map(card => (
                <div key={card.name}>
                  {card.name}: {card.victoryPoints}
                </div>
              ))}
            </div>
          </div>

          {/* Yellow Cards */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Commercial Structures (Yellow)</h4>
            <p className="text-white/80">
              {yellowCards.reduce((sum, card) => sum + (card.victoryPoints || 0), 0)} points
            </p>
            <div className="mt-2 text-sm text-white/60">
              {yellowCards.map(card => (
                <div key={card.name}>
                  {card.name}: {card.victoryPoints}
                </div>
              ))}
            </div>
          </div>

          {/* Green Cards */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Scientific Structures (Green)</h4>
            <div className="mt-2 text-sm text-white/60">
              <div>Total Science Points: {sciencePoints}</div>
              <div>Cogs: {player.science.Cog || 0}</div>
              <div>Compasses: {player.science.Compass || 0}</div>
              <div>Tablets: {player.science.Tablet || 0}</div>
            </div>
          </div>

          {/* Purple Cards */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Guilds (Purple)</h4>
            <p className="text-white/80">
              {purpleCards.reduce((sum, card) => sum + (card.victoryPoints || 0), 0)} points
            </p>
            <div className="mt-2 text-sm text-white/60">
              {purpleCards.map(card => (
                <div key={card.name}>
                  {card.name}: {card.victoryPoints}
                </div>
              ))}
            </div>
          </div>

          {/* Military Points */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Military Conflicts</h4>
            <p className="text-white/80">
              Total Points: {militaryResult.points}
            </p>
            <div className="mt-2 text-sm text-white/60">
              <div>Wins: {militaryResult.wins}</div>
              <div>Losses: {militaryResult.losses}</div>
              <div>Loss Tokens: {player.conflictLossTokens}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GameEndResults: React.FC<GameEndResultsProps> = ({ players, onPlayAgain }) => {
  console.log("=== RENDERING END GAME RESULTS ===");
  console.log("Final player standings:", players.map(p => ({
    name: p.name,
    points: p.victoryPoints
  })));

  // Sort players by victory points
  const sortedPlayers = [...players].sort((a, b) => b.victoryPoints - a.victoryPoints);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        Game Results
      </h1>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedPlayers.map((player, index) => (
          <PlayerResultsPanel
            key={index}
            player={player}
            isUser={index === 0}
            rank={index + 1}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onPlayAgain}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameEndResults;