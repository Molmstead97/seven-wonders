import { Player } from "./types/player";
import { Card } from "./types/card";
import { Wonder } from "./types/wonder";
import { ResourceType } from "./types/resource";

import { setupPlayers } from "./utils/setupPlayers";
import { dealCards } from "./utils/dealCards";
import { ageEnd } from "./utils/ageEnd";

import {
  handleEndGame,
  handlePassHand,
  handleDiscardCard,
} from "./gameActions";

export interface GameState {
  age: number;
  players: Player[];
  discardPile: Card[];
  // ... other game state properties
}

export function initializeGame(aiPlayerCount: number, selectedWonder?: Wonder): GameState {
  const players = setupPlayers(aiPlayerCount, selectedWonder);

  const dealtCards = dealCards(players.length, 1);

  // Shuffle the dealt cards
  const shuffledCards = dealtCards.sort(() => Math.random() - 0.5);

  // Distribute 7 cards to each player
  players.forEach((player, index) => {
    player.playerHand = shuffledCards.slice(index * 7, (index + 1) * 7);
    console.log(
      `Player ${player.name} has been dealt:`,
      player.playerHand.map((card) => card.name)
    );
  });

  return {
    age: 1,
    players,
    discardPile: [],
    // ... initialize other game state properties
  };
}

export function gameLoop(gameState: GameState, playerActionTaken: boolean): GameState {
  let updatedGameState = {
    ...gameState,
    players: gameState.players.map(player => ({
      ...player,
      tempResources: {
        Wood: 0,
        Stone: 0,
        Ore: 0,
        Clay: 0,
        Glass: 0,
        Papyrus: 0,
        Textile: 0,
      },
      playerHand: [...player.playerHand]
    }))
  };

  // If no player action, return current state
  if (!playerActionTaken) {
    return updatedGameState;
  }

  // Have AI players take their actions (randomly discard a card)
  // TODO: REMOVE THIS BEFORE FINALIZING, FOR TESTING PURPOSES ONLY
  updatedGameState.players.slice(1).forEach((player, index) => {
    const aiPlayerIndex = index + 1; // Add 1 because we skip the human player
    if (player.playerHand.length > 0) {
      updatedGameState = {
        ...updatedGameState,
        players: updatedGameState.players.map((player, index) => {
          if (index === aiPlayerIndex) {
            const randomCardIndex = Math.floor(Math.random() * player.playerHand.length);
            const updatedPlayers = handleDiscardCard(updatedGameState, aiPlayerIndex, randomCardIndex).players;
            return { ...player, ...updatedPlayers[aiPlayerIndex] };
          }
          return player;
        })
      };
    }
  });

  // Regular turn actions
  updatedGameState.players.forEach((player) => {
    addRandomResourceFromCards(player);
  });

  displayPlayerState(updatedGameState.players[0]); // Only display the user

  // Reset temporary resources
  updatedGameState.players.forEach((player) => {
    player.tempResources = {
      Wood: 0,
      Stone: 0,
      Ore: 0,
      Clay: 0,
      Glass: 0,
      Papyrus: 0,
      Textile: 0,
    };
  });

  // Pass hands if not the last turn of the age
  if (updatedGameState.players[0].playerHand.length > 1) {
    updatedGameState = {
      ...updatedGameState,
      players: handlePassHand(updatedGameState).players
    };
  } else {
    // Handle end of age
    updatedGameState.discardPile.push(
      ...updatedGameState.players.flatMap((player) => player.playerHand)
    );

    const newCards = dealCards(updatedGameState.players.length, updatedGameState.age);

    updatedGameState = {
      ...updatedGameState,
      ...ageEnd(updatedGameState.players, updatedGameState),
      players: updatedGameState.players.map((player, index) => ({
        ...player,
        playerHand: newCards.slice(index * 7, (index + 1) * 7)
      }))
    };
  }

  return updatedGameState;
}

// TODO: This is a function for TESTING PURPOSES ONLY, remove before finalizing
function displayPlayerState(player: Player) {
  console.log(`\nPlayer: ${player.name}`);
  console.log(`Gold: ${player.gold}`);
  console.log(`Shields: ${player.shields}`);
  console.log(`Victory Points: ${player.victoryPoints}`);
  console.log(`Science:`, player.science);
  console.log(`Resources:`, player.resources);
  console.log(`Built Structures:`);
  player.playerBoard.forEach((card) => {
    console.log(`Structure: ${card.name}`);
  });
  console.log(`Wonder Stages:`);
  player.wonder.wonderStages.forEach((stage, index) => {
    console.log(
      `  Stage ${index + 1}: ${stage.isBuilt ? "Built" : "Not Built"}`
    );
  });
}

// TODO: This is a function for TESTING PURPOSES ONLY, remove before finalizing
function addRandomResourceFromCards(player: Player) {
  player.playerBoard.forEach((card) => {
    if (card.production) {
      Object.entries(card.production).forEach(([resource, amount]) => {
        if (typeof resource === "string" && resource.includes(",")) {
          const choices = resource
            .split(",")
            .map((r) => r.trim()) as ResourceType[];
          const randomChoice =
            choices[Math.floor(Math.random() * choices.length)];

          player.tempResources[randomChoice] =
            (player.tempResources[randomChoice] || 0) + (amount as number);
        }
      });
    }
  });
}
