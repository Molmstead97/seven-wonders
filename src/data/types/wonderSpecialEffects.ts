import { Player } from "./player";
import { ResourceType, ScienceType } from "./resource";
import { Card } from "./card";
import { GameState } from "../../game-logic/gameState";
import { applyGoldVictoryBonus, GoldVictoryBonus } from "./cardSpecialEffects";

export interface FreeScienceEffect {
  type: "freeScience";
  scienceType: ScienceType[];
}

export interface CardFromDiscardEffect {
  type: "cardFromDiscard";
}

export interface FreeBuildPerAgeEffect {
  type: "freeBuildPerAge";
}

export interface PlaySeventhCardEffect {
  type: "playSeventhCard";
}

export interface CopyGuildEffect {
  type: "copyGuild";
}

export interface TradeDiscountEffect {
  type: "tradeDiscount";
  neighbor: "left" | "right" | "both";
  resource: ResourceType[];
}

export type SpecialEffect =
  | FreeScienceEffect
  | CardFromDiscardEffect
  | FreeBuildPerAgeEffect
  | PlaySeventhCardEffect
  | CopyGuildEffect
  | TradeDiscountEffect;

export function freeScienceFunction(player: Player, source: "wonder" | "card") {
  if (!player.freeScience) {
    player.freeScience = { fromWonder: false, fromCard: false };
  }

  if (source === "wonder") {
    player.freeScience.fromWonder = true;
  } else {
    player.freeScience.fromCard = true;
  }
}

export function cardFromDiscardFunction(
  player: Player,
): Player {
  //player.cardFromDiscard = true;
  return player;
}

export function freeBuildPerAgeFunction(player: Player) {
  player.freeBuildPerAge.isEffectTriggered = true;
  return player;
}

export function playSeventhCardFunction(player: Player): Player {
  //player.playSeventhCard = true;
  return player;
}

export function copyGuildFunction(player: Player): Player {
  //player.copyGuild = true;
  return player;
}
