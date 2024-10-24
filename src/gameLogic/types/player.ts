import { Wonder } from "./wonder";
import { Card } from "./card";
import { Resource, Science } from "./resource";

export interface Player {
  id: number;
  name: string;
  wonder: Wonder;
  playerBoard: Set<Card>;
  playerHand: Card[];
  resources: Resource;
  tempResources: Resource;
  gold: number;
  victoryPoints: number;
  science: Science;
  shields: number;
  conflictLossTokens: number; // Only used for Strategy Guild card
  leftPlayer: Player;
  rightPlayer: Player;
  freeBuildPerAge: Record<number, boolean>;
  canPlaySeventhCard: boolean;
}
