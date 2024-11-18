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
  turns: number;
  players: Player[];
  discardPile: Card[];
  // ... other game state properties
}

export function initializeGame(
  aiPlayerCount: number,
  selectedWonder?: Wonder
): GameState {
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
    turns: 0,
    players,
    discardPile: [],
    // ... initialize other game state properties
  };
}

export function gameLoop(
  gameState: GameState,
  playerActionTaken: boolean
): GameState {
  console.log('\n=== GAME LOOP START ===');
  console.log(`Age: ${gameState.age}, Turn: ${gameState.turns}, Player Action Taken: ${playerActionTaken}`);
  
  if (!playerActionTaken) {
    console.log('No player action taken, returning current state');
    return gameState;
  }

  let updatedGameState = { ...gameState };
  
  console.log('Initial hand sizes:');
  updatedGameState.players.forEach((player, index) => {
    console.log(`${player.name}:`, {
      handSize: player.playerHand.length,
      cards: player.playerHand.map(c => c.name)
    });
  });

  // AI Actions
  updatedGameState.players.slice(1).forEach((player, index) => {
    const aiPlayerIndex = index + 1;
    console.log(`\nAI Player ${aiPlayerIndex} taking action`);
    const randomCardIndex = Math.floor(Math.random() * player.playerHand.length);
    updatedGameState = handleDiscardCard(updatedGameState, aiPlayerIndex, randomCardIndex);
  });

  // Update turn counter
  updatedGameState = {
    ...updatedGameState,
    turns: updatedGameState.turns + 1,
  };
  console.log(`\nTurn counter updated to: ${updatedGameState.turns}`);

  // Handle turn end
  if (updatedGameState.turns < 6) {
    console.log('\nPassing hands...');
    updatedGameState = handlePassHand(updatedGameState);
  } else {
    console.log('\nEnd of age reached');
    updatedGameState = {
      ...updatedGameState,
        turns: 0,  // Reset turns for next age
        age: updatedGameState.age + 1,  // Increment age
        discardPile: [
          ...updatedGameState.discardPile,
          ...updatedGameState.players.flatMap((player) => player.playerHand)
      ],
    };
  
    // Deal new cards if not the end of the game
      if (updatedGameState.age <= 3) {
        const newCards = dealCards(updatedGameState.players.length, updatedGameState.age);
        updatedGameState = {
          ...updatedGameState,
          ...ageEnd(updatedGameState.players, updatedGameState),
          players: updatedGameState.players.map((player, index) => ({
            ...player,
            playerHand: newCards.slice(index * 7, (index + 1) * 7),
          })),
        };
    }
  }

  console.log('\n=== GAME LOOP END ===');
  console.log('Final hand sizes:');
  updatedGameState.players.forEach((player, index) => {
    console.log(`${player.name}:`, {
      handSize: player.playerHand.length,
      cards: player.playerHand.map(c => c.name)
    });
  });

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
