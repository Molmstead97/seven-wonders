import { GameState } from "../gameState";

export function passHands(gameState: GameState): GameState {

  const { age, players } = gameState;
  const direction = age === 2 ? -1 : 1;

  // Deep copy all hands first
  const currentHands = players.map((player) =>
    player.playerHand.map((card) => ({ ...card }))
  );

  // Create new hands array
  const newHands = players.map((_, index) => {
    const nextPlayerIndex =
      (index + direction + players.length) % players.length;
    return currentHands[nextPlayerIndex];
  });

  // Create new state with updated hands
  const updatedState = {
    ...gameState,
    players: players.map((player, index) => ({
      ...player,
      playerHand: newHands[index],
    })),
  };

  return updatedState;
}
