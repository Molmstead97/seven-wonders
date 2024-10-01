export type ResourceType = "Wood" | "Stone" | "Ore" | "Clay" | "Glass" | "Papyrus" | "Cloth";

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

