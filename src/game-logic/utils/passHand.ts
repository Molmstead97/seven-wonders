import { GameState } from "../gameState";

export function passHands(gameState: GameState): GameState {
  console.log('=== PASSING HANDS ===');
  console.log(`Current Age: ${gameState.age}, Current Turn: ${gameState.turns}`);
  
  const { age, players } = gameState;
  const direction = age === 2 ? -1 : 1;
  console.log(`Pass direction: ${direction === 1 ? 'Left' : 'Right'}`);

  console.log('Before passing:');
  players.forEach((player, index) => {
    console.log(`Player ${player.name}:`, {
      handSize: player.playerHand.length,
      cards: player.playerHand.map(c => c.name)
    });
  });

  const newHands = players.map((_, index) => {
    const nextPlayerIndex = (index + direction + players.length) % players.length;
    console.log(`Player ${index} passing to Player ${nextPlayerIndex}`);
    return players[nextPlayerIndex].playerHand;
  });

  const updatedState = {
    ...gameState,
    players: gameState.players.map((player, index) => ({
      ...player,
      playerHand: newHands[index],
    })),
  };

  console.log('After passing:');
  updatedState.players.forEach((player, index) => {
    console.log(`Player ${player.name}:`, {
      handSize: player.playerHand.length,
      cards: player.playerHand.map(c => c.name)
    });
  });

  return updatedState;
}
