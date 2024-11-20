import { Player } from "./types/player";
import { Card } from "./types/card";
import { Wonder } from "./types/wonder";
import { ResourceType } from "./types/resource";

import { setupPlayers } from "./utils/setupPlayers";
import { dealCards } from "./utils/dealCards";
import { ageEnd } from "./utils/ageEnd";

import { scoreActions } from "./ai/scoring";

import {
  handleEndGame,
  handlePassHand,
  handleDiscardCard,
  handleCardPlay,
  handleBuildWonder,
} from "./gameActions";

export interface GameState {
  age: number;
  turns: number;
  players: Player[];
  discardPile: Card[];
  isAutomated?: boolean;
  // ... other game state properties
}

export function handleAITurn(player: Player, gameState: GameState): {
  action: "play" | "wonder" | "discard";
  cardIndex: number;
} {
  let bestScore = -Infinity;
  let bestAction = {
    action: "discard" as "play" | "wonder" | "discard",
    cardIndex: 0,
  };

  // Score each card in hand
  player.playerHand.forEach((card, index) => {
    // Skip scoring if card already exists in player's board
    if (Array.from(player.playerBoard).some(boardCard => boardCard.name === card.name)) {
      return;
    }

    const scores = scoreActions(player, card, gameState);
    
    // Find the highest scoring action for this card
    const bestActionForCard = scores.reduce((best, current) =>
      current.score > best.score ? current : best
    );

    if (bestActionForCard.score > bestScore) {
      bestScore = bestActionForCard.score;
      bestAction = {
        action: bestActionForCard.action,
        cardIndex: index,
      };
    }
  });

  return bestAction;
}

export function initializeGame(
  aiPlayerCount: number,
  selectedWonder?: Wonder
): GameState {
  const players = setupPlayers(aiPlayerCount, selectedWonder);
  const dealtCards = dealCards(players.length, 1);

  console.log(`Total cards dealt: ${dealtCards.length}`);

  const shuffledCards = dealtCards.sort(() => Math.random() - 0.5);

  players.forEach((player, index) => {
    player.playerHand = shuffledCards.slice(index * 7, (index + 1) * 7);
    console.log(`${player.name} initial hand:`, {
      handSize: player.playerHand.length,
      cards: player.playerHand.map((card) => card.name),
    });
  });

  return {
    age: 1,
    turns: 0,
    players,
    discardPile: [],
  };
}

export function gameLoop(
  gameState: GameState,
  playerActionTaken: boolean
): GameState {
  
  console.log(`=== TURN ${gameState.turns} ===`);  
  // Add random resources until UI is added
  gameState.players.forEach((player) => {
    addRandomResourceFromCards(player);
  });

  if (!playerActionTaken) {
    return gameState;
  }

  let updatedGameState = { ...gameState };

  // Skip AI processing if this is an automated game
  if (!gameState.isAutomated) {
    // Process AI turns after player action
    for (let i = 1; i < updatedGameState.players.length; i++) {
      const aiPlayer = updatedGameState.players[i];
      const aiAction = handleAITurn(aiPlayer, updatedGameState);
      const cardName = aiPlayer.playerHand[aiAction.cardIndex].name; // Get name before action

      // Execute AI action
      switch (aiAction.action) {
        case "play":
          updatedGameState = handleCardPlay(updatedGameState, i, aiAction.cardIndex);
          console.log(`AI Player ${i} played: ${cardName}`);
          break;
        case "wonder":
          updatedGameState = handleBuildWonder(updatedGameState, i, aiAction.cardIndex);
          console.log(`AI Player ${i} built wonder stage using: ${cardName}`);
          break;
        case "discard":
          updatedGameState = handleDiscardCard(updatedGameState, i, aiAction.cardIndex);
          console.log(`AI Player ${i} discarded: ${cardName}`);
          break;
      }
    }
  }

  updatedGameState.players.forEach((player) => {
    displayPlayerState(player);
  });

  // Update turn counter
  updatedGameState = {
    ...updatedGameState,
    turns: updatedGameState.turns + 1,
  };

  // Handle turn end
  if (updatedGameState.turns < 6) {
    console.log("=== PASSING HANDS ===");
    updatedGameState = handlePassHand(updatedGameState);
  } else {
    console.log('=== AGE END ===');
    updatedGameState = {
      ...updatedGameState,
      turns: 0, // Reset turns for next age
      age: updatedGameState.age + 1, // Increment age
      discardPile: [
        ...updatedGameState.discardPile,
        ...updatedGameState.players.flatMap((player) => player.playerHand),
      ],
    };

    // Deal new cards if not the end of the game
    if (updatedGameState.age <= 3) {
      // First process age end effects
      updatedGameState = {
        ...updatedGameState,
        ...ageEnd(updatedGameState.players, updatedGameState),
      };
      
      // Then deal new cards
      const newCards = dealCards(updatedGameState.players.length, updatedGameState.age);
      updatedGameState.players = updatedGameState.players.map((player, index) => ({
        ...player,
        playerHand: newCards.slice(index * 7, (index + 1) * 7),
      }));
    }
  }

  updatedGameState.players.forEach((player, index) => {
    console.log(`${player.name}:`, {
      handSize: player.playerHand.length,
      cards: player.playerHand.map((c) => c.name),
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
