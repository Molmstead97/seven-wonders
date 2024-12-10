import { GameState } from "./gameState";

import { ResourceType } from "../data/types/resource";
import { Wonder } from "../data/types/wonder";
import { ProductionChoiceState } from "../data/types/productionChoice";

import { applyCardEffects } from "./utils/applyCardEffects";
import { buildWonder } from "./utils/buildWonder";
import { tradeResource } from "./utils/tradeResource";
import { ageEnd } from "./utils/ageEnd";
import { gameEnd } from "./utils/gameEnd";
import { passHands } from "./utils/passHand";
import { checkResources } from './utils/resourceCheck';
import { Card } from "../data/types/card";

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
      wonder: index === playerId ? {
        ...p.wonder,
        wonderStages: p.wonder.wonderStages.map(stage => ({ ...stage })),
      } : p.wonder,
    })),
    gameLog: [...(gameState.gameLog || [])] // Ensure gameLog exists
  };

  // Get current player and card
  const currentPlayer = newState.players[playerId];
  const cardToUse = currentPlayer.playerHand[cardIndex];

  if (!cardToUse) {
    console.error('Invalid card index');
    return gameState;
  }

  // Use buildWonder utility function to handle the wonder building logic
  const updatedPlayer = buildWonder(
    currentPlayer,
    currentPlayer.wonder,
    cardToUse,
    newState
  );

  // Update the player in the game state
  newState.players[playerId] = updatedPlayer;

  // Remove card from hand
  currentPlayer.playerHand.splice(cardIndex, 1);

  // Update the game log
  newState.gameLog = addToGameLog(
    newState.gameLog,
    playerId === 0 
      ? `You built a Wonder stage`
      : `Player ${playerId + 1} built a Wonder stage`
  );

  // Check for production choices in the wonder stage
  const nextStage = currentPlayer.wonder.wonderStages.find(stage => !stage.isBuilt);
  if (nextStage?.production && "choice" in nextStage.production) {
    const choices = nextStage.production.choice.map(choice => ({
      cardName: `${currentPlayer.wonder.name} Stage ${nextStage.stage}`,
      cardImage: currentPlayer.wonder.imagePath,
      options: choice.options,
      amount: choice.amount
    }));

    newState.productionChoiceState = {
      choices,
      currentChoiceIndex: 0
    };
  }

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
    gameLog: addToGameLog(
      gameState.gameLog,
      `${tradingPlayerId === 0 ? 'You' : `Player ${tradingPlayerId + 1}`} traded ${amount} ${resourceType} for ${amount * 2} gold`
    ),
  };
  
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

  // Check for chain buildings
  const canChainBuild = Array.from(player.playerBoard).some(
    boardCard => boardCard.name === card.chainedFrom
  );

  if (canChainBuild) {
    return true;
  }

  // Check resources including temporary resources
  return checkResources(player, card, null, player.tempResources);
}
