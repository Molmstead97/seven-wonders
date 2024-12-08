import { Card, CardColor } from "../data/types/card";
import { Player } from "../data/types/player";

export type PlayerPosition =
  | "bottom" // User's position (0, -y)
  | "left-bottom" // (-x, -y)
  | "left-top" // (-x, y)
  | "top-left" // (-x, y)
  | "top-right" // (x, y)
  | "right-top" // (x, y)
  | "right-bottom" // (x, -y)
  | "top-center" // (0, y)
  | "right-center" // (x, 0)
  | "left-center"; // (-x, 0)

interface PlayerBoardProps {
  player: Player;
  position: PlayerPosition;
  onCardClick: (card: Card) => void;
}

const CARD_COLORS = ['Brown', 'Grey', 'Blue', 'Green', 'Yellow', 'Red', 'Purple'] as const;

// Constants for card stacking
const CARD_OFFSET = {
  vertical: 30,    // Pixels to offset each card vertically
  horizontalGap: 4 // Gap between color columns
};

export const PlayerBoard: React.FC<PlayerBoardProps> = ({ player, position, onCardClick }) => {
  // Group cards by color
  const cardsByColor = Array.from(player.playerBoard).reduce((acc, card) => {
    const color = Array.isArray(card.cardColor) ? card.cardColor[0] : card.cardColor;
    if (!acc[color]) acc[color] = [];
    acc[color].push(card);
    return acc;
  }, {} as Record<CardColor, Card[]>);

  // Calculate maximum stack height for scaling
  const maxStackSize = Math.max(...Object.values(cardsByColor).map(cards => cards.length));
  
  return (
    <div className={`absolute ${getPositionClasses(position)}`}>
      <div className="grid grid-cols-7 gap-4">
        {CARD_COLORS.map(color => (
          <div 
            key={color} 
            className="relative"
            // Height should accommodate the tallest possible stack
            style={{ height: `${(maxStackSize * CARD_OFFSET.vertical) + 100}px` }} 
          >
            {cardsByColor[color]?.map((card, index, array) => {
              const isLastCard = index === array.length - 1;
              
              return (
                <div 
                  key={card.name}
                  className={`
                    absolute 
                    transition-all 
                    duration-300 
                    hover:z-50
                    ${isLastCard ? 'hover:-translate-y-2' : ''}
                  `}
                  style={{
                    top: `${index * CARD_OFFSET.vertical}px`,
                    transform: getCardRotation(position),
                    zIndex: index,
                    // Add a hover effect that slightly raises the card
                    cursor: 'pointer',
                  }}
                  onClick={() => onCardClick(card)}
                >
                  {/* Card content */}
                  <div 
                    className="w-24 h-36 rounded-lg shadow-md overflow-hidden relative"
                    style={{
                      clipPath: isLastCard ? 'none' : 'inset(0 0 20% 0)'
                    }}
                  >
                    {/* Card background image */}
                    <img
                      src={card.imagePath}
                      alt={card.name}
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                    />
                    
                    {/* Card name - rotated on the side */}
                    <div className="absolute left-0 top-0 h-full w-8 flex items-center">
                      <span 
                        className="text-white text-xs font-semibold transform -rotate-90 whitespace-nowrap"
                        style={{ transformOrigin: 'center' }}
                      >
                        {card.name}
                      </span>
                    </div>

                    {/* Cost and effects at the top */}
                    <div className="absolute top-0 right-0 p-1 flex gap-1">
                      {card.cost && typeof card.cost === 'object' && 
                        Object.entries(card.cost).map(([resource, amount]) => (
                          <div 
                            key={resource}
                            className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs"
                          >
                            {amount}
                          </div>
                        ))
                      }
                      {card.victoryPoints && (
                        <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                          {card.victoryPoints}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get position classes (as before)
function getPositionClasses(position: PlayerPosition): string {
  switch (position) {
    case 'bottom':
      return 'bottom-0 left-1/2 -translate-x-1/2';
    case 'left-bottom':
      return 'bottom-1/4 left-0';
    case 'left-top':
      return 'top-1/4 left-0';
    // ... other positions
    default:
      return '';
  }
}

// Helper function to get card rotation (we'll implement this next)
function getCardRotation(position: PlayerPosition): string {
  switch (position) {
    case 'bottom':
      return 'rotate(0deg)';
    case 'left-bottom':
    case 'left-top':
    case 'left-center':
      return 'rotate(90deg)';
    case 'top-left':
    case 'top-right':
    case 'top-center':
      return 'rotate(180deg)';
    case 'right-top':
    case 'right-bottom':
    case 'right-center':
      return 'rotate(270deg)';
    default:
      return 'rotate(0deg)';
  }
}
