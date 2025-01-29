import { Player } from '../../data/types/player';

export function createPlayerPropertyUpdates(player: Player): Partial<Player> {
  return {
    resources: { ...player.resources },
    science: { ...player.science },
    victoryPoints: player.victoryPoints,
    gold: player.gold,
    shields: player.shields,
    freeScience: player.freeScience 
      ? { ...player.freeScience } 
      : { fromWonder: false, fromCard: false },
    tempResources: { ...player.tempResources },
  };
} 