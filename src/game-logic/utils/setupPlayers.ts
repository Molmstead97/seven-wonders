import { Player } from "../types/player";
import { Card } from "../types/card";
import { randomizeWonders } from "./randomizeWonders";
import { Wonder } from "../types/wonder";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET, MAKE SURE TO DOUBLE CHECK LEFT AND RIGHT PLAYER ASSIGNMENTS

export function setupPlayers(aiPlayerCount: number, selectedWonder?: Wonder): Player[] {
  const players: Player[] = [];

  if (aiPlayerCount < 2 || aiPlayerCount > 6) {
    throw new Error("Invalid number of AI players");
  }

  const setWonders = selectedWonder 
    ? [selectedWonder, ...randomizeWonders(aiPlayerCount)] // Only pick AI wonders
    : randomizeWonders(aiPlayerCount + 1); // Pick all wonders including user's

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
      Textile: 0,
    },
    tempResources: {
      Wood: 0,
      Stone: 0,
      Ore: 0,
      Clay: 0,
      Glass: 0,
      Papyrus: 0,
      Textile: 0,
    },
    gold: 3,
    victoryPoints: 0,
    science: {
      Cog: 0,
      Compass: 0,
      Tablet: 0,
    },
    shields: 0,
    conflictLossTokens: 0,
    leftPlayer: null,
    rightPlayer: null,
    freeBuildPerAge: {},
  };

  userPlayer.resources = {
    ...userPlayer.resources,
    ...userPlayer.wonder.production,
  };

  // Log the user's wonder and initial resources
  console.log(`User Player Wonder: ${userPlayer.wonder.name}`);
  console.log("User Player Initial Resources:", userPlayer.resources);

  // Apply initial production from the wonder

  players.push(userPlayer);

  // Create AI players
  for (let i = 1; i <= aiPlayerCount; i++) {
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
        Textile: 0,
      },
      tempResources: {
        Wood: 0,
        Stone: 0,
        Ore: 0,
        Clay: 0,
        Glass: 0,
        Papyrus: 0,
        Textile: 0,
      },
      gold: 3,
      victoryPoints: 0,
      science: {
        Cog: 0,
        Compass: 0,
        Tablet: 0,
      },
      shields: 0,
      conflictLossTokens: 0, // Only used for Strategy Guild card
      leftPlayer: null, // Temporarily assign null
      rightPlayer: null, // Temporarily assign null
      freeBuildPerAge: {}, // Only used if Player is playing Olympia A. // TODO: Might make sense to move this to the wonder struct. Or make this optional as well as other special effects.
    };

    // Apply initial production from the wonder
    aiPlayer.resources = {
      ...aiPlayer.resources,
      ...aiPlayer.wonder.production,
    };

    // Log each AI player's wonder and initial resources
    console.log(`AI Player ${i} Wonder: ${aiPlayer.wonder.name}`);
    console.log(`AI Player ${i} Initial Resources:`, aiPlayer.resources);

    players.push(aiPlayer);
  }

  // Initialize leftPlayer and rightPlayer for each player
  for (let i = 0; i < players.length; i++) {
    const currentPlayer = players[i];
    const leftIndex = (i - 1 + players.length) % players.length; // Handles wrap-around
    const rightIndex = (i + 1) % players.length; // Handles wrap-around

    currentPlayer.leftPlayer = players[leftIndex];
    currentPlayer.rightPlayer = players[rightIndex];
  }

  return players;
}
