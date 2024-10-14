import { Player } from "../types/player";
import { Card } from "../types/card";
import { setupPlayers } from "../utils/setupPlayers";
import { dealCards } from "../utils/dealCards";

export interface GameState {
  age: number;
  players: Player[];
  discardPile: Card[];
  // ... other game state properties
}

export function initializeGame(numPlayers: number, age: number): GameState {
  const players = setupPlayers();
  const dealtCards = dealCards(numPlayers, age);

  players.forEach((player, index) => {
    player.playerHand = dealtCards.slice(index * 7, (index + 1) * 7);
  });

  return {
    age: 1,
    players,
    discardPile: [],
    // ... initialize other game state properties
  };
}


