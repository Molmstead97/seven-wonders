import React, { useState, useEffect } from 'react';
import { Player } from '../data/types/player';
import { Card } from '../data/types/card';
import { militaryResults } from '../game-logic/utils/ageEnd';
import { Science } from '../data/types/resource';
import { applyGoldVictoryBonus } from '../data/types/cardSpecialEffects';

interface GameEndResultsProps {
  players: Player[];
  onPlayAgain: () => void;
}

interface PlayerResultsPanelProps {
  player: Player;
  isUser: boolean;
  rank: number;
}
 
function calculateSciencePoints(science: Science): number {
  
  // Calculate points for each symbol type
  const cogPoints = (science.Cog ?? 0) ** 2;
  const compassPoints = (science.Compass ?? 0) ** 2;
  const tabletPoints = (science.Tablet ?? 0) ** 2;

  // Calculate sets of different symbols
  const sets = Math.min(science.Cog ?? 0, science.Compass ?? 0, science.Tablet ?? 0);
  const setPoints = sets * 7;

  return cogPoints + compassPoints + tabletPoints + setPoints;
}

const PlayerResultsPanel: React.FC<PlayerResultsPanelProps> = ({ player, isUser, rank }) => {
  const getCardsByType = (type: string): Card[] => {
    return Array.from(player.playerBoard).filter(card => 
      card.cardColor === type
    );
  };

  const blueCards = getCardsByType('Blue');
  const yellowCards = getCardsByType('Yellow');
  const purpleCards = getCardsByType('Purple');

  // Calculate all points
  const goldPoints = Math.floor(player.gold / 3);
  const wonderPoints = player.wonder.wonderStages.reduce((sum, stage) => sum + (stage.victoryPoints || 0), 0);
  const bluePoints = blueCards.reduce((sum, card) => sum + (card.victoryPoints || 0), 0);
  
  // Calculate yellow card points through their special effects
  const yellowPoints = yellowCards.reduce((sum, card) => {
    if (card.specialEffect?.type === 'goldVictoryBonus') {
      return sum + applyGoldVictoryBonus(player, card.specialEffect, true);
    }
    return sum;
  }, 0);

  // Calculate purple card points through their special effects
  const purplePoints = purpleCards.reduce((sum, card) => {
    if (card.specialEffect?.type === 'goldVictoryBonus') {
      return sum + applyGoldVictoryBonus(player, card.specialEffect, true);
    }
    return sum;
  }, 0);

  const sciencePoints = calculateSciencePoints(player.science);
  const militaryResult = militaryResults.get(player.name) || { points: 0, wins: 0, losses: 0 };

  const totalPoints = goldPoints + bluePoints + yellowPoints + purplePoints + sciencePoints + militaryResult.points + wonderPoints;

  return (
    <div className={`rounded-lg p-6 mb-4 ${isUser ? 'bg-blue-900' : 'bg-gray-800'}`}>
      <div>
        <h3 className="text-2xl font-bold text-white">
          {isUser ? 'You' : `Player ${rank}`}
        </h3>
        <p className="text-xl text-white/80">
          Total Points: {totalPoints} | Remaining Gold: {player.gold}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {/* Gold Points - Always show since everyone starts with gold */}
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-lg text-white/90 mb-2">Points from Gold</h4>
          <p className="text-white/80">
            {goldPoints} points ({player.gold} gold)
          </p>
        </div>

        {/* Wonder Points - Only show if they have any */}
        {wonderPoints > 0 && (
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Wonder Points</h4>
            <p className="text-white/80">
              {wonderPoints} points
            </p>
          </div>
        )}

        {/* Blue Cards - Only show if they have any */}
        {bluePoints > 0 && (
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Civilian Structures (Blue)</h4>
            <p className="text-white/80">
              {bluePoints} points
            </p>
            <div className="mt-2 text-sm text-white/60">
              {blueCards.map(card => (
                <div key={card.name}>
                  {card.name}: {card.victoryPoints}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yellow Cards - Only show if they have any */}
        {yellowPoints > 0 && (
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Commercial Structures (Yellow)</h4>
            <p className="text-white/80">
              {yellowPoints} points
            </p>
            <div className="mt-2 text-sm text-white/60">
              {yellowCards.map(card => (
                <div key={card.name}>
                  {card.name}: {card.victoryPoints}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Green Cards - Only show if they have any science symbols */}
        {(player.science.Cog || player.science.Compass || player.science.Tablet) && (
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Scientific Structures (Green)</h4>
            <div className="mt-2 text-sm text-white/60">
              <div>Total Science Points: {sciencePoints}</div>
              <div>Cogs: {player.science.Cog || 0}</div>
              <div>Compasses: {player.science.Compass || 0}</div>
              <div>Tablets: {player.science.Tablet || 0}</div>
            </div>
          </div>
        )}

        {/* Purple Cards - Only show if they have any */}
        {purplePoints > 0 && (
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-lg text-white/90 mb-2">Guilds (Purple)</h4>
            <p className="text-white/80">
              {purplePoints} points
            </p>
            <div className="mt-2 text-sm text-white/60">
              {purpleCards.map(card => (
                <div key={card.name}>
                  {card.name}: {card.victoryPoints}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Military Points - Only show if they participated in conflicts */}
        {(militaryResult.wins > 0 || militaryResult.losses > 0) && (
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
        )}
      </div>
    </div>
  );
};

const GameEndResults: React.FC<GameEndResultsProps> = ({ players, onPlayAgain }) => {
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    // Small delay to ensure all calculations are complete
    const timer = setTimeout(() => {
      setIsCalculated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isCalculated) {
    return <div>Calculating final scores...</div>;
  }

  console.log("=== RENDERING END GAME RESULTS ===");
  console.log("Final player standings:", players.map(p => ({
    name: p.name,
    points: p.victoryPoints
  })));

  // Sort players by victory points
  const sortedPlayers = [...players].sort((a, b) => b.victoryPoints - a.victoryPoints);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 overflow-auto animate-fadeIn">
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
    </div>
  );
};

export default GameEndResults;