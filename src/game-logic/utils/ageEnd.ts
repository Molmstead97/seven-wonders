import { GameState } from "../gameState";

import { Player } from "../../data/types/player";

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
    endGameTriggered: gameState.age === 3
  };

  // Calculate military points based on age
  const militaryPoints = {
    1: { win: 1, loss: -1 },
    2: { win: 3, loss: -1 },
    3: { win: 5, loss: -1 },
  }[gameState.age] ?? { win: 0, loss: 0 };

  // Process each player immutably
  newState.players = newState.players.map((player) => {
    console.log(`\nProcessing player: ${player.name}`);

    let updatedPlayer = { ...player };

    // Reset free build per age if it has been used this age
    if (updatedPlayer.freeBuildPerAge?.isEffectTriggered && updatedPlayer.freeBuildPerAge?.usedThisAge) {
      updatedPlayer = {
        ...updatedPlayer,
        freeBuildPerAge: {
          ...updatedPlayer.freeBuildPerAge,
          usedThisAge: false
        }
      };
    }

    // Military conflicts
    const leftNeighbor = updatedPlayer.leftPlayer;
    const rightNeighbor = updatedPlayer.rightPlayer;

    const result: MilitaryResult = {
      points: 0,
      wins: 0,
      losses: 0,
    };

    if (leftNeighbor) {
      const leftConflict = resolveMilitaryConflict(
        updatedPlayer,
        leftNeighbor,
        militaryPoints
      );
      result.points += leftConflict.points;
      result.wins += leftConflict.points > 0 ? 1 : 0;
      result.losses += leftConflict.lossTokens;
      
      updatedPlayer = {
        ...updatedPlayer,
        victoryPoints: updatedPlayer.victoryPoints + leftConflict.points,
        conflictLossTokens: updatedPlayer.conflictLossTokens + leftConflict.lossTokens
      };
    }

    if (rightNeighbor) {
      const rightConflict = resolveMilitaryConflict(
        updatedPlayer,
        rightNeighbor,
        militaryPoints
      );
      result.points += rightConflict.points;
      result.wins += rightConflict.points > 0 ? 1 : 0;
      result.losses += rightConflict.lossTokens;
      
      updatedPlayer = {
        ...updatedPlayer,
        victoryPoints: updatedPlayer.victoryPoints + rightConflict.points,
        conflictLossTokens: updatedPlayer.conflictLossTokens + rightConflict.lossTokens
      };
    }

    // Store the results in our map using player name as key
    militaryResults.set(updatedPlayer.name, result);
    console.log(`Military results for ${updatedPlayer.name}:`, {
      points: result.points,
      wins: result.wins,
      losses: result.losses,
      shields: updatedPlayer.shields,
    });

    return updatedPlayer;
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
