import React, { useState, useEffect } from 'react';
import { ResourceType } from '../data/types/resource';
import { Wonder, WonderStage } from '../data/types/wonder';
import { GameState } from '../game-logic/gameState';
import { Player } from '../data/types/player';
import { tradeResource } from '../game-logic/utils/tradeResource';

interface TradeModalProps {
  onClose: () => void;
  onTrade: (resourceType: ResourceType, amount: number) => void;
  selectedWonder: Wonder;
  userWonder: Wonder;
  gameState: GameState;
  tradingPlayerId: number;
}

const TradeModal: React.FC<TradeModalProps> = ({
  onClose,
  onTrade,
  selectedWonder,
  userWonder,
  gameState,
  tradingPlayerId,
}) => {
  const [selectedResources, setSelectedResources] = useState<Record<ResourceType, number>>({} as Record<ResourceType, number>);
  const [goldCost, setGoldCost] = useState(0);

  const hasEnoughGold = gameState.players[0].gold >= goldCost;

  const isResourceFromWonder = (type: ResourceType, player: Player): boolean => {
    return player.wonder.wonderStages
      .filter(stage => stage.isBuilt)
      .some(stage => {
        if (!stage.production) return false;
        
        if ('choice' in stage.production) {
          // Handle production with choices
          return stage.production.choice.some(choice => 
            choice.options.includes(type)
          );
        } else {
          // Handle direct resource production
          return type in stage.production;
        }
      });
  };

  // Calculate gold cost whenever selected resources change
  useEffect(() => {
    // Calculate total cost considering trade discounts
    const totalCost = Object.entries(selectedResources).reduce((sum, [type, amount]) => {
      if (amount === 0) return sum;
      
      // Create temporary player objects to simulate the trade
      const tempPlayer = { 
        ...gameState.players[0],
        leftPlayer: gameState.players[gameState.players.length - 1],
        rightPlayer: gameState.players[1]
      };
      const tempNeighbor = { 
        ...gameState.players[tradingPlayerId],
        leftPlayer: gameState.players[(tradingPlayerId - 1 + gameState.players.length) % gameState.players.length],
        rightPlayer: gameState.players[(tradingPlayerId + 1) % gameState.players.length]
      };
      
      // Get the trade cost directly
      const { tradeCost } = tradeResource(
        tempPlayer,
        tempNeighbor,
        type as ResourceType,
        1  // Calculate for 1 resource to get per-resource cost
      );
      
      return sum + (amount * tradeCost);
    }, 0);

    setGoldCost(totalCost);
  }, [selectedResources, gameState.players, tradingPlayerId]);

  const handleResourceChange = (type: ResourceType, amount: number) => {
    const tradingPlayer = gameState.players[tradingPlayerId];
    const maxAmount = tradingPlayer.resources[type] || 0;
    
    // Ensure amount doesn't exceed available resources and isn't from a Wonder
    if (isResourceFromWonder(type as ResourceType, tradingPlayer)) {
      return;
    }
    
    const validAmount = Math.min(Math.max(0, amount), maxAmount);
    
    setSelectedResources(prev => ({
      ...prev,
      [type]: validAmount
    }));
  };

  // Add this function to filter out Wonder-produced resources
  const getAvailableResources = (player: Player): Record<ResourceType, number> => {
    const availableResources: Record<ResourceType, number> = {
      Wood: 0,
      Stone: 0,
      Ore: 0,
      Clay: 0,
      Glass: 0,
      Papyrus: 0,
      Textile: 0,
    };
    
    // Only include resources from cards, not from wonders
    Array.from(player.playerBoard).forEach(card => {
      if (card.production && !("choice" in card.production)) {
        Object.entries(card.production).forEach(([resource, amount]) => {
          availableResources[resource as ResourceType] += amount as number;
        });
      }
    });
    
    return availableResources;
  };

  // Use this function when displaying tradeable resources
  const tradeableResources = getAvailableResources(gameState.players[tradingPlayerId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-24">
          {/* Trading Player Container */}
          <div
            className="bg-[#F5F5DC] p-6 rounded-lg border border-[#666666]/10 shadow-2xl"
            style={{
              width: "500px",
              boxShadow: "0 0 40px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 255, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img
                src={selectedWonder.imagePath}
                alt={selectedWonder.name}
                className="rounded shadow-2xl"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                }}
              />
            </div>
            <div className="bg-[#E0D8C0]/50 p-4 rounded-lg shadow-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2 text-md text-[#333333]">Available Resources</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(tradeableResources)
                  .filter(([_, count]) => count >= 1)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center">
                      <span className="text-[#333333]/80 mr-2">{type}:</span>
                      <input
                        type="number"
                        min="0"
                        max={count}
                        value={selectedResources[type as ResourceType] || 0}
                        onChange={(e) => handleResourceChange(type as ResourceType, parseInt(e.target.value))}
                        className="w-16 bg-white text-[#333333] rounded px-2 py-1"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Arrow and Gold Cost */}
          <div className="flex flex-col items-center">
            <div className="text-yellow-400 text-2xl font-bold mb-2">
              {goldCost} Gold
            </div>
            <div className="text-[#2fa976] text-3xl">→</div>
          </div>

          {/* User Container */}
          <div
            className="bg-[#F5F5DC] p-6 rounded-lg border border-[#666666]/10 shadow-2xl"
            style={{
              width: "500px",
              boxShadow: "0 0 40px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 255, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img
                src={userWonder.imagePath}
                alt={userWonder.name}
                className="rounded shadow-2xl"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                }}
              />
            </div>
            <div className="bg-[#E0D8C0]/50 p-4 rounded-lg shadow-lg backdrop-blur-sm">
              <h3 className="font-bold mb-2 text-md text-[#333333]">Resources After Trade</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedResources).map(([type, amount]) => (
                  <div key={type} className="flex items-center">
                    <span className="text-[#333333]/80 mr-2">{type}:</span>
                    <span className="font-bold text-[#333333]">{amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              Object.entries(selectedResources).forEach(([type, amount]) => {
                if (amount > 0) {
                  onTrade(type as ResourceType, amount);
                }
              });
              onClose();
            }}
            className={`px-4 py-2 rounded transition-colors ${
              hasEnoughGold 
                ? "bg-blue-600 text-white hover:bg-blue-500" 
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
            disabled={goldCost === 0 || !hasEnoughGold}
          >
            {hasEnoughGold ? "Complete Trade" : "Not enough gold"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
