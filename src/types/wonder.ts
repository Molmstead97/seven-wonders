import { Resource, Production } from "./resource";
import { Gold, Science, Shields, VictoryPoints } from "./resource"

export interface WonderStage {
    stage: number;
    cost: Resource | Gold | null
    production?: Production;
    victoryPoints?: VictoryPoints;
    gold?: Gold;
    science?: Science;
    shields?: Shields;
    //specialEffect?: SpecialEffect; // TODO: Figure out how the heck to do this
}

export interface Wonder {
    name: string;
    production: Production;
    wonderStages: WonderStage[];
    builtStages: WonderStage[];
}