import React, { useState } from 'react';
import { Card } from '../data/types/card';
import { ResourceType, ScienceType } from '../data/types/resource';
import { Wonder } from '../data/types/wonder';

interface ProductionChoiceModalProps {
  card?: Card;
  wonder?: Wonder;
  stageIndex?: number;
  onChoiceSelected: (choice: ResourceType | ScienceType) => void;
  onClose: () => void;
}

const ProductionChoiceModal: React.FC<ProductionChoiceModalProps> = ({
  card,
  wonder,
  stageIndex,
  onChoiceSelected,
  onClose,
}) => {
  const [hoveredChoice, setHoveredChoice] = useState<ResourceType | ScienceType | null>(null);

  const getProductionChoices = (): Array<{ options: (ResourceType | ScienceType)[], amount: number }> => {
    const source = card || (wonder && typeof stageIndex === 'number' ? wonder.wonderStages[stageIndex] : null);
    if (!source?.production || !("choice" in source.production)) return [];
    return source.production.choice;
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
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-bold text-white text-center w-full">
            {card ? card.name : wonder?.name} - Choose {choices[0]?.options.includes('Cog') ? 'Science Symbol' : 'Production'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white absolute right-4 top-4"
          >
            ✕
          </button>
        </div>

        <div className="space-y-8">
          {choices.map((choice, choiceIndex) => (
            <div key={choiceIndex} className="bg-gray-700 p-6 rounded-lg">
              <p className="text-white text-xl text-center mb-6">
                Choose {choice.amount} {choice.options.includes('Cog') ? 'science symbol' : 'resource'}
                {choice.amount > 1 ? 's' : ''}:
              </p>
              <div className={`grid gap-8 grid-cols-${choice.options.length} justify-items-center max-w-[400px] mx-auto`}>
                {choice.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => onChoiceSelected(option)}
                    onMouseEnter={() => setHoveredChoice(option)}
                    onMouseLeave={() => setHoveredChoice(null)}
                    className="flex flex-col items-center group"
                  >
                    <div className={`
                      p-2 rounded-lg transition-all duration-200
                      ${hoveredChoice === option ? 'bg-green-500/20 scale-110' : ''}
                      group-hover:animate-bounce
                    `}>
                      <img 
                        src={`/images/resource-images/${option.toLowerCase()}.png`}
                        alt={option}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <span className={`
                      text-white text-lg mt-2 font-medium transition-colors duration-200
                      ${hoveredChoice === option ? 'text-green-400' : ''}
                    `}>
                      {option}
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