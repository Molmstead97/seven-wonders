import { Wonder } from "./wonder";
import { Card } from "./card";
import { Resource, ResourceType, Science } from "./resource";
import { AIPersonality } from "./aiPlayer";

export interface Player {
  id: number;
  name: string;
  aiPersonality?: AIPersonality; // Optional because the user won't have it
  wonder: Wonder;
  playerBoard: Set<Card>;
  playerHand: Card[];
  resources: Resource;
  tempResources: {
    [key in ResourceType]: number;
  };
  gold: number;
  victoryPoints: number;
  science: Science;
  shields: number;
  conflictLossTokens: number;
  leftPlayer: Player | null;
  rightPlayer: Player | null;
  freeBuildPerAge: Record<number, boolean>;
}
