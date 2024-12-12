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
  isCardFromDiscardEffect?: boolean;
}
export const DiscardPile: React.FC<DiscardPileProps> = ({
  gameState,
  onClose,
  onCardClick,
  isCardFromDiscardEffect = false,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedCardPosition, setSelectedCardPosition] = useState<CardPosition | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCardForConfirmation, setSelectedCardForConfirmation] = useState<{card: Card, position: CardPosition} | null>(null);

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

    if (isCardFromDiscardEffect) {
      setSelectedCardForConfirmation({card, position});
      setShowConfirmation(true);
    } else {
      onCardClick(card, position);
    }
  };

  const handleConfirm = () => {
    if (selectedCardForConfirmation) {
      onCardClick(selectedCardForConfirmation.card, selectedCardForConfirmation.position);
      setShowConfirmation(false);
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${isCardFromDiscardEffect ? 'animate-fadeIn' : ''}`}>
      <div 
        className="bg-[#F5F5DC] p-6 rounded-lg border border-[#666666]/10 shadow-2xl"
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
            className="rounded-full p-2 bg-[#666666]/10 hover:bg-[#666666]/20 transition-colors"
          >
            <span className="text-[#333333]/80 text-xl">×</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="overflow-auto max-h-[calc(90vh-100px)]">
          {discardedCards.length > 0 ? (
            <div className="relative h-48 bg-[#666666]/5 rounded-lg p-4">
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
            <div className="text-[#333333]/60 text-center py-8">
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

      {/* Confirmation Modal */}
      {showConfirmation && selectedCardForConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#F5F5DC] p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-xl text-[#333333] font-bold mb-4">Confirm Selection</h3>
            <p className="mb-6 text-[#333333]/80">
              Are you sure you want to add {selectedCardForConfirmation.card.name} to your city?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-[#FF6347] hover:text-[#FF6347]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#4682B4] text-white rounded hover:bg-[#5F9EA0]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscardPile;