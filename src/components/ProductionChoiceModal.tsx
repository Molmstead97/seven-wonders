import React, { useState } from 'react';
import { Card } from '../data/types/card';
import { ResourceType } from '../data/types/resource';

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

  const getProductionChoices = (): Array<{ options: ResourceType[], amount: number }> => {
    if (!card.production || !("choice" in card.production)) return [];
    return card.production.choice;
  };

  const choices = getProductionChoices();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-bold text-white text-center w-full">
            {card.name} - Choose Production
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white absolute right-4 top-4"
          >
            ✕
          </button>
        </div>

        {/* Resource Choices */}
        <div className="space-y-8">
          {choices.map((choice, choiceIndex) => (
            <div key={choiceIndex} className="bg-gray-700 p-6 rounded-lg">
              <p className="text-white text-xl text-center mb-6">
                Choose {choice.amount} resource{choice.amount > 1 ? 's' : ''}:
              </p>
              <div className={`grid gap-8 ${choice.options.length <= 2 ? 'grid-cols-2 justify-items-center max-w-[400px] mx-auto' : 'grid-cols-4'}`}>
                {choice.options.map((resource) => (
                  <button
                    key={resource}
                    onClick={() => onChoiceSelected(resource)}
                    onMouseEnter={() => setHoveredResource(resource)}
                    onMouseLeave={() => setHoveredResource(null)}
                    className="flex flex-col items-center group"
                  >
                    <div className={`
                      p-2 rounded-lg transition-all duration-200
                      ${hoveredResource === resource ? 'bg-green-500/20 scale-110' : ''}
                      group-hover:animate-bounce
                    `}>
                      <img 
                        src={`/images/resource-images/${resource.toLowerCase()}.png`}
                        alt={resource}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <span className={`
                      text-white text-lg mt-2 font-medium transition-colors duration-200
                      ${hoveredResource === resource ? 'text-green-400' : ''}
                    `}>
                      {resource}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductionChoiceModal;