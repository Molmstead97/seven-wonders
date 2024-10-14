import { Resource, Production } from "./resource";
import { Gold, Science, Shields, VictoryPoints } from "./resource"
import { SpecialEffect } from "./wonderSpecialEffects";
export interface WonderStage {
    stage: number;
    cost: Resource | Gold | null
    production?: Production;
    victoryPoints?: VictoryPoints;
    gold?: Gold;
    science?: Science;
    shields?: Shields;
    specialEffect?: SpecialEffect;
    isBuilt: boolean;
}

export interface Wonder {
    name: string;
    production: Production;
    wonderStages: WonderStage[];
}