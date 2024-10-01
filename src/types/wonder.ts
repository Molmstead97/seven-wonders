import { Resource, Production } from "./resource";
import { Gold, Science, VictoryPoints } from "./resource"

export interface WonderStage {
    stage: number;
    cost: Resource | Gold | null
    production?: Production;
    victoryPoints?: VictoryPoints;
    gold?: Gold;
    science?: Science
}

export interface Wonder {
    name: string;
    production: Production;
    wonderStages: WonderStage[];
}