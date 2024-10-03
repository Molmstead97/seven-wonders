import { Player } from "../types/player";
import { Card } from "../types/card";
import { pickWonders } from "./wonderPicker";

export const setupPlayers = () => {
  let howManyPlayers;
  let players: Player[] = []; // Initialize players array

  while (true) {
    howManyPlayers = prompt("How many AI players are playing?");

    // Check if input is valid
    if (
      howManyPlayers !== null &&
      howManyPlayers !== "" &&
      Number(howManyPlayers) >= 2 &&
      Number(howManyPlayers) <= 6
    ) {
      break; // Exit the loop if valid
    }

    alert(
      "Invalid number of players. You must enter a number between 2 and 6."
    );
  }

  const setWonders = pickWonders(Number(howManyPlayers));

  for (let i = 0; i < Number(howManyPlayers); i++) {
    const player: Player = {
      id: i,
      name: `Player ${i}`,
      // Initialize the properties with default values
      wonder: setWonders[i],
      playerBoard: new Set<Card>(),
      playerHand: [],
      resources: {
        Wood: 0,
        Stone: 0,
        Ore: 0,
        Clay: 0,
        Glass: 0,
        Papyrus: 0,
        Cloth: 0,
      },
      coin: { gold: 3 },
      victoryPoints: { victoryPoints: 0 },
      science: {
        Cog: 0,
        Compass: 0,
        Tablet: 0,
      },
      military: { shields: 0 },
      leftPlayer: null,
      rightPlayer: null,
    };
    players.push(player);
  }

  for (let i = 0; i < players.length; i++) {
    const currentPlayer = players[i];
    const leftIndex = (i - 1 + players.length) % players.length; // Handles wrap-around
    const rightIndex = (i + 1) % players.length; // Handles wrap-around

    currentPlayer.leftPlayer = players[leftIndex];
    currentPlayer.rightPlayer = players[rightIndex];
  }

  return Number(howManyPlayers);
};
