import { GameState } from "../gameState";

import { Player } from "../types/player";
import { cardFromDiscardFunction } from "../types/wonderSpecialEffects";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function ageEnd(players: Player[], gameState: GameState): GameState {
  const updatedGameState = { ...gameState };

  const getMilitaryPoints = (player: Player, neighbor: Player): number => {
    const basePoints = gameState.age === 1 ? 1 : gameState.age === 2 ? 3 : 5;
    if (player.shields > neighbor.shields) return basePoints;
    if (player.shields < neighbor.shields) {
      player.conflictLossTokens += 1;
      return -1;
    }
    return 0;
  };

  const updatedPlayers = players.map((player) => {
    const updatedPlayer = { ...player };

    updatedPlayer.victoryPoints += getMilitaryPoints(player, player.leftPlayer || player);
    updatedPlayer.victoryPoints += getMilitaryPoints(
      player,
      player.rightPlayer || player
    );

    if (
      updatedPlayer.wonder.name === "Halikarnassós A" &&
      updatedPlayer.wonder.wonderStages[2].isBuilt
    ) {
      const chosenCard = updatedGameState.discardPile[0]; // TODO: Replace with UI prompt
      updatedPlayer.playerBoard = new Set([
        ...updatedPlayer.playerBoard,
        chosenCard,
      ]);
      updatedGameState.discardPile = updatedGameState.discardPile.slice(1);
    } else if (updatedPlayer.wonder.name === "Halikarnassós B") {
      cardFromDiscardFunction(updatedPlayer, updatedGameState); // Used a separate function for this since the logic is different and more complex
    }

    return updatedPlayer;
  });

  return {
    ...updatedGameState,
    age: updatedGameState.age + 1,
    players: updatedPlayers,
  };
}
