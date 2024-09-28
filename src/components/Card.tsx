import React from 'react';
import { Card as CardType } from '../types/card';

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const {
    name,
    description,
    production,
    playerCount,
    upgradeCard,
    cost,
    age,
    color,
    ageVariant,
  } = card;

  const renderPlayerCount = () => {
    return playerCount.map((count, index) => (
      <span key={index}>
        {count.minPlayers}-{count.maxPlayers ?? '+'}: {count.copies} {index < playerCount.length - 1 ? ', ' : ''}
      </span>
    ));
  };

  const renderCost = () => {
    if (!cost) return 'Free';
    return Object.entries(cost).map(([resource, amount]) => 
      `${resource}: ${amount}`
    ).join(', ');
  };

  return (
    <div className={`card age-${age} category-${color.toLowerCase()}`}>
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="production">
        {Object.entries(production).map(([resource, amount]) => (
          <span key={resource} className="resource">
            {resource}: {amount}
          </span>
        ))}
      </div>
      <p>Players: {renderPlayerCount()}</p>
      {upgradeCard && <p>Can be upgraded in a later Age</p>}
      <div className="cost">
        Cost: {renderCost()}
      </div>
      <p>Age: {age}</p>
      <p>Category: {color}</p>
      {ageVariant && (
        <p>Age Variant: Age {ageVariant.age}, Max Players: {ageVariant.maxPlayers}</p>
      )}
    </div>
  );
};

export default Card;