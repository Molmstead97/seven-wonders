import { GameState } from "../gameState";

export function createGameStateCopy(gameState: GameState, playerId?: number): GameState {
  return {
    ...gameState,
    players: gameState.players.map((p, index) => ({
      ...p,
      playerHand: (playerId !== undefined && index === playerId) ? [...p.playerHand] : p.playerHand,
      playerBoard: (playerId !== undefined && index === playerId) ? new Set([...p.playerBoard]) : p.playerBoard,
    })),
    discardPile: [...gameState.discardPile],
    gameLog: [...(gameState.gameLog || [])],
  };
} 