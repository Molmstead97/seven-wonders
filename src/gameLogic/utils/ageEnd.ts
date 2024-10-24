import { GameState } from "../gameState";
import { Player } from "../types/player";
import { dealCards } from "./dealCards";
// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function ageEnd(players: Player[], gameState: GameState): GameState {
  const getMilitaryPoints = (player: Player, neighbor: Player): number => {
    const basePoints = gameState.age === 1 ? 1 : gameState.age === 2 ? 3 : 5;
    if (player.shields > neighbor.shields) return basePoints;
    if (player.shields < neighbor.shields) {
      player.conflictLossTokens += 1;
      return -1;
    }
    return 0; // No points if shields are equal
  };

  const updatedPlayers = players.map((player) => {
    const updatedPlayer = { ...player }; // Clone player to modify safely

    // Compare against left and right neighbors and update victory points
    updatedPlayer.victoryPoints += getMilitaryPoints(player, player.leftPlayer);
    updatedPlayer.victoryPoints += getMilitaryPoints(
      player,
      player.rightPlayer
    );

    dealCards(updatedPlayers.length, gameState.age);

    return updatedPlayer;

    // TODO: Implement wonder special effects (card from discard, free build per age, etc.)
  });

  return {
    age: gameState.age + 1, // Increment age
    players: updatedPlayers,
    discardPile: gameState.discardPile, // Keep discard pile
  };
}
