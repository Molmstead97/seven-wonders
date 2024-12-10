import React, { useState } from 'react';
import { Card, CardColor, CardPosition } from '../data/types/card';
import { Player } from '../data/types/player';
import { EnhancedCard } from './EnhancedCard';

const CARD_COLORS = ['Brown', 'Grey', 'Blue', 'Green', 'Yellow', 'Red', 'Purple'] as const;

// Constants for card stacking
const CARD_OFFSET = {
  horizontal: 50,    // Increased from 30
  verticalGap: 3     // Gap between color rows
};

interface PlayerBoardProps {
  player: Player;
  onClose: () => void;
  onCardClick: (card: Card, position: CardPosition) => void;
}

// Add this function to calculate modal width based on cards
const calculateModalWidth = (maxCardsInRow: number) => {
  const baseWidth = 250;  // Base width for the container
  const cardWidth = CARD_OFFSET.horizontal * (maxCardsInRow - 1) + 128; // 128px is the card width
  return Math.max(baseWidth, cardWidth + 64); // Add padding
};

export const PlayerBoard: React.FC<PlayerBoardProps> = ({
  player,
  onClose,
  onCardClick,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedCardPosition, setSelectedCardPosition] = useState<CardPosition | null>(null);

  // Group cards by color
  const cardsByColor = Array.from(player.playerBoard).reduce((acc, card) => {
    const color = Array.isArray(card.cardColor) ? card.cardColor[0] : card.cardColor;
    if (!acc[color]) acc[color] = [];
    acc[color].push(card);
    return acc;
  }, {} as Record<CardColor, Card[]>);

  const handleCardClick = (card: Card, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    const position: CardPosition = {
      x: rect.left,
      y: rect.top,
      width: 300,  // Fixed width to match PlayerHand
      height: 450, // Fixed height to match PlayerHand
      rotation: 0
    };
    
    setSelectedCardPosition(position);
    setSelectedCard(card);
    onCardClick(card, position);
  };

  // In your component, before the return statement
  const nonEmptyColors = CARD_COLORS.filter(color => 
    cardsByColor[color] && cardsByColor[color].length > 0
  );

  const maxCardsInRow = Math.max(
    ...nonEmptyColors.map(color => cardsByColor[color]?.length || 0)
  );

  const modalWidth = calculateModalWidth(maxCardsInRow);

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-white font-bold">
            {player.id === 0 ? "" : `Player ${player.id + 1}`}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="text-white/80 text-xl">×</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="overflow-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-6">
            {nonEmptyColors.map(color => (
              <div key={color} className="relative bg-white/5 rounded-lg p-4">
                <div className="text-white/60 text-sm mb-3 font-semibold">{color}</div>
                <div className="relative h-48">
                  {cardsByColor[color]?.map((card, index) => (
                    <div
                      key={card.name}
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
              </div>
            ))}
          </div>
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

