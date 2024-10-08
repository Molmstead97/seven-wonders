import { Player } from "../types/player";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function ageEnd(players: Player[], age: number): Player[] {
    const getMilitaryPoints = (player: Player, neighbor: Player): number => {
      const basePoints = age === 1 ? 1 : age === 2 ? 3 : 5;
      if (player.military.shields > neighbor.military.shields) return basePoints; // Add points if player has more shields
      if (player.military.shields < neighbor.military.shields) return -1; // Subtract points if player has less shields
      return 0; // No points if shields are equal
    };
  
    return players.map(player => {
      const updatedPlayer = { ...player }; // Clone player to modify safely
  
      // Compare against left and right neighbors and update victory points
      updatedPlayer.victoryPoints.victoryPoints += getMilitaryPoints(player, player.leftPlayer);
      updatedPlayer.victoryPoints.victoryPoints += getMilitaryPoints(player, player.rightPlayer);
  
      return updatedPlayer;
    });
  }
  