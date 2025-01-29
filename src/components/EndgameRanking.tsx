import React from 'react';
import { Player } from '../data/types/player';
import { Science } from '../data/types/resource';
import { applyGoldVictoryBonus } from '../data/types/cardSpecialEffects';
import { CardColor } from '../data/types/card';

interface GameEndResultsProps {
  players: Player[];
  onPlayAgain: () => void;
}

interface PlayerResultsPanelProps {
  player: Player;
  isUser: boolean;
  rank: number;
}
 
export function calculateSciencePoints(science: Science): number {
  
  // Calculate points for each symbol type
  const cogPoints = (science.Cog ?? 0) ** 2;
  const compassPoints = (science.Compass ?? 0) ** 2;
  const tabletPoints = (science.Tablet ?? 0) ** 2;

  // Calculate sets of different symbols
  const sets = Math.min(science.Cog ?? 0, science.Compass ?? 0, science.Tablet ?? 0);
  const setPoints = sets * 7;

  return cogPoints + compassPoints + tabletPoints + setPoints;
}

const calculateColorPoints = (player: Player, cardColor: CardColor) => {
  return Array.from(player.playerBoard)
    .filter(card => card.cardColor === cardColor)
    .reduce((sum, card) => {
      if (card.specialEffect?.type === 'goldVictoryBonus') {
        return sum + applyGoldVictoryBonus(player, card.specialEffect, true);
      }
      return sum;
    }, 0);
};

const PlayerResultsPanel: React.FC<PlayerResultsPanelProps> = ({ player, isUser, rank }) => {
  // Keep all calculation logic
  const goldPoints = Math.floor(player.gold / 3);
  const wonderPoints = player.wonder.wonderStages.reduce((sum, stage) => sum + (stage.victoryPoints || 0), 0);
  const bluePoints = Array.from(player.playerBoard)
    .filter(card => card.cardColor === 'Blue')
    .reduce((sum, card) => sum + (card.victoryPoints || 0), 0);
  
  const yellowPoints = calculateColorPoints(player, 'Yellow');
  const purplePoints = calculateColorPoints(player, 'Purple');

  const sciencePoints = calculateSciencePoints(player.science);

  const totalPoints = goldPoints + bluePoints + yellowPoints + purplePoints + sciencePoints + wonderPoints;
  const rankSuffix = rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th';

  return (
    <div className={`rounded-lg p-6 mb-4 ${isUser ? 'bg-[#4682B4]' : 'bg-[#F5F5DC]'}`}>
      <div>
        <h3 className={`text-2xl font-bold ${isUser ? 'text-white' : 'text-[#333333]'}`}>
          {isUser ? (
            rank === 1 ? 
            'Congratulations! You won!' : 
            `You took ${rank}${rankSuffix} place`
          ) : (
            `Player ${rank} took ${rank}${rankSuffix} place`
          )}
        </h3>
        <p className={`text-xl mt-2 ${isUser ? 'text-white/80' : 'text-[#333333]/80'}`}>
          Total Points: {totalPoints}
        </p>
      </div>
    </div>
  );
};

const GameEndResults: React.FC<GameEndResultsProps> = ({ players, onPlayAgain }) => {
  // Sort players by victory points
  const sortedPlayers = [...players].sort((a, b) => b.victoryPoints - a.victoryPoints);

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F5DC] overflow-auto animate-fadeIn">
      <div className="min-h-screen bg-[#F5F5DC] p-8">
        <h1 className="text-4xl font-bold text-[#333333] text-center mb-8">
          Game Results
        </h1>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedPlayers.map((player, index) => (
            <PlayerResultsPanel
              key={player.name}
              player={player}
              isUser={player.name === sortedPlayers[0].name}
              rank={index + 1}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onPlayAgain}
            className="px-8 py-3 bg-[#4682B4] text-white rounded-lg hover:bg-[#5F9EA0] transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEndResults;