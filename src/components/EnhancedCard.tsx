import React, { useRef, useEffect } from "react";
import { Card, CardPosition } from "../data/types/card";
import { Wonder } from "../data/types/wonder";

import { expandZoom } from "./animations/expandZoom";
import { checkResources } from "../game-logic/utils/resourceCheck";
import { GameState } from "../game-logic/gameState";
import { canPlayCard } from "../game-logic/gameActions";

interface EnhancedCardProps {
  card: Card;
  initialPosition: CardPosition;
  onAnimationStart: () => void;
  onClose: () => void;
  showActions?: boolean;
  children?: React.ReactNode;
  // These props are only required if showActions is true
  onCardPlay?: () => void;
  onWonderBuild?: () => void;
  onCardDiscard?: () => void;
  currentWonder?: Wonder;
  gameState?: GameState;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  card,
  initialPosition,
  onAnimationStart,
  onClose,
  onCardPlay,
  onWonderBuild,
  onCardDiscard,
  currentWonder,
  gameState,
  showActions = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const CARD_WIDTH = 300;
  const CARD_HEIGHT = 450;

  

  // Only calculate these if we're showing actions
  const hasResources =
    showActions && gameState ? canPlayCard(gameState, 0, card) : false;
  const canBuildWonder =
    showActions && currentWonder && gameState
      ? (() => {
          const nextStageIndex = currentWonder.wonderStages.findIndex(
            (stage) => !stage.isBuilt
          );
          if (nextStageIndex === -1) return false;
          return checkResources(
            gameState.players[0],
            null,
            currentWonder.wonderStages[nextStageIndex],
            gameState.players[0].tempResources
          );
        })()
      : false;

  useEffect(() => {
    if (!cardRef.current || !controlsRef.current) return;

    onAnimationStart();

    const targetPosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      rotation: 0,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    };

    const timeline = expandZoom(
      cardRef.current,
      controlsRef.current,
      initialPosition,
      targetPosition
    );

    return () => {
      timeline.kill();
    };
  }, [initialPosition, onAnimationStart]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="relative z-50 bg-gray-900 p-6 rounded-lg border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
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
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ✕
        </button>
      </div>
      {showActions && (
        <div
          ref={controlsRef}
          className="flex space-x-4 mt-8"
          style={{
            opacity: 0,
          }}
        >
          <button
            onClick={onCardPlay}
            disabled={!hasResources}
            className={`px-4 py-2 rounded ${
              hasResources
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Build
          </button>
          <button
            onClick={onWonderBuild}
            disabled={!canBuildWonder}
            className={`px-4 py-2 rounded ${
              canBuildWonder
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Construct Wonder
          </button>
          <button
            onClick={onCardDiscard}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Discard
          </button>

          {/* Free Build Button - only show if effect is triggered and not used */}
          {gameState?.players[0].freeBuildPerAge?.isEffectTriggered &&
            !gameState?.players[0].freeBuildPerAge?.usedThisAge && (
              <button
                onClick={() => {
                  onCardPlay?.();
                  // Set usedThisAge to true when the card is built
                  if (gameState) {
                    gameState.players[0].freeBuildPerAge.usedThisAge = true;
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Build Free
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default EnhancedCard;
