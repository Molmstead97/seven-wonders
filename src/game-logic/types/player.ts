import { Wonder } from "./wonder";
import { Card } from "./card";
import { Resource, ResourceType, Science } from "./resource";

export interface Player {
  id: number;
  name: string;
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
