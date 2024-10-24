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

export type ProductionChoice = {
  // This is used for cards that have multiple production options
  resources: ResourceType[];
};

export type Production = Resource | ProductionChoice;

export type ScienceType = "Cog" | "Compass" | "Tablet";

export type Science = {
  Cog?: number;
  Compass?: number;
  Tablet?: number;
};
