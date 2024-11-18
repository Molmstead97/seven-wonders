import { GameState } from './gameState';

import { ResourceType } from './types/resource';
import { Wonder } from './types/wonder';

import { playCard } from './utils/cardActions';
import { discardCard } from './utils/cardActions';
import { buildWonder } from './utils/buildWonder';
import { tradeResource } from './utils/tradeResource';
import { ageEnd } from './utils/ageEnd'
import { gameEnd } from './utils/gameEnd'
import { passHands } from "./utils/passHand";

export function handleCardPlay(gameState: GameState, playerId: number, cardIndex: number): GameState {
  const newState = { ...gameState };
  const player = { ...newState.players[playerId] };
  const card = player.playerHand[cardIndex];

  const updatedPlayer = playCard(player, card);
  newState.players = newState.players.map((p, idx) => 
    idx === playerId ? updatedPlayer : p
  );

  return newState;
}

export function handleDiscardCard(gameState: GameState, playerId: number, cardIndex: number): GameState {
  console.log('=== HANDLE DISCARD CARD ===');
  console.log(`Processing discard for player ${playerId}, card index ${cardIndex}`);
  console.log('Initial state player hands:', gameState.players.map(p => ({
    player: p.name,
    handSize: p.playerHand.length,
    cards: p.playerHand.map(c => c.name)
  })));

  const newState = { ...gameState };
  const player = { ...newState.players[playerId] };
  const result = discardCard(player, cardIndex, newState);
  
  const updatedState = {
    ...newState,
    players: newState.players.map((p, idx) => 
      idx === playerId ? result.player : p
    )
  };

  console.log('Final state player hands:', updatedState.players.map(p => ({
    player: p.name,
    handSize: p.playerHand.length,
    cards: p.playerHand.map(c => c.name)
  })));
  
  return updatedState;
}

export function handleBuildWonder(gameState: GameState, playerId: number, wonder: Wonder, cardIndex: number): GameState {
  const newState = { ...gameState };
  const player = { ...newState.players[playerId] };
  const card = player.playerHand[cardIndex];

  const updatedPlayer = buildWonder(player, wonder, card, newState);
  newState.players = newState.players.map((p, idx) => 
    idx === playerId ? updatedPlayer : p
  );

  return newState;
}

export function handlePassHand(gameState: GameState): GameState {
  return passHands(gameState);
}

export function handleTrade(gameState: GameState, playerId: number, resourceType: ResourceType, amount: number): GameState {
  const newState = { ...gameState };
  const player = newState.players[playerId];

  const tradingPlayer = player.leftPlayer || player.rightPlayer;
  if (tradingPlayer) {
    const updatedPlayer = tradeResource(player, tradingPlayer, resourceType, amount);
    newState.players[playerId] = updatedPlayer;
  }

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

  



