import React, { useRef, useEffect } from 'react';
import { Card } from '../game-logic/types/card';
import { Wonder } from '../game-logic/types/wonder';

import { gsap } from 'gsap';
import { expandZoom, shrinkZoom } from './animations/expandZoom';
import { blurBackground, unblurBackground } from './animations/backgroundBlur';
import { checkResources } from '../game-logic/utils/resourceCheck';
import { GameState } from '../game-logic/gameState';

interface CardPosition {
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
}

interface EnhancedCardProps {
  card: Card;
  initialPosition: CardPosition;
  onAnimationStart: () => void;
  onClose: () => void;
  onCardPlay: () => void;
  onWonderBuild: () => void;
  onCardDiscard: () => void;
  currentWonder: Wonder;
  gameState: GameState;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  card,
  initialPosition,
  onAnimationStart,
  onClose,
  onCardPlay,
  onWonderBuild,
  onCardDiscard,
  currentWonder,
  gameState,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const CARD_WIDTH = 300;
  const CARD_HEIGHT = 450;

  const canPlayCard = checkResources(gameState.players[0], card, null);
  
  const nextStageIndex = currentWonder.wonderStages.findIndex(
    (stage) => !stage.isBuilt
  );
  const canBuildWonder = nextStageIndex !== -1 && 
    checkResources(gameState.players[0], null, currentWonder.wonderStages[nextStageIndex]);

  useEffect(() => {
    if (!cardRef.current) return;

    onAnimationStart();

    const targetPosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      rotation: 0,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    };

    const timeline = expandZoom(cardRef.current, initialPosition, targetPosition);
    
    timeline.add(() => {
      if (controlsRef.current) {
        gsap.to(controlsRef.current, {
          opacity: 1,
          duration: 0.3,
        });
      }
    });

    return () => {
      timeline.kill();
    };
  }, [initialPosition, onAnimationStart]);

  const handleClose = () => {
    if (cardRef.current) {
      shrinkZoom(cardRef.current, initialPosition, () => {
        onClose();
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div 
        ref={cardRef}
        className="relative z-50"
        style={{
          width: initialPosition.width,
          height: initialPosition.height,
        }}
      >
        <img 
          src={card.imagePath}
          alt={card.name}
          className="w-full h-full object-cover rounded-lg shadow-2xl"
        />
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ✕
        </button>
      </div>
      <div
        ref={controlsRef}
        className="flex space-x-4 mt-8"
        style={{
          opacity: 0,
        }}
      >
        <button 
          onClick={onCardPlay}
          disabled={!canPlayCard}
          className={`px-4 py-2 rounded ${
            canPlayCard 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Play
        </button>
        <button 
          onClick={onWonderBuild}
          disabled={!canBuildWonder}
          className={`px-4 py-2 rounded ${
            canBuildWonder 
              ? 'bg-purple-500 text-white hover:bg-purple-600' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
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
  );
};

export default EnhancedCard;