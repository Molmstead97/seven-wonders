import { GameState } from "./gameState";

import { ResourceType } from "../data/types/resource";
import { Wonder } from "../data/types/wonder";
import { ProductionChoiceState } from "../data/types/productionChoice";

import { applyCardEffects } from "./utils/applyCardEffects";
import { buildWonder } from "./utils/buildWonder";
import { tradeResource } from "./utils/tradeResource";
import { ageEnd } from "./utils/ageEnd";
import { passHands } from "./utils/passHand";
import { checkResources } from './utils/resourceCheck';
import { Card } from "../data/types/card";
import { dealCards } from "./utils/dealCards";

export const addToGameLog = (gameLog: string[], message: string) => {
  console.log("Adding to game log:", message);
  return [...gameLog, message];
};

export function handleCardPlay(
  gameState: GameState,
  playerId: number,
  cardIndex: number
): GameState {
  if (!gameState || !gameState.players[playerId]) {
    console.error('Invalid game state or player ID');
    return gameState;
  }

  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p, index) => ({
      ...p,
      playerHand: index === playerId ? [...p.playerHand] : p.playerHand,
      playerBoard: index === playerId ? new Set([...p.playerBoard]) : p.playerBoard,
    })),
    gameLog: [...(gameState.gameLog || [])] // Ensure gameLog exists
  };

  // Get current player and card
  const currentPlayer = newState.players[playerId];
  const cardToPlay = currentPlayer.playerHand[cardIndex];

  if (!cardToPlay) {
    console.error('Invalid card index');
    return gameState;
  }

  // Check for production choices
  if (cardToPlay.production && "choice" in cardToPlay.production) {
    const choices = cardToPlay.production.choice.map(choice => ({
      sourceName: cardToPlay.name,
      sourceImage: cardToPlay.imagePath,
      options: choice.options,
      amount: choice.amount,
      sourceType: 'card'
    }));

    newState.productionChoiceState = {
      choices,
      currentChoiceIndex: 0
    };
  }

  // Update player state
  currentPlayer.playerBoard.add(cardToPlay);
  currentPlayer.playerHand.splice(cardIndex, 1);

  // Update the game log
  newState.gameLog = addToGameLog(
    newState.gameLog, 
    playerId === 0 
      ? `You constructed ${cardToPlay.name}`
      : `Player ${playerId + 1} constructed ${cardToPlay.name}`
  );

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
  if (!gameState || !gameState.players[playerId]) {
    console.error('Invalid game state or player ID');
    return gameState;
  }
  
  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p, index) => ({
      ...p,
      playerHand: index === playerId ? [...p.playerHand] : p.playerHand,
      playerBoard: index === playerId ? new Set([...p.playerBoard]) : p.playerBoard,
    })),
    discardPile: [...gameState.discardPile],
    gameLog: [...(gameState.gameLog || [])] // Ensure gameLog exists
  };

  // Get current player and card
  const currentPlayer = newState.players[playerId];
  const cardToDiscard = currentPlayer.playerHand[cardIndex];

  if (!cardToDiscard) {
    console.error('Invalid card index');
    return gameState;
  }

  // Add 3 gold for discarding
  currentPlayer.gold += 3;

  // Remove card from hand
  currentPlayer.playerHand.splice(cardIndex, 1);

  // Add card to discard pile
  newState.discardPile.push(cardToDiscard);

  // Update the game log
  newState.gameLog = addToGameLog(newState.gameLog, playerId === 0 
    ? `You discarded ${cardToDiscard.name}`
    : `Player ${playerId + 1} discarded ${cardToDiscard.name}`
  );

  return newState;
}

export function handleBuildWonder(
  gameState: GameState,
  playerId: number,
  cardIndex: number
): GameState {
  console.log(`Attempting wonder build - Player ${playerId}`);
  
  if (!gameState?.players[playerId]) {
    console.error(`Invalid player ID: ${playerId}`);
    return gameState;
  }

  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p, index) => ({
      ...p,
      playerHand: index === playerId ? [...p.playerHand] : p.playerHand,
      playerBoard: index === playerId ? new Set([...p.playerBoard]) : p.playerBoard,
      wonder: index === playerId ? {
        ...p.wonder,
        wonderStages: p.wonder.wonderStages.map(stage => ({ ...stage })),
      } : p.wonder,
    })),
    gameLog: [...gameState.gameLog]
  };

  const currentPlayer = newState.players[playerId];
  console.log(`Player ${playerId} hand:`, currentPlayer.playerHand);
  console.log(`Attempting to use card at index:`, cardIndex);
  console.log(`Player wonder:`, currentPlayer.wonder.name);
  
  const cardToUse = currentPlayer.playerHand[cardIndex];
  if (!cardToUse) {
    console.error(`No card found at index ${cardIndex} for player ${playerId}`);
    return gameState;
  }

  const { updatedPlayer, hasProductionChoice, stageBuilt } = buildWonder(
    currentPlayer,
    currentPlayer.wonder,
    cardToUse,
    newState
  );

  console.log(`Build wonder result:`, {
    wonderBuilt: !!stageBuilt,
    hasProductionChoice,
    playerUpdated: updatedPlayer !== currentPlayer
  });

  if (!stageBuilt) {
    console.log(`Wonder build failed for player ${playerId}`);
    return gameState;
  }

  // Update player in game state
  newState.players[playerId] = updatedPlayer;

  // Add to game log
  newState.gameLog = addToGameLog(
    newState.gameLog,
    playerId === 0 
      ? `You built Wonder stage ${stageBuilt.stage}`
      : `Player ${playerId + 1} built Wonder stage ${stageBuilt.stage}`
  );

  // Handle production choices if needed
  if (hasProductionChoice && stageBuilt.production && 'choice' in stageBuilt.production) {
    const production = stageBuilt.production as { choice: Array<{ options: string[], amount: number }> };
    newState.productionChoiceState = {
      choices: production.choice.map(choice => ({
        sourceName: `${newState.players[playerId].wonder.name} Stage ${stageBuilt.stage}`,
        sourceImage: newState.players[playerId].wonder.imagePath,
        options: choice.options || [],
        amount: choice.amount || 1
      })),
      currentChoiceIndex: 0
    };
  }

  console.log(`Wonder build attempt - Player ${playerId}, Card: ${cardToUse?.name}`);

  return newState;
}

export function handlePassHand(gameState: GameState): GameState {
  return passHands(gameState);
}

export function handleTrade(gameState: GameState, tradingPlayerId: number, resourceType: ResourceType, amount: number): GameState {
  if (!gameState) return gameState;
  
  const tradingPlayer = gameState.players[tradingPlayerId];
  const userPlayer = gameState.players[0];
  
  const { player: updatedUserPlayer, neighbor: updatedTradingPlayer } = tradeResource(userPlayer, tradingPlayer, resourceType, amount);
  
  // Update game state
  const newState: GameState = {
    ...gameState,
    players: gameState.players.map((player, index) => 
      index === 0 ? updatedUserPlayer : 
      index === tradingPlayerId ? updatedTradingPlayer :
      player
    ),
  };
  
  return newState;
}

export function handleEndAge(gameState: GameState): GameState {
  addToGameLog(gameState.gameLog, `=== AGE ${gameState.age} END ===`);
  
  let updatedGameState = {
    ...gameState,
    turns: 0,
    age: gameState.age + 1,
    discardPile: [
      ...gameState.discardPile,
      ...gameState.players.flatMap((player) => player.playerHand),
    ],
  };

  // Process age end effects
  updatedGameState = {
    ...updatedGameState,
    ...ageEnd(updatedGameState.players, updatedGameState),
  };

  // If we're entering Age 4, handle end game
  if (updatedGameState.age === 4) {
    return handleEndGame(updatedGameState);
  }

  // Deal new cards if not the end of the game
  const newCards = dealCards(updatedGameState.players.length, updatedGameState.age);
  updatedGameState.players = updatedGameState.players.map((player, index) => ({
    ...player,
    playerHand: newCards.slice(index * 7, (index + 1) * 7),
  }));

  return updatedGameState;
}

export function handleEndGame(gameState: GameState): GameState {
  console.log("=== PREPARING FINAL GAME STATE ===");
  
  // Create final state with all trading and production disabled
  const finalState = {
    ...gameState,
    finalState: true,  // This will disable interactions
    players: gameState.players.map(player => ({
      ...player,
      canTrade: false,
      canChooseProduction: false
    }))
  };

  console.log("Final player state:", finalState.players.map(p => ({
    name: p.name,
    points: p.victoryPoints,
    gold: p.gold
  })));

  gameState.finalState = true;
  return finalState;
}

export function canPlayCard(gameState: GameState, playerId: number, card: Card): boolean {
  if (!gameState?.players?.[playerId]?.playerBoard) {
    return false;
  }

  const player = gameState.players[playerId];

  // Check if the card has already been played by the player
  const isCardPlayed = Array.from(player.playerBoard).some(
    (playedCard) => playedCard && playedCard.name === card.name
  );

  if (isCardPlayed) {
    return false;
  }

  // Check resources including temporary resources
  return checkResources(player, card, null, player.tempResources);
}
