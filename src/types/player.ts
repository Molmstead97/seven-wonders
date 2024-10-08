import { Wonder } from "./wonder";
import { Card } from "./card";
import { Resource, Gold, VictoryPoints, Science, Shields } from "./resource";

export interface Player {
  id: number;
  name: string;
  wonder: Wonder;
  playerBoard: Set<Card>;
  playerHand: Card[];
  resources: Resource;
  tempResources: Resource;
  coin: Gold;
  victoryPoints: VictoryPoints;
  science: Science;
  military: Shields;
  leftPlayer: Player;
  rightPlayer: Player;
}
