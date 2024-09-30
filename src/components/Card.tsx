import React, { useState } from 'react';
import { Card as CardType, AgeVariant } from '../types/card';

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const { name, description, production, upgradeCard, color, variants } = card;
  const [currentVariant, setCurrentVariant] = useState<AgeVariant>(variants[0]);

  const renderPlayerCount = () => {
    return (
      <span>
        {card.minPlayers}-{currentVariant.maxPlayers}: {currentVariant.copies ?? ''}
      </span>
    );
  };

  const renderCost = () => {
    if (!currentVariant.cost) return 'Free';
    return Object.entries(currentVariant.cost).map(([resource, amount]) => 
      `${resource}: ${amount}`
    ).join(', ');
  };

  const handleAgeChange = (age: number) => {
    const selectedVariant = variants.find(v => v.age === age);
    if (selectedVariant) {
      setCurrentVariant(selectedVariant);
    }
  };

  return (
    <div className={`card age-${currentVariant.age} category-${color.toLowerCase()}`}>
      <img 
        src={`/images/cards/${name}.jpg`} 
        alt={name} 
        className="card-image"
      />
      <div className="card-overlay">
        <h2>{name}</h2>
        <p>{description}</p>
        <p>Players: {renderPlayerCount()}</p>
        <p>Cost: {renderCost()}</p>
        <p>Age: {currentVariant.age}</p>
        {variants.length > 1 && (
          <div>
            {variants.map(variant => (
              <button
                key={variant.age}
                onClick={() => handleAgeChange(variant.age)}
                disabled={currentVariant.age === variant.age}
              >
                Age {variant.age}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
