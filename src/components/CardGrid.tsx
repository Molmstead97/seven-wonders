import React from 'react';
import { Card, CardPosition } from '../data/types/card';

interface CardGridProps {
  cards: Card[];
  color: string;
  onCardClick: (card: Card, element: HTMLElement) => void;
  cardOffset: { horizontal: number; verticalGap: number };
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, color, onCardClick, cardOffset }) => {
  return (
    <div className="relative bg-[#666666]/10 rounded-lg p-4">
      <div className="text-[#333333] text-sm mb-3 font-bold">{color}</div>
      <div className="relative h-44">
        {cards.map((card, index) => (
          <div
            key={card.name}
            className="absolute transition-all duration-300 hover:z-50 hover:-translate-y-2"
            style={{
              left: `${index * cardOffset.horizontal}px`,
              zIndex: index,
            }}
            onClick={(e) => onCardClick(card, e.currentTarget)}
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
  );
}; 