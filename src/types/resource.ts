export type ResourceType =
  | "Wood"
  | "Stone"
  | "Ore"
  | "Clay"
  | "Glass"
  | "Papyrus"
  | "Cloth";

export type ScienceType = "Cog" | "Compass" | "Tablet";

export type Gold = {
  gold: number;
};

export type VictoryPoints = {
  victoryPoints: number;
};

export type Science = {
  [K in ScienceType]?: number;
};

export type Shields = {
  shields: number;
};

export type Resource = {
  [K in ResourceType]?: number;
};

export interface ProductionChoice {
  resource: ResourceType;
  amount: number;
}

export type Production =
  | Resource
  | {
      type: "option";
      options: ProductionChoice[];
    };
