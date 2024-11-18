import { Player } from "../types/player";
import { Card } from "../types/card";
import { Resource, ScienceType } from "../types/resource";
import { applyGoldVictoryBonus } from "../types/cardSpecialEffects";

import { checkResources } from "./resourceCheck";

import { GameState } from "../gameState";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export const playCard = (player: Player, card: Card): Player => {
  if (!checkResources(player, card)) {
    console.warn("Not enough resources to play this card");
    return player;
  }

  return {
    ...player,
    playerBoard: new Set([...player.playerBoard, card]),
    playerHand: player.playerHand.filter(c => c !== card),
    gold: typeof card.cost === "number" ? player.gold - card.cost : player.gold,
    ...applyCardEffects(player, card)
  };
};

export function discardCard(player: Player, cardIndex: number, gameState: GameState) {
  console.log('=== DISCARD CARD ===');
  console.log(`Player ${player.name} discarding card at index ${cardIndex}`);
  console.log('Initial hand:', player.playerHand.map(card => card.name));
  
  const updatedPlayer = { ...player };
  const updatedGameState = { ...gameState };
  
  const cardToDiscard = updatedPlayer.playerHand[cardIndex];
  console.log('Card being discarded:', cardToDiscard.name);
  
  updatedPlayer.playerHand = [
    ...updatedPlayer.playerHand.slice(0, cardIndex),
    ...updatedPlayer.playerHand.slice(cardIndex + 1)
  ];
  
  updatedGameState.discardPile = [...updatedGameState.discardPile, cardToDiscard];
  updatedPlayer.gold += 3;
  
  console.log('Hand after discard:', updatedPlayer.playerHand.map(card => card.name));
  console.log('New hand size:', updatedPlayer.playerHand.length);
  
  return { player: updatedPlayer, gameState: updatedGameState };
}

function applyCardEffects(player: Player, card: Card): Partial<Player> {
  // Apply resource production
  if (card.production) {
    if (card.production.choice) {
      // promptChoiceProduction(player, card.production.choice); // TODO: Implement this
    } else {
      Object.entries(card.production).forEach(([resource, amount]) => {
        player.resources[resource as keyof Resource] =
          (player.resources[resource as keyof Resource] || 0) +
          (amount as number);
      });
    }
  }

  // Apply victory points
  if (card.victoryPoints) {
    player.victoryPoints += card.victoryPoints;
  }

  // Apply gold
  if (card.gold) {
    player.gold += card.gold;
  }

  // Apply science
  if (card.science) {
    Object.entries(card.science).forEach(([resource, amount]) => {
      player.science[resource as ScienceType] =
        (player.science[resource as ScienceType] || 0) + (amount as number);
    });
  }

  // Apply shields
  if (card.shields) {
    player.shields += card.shields;
  }

  if (card.specialEffect && card.specialEffect.type === "goldVictoryBonus") {
    applyGoldVictoryBonus(player, card.specialEffect);
  }

  return player;
}
