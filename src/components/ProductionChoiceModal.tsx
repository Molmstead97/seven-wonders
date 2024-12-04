import React, { useState } from 'react';
import { Card } from '../game-logic/types/card';
import { ResourceType } from '../game-logic/types/resource';
import { motion } from 'framer-motion';

interface ProductionChoiceModalProps {
  card: Card;
  onChoiceSelected: (resource: ResourceType) => void;
  onClose: () => void;
}

const ProductionChoiceModal: React.FC<ProductionChoiceModalProps> = ({
  card,
  onChoiceSelected,
  onClose,
}) => {
  const [hoveredResource, setHoveredResource] = useState<ResourceType | null>(null);

  // Parse the production choices from the card
  const getProductionChoices = (): ResourceType[] => {
    if (!card.production) return [];
    
    const choices = Object.keys(card.production).find(key => key.includes(','));
    return choices ? choices.split(',').map(r => r.trim() as ResourceType) : [];
  };

  // Get the color for each resource type
  const getResourceColor = (resource: ResourceType) => {
    const colors: Record<ResourceType, string> = {
      Wood: '#8B4513',
      Stone: '#808080',
      Clay: '#CD5C5C',
      Ore: '#4A4A4A',
      Glass: '#ADD8E6',
      Papyrus: '#F5DEB3',
      Textile: '#E6E6FA',
    };
    return colors[resource];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Choose Production Resource
        </h2>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Card Image */}
          <div className="relative w-[240px] h-[336px] rounded-lg overflow-hidden shadow-lg">
            <img 
              src={card.imagePath} 
              alt={card.name}
              className="w-full h-full object-cover"
            />
            {hoveredResource && (
              <div 
                className="absolute inset-0 bg-opacity-30"
                style={{ backgroundColor: getResourceColor(hoveredResource) }}
              />
            )}
          </div>
          
          {/* Resource Choices */}
          <div className="flex space-x-4 mt-6">
            {getProductionChoices().map((resource) => (
              <motion.button
                key={resource}
                onClick={() => onChoiceSelected(resource)}
                onHoverStart={() => setHoveredResource(resource)}
                onHoverEnd={() => setHoveredResource(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-colors"
                style={{ 
                  backgroundColor: getResourceColor(resource),
                  border: '2px solid transparent',
                  borderColor: hoveredResource === resource ? '#ffffff' : 'transparent'
                }}
              >
                {resource}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ✕
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ProductionChoiceModal;