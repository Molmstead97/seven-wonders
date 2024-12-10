import { Player } from "../data/types/player";
import { Card } from "../data/types/card";
import { Wonder } from "../data/types/wonder";
import { ResourceType } from "../data/types/resource";
import { ProductionChoiceState } from "../data/types/productionChoice";
import { analyzeTradingOptions } from "../game-logic/ai/scoring";
import { tradeResource } from "./utils/tradeResource";
import { setupPlayers } from "./utils/setupPlayers";
import { dealCards } from "./utils/dealCards";
import { ageEnd } from "./utils/ageEnd";

import { scoreActions, applyProductionChoices } from "./ai/scoring";

import {
  handleEndGame,
  handlePassHand,
  handleDiscardCard,
  handleCardPlay,
  handleBuildWonder,
  addToGameLog,
} from "./gameActions";

export interface GameState {
  age: number;
  turns: number;
  players: Player[];
  discardPile: Card[];
  gameLog: string[];
  isAutomated?: boolean;
  productionChoiceState: ProductionChoiceState
  // ... other game state properties
}

export function handleAITurn(player: Player, gameState: GameState): {
  action: "play" | "wonder" | "discard";
  cardIndex: number;
} {
  // First, check if we need any resources and can trade for them
  const availableResources = analyzeTradingOptions(player, gameState);
  
  // Execute trades for available resources if they're affordable and available
  availableResources.forEach((tradingOption, resource) => {
    if (player.gold >= Math.min(tradingOption.leftCost, tradingOption.rightCost) && 
        tradingOption.availability !== "low") {
      const tradingNeighbor = tradingOption.leftCost <= tradingOption.rightCost 
        ? player.leftPlayer 
        : player.rightPlayer;
      
      tradeResource(player, tradingNeighbor!, resource as ResourceType, 1);
    }
  });

  // Then proceed with regular turn scoring
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
    gameLog: [],
    productionChoiceState: {
      choices: [],
      currentChoiceIndex: 0,
    },
  };
}

export function gameLoop(
  gameState: GameState,
  playerActionTaken: boolean
): GameState {

  addToGameLog(gameState.gameLog, `=== TURN ${gameState.turns} ===`);  
  // Add random resources until UI is added
  gameState.players.forEach((player, index) => {
    if (index > 0) { // Skip human player
      applyProductionChoices(player, gameState);
    }
  });

  // Reset temp resources for all players
  gameState.players.forEach((player) => {
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

  if (!playerActionTaken) {
    return gameState;
  }

  let updatedGameState = { ...gameState };

  if (updatedGameState.age === 4) {
    console.log("=== GAME END TRIGGERED ===");
    console.log("Pre-calculation player points:", updatedGameState.players.map(p => ({
      name: p.name,
      points: p.victoryPoints
    })));
    updatedGameState = handleEndGame(updatedGameState);
    console.log("Post-calculation player points:", updatedGameState.players.map(p => ({
      name: p.name,
      points: p.victoryPoints
    })));
  }

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
    addToGameLog(updatedGameState.gameLog, `=== AGE ${updatedGameState.age} END ===`);
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
