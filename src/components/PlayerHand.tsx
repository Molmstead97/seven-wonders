import React from 'react';
import { Card } from '../types/card';
import { Player } from '../types/player';

interface PlayerHandProps {
    cards: Card[];
    onCardPlay: (card: Card) => void;
    onWonderBuild: () => void;
    onCardDiscard: (card: Card) => void;
  }
  
  const PlayerHand: React.FC<PlayerHandProps> = ({ cards, onCardPlay, onWonderBuild, onCardDiscard }) => {
    return (
      <div className="player-hand">
        {cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    );
  };

export default PlayerHand;