import React from 'react';
import { Card } from '../types/card';
import { Player } from '../types/player';

interface CardHandProps {
  cards: Card[];
  onCardPlay: (card: Card) => void;
  onWonderBuild: () => void;
  onCardDiscard: (card: Card) => void;
}

const PlayerHand: React.FC<CardHandProps> = ({ cards, onCardPlay, onWonderBuild, onCardDiscard }) => {
  return (
    <></>
  );
};

export default PlayerHand;