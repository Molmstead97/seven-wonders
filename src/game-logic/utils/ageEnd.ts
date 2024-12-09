import { GameState } from "../gameState";

import { Player } from "../../data/types/player";
import { cardFromDiscardFunction } from "../../data/types/wonderSpecialEffects";

interface MilitaryResult {
  points: number;
  wins: number;
  losses: number;
}

// Create a map to store military results
export const militaryResults = new Map<string, MilitaryResult>();

export function ageEnd(players: Player[], gameState: GameState): GameState {
  // Create deep copy of state
  const newState = {
    ...gameState,
    players: players.map((p) => ({
      ...p,
      playerHand: [...p.playerHand],
      playerBoard: new Set([...p.playerBoard]),
      wonder: {
        ...p.wonder,
        wonderStages: p.wonder.wonderStages.map((stage) => ({ ...stage })),
      },
      resources: { ...p.resources },
      science: { ...p.science },
    })),
    discardPile: [...gameState.discardPile],
  };

  // Calculate military points based on age
  const militaryPoints = {
    1: { win: 1, loss: -1 },
    2: { win: 3, loss: -1 },
    3: { win: 5, loss: -1 },
  }[gameState.age] ?? { win: 0, loss: 0 };

  // Process each player
  newState.players.forEach((player) => {
    console.log(`\nProcessing player: ${player.name}`);

    // Military conflicts
    const leftNeighbor = player.leftPlayer;
    const rightNeighbor = player.rightPlayer;

    const result: MilitaryResult = {
      points: 0,
      wins: 0,
      losses: 0
    };

    if (leftNeighbor) {
      const leftConflict = resolveMilitaryConflict(
        player,
        leftNeighbor,
        militaryPoints
      );
      player.victoryPoints += leftConflict.points;
      player.conflictLossTokens += leftConflict.lossTokens;
      result.points += leftConflict.points;
      result.wins += leftConflict.points > 0 ? 1 : 0;
      result.losses += leftConflict.lossTokens;
    }

    if (rightNeighbor) {
      const rightConflict = resolveMilitaryConflict(
        player,
        rightNeighbor,
        militaryPoints
      );
      player.victoryPoints += rightConflict.points;
      player.conflictLossTokens += rightConflict.lossTokens;
      result.points += rightConflict.points;
      result.wins += rightConflict.points > 0 ? 1 : 0;
      result.losses += rightConflict.lossTokens;
    }

    // Store the results in our map using player name as key
    militaryResults.set(player.name, result);
    console.log(`Military results for ${player.name}:`, {
      points: result.points,
      wins: result.wins,
      losses: result.losses,
      shields: player.shields
    });

    // Handle special wonder effects
    if (
      player.wonder.name === "Halikarnassós A" &&
      player.wonder.wonderStages[2].isBuilt &&
      newState.discardPile.length > 0
    ) {
      handleHalikarnassosEffect(player, newState);
    }
  });

  return newState;
}

function resolveMilitaryConflict(
  player: Player,
  neighbor: Player,
  points: { win: number; loss: number }
): { points: number; lossTokens: number } {
  if (player.shields > neighbor.shields) {
    return { points: points.win, lossTokens: 0 };
  }
  if (player.shields < neighbor.shields) {
    return { points: points.loss, lossTokens: 1 };
  }
  return { points: 0, lossTokens: 0 };
}

function handleHalikarnassosEffect(player: Player, gameState: GameState) {
  // Note: This is a placeholder. The actual card selection will be handled by the UI
  const chosenCard = gameState.discardPile[0];
  if (chosenCard) {
    player.playerBoard.add(chosenCard);
    gameState.discardPile = gameState.discardPile.slice(1);

    console.log("Halikarnassos effect:", {
      cardTaken: chosenCard.name,
      remainingDiscardSize: gameState.discardPile.length,
    });
  }
}
