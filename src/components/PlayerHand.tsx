import React, { useMemo, useState } from 'react';

import { Card as CardType } from '../game-logic/types/card';
import { Wonder } from '../game-logic/types/wonder';
import { GameState } from '../game-logic/gameState';
import EnhancedCard from './EnhancedCard';

interface PlayerHandProps {
  cards: CardType[];
  currentWonder: Wonder; // Used for building wonders
  gameState: GameState;
  onCardPlay: (cardIndex: number) => void;
  onWonderBuild: (cardIndex: number) => void;
  onCardDiscard: (cardIndex: number) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ 
  cards,  
  onCardPlay,
  onWonderBuild,
  onCardDiscard,
}) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  // Calculate card positions in a fan layout
  const cardPositions = useMemo(() => {
    const fanAngle = Math.min(5 * (cards.length - 1), 60); // Max 60 degree spread
    const angleStep = cards.length > 1 ? fanAngle / (cards.length - 1) : 0;
    const radius = 400;

    return cards.map((_, index) => {
      const angle = -fanAngle / 2 + angleStep * index;
      const radian = (angle * Math.PI) / 180;
      return {
        x: radius * Math.sin(radian),
        y: radius - radius * Math.cos(radian),
        rotation: angle
      };
    });
  }, [cards.length]);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 h-48 perspective-1000">
      <div className="relative w-full h-full">
        {cards.map((card, index) => {
          const { x, y, rotation } = cardPositions[index];
          return (
            <div 
              key={`${card.name}-${index}`}
              className="absolute group"
              style={{
                transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg)`,
                transformOrigin: 'bottom center',
                transition: 'transform 0.3s ease-out',
              }}
              onClick={() => setSelectedCard(card)}
            >
              <div className="relative w-32 h-48 rounded-lg overflow-hidden hover:z-10">
                <img 
                  src={card.imagePath}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 bg-black bg-opacity-50 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onCardPlay(index)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    >
                      Play
                    </button>
                    <button
                      onClick={() => onWonderBuild(index)}
                      className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs"
                    >
                      Build Wonder
                    </button>
                    <button
                      onClick={() => onCardDiscard(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedCard && (
        <EnhancedCard
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onCardPlay={() => {
            onCardPlay(cards.indexOf(selectedCard));
            setSelectedCard(null);
          }}
          onWonderBuild={() => {
            onWonderBuild(cards.indexOf(selectedCard));
            setSelectedCard(null);
          }}
          onCardDiscard={() => {
            onCardDiscard(cards.indexOf(selectedCard));
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
};

export default PlayerHand;
