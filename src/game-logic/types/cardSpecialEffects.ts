import { Player } from "./player";
import { CardColor } from "./card";
import { FreeScienceEffect, TradeDiscountEffect } from "./wonderSpecialEffects"; // These function the same on both the cards and the Wonder, so we're importing them here. Might put them in a separate file later.

export interface GoldVictoryBonus {
  type: "goldVictoryBonus";
  cardColor?: CardColor | CardColor[];
  gold?: number;
  victoryPoints?: number;
  scope: "self" | "neighbors" | "all";
  name?: string; // Added to identify special cards
}

export type SpecialEffect =
  | TradeDiscountEffect
  | FreeScienceEffect
  | GoldVictoryBonus;

export function applyGoldVictoryBonus(
  player: Player,
  goldVictoryBonus: GoldVictoryBonus,
  isEndGame: boolean = false
) {
  let matchingCards = 0;

  const countMatchingCards = (targetPlayer: Player) => {
    if (!goldVictoryBonus.cardColor) return 0;

    return Array.from(targetPlayer.playerBoard).filter((card) => {
      if (Array.isArray(goldVictoryBonus.cardColor)) {
        return goldVictoryBonus.cardColor.includes(card.cardColor as CardColor);
      } else {
        return card.cardColor === goldVictoryBonus.cardColor;
      }
    }).length;
  };

  // Handle special cases
  if (goldVictoryBonus.name === "Builders Guild") {
    matchingCards =
      player.wonder.wonderStages.filter((stage) => stage.isBuilt).length +
      (player.leftPlayer || player).wonder.wonderStages.filter((stage) => stage.isBuilt)
        .length +
      (player.rightPlayer || player).wonder.wonderStages.filter((stage) => stage.isBuilt)
        .length;
  } else if (goldVictoryBonus.name === "Arena") {
    matchingCards = player.wonder.wonderStages.filter(
      (stage) => stage.isBuilt
    ).length;
  } else if (goldVictoryBonus.name === "Strategy Guild") {
    matchingCards =
      (player.leftPlayer || player).conflictLossTokens +
      (player.rightPlayer || player).conflictLossTokens;
  } else {
    switch (goldVictoryBonus.scope) {
      case "self":
        matchingCards = countMatchingCards(player);
        break;
      case "neighbors":
        matchingCards =
          countMatchingCards(player.leftPlayer || player) +
          countMatchingCards(player.rightPlayer || player);
        break;
      case "all":
        matchingCards =
          countMatchingCards(player) +
          countMatchingCards(player.leftPlayer || player) +
          countMatchingCards(player.rightPlayer || player);
        break;
    }
  }

  // Apply gold bonus immediately
  if (goldVictoryBonus.gold && !isEndGame) {
    player.gold += goldVictoryBonus.gold * matchingCards;
  }

  // Apply victory points only at the end of the game
  if (isEndGame && goldVictoryBonus.victoryPoints) {
    player.victoryPoints += goldVictoryBonus.victoryPoints * matchingCards;
  }

  // Return the number of matching cards for end-game scoring
  return matchingCards;
}
