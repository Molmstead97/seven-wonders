import { Resource } from "./resource";

export interface PlayerCountThreshold {
  minPlayers: number;
  copies: number;
}

export interface ProductionChoice {
  resource: string;
  amount: number;
}

export type Production = Partial<Resource> | {
  type: "option";
  value: ProductionChoice[];
};

export interface AgeVariant {
  age: 2 | 3; // Age variants only apply to Ages 2 or 3
  maxPlayers: number;
}

export interface Card {
  name: string;
  description: string;
  production: Production | null;
  victoryPoints?: number;
  playerCount: PlayerCountThreshold[] | null;
  upgradeCard: boolean;
  cost: Resource | null;
  age: 1 | 2 | 3;
  color: "Brown" | "Grey" | "Blue" | "Yellow" | "Red" | "Green" | "Purple";
  ageVariant?: AgeVariant; // Optional, only for cards that change based on age
}
