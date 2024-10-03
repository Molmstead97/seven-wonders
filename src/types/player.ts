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
  coin: Gold;
  victoryPoints: VictoryPoints;
  science: Science;
  military: Shields;
  leftPlayer: Player | null;
  rightPlayer: Player | null;
}
