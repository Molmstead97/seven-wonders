import { Resource, Production } from "./resource";
import { Science } from "./resource";
import { SpecialEffect } from "./cardSpecialEffects";

export interface PlayerCountThreshold {
  minPlayers: number;
  copies: number;
}

export type CardColor = "Brown" | "Red" | "Yellow" | "Grey" | "Green" | "Blue" | "Purple";

export interface Card {
  name: string;
  description: string;
  imagePath: string;
  production?: Production
  victoryPoints?: number;
  gold?: number;
  science?: Science;
  shields?: number;
  specialEffect?: SpecialEffect;
  playerCount?: PlayerCountThreshold[];
  upgradeCard: string | string[] | null;
  cost: Resource | number | null; // The number is the cost in gold.
  age: 1 | 2 | 3;
  cardColor: CardColor | CardColor[];
}
