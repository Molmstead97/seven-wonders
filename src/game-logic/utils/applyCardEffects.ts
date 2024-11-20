import { Player } from "../types/player";
import { Card } from "../types/card";
import { Resource, ScienceType } from "../types/resource";
import { applyGoldVictoryBonus } from "../types/cardSpecialEffects";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function applyCardEffects(player: Player, card: Card): Partial<Player> {
  const updates: Partial<Player> = {
    resources: { ...player.resources },
    science: { ...player.science },
    victoryPoints: player.victoryPoints,
    gold: player.gold,
    shields: player.shields,
  };

  // Apply resource production
  if (card.production) {
    if (!card.production.choice) {
      // Handle fixed production
      Object.entries(card.production).forEach(([resource, amount]) => {
        const resourceKey = resource as keyof Resource;
        updates.resources![resourceKey] =
          (updates.resources![resourceKey] || 0) + (amount as number);
      });
    }
    // Note: choice production will be handled by UI
  }

  // Apply science
  if (card.science) {
    Object.entries(card.science).forEach(([type, amount]) => {
      const scienceKey = type as ScienceType;
      updates.science![scienceKey] =
        (updates.science![scienceKey] || 0) + (amount as number);
    });
  }

  // Apply direct bonuses
  if (card.victoryPoints) {
    updates.victoryPoints! += card.victoryPoints;
  }

  if (card.gold) {
    updates.gold! += card.gold;
  }

  if (card.shields) {
    updates.shields! += card.shields;
  }

  // Handle special effects
  if (card.specialEffect?.type === "goldVictoryBonus") {
    applyGoldVictoryBonus(player, card.specialEffect, false); // This handles updating the player's gold and victory points internally
  }

  return updates;
}
