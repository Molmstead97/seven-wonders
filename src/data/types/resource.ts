export type ResourceType =
  | "Wood"
  | "Stone"
  | "Ore"
  | "Clay"
  | "Glass"
  | "Papyrus"
  | "Textile";

export type Resource = {
  [K in ResourceType]?: number;
};

export type ResourceChoice = {
  options: ResourceType[];
  amount: number;
};

export type Production = Resource | { choice: ResourceChoice[] };

export type ScienceType = "Cog" | "Compass" | "Tablet";

export type Science = {
  Cog?: number;
  Compass?: number;
  Tablet?: number;
};
