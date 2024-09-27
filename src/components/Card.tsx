import React from 'react';
import { Card as CardType } from '../types/card';

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const {
    name,
    description,
    resources,
    minPlayers,
    maxPlayers,
    thirdCard,
    cost,
    age
  } = card;

  return (
    <div className={`card age-${age}`}>
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="resources">
        {Object.entries(resources).map(([resource, amount]) => (
          <span key={resource} className="resource">
            {resource}: {amount}
          </span>
        ))}
      </div>
      <p>Players: {minPlayers}-{maxPlayers}</p>
      {thirdCard && <p>Upgrades to: {thirdCard}</p>}
      <div className="cost">
        Cost: {cost ? Object.entries(cost).map(([resource, amount]) => 
          `${resource}: ${amount}`).join(', ') : 'Free'}
      </div>
      <p>Age: {age}</p>
    </div>
  );
};

export default Card;