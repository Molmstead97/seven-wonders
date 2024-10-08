import { GameState } from './gameState';
import { Player } from '../types/player';
import { Resource, ResourceType } from '../types/resource';
import { Card } from '../types/card';
import { Wonder } from '../types/wonder';
import { playCard } from '../utils/cardFunctions';
import { buildWonder } from '../utils/buildWonder';
import { tradeResource } from '../utils/tradeResource';
import { ageEnd } from '../utils/ageEnd'

export function handleCardPlay(gameState: GameState, playerId: number, cardIndex: number): GameState {
  const newState = { ...gameState };
  const player = newState.players[playerId];
  const card = player.playerHand[cardIndex];

  const updatedPlayer = playCard(player, card);
  newState.players[playerId] = updatedPlayer;

  return newState;
}

export function handleBuildWonder(gameState: GameState, playerId: number, wonder: Wonder, card: Card): GameState {
  const newState = { ...gameState };
  const player = newState.players[playerId];

  const updatedPlayer = buildWonder(player, wonder, card);
  newState.players[playerId] = updatedPlayer;

  return newState;
}

export function handlePassHand(gameState: GameState): GameState {
  const { age, players } = gameState;
  const direction = age === 2 ? -1 : 1;

  const newHands = players.map((_, index) => {
    const nextPlayerIndex = (index + direction + players.length) % players.length;
    return players[nextPlayerIndex].playerHand;
  });

  return {
    ...gameState,
    players: gameState.players.map((player, index) => ({
      ...player,
      playerHand: newHands[index],
    })),
  };
}

export function handleTrade(gameState: GameState, playerId: number, resourceType: ResourceType, amount: number): GameState {
  const newState = { ...gameState };
  const player = newState.players[playerId];

  const updatedPlayer = tradeResource(player, player.leftPlayer || player.rightPlayer, resourceType, amount);
  newState.players[playerId] = updatedPlayer;

  return newState;
}

export function handleAgeEnd(gameState: GameState): GameState {
  const updatedPlayers = ageEnd(gameState.players, gameState.age);

  return {
    ...gameState,
    players: updatedPlayers,
  };
}


