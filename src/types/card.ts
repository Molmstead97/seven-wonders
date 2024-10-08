import { Resource, Production } from "./resource";
import { Gold, Science, Shields, VictoryPoints } from "./resource";

export interface PlayerCountThreshold {
  minPlayers: number;
  copies: number;
}


export interface AgeVariant {
  age: 2 | 3; // Age variants only apply to Ages 2 or 3
  maxPlayers: number;
}

export interface Card {
  name: string;
  description: string;
  production?: Production
  victoryPoints?: VictoryPoints;
  gold?: Gold;
  science?: Science;
  shields?: Shields;
  //specialEffect?: SpecialEffect;
  playerCount?: PlayerCountThreshold[];
  upgradeCard: boolean;
  cost: Resource | Gold | null;
  age: 1 | 2 | 3;
  color: "Brown" | "Grey" | "Blue" | "Yellow" | "Red" | "Green" | "Purple";
  ageVariant?: AgeVariant; // Optional, only for cards that change based on age
}
