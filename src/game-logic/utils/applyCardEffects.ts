import { Player } from "../../data/types/player";
import { Card } from "../../data/types/card";
import { Resource, ScienceType } from "../../data/types/resource";
import { applyGoldVictoryBonus } from "../../data/types/cardSpecialEffects";
import { freeScienceFunction } from "../../data/types/wonderSpecialEffects";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function applyCardEffects(player: Player, card: Card): Partial<Player> {
  // Create a deep copy of relevant player properties
  const updates: Partial<Player> = {
    resources: { ...player.resources },
    science: { ...player.science },
    victoryPoints: player.victoryPoints,
    gold: player.gold,
    shields: player.shields,
    freeScience: player.freeScience ? { ...player.freeScience } : { fromWonder: false, fromCard: false }
  };

  // Apply resource production
  if (card.production) {
    Object.entries(card.production).forEach(([resource, amount]) => {
      const resourceKey = resource as keyof Resource;
      updates.resources![resourceKey] =
        (updates.resources![resourceKey] || 0) + (amount as number);
    });
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
  if (card.specialEffect) {
    switch (card.specialEffect.type) {
      case "goldVictoryBonus":
        const bonusPoints = applyGoldVictoryBonus(
          { ...player, ...updates },  // Create a merged copy for the calculation
          card.specialEffect,
          false
        );
        updates.victoryPoints! += bonusPoints;
        break;
      case "freeScience":
        freeScienceFunction({ ...player, ...updates }, 'card');
        break;
    }
  }

  return updates;
}
