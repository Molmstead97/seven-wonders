import React, { useState } from 'react';
import { Wonder } from '../data/types/wonder';

interface WonderSelectorProps {
  onWonderSelected: (wonder: Wonder) => void;
  availableWonders: Wonder[];
}

interface WonderCardProps {
  wonder: Wonder;
  pairWonder: Wonder;
  onSelect: (wonder: Wonder) => void;
}

const WonderCard: React.FC<WonderCardProps> = ({ wonder, pairWonder, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  
  const currentWonder = isFlipped ? pairWonder : wonder;

  const handleConfirm = () => {
    console.log("WonderCard - Selected Wonder (full object):", currentWonder);
    console.log("WonderCard - Selected Wonder name:", currentWonder.name);
    console.log("WonderCard - onSelect function:", typeof onSelect);
    onSelect(currentWonder);
    setShowConfirmation(false);
  };

  return (
    <div className="relative">
      {/* Wonder Card */}
      <div className="relative preserve-3d" style={{ perspective: '1000px' }}>
        <div
          className={`transition-all duration-700 preserve-3d ${
            isFlipped ? 'rotate-x-180 translate-y-0' : ''
          }`}
        >
          {/* Front */}
          <div className={`backface-hidden ${isFlipped ? 'invisible' : ''}`}>
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <h3 className="text-xl text-white font-bold text-center">
                {wonder.name}
              </h3>
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer 
                           transform transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1"
                onClick={() => setShowImageModal(true)}
              >
                <img
                  src={wonder.imagePath}
                  alt={wonder.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Play Wonder
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Show B Side
                </button>
              </div>
            </div>
          </div>

          {/* Back */}
          <div 
            className={`backface-hidden absolute inset-0 rotate-x-180 ${!isFlipped ? 'invisible' : ''}`}
          >
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <h3 className="text-xl text-white font-bold text-center">
                {pairWonder.name}
              </h3>
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer 
                           transform transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1"
                onClick={() => setShowImageModal(true)}
              >
                <img
                  src={pairWonder.imagePath}
                  alt={pairWonder.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Play Wonder
                </button>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Show A Side
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="max-w-4xl w-full mx-4 p-4"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={currentWonder.imagePath}
              alt={currentWonder.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-xl text-white font-bold mb-4">Confirm Selection</h3>
            <p className="mb-6 text-white/80">
              Are you sure you want to play as {currentWonder.name}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-white hover:text-red-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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

const WonderSelector: React.FC<WonderSelectorProps> = ({ onWonderSelected, availableWonders }) => {
  // Filter out wonders that have their counterpart (A/B) already selected
  const wonderPairs = availableWonders.reduce((acc: Record<string, Wonder[]>, wonder) => {
    const baseName = wonder.name.replace(/ [AB]$/, '');  // Use same regex as randomizeWonders
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(wonder);
    return acc;
  }, {});

  console.log("WonderSelector - Available wonders:", availableWonders);
  console.log("WonderSelector - Wonder pairs:", wonderPairs);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        Choose Your Wonder
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {Object.entries(wonderPairs).map(([baseName, pairArray]) => (
          <WonderCard
            key={baseName}
            wonder={pairArray[0]}
            pairWonder={pairArray[1]}
            onSelect={onWonderSelected}
          />
        ))}
      </div>
    </div>
  );
};

export default WonderSelector;