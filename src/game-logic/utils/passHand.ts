import { GameState } from "../gameState";

export function passHands(gameState: GameState): GameState {
  const { age, players } = gameState;
  const direction = age === 2 ? -1 : 1;

  const newHands = players.map((_, index) => {
    const nextPlayerIndex = (index + direction + players.length) % players.length;
    return players[nextPlayerIndex].playerHand;
  });

  return {
    ...gameState,
    players: gameState.players.map((player, index) => ({
      ...player,
      playerHand: newHands[index],
    })),
  };
}
