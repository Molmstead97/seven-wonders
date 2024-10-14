import { Resource, Production, Gold, VictoryPoints } from "./resource";
import { Science, Shields } from "./resource";
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
  victoryPoints?: VictoryPoints;
  gold?: Gold;
  science?: Science;
  shields?: Shields;
  specialEffect?: SpecialEffect;
  playerCount?: PlayerCountThreshold[];
  upgradeCard: boolean;
  cost: Resource | Gold | null;
  age: 1 | 2 | 3;
  cardColor: CardColor | CardColor[];
  ageVariant?: AgeVariant; // Optional, only for cards that change based on age
}
