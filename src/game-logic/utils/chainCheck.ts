import { Card } from '../../data/types/card';
import { Player } from '../../data/types/player';

export function canChainBuild(player: Player, card: Card): boolean {
  if (!card.upgradeCard) return false;
  
  const playerCards = Array.from(player.playerBoard);
  const prerequisiteCards = Array.isArray(card.upgradeCard) 
    ? card.upgradeCard 
    : [card.upgradeCard];

  // Return true if player has any of the prerequisite cards
  return prerequisiteCards.some(prereq => 
    playerCards.some(playerCard => playerCard.name === prereq)
  );
} 