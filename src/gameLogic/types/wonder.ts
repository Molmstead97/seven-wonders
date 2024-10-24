import { Resource, Production } from "./resource";
import { Science } from "./resource"
import { SpecialEffect } from "./wonderSpecialEffects";
export interface WonderStage {
    stage: number;
    cost: Resource | number | null; // The number provides gold to player
    production?: Production;
    victoryPoints?: number;
    gold?: number;
    science?: Science;
    shields?: number;
    specialEffect?: SpecialEffect;
    isBuilt: boolean;
}

export interface Wonder {
    name: string;
    production: Production;
    wonderStages: WonderStage[];
}