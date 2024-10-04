import { Player } from "../types/player";
import { Card } from "../types/card";
import { Production, ResourceType } from "../types/resource";

export function playCard(player: Player, card: Card) {
  const updatedPlayer = { ...player };

  updatedPlayer.playerBoard = new Set([...updatedPlayer.playerBoard, card]);
  applyCardEffects(updatedPlayer, card);

  const index = updatedPlayer.playerHand.indexOf(card);
  if (index > -1) {
    updatedPlayer.playerHand = [
      ...updatedPlayer.playerHand.slice(0, index),
      ...updatedPlayer.playerHand.slice(index + 1),
    ];
  }

  return updatedPlayer;
}

function applyCardEffects(player: Player, card: Card) {
  // Apply resource production
  if (card.production) {
    applyProduction(player, card.production);
  }

  // Apply victory points
  if (card.victoryPoints) {
    player.victoryPoints.victoryPoints += card.victoryPoints.victoryPoints;
  }

  // Apply gold
  if (card.gold) {
    player.coin.gold += card.gold.gold;
  }

  // Apply science
  if (card.science) {
    let scienceType = card.science as unknown as keyof typeof player.science; // Cast to unknown first
    // Check if player.science[scienceType] is defined
    if (player.science[scienceType] !== undefined) {
      player.science[scienceType]++;
    }
  }

  // Apply shields
  if (card.shields) {
    player.military.shields += card.shields.shields;
  }
}

function applyProduction(player: Player, production: Production) {
  // Handle resource production based on card effects
  Object.entries(production).forEach(([resource, amount]) => {
    if (amount !== undefined) {
      player.resources[resource as ResourceType] =
        (player.resources[resource as ResourceType] || 0) + amount;
    }
  });
}
