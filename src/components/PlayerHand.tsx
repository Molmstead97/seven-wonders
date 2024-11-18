import React, { useMemo, useState, useRef } from 'react';
import { Card as CardType } from '../game-logic/types/card';
import { Wonder } from '../game-logic/types/wonder';
import { GameState } from '../game-logic/gameState';
import EnhancedCard from './EnhancedCard';
import { CardPosition } from '../game-logic/types/card';

interface PlayerHandProps {
  cards: CardType[];
  currentWonder: Wonder;
  gameState: GameState;
  onCardPlay: (cardIndex: number) => void;
  onWonderBuild: (cardIndex: number) => void;
  onCardDiscard: (cardIndex: number) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ 
  cards,  
  currentWonder,
  gameState,
  onCardPlay,
  onWonderBuild,
  onCardDiscard,
}) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [selectedCardPosition, setSelectedCardPosition] = useState<CardPosition | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef<HTMLDivElement[]>([]);

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

  const handleCardClick = (card: CardType, index: number) => {
    const cardElement = cardRefs.current[index];
    if (!cardElement) return;

    const rect = cardElement.getBoundingClientRect();
    const { rotation } = cardPositions[index];
    
    // Reset any transforms to get true dimensions
    const position: CardPosition = {
      x: rect.left,
      y: rect.top,
      rotation: rotation,
      width: cardElement.offsetWidth,
      height: cardElement.offsetHeight,
    };

    setSelectedCardPosition(position);
    setSelectedCard(card);
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 h-48 perspective-1000">
      <div className="relative w-full h-full">
        {cards.map((card, index) => {
          const { x, y, rotation } = cardPositions[index];
          const isSelected = selectedCard === card;
          
          return (
            <div 
              key={`${card.name}-${index}`}
              ref={(el) => (cardRefs.current[index] = el!)}
              className="absolute group"
              style={{
                transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg)`,
                transformOrigin: 'bottom center',
                transition: 'transform 0.3s ease-out',
                opacity: (isSelected && isAnimating) ? 0 : 1,
              }}
              onClick={() => handleCardClick(card, index)}
            >
              <div className="relative w-32 h-48 rounded-lg overflow-hidden hover:z-10">
                <img 
                  src={card.imagePath}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
      {selectedCard && selectedCardPosition && (
        <EnhancedCard
          card={selectedCard}
          initialPosition={selectedCardPosition}
          onAnimationStart={() => setIsAnimating(true)}
          currentWonder={currentWonder}
          gameState={gameState}
          onClose={() => {
            setSelectedCard(null);
            setSelectedCardPosition(null);
            setIsAnimating(false);
          }}
          onCardPlay={() => {
            onCardPlay(cards.indexOf(selectedCard));
            setSelectedCard(null);
            setSelectedCardPosition(null);
            setIsAnimating(false);
          }}
          onWonderBuild={() => {
            onWonderBuild(cards.indexOf(selectedCard));
            setSelectedCard(null);
            setSelectedCardPosition(null);
            setIsAnimating(false);
          }}
          onCardDiscard={() => {
            onCardDiscard(cards.indexOf(selectedCard));
            setSelectedCard(null);
            setSelectedCardPosition(null);
            setIsAnimating(false);
          }}
        />
      )}
    </div>
  );
};

export default PlayerHand;
