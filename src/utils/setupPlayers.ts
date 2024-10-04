import { Player } from "../types/player";
import { Card } from "../types/card";
import { pickWonders } from "./wonderPicker";
import { Resource } from "../types/resource";

export const setupPlayers = () => {
  let howManyAIPlayers;
  let players: Player[] = []; // Initialize players array

  while (true) {
    howManyAIPlayers = prompt("How many AI players are playing?");

    // Check if input is valid
    if (
      howManyAIPlayers !== null &&
      howManyAIPlayers !== "" &&
      Number(howManyAIPlayers) >= 2 &&
      Number(howManyAIPlayers) <= 6
    ) {
      break; // Exit the loop if valid
    }

    alert(
      "Invalid number of AI players. You must enter a number between 2 and 6."
    );
  }

  const setWonders = pickWonders(Number(howManyAIPlayers) + 1); // Add 1 for the user player

  // Create the user player
  const userPlayer: Player = {
    id: 0,
    name: "User",
    wonder: setWonders[0],
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
    leftPlayer: null as unknown as Player, // Temporarily assign null
    rightPlayer: null as unknown as Player, // Temporarily assign null
  };

  // Apply initial production from the wonder
  if (userPlayer.wonder.production) {
    Object.entries(userPlayer.wonder.production).forEach(
      ([resource, amount]) => {
        if (amount !== undefined && resource in userPlayer.resources) {
          userPlayer.resources[resource as keyof Resource] =
            (userPlayer.resources[resource as keyof Resource] || 0) + amount;
        }
      }
    );
  }

  players.push(userPlayer);

  // Create AI players
  for (let i = 1; i <= Number(howManyAIPlayers); i++) {
    const aiPlayer: Player = {
      id: i,
      name: `AI Player ${i}`,
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
      leftPlayer: null as unknown as Player, // Temporarily assign null
      rightPlayer: null as unknown as Player, // Temporarily assign null
    };

    // Apply initial production from the wonder
    if (aiPlayer.wonder.production) {
      Object.entries(aiPlayer.wonder.production).forEach(
        ([resource, amount]) => {
          if (amount !== undefined && resource in aiPlayer.resources) {
            aiPlayer.resources[resource as keyof Resource] =
              (aiPlayer.resources[resource as keyof Resource] || 0) + amount;
          }
        }
      );
    }

    players.push(aiPlayer);
  }

  for (let i = 0; i < players.length; i++) {
    const currentPlayer = players[i];
    const leftIndex = (i - 1 + players.length) % players.length; // Handles wrap-around
    const rightIndex = (i + 1) % players.length; // Handles wrap-around

    currentPlayer.leftPlayer = players[leftIndex];
    currentPlayer.rightPlayer = players[rightIndex];
  }

  return players;
};
