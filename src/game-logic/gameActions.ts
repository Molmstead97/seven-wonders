import { GameState } from "./gameState";

import { ResourceType } from "./types/resource";
import { Wonder } from "./types/wonder";
import { ProductionChoiceState } from './types/productionChoice';

import { applyCardEffects } from "./utils/applyCardEffects";
import { buildWonder } from "./utils/buildWonder";
import { tradeResource } from "./utils/tradeResource";
import { ageEnd } from "./utils/ageEnd";
import { gameEnd } from "./utils/gameEnd";
import { passHands } from "./utils/passHand";

export function handleCardPlay(
  gameState: GameState,
  playerId: number,
  cardIndex: number
): GameState {
  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p) => ({
      ...p,
      playerHand: [...p.playerHand],
      playerBoard: new Set([...p.playerBoard]),
    })),
  };

  // Get current player and card
  const currentPlayer = newState.players[playerId];
  const cardToPlay = currentPlayer.playerHand[cardIndex];

  // Check for production choices
  if (cardToPlay.production?.choice) {
    const choices = cardToPlay.production.choice.map(choice => ({
      cardName: cardToPlay.name,
      cardImage: cardToPlay.imagePath,
      options: choice.options,
      amount: choice.amount
    }));

    newState.productionChoiceState = {
      choices,
      currentChoiceIndex: 0
    };
  }

  // Update player state
  currentPlayer.playerBoard.add(cardToPlay);
  currentPlayer.playerHand = [
    ...currentPlayer.playerHand.slice(0, cardIndex),
    ...currentPlayer.playerHand.slice(cardIndex + 1),
  ];

  // Apply cost
  if (typeof cardToPlay.cost === "number") {
    currentPlayer.gold -= cardToPlay.cost;
  }

  // Apply card effects (except for production choices which will be handled by the UI)
  const effectsUpdate = applyCardEffects(currentPlayer, cardToPlay);
  Object.assign(currentPlayer, effectsUpdate);

  return newState;
}

export function handleDiscardCard(
  gameState: GameState,
  playerId: number,
  cardIndex: number
): GameState {
  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p) => ({
      ...p,
      playerHand: [...p.playerHand],
      playerBoard: new Set([...p.playerBoard]),
    })),
    discardPile: [...gameState.discardPile],
  };

  // Get current player
  const currentPlayer = newState.players[playerId];
  const cardToDiscard = currentPlayer.playerHand[cardIndex];

  // Add 3 gold for discarding
  currentPlayer.gold += 3;

  // Remove card from hand
  currentPlayer.playerHand = [
    ...currentPlayer.playerHand.slice(0, cardIndex),
    ...currentPlayer.playerHand.slice(cardIndex + 1),
  ];

  // Add card to discard pile
  newState.discardPile.push(cardToDiscard);

  return newState;
}

export function handleBuildWonder(
  gameState: GameState,
  playerId: number,
  cardIndex: number
): GameState {
  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p) => ({
      ...p,
      playerHand: [...p.playerHand],
      playerBoard: new Set([...p.playerBoard]),
      wonder: {
        ...p.wonder,
        wonderStages: p.wonder.wonderStages.map((stage) => ({ ...stage })),
      },
    })),
  };

  // Get current player
  const currentPlayer = newState.players[playerId];
  const cardToUse = currentPlayer.playerHand[cardIndex];

  // Use buildWonder utility function to handle the wonder building logic
  const updatedPlayer = buildWonder(
    currentPlayer,
    currentPlayer.wonder,
    cardToUse,
    newState
  );

  // Update the player in the game state
  newState.players[playerId] = updatedPlayer;

  return newState;
}

export function handlePassHand(gameState: GameState): GameState {
  return passHands(gameState);
}

export function handleTrade(
  gameState: GameState,
  playerId: number,
  resourceType: ResourceType,
  amount: number
): GameState {
  console.log("=== HANDLE TRADE ===");
  console.log(
    `Processing trade for player ${playerId}, resource ${resourceType}, amount ${amount}`
  );

  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p) => ({
      ...p,
      playerHand: [...p.playerHand],
      playerBoard: new Set([...p.playerBoard]),
      resources: { ...p.resources },
    })),
  };

  // Get current player
  const currentPlayer = newState.players[playerId];
  const tradingPlayer = currentPlayer.leftPlayer || currentPlayer.rightPlayer;

  if (!tradingPlayer) {
    console.warn("No trading partner available");
    return gameState;
  }

  console.log("Before trade:", {
    playerGold: currentPlayer.gold,
    playerResources: currentPlayer.resources[resourceType],
    tradingPlayerResources: tradingPlayer.resources[resourceType],
  });

  // Calculate trade cost (2 gold per resource)
  const tradeCost = amount * 2;

  // Check if player has enough gold
  if (currentPlayer.gold < tradeCost) {
    console.warn("Not enough gold for trade");
    return gameState;
  }

  // Execute trade
  currentPlayer.gold -= tradeCost;
  currentPlayer.resources[resourceType] =
    (currentPlayer.resources[resourceType] || 0) + amount;

  console.log("After trade:", {
    playerGold: currentPlayer.gold,
    playerResources: currentPlayer.resources[resourceType],
    tradingPlayerResources: tradingPlayer.resources[resourceType],
  });

  return newState;
}

export function handleAgeEnd(gameState: GameState): GameState {
  const updatedGameState = ageEnd(gameState.players, gameState);

  if (updatedGameState.age === 3) {
    // If the current age is 3, end the game after completing the age
    return {
      ...updatedGameState,
      age: updatedGameState.age + 1, // Increment the age to 4 to signify the end of the game
    };
  } else {
    // Otherwise, increment the age and continue
    return {
      ...updatedGameState,
      age: updatedGameState.age + 1,
    };
  }
}

export function handleEndGame(gameState: GameState): GameState {
  const updatedPlayers = gameEnd(gameState.players);

  return {
    ...gameState,
    players: updatedPlayers,
  };
}
