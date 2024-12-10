import React, { useState } from 'react';
import { Card, CardPosition } from '../data/types/card';
import { GameState } from '../game-logic/gameState';
import { EnhancedCard } from './EnhancedCard';

const CARD_OFFSET = {
  horizontal: 40,
};

interface DiscardPileProps {
  gameState: GameState;
  onClose: () => void;
  onCardClick: (card: Card, position: CardPosition) => void;
}

export const DiscardPile: React.FC<DiscardPileProps> = ({
  gameState,
  onClose,
  onCardClick,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedCardPosition, setSelectedCardPosition] = useState<CardPosition | null>(null);

  const discardedCards = gameState.discardPile || [];

  const calculateModalWidth = (cardCount: number) => {
    const baseWidth = 200;
    const cardWidth = CARD_OFFSET.horizontal * (cardCount - 1) + 128; // 128px is the card width
    return Math.max(baseWidth, cardWidth + 64); // Add padding
  };

  const modalWidth = calculateModalWidth(discardedCards.length);

  const handleCardClick = (card: Card, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    const position: CardPosition = {
      x: rect.left,
      y: rect.top,
      width: 300,
      height: 450,
      rotation: 0
    };
    
    setSelectedCardPosition(position);
    setSelectedCard(card);
    onCardClick(card, position);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-gray-900 p-6 rounded-lg border border-white/10 shadow-2xl"
        style={{
          width: `${modalWidth}px`,
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={onClose}
            className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="text-white/80 text-xl">×</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="overflow-auto max-h-[calc(90vh-100px)]">
          {discardedCards.length > 0 ? (
            <div className="relative h-48 bg-white/5 rounded-lg p-4">
              {discardedCards.map((card, index) => (
                <div
                  key={`${card.name}-${index}`}
                  className="absolute transition-all duration-300 hover:z-50 hover:-translate-y-2"
                  style={{
                    left: `${index * CARD_OFFSET.horizontal}px`,
                    zIndex: index,
                  }}
                  onClick={(e) => handleCardClick(card, e.currentTarget)}
                >
                  <div className="w-32 h-48 rounded-lg shadow-md overflow-hidden">
                    <img
                      src={card.imagePath}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/60 text-center py-8">
              No cards have been discarded yet
            </div>
          )}
        </div>
      </div>

      {selectedCard && selectedCardPosition && (
        <EnhancedCard
          card={selectedCard}
          initialPosition={selectedCardPosition}
          onAnimationStart={() => {}}
          onClose={() => {
            setSelectedCard(null);
            setSelectedCardPosition(null);
          }}
          showActions={false}
        />
      )}
    </div>
  );
};

export default DiscardPile;