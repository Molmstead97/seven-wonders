import { GameState } from "../gameState";
import { Player } from "../types/player";
import { playCard, discardCard } from "./cardActions";

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

export function lastTwoCards(player: Player, gameState: GameState): Player {
  const [cardToPlay, cardToDiscard] = player.playerHand;

  // Play one card
  const updatedPlayer = playCard(player, cardToPlay);
  
  // Discard the other card
  const { player: finalPlayer } = discardCard(updatedPlayer, cardToDiscard, gameState);

  return {
    ...finalPlayer,
    playerHand: [], // Empty the hand after playing and discarding
  };
}
