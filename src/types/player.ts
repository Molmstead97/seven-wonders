import { Wonder } from "./wonder";
import { Card } from "./card";
import { Gold, Resource, Science, Shields, VictoryPoints } from "./resource";

export interface Player {
  id: number;
  name: string;
  wonder: Wonder;
  playerBoard: Set<Card>;
  playerHand: Card[];
  resources: Resource;
  tempResources: Resource;
  gold: Gold;
  victoryPoints: VictoryPoints;
  science: Science;
  military: Shields;
  leftPlayer: Player;
  rightPlayer: Player;
  hasTradeDiscount: boolean;
}
