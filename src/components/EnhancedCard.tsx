import React, { useRef, useEffect } from "react";
import { Card, CardPosition } from "../data/types/card";
import { Wonder } from "../data/types/wonder";

import { expandZoom } from "./animations/expandZoom";
import { checkResources } from "../game-logic/utils/resourceCheck";
import { GameState } from "../game-logic/gameState";
import { canPlayCard } from "../game-logic/gameActions";
import { canChainBuild } from '../game-logic/utils/chainCheck';

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

  const canBuildFree = 
    (gameState?.players[0].freeBuildPerAge?.isEffectTriggered &&
     !gameState?.players[0].freeBuildPerAge?.usedThisAge) ||
    (gameState && canChainBuild(gameState.players[0], card));

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
        className="relative z-50 bg-[#D0C8B0] p-6 rounded-lg border border-[#666666]/20 shadow-2xl"
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
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#666666]/20 hover:bg-[#666666]/30"
        >
          <span className="text-[#333333]">✕</span>
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
                ? "bg-[#4682B4] text-white hover:bg-[#5F9EA0]"
                : "bg-black/40 text-white cursor-not-allowed"
            }`}
          >
            Build
          </button>
          <button
            onClick={onWonderBuild}
            disabled={!canBuildWonder}
            className={`px-4 py-2 rounded ${
              canBuildWonder
                ? "bg-[#9932CC] text-white hover:bg-[#8A2BE2]"
                : "bg-black/40 text-white cursor-not-allowed"
            }`}
          >
            Construct Wonder
          </button>
          <button
            onClick={onCardDiscard}
            className="px-4 py-2 bg-[#FF6347] text-white rounded hover:bg-[#FF4500]"
          >
            Discard
          </button>

          {/* Free Build Button */}
          {canBuildFree && (
            <button
              onClick={() => {
                onCardPlay?.();
                if (gameState?.players[0].freeBuildPerAge?.isEffectTriggered) {
                  gameState.players[0].freeBuildPerAge.usedThisAge = true;
                }
              }}
              className="px-4 py-2 bg-[#2E8B57] text-white rounded hover:bg-[#3CB371]"
            >
              Build Free
              {canChainBuild(gameState!.players[0], card) && " (Chain)"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedCard;
