import { GameState } from './gameState';

import { ResourceType } from './types/resource';
import { Card } from './types/card';
import { Wonder } from './types/wonder';

import { playCard } from './utils/cardActions';
import { discardCard } from './utils/cardActions';
import { buildWonder } from './utils/buildWonder';
import { tradeResource } from './utils/tradeResource';
import { ageEnd } from './utils/ageEnd'
import { gameEnd } from './utils/gameEnd'
import { passHands, lastTwoCards } from "./utils/passHand";

export function handleCardPlay(gameState: GameState, playerId: number, cardIndex: number): GameState {
  const newState = { ...gameState };
  const player = newState.players[playerId];
  const card = player.playerHand[cardIndex];

  const updatedPlayer = playCard(player, card);
  newState.players[playerId] = updatedPlayer;

  return newState;
}

export function handleDiscardCard(gameState: GameState, playerId: number, cardIndex: number): GameState {
  const newState = { ...gameState };
  const player = newState.players[playerId];
  const card = player.playerHand[cardIndex];

    const updatedPlayer = discardCard(player, card, newState);
    newState.players[playerId] = updatedPlayer.player;
    newState.discardPile = updatedPlayer.gameState.discardPile; 
    return newState;
}

export function handleBuildWonder(gameState: GameState, playerId: number, wonder: Wonder, card: Card): GameState {
  const newState = { ...gameState };
  const player = newState.players[playerId];

  const updatedPlayer = buildWonder(player, wonder, card, newState);
  newState.players[playerId] = updatedPlayer;

  return newState;
}

export function handlePassHand(gameState: GameState): GameState {
  let updatedGameState = gameState;

  // Check if all players have two cards left
  if (updatedGameState.players.every(player => player.playerHand.length === 2)) {
    // Handle last two cards for all players
    updatedGameState.players = updatedGameState.players.map(player => 
      lastTwoCards(player, updatedGameState)
    );

    // After all players have played their last two cards, end the age
    updatedGameState = handleAgeEnd(updatedGameState);

    // Return here as we don't need to pass hands anymore
    return updatedGameState;
  }

  // If not all players have two cards, pass hands normally
  updatedGameState = passHands(updatedGameState);

  return updatedGameState;
}

export function handleTrade(gameState: GameState, playerId: number, resourceType: ResourceType, amount: number): GameState {
  const newState = { ...gameState };
  const player = newState.players[playerId];

  const updatedPlayer = tradeResource(player, player.leftPlayer || player.rightPlayer, resourceType, amount);
  newState.players[playerId] = updatedPlayer;

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
  // Only call gameEnd if the age is 4 (i.e., after age 3 has been completed)
  if (gameState.age === 4) {
    const updatedPlayers = gameEnd(gameState.players);

    return {
      ...gameState,
      players: updatedPlayers,
    };
  }

  // If the age is not 4, return the game state as is
  return gameState;
}



