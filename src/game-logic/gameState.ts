import { Player } from "../data/types/player";
import { Card } from "../data/types/card";
import { Wonder } from "../data/types/wonder";
import { ResourceType } from "../data/types/resource";
import { ProductionChoiceState } from "../data/types/productionChoice";
import { analyzeTradingOptions } from "../game-logic/ai/scoring";
import { tradeResource } from "./utils/tradeResource";
import { setupPlayers } from "./utils/setupPlayers";
import { dealCards } from "./utils/dealCards";
import { DiscardPile } from "../components/DiscardPile";

import { scoreActions, applyProductionChoices } from "./ai/scoring";

import {
  handlePassHand,
  handleDiscardCard,
  handleCardPlay,
  handleBuildWonder,
  addToGameLog,
  handleEndAge,
} from "./gameActions";

export interface GameState {
  age: number;
  turns: number;
  players: Player[];
  discardPile: Card[];
  gameLog: string[];
  isAutomated?: boolean;
  finalState?: boolean;
  productionChoiceState: ProductionChoiceState;
  showDiscardPile?: boolean;
  waitingForSeventhCard?: boolean;
  endGameTriggered?: boolean;
  // ... other game state properties
}

export function handleAITurn(
  player: Player,
  gameState: GameState
): {
  action: "play" | "wonder" | "discard";
  cardIndex: number;
} {
  // First, check if we need any resources and can trade for them
  const availableResources = analyzeTradingOptions(player, gameState);

  // Execute trades for available resources if they're affordable and available
  availableResources.forEach((tradingOption, resource) => {
    if (
      player.gold >= Math.min(tradingOption.leftCost, tradingOption.rightCost) &&
      tradingOption.availability !== "low"
    ) {
      const tradingNeighbor =
        tradingOption.leftCost <= tradingOption.rightCost
          ? player.leftPlayer!
          : player.rightPlayer!;
      
      const { player: updatedPlayer, neighbor: updatedNeighbor } = 
        tradeResource(player, tradingNeighbor, resource as ResourceType, 1);

      // Only update if trade was successful
      if (updatedPlayer.gold !== player.gold) {
        // Update the player objects
        player = updatedPlayer;
        if (tradingNeighbor.id === player.leftPlayer!.id) {
          player.leftPlayer = updatedNeighbor;
        } else {
          player.rightPlayer = updatedNeighbor;
        }

        // Log the AI trade
        gameState.gameLog = addToGameLog(
          gameState.gameLog,
          `${player.id === 0 ? "You" : player.wonder.name} bought ${resource} from ${tradingNeighbor.id === 0 ? "You" : tradingNeighbor.wonder.name}`
        );
      }
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
    if (
      Array.from(player.playerBoard).some(
        (boardCard) => boardCard.name === card.name
      )
    ) {
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
  console.log("initializeGame - Received wonder:", selectedWonder?.name);
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
    finalState: false,
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
  if (gameState.finalState) {
    return gameState;
  }

  // Create initial new state WITHOUT the turn log message
  let newState = {
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
      }
    }))
  };

  // Apply production choices for AI players
  newState = {
    ...newState,
    players: newState.players.map((player, index) => {
      if (index > 0) {
        return applyProductionChoices(player, newState);
      }
      return player;
    })
  };

  if (!playerActionTaken) {
    return newState;
  }

  // Process AI turns
  if (!newState.isAutomated) {
    for (let i = 1; i < newState.players.length; i++) {
      const aiPlayer = newState.players[i];
      const aiAction = handleAITurn(aiPlayer, newState);
      const cardName = aiPlayer.playerHand[aiAction.cardIndex].name;

      // Execute AI action
      switch (aiAction.action) {
        case "play":
          newState = handleCardPlay(newState, i, aiAction.cardIndex);
          console.log(`AI Player ${i} played: ${cardName}`);
          break;
        case "wonder":
          newState = handleBuildWonder(newState, i, aiAction.cardIndex);
          console.log(`AI Player ${i} built wonder stage using: ${cardName}`);
          break;
        case "discard":
          newState = handleDiscardCard(newState, i, aiAction.cardIndex);
          console.log(`AI Player ${i} discarded: ${cardName}`);
          break;
      }
    }
  }

  // Update turn counter
  newState = {
    ...newState,
    turns: newState.turns + 1,
  };

  // Add debug logging
  console.log("Game Loop State:", {
    age: newState.age,
    turns: newState.turns,
    finalState: newState.finalState,
    playerCount: newState.players.length
  });

  // Handle turn end
  if (newState.turns < 6) {
    console.log("=== PASSING HANDS ===");
    return handlePassHand(newState);
  } else {
    return handleEndAge(newState);
  }
}
