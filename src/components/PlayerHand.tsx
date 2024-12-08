import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Card as CardType } from '../data/types/card';
import { Wonder } from '../data/types/wonder';
import { GameState } from '../game-logic/gameState';
import EnhancedCard from './EnhancedCard';
import { CardPosition } from '../data/types/card';
import gsap from 'gsap';

interface PlayerHandProps {
  cards: CardType[];
  currentWonder: Wonder;
  gameState: GameState;
  onCardPlay: (cardIndex: number) => void;
  onWonderBuild: (cardIndex: number) => void;
  onCardDiscard: (cardIndex: number) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ 
  cards,  
  currentWonder,
  gameState,
  onCardPlay,
  onWonderBuild,
  onCardDiscard,
}) => {
  if (!cards || !currentWonder || !gameState) {
    return null;
  }

  const [prevCards, setPrevCards] = useState(cards);
  const [isDealing, setIsDealing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCardPosition, setSelectedCardPosition] = useState<CardPosition | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const animationInProgressRef = useRef(false);

  // Detect card changes
  useEffect(() => {
    // First check if the arrays are different lengths
    if (prevCards.length !== cards.length) {
      console.log("Cards changed (length difference)");
      handleCardAnimation();
      return;
    }

    // Then check for content differences
    const cardsChanged = prevCards.some((prevCard, i) => {
      const currentCard = cards[i];
      return prevCard && currentCard && prevCard.name !== currentCard.name;
    });
    
    if (cardsChanged) {
      console.log("Cards changed (content difference)");
      handleCardAnimation();
    }

    function handleCardAnimation() {
      if (animationInProgressRef.current) return;
      
      console.log("Starting animation");
      animationInProgressRef.current = true;
      setIsDealing(true);

      // Kill any existing animations
      gsap.killTweensOf(cardRefs.current);

      const tl = gsap.timeline({
        onComplete: () => {
          animationInProgressRef.current = false;
          setIsDealing(false);
          console.log("Animation complete");
        }
      });

      tl.to(cardRefs.current, {
        opacity: 0,
        duration: 0.2,
        stagger: 0.05,
        onComplete: () => setPrevCards(cards)
      })
      .to(cardRefs.current, {
        opacity: 1,
        duration: 0.3,
        stagger: 0.08,
        delay: 0.1
      });
    }
  }, [cards, prevCards]);

  // Calculate card positions in a fan layout
  const cardPositions = useMemo(() => {
    const fanAngle = Math.min(5 * (cards.length - 1), 60); // Max 60 degree spread
    const angleStep = cards.length > 1 ? fanAngle / (cards.length - 1) : 0;
    const radius = 400;

    return cards.map((_, index) => {
      const angle = -fanAngle / 2 + angleStep * index;
      const radian = (angle * Math.PI) / 180;
      return {
        x: radius * Math.sin(radian),
        y: radius - radius * Math.cos(radian),
        rotation: angle
      };
    });
  }, [cards.length]);

  const handleCardClick = (card: CardType, index: number) => {
    if (isDealing || !cardRefs.current[index]) return;
    
    const cardElement = cardRefs.current[index];
    const rect = cardElement.getBoundingClientRect();
    const { rotation } = cardPositions[index];
    
    setSelectedCardPosition({
      x: rect.left,
      y: rect.top,
      rotation: rotation,
      width: cardElement.offsetWidth,
      height: cardElement.offsetHeight,
    });
    setSelectedCard(card);
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 h-48 perspective-1000">
      <div className="relative w-full h-full">
        {cards.map((card, index) => {
          const { x, y, rotation } = cardPositions[index];
          
          return (
            <div 
              key={`${card.name}-${index}`}
              ref={el => cardRefs.current[index] = el!}
              className="absolute group"
              style={{
                transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg)`,
                transformOrigin: 'bottom center',
                opacity: isDealing ? 0 : 1,
              }}
              onClick={() => handleCardClick(card, index)}
            >
              <div className="relative w-32 h-48 rounded-lg overflow-hidden hover:z-10">
                <img 
                  src={card.imagePath}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
      {selectedCard && selectedCardPosition && (
        <EnhancedCard
          card={selectedCard}
          initialPosition={selectedCardPosition}
          onAnimationStart={() => setIsAnimating(true)}
          currentWonder={currentWonder}
          gameState={gameState}
          onClose={() => {
            setSelectedCard(null);
            setSelectedCardPosition(null);
          }}
          onCardPlay={() => {
            onCardPlay(cards.indexOf(selectedCard));
            setSelectedCard(null);
            setSelectedCardPosition(null);
          }}
          onWonderBuild={() => {
            onWonderBuild(cards.indexOf(selectedCard));
            setSelectedCard(null);
            setSelectedCardPosition(null);
          }}
          onCardDiscard={() => {
            onCardDiscard(cards.indexOf(selectedCard));
            setSelectedCard(null);
            setSelectedCardPosition(null);
          }}
          showActions={true}
        />
      )}
    </div>
  );
};

export default PlayerHand;
