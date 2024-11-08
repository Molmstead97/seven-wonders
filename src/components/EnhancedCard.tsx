import React from 'react';
import { Card } from '../game-logic/types/card';

interface EnhancedCardProps {
  card: Card;
  onClose: () => void;
  onCardPlay: () => void;
  onWonderBuild: () => void;
  onCardDiscard: () => void;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  card, 
  onClose,
  onCardPlay,
  onWonderBuild,
  onCardDiscard,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg">
        <img src={card.imagePath} alt={card.name} className="w-64 h-96 object-cover mb-4" />
        <h2 className="text-2xl font-bold mb-4">{card.name}</h2>
        <div className="flex space-x-4">
          <button 
            onClick={onCardPlay}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play
          </button>
          <button 
            onClick={onWonderBuild}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Build Wonder
          </button>
          <button 
            onClick={onCardDiscard}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCard;