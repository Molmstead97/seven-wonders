import React, { useState, useEffect } from 'react';
import { Card } from '../data/types/card';
import { ResourceType } from '../data/types/resource';
import { motion } from 'framer-motion';

interface ProductionChoiceModalProps {
  card: Card;
  onChoiceSelected: (resource: ResourceType) => void;
  onClose: () => void;
}

// Define clickable areas for each resource type
const resourceAreas: Record<ResourceType, { top: number; left: number; width: number; height: number }> = {
  Wood: { top: 240, left: 20, width: 40, height: 40 },
  Stone: { top: 240, left: 70, width: 40, height: 40 },
  Clay: { top: 240, left: 120, width: 40, height: 40 },
  Ore: { top: 240, left: 170, width: 40, height: 40 },
  Glass: { top: 290, left: 20, width: 40, height: 40 },
  Papyrus: { top: 290, left: 70, width: 40, height: 40 },
  Textile: { top: 290, left: 120, width: 40, height: 40 },
};

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

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const choices = getProductionChoices();
    for (const resource of choices) {
      const area = resourceAreas[resource];
      if (
        x >= area.left && 
        x <= area.left + area.width && 
        y >= area.top && 
        y <= area.top + area.height
      ) {
        onChoiceSelected(resource);
        break;
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const choices = getProductionChoices();
    let foundResource: ResourceType | null = null;
    
    for (const resource of choices) {
      const area = resourceAreas[resource];
      if (
        x >= area.left && 
        x <= area.left + area.width && 
        y >= area.top && 
        y <= area.top + area.height
      ) {
        foundResource = resource;
        break;
      }
    }
    
    setHoveredResource(foundResource);
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
          {/* Card Image with clickable areas */}
          <div 
            className="relative w-[240px] h-[336px] rounded-lg overflow-hidden shadow-lg cursor-pointer"
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredResource(null)}
          >
            <img 
              src={card.imagePath} 
              alt={card.name}
              className="w-full h-full object-cover"
            />
            {hoveredResource && (
              <div 
                className="absolute inset-0 bg-white bg-opacity-20"
                style={{
                  top: resourceAreas[hoveredResource].top,
                  left: resourceAreas[hoveredResource].left,
                  width: resourceAreas[hoveredResource].width,
                  height: resourceAreas[hoveredResource].height,
                }}
              />
            )}
          </div>
        </div>

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