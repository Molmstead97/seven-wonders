import { Resource, Production } from "./resource";
import { Science } from "./resource";
import { SpecialEffect } from "./cardSpecialEffects";

export interface PlayerCountThreshold {
  minPlayers: number;
  copies: number;
}

export interface AgeVariant {
  age: 2 | 3; // Age variants only apply to Ages 2 or 3
  maxPlayers: number;
}

export type CardColor = "Brown" | "Red" | "Yellow" | "Grey" | "Green" | "Blue" | "Purple";

export interface Card {
  name: string;
  description: string;
  production?: Production
  victoryPoints?: number;
  gold?: number;
  science?: Science;
  shields?: number;
  specialEffect?: SpecialEffect;
  playerCount?: PlayerCountThreshold[];
  upgradeCard: boolean;
  cost: Resource | number | null; // The number is the cost in gold.
  age: 1 | 2 | 3;
  cardColor: CardColor | CardColor[];
  ageVariant?: AgeVariant; // This is only for the Grey cards, they're a little weird.
}
