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

export function discardCard(player: Player, card: Card, gameState: GameState) {
  const updatedPlayer = { ...player };
  const updatedGameState = { ...gameState };

  const index = updatedPlayer.playerHand.indexOf(card);
  if (index > -1) {
    updatedPlayer.playerHand = [
      ...updatedPlayer.playerHand.slice(0, index),
      ...updatedPlayer.playerHand.slice(index + 1),
    ];
    updatedPlayer.gold += 3;
    updatedGameState.discardPile = [...updatedGameState.discardPile, card];
  }

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
