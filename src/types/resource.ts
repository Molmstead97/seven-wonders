// TODO: Change ResourceType to accept 'rawMaterials' and 'manufacturedGoods'. This will help condense the code so I don't need to list every resource when they're in the same category. Same for ProductionChoice.


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

export type ProductionChoice =  { // This is used for cards that have multiple production options
  resources: ResourceType[];
}

export type Production =
  | Resource
  | ProductionChoice;

export type ScienceType = "Cog" | "Compass" | "Tablet";

export type Science = {
  [K in ScienceType]?: number;
};

export type Gold = {
  gold: number;
};

export type VictoryPoints = {
  victoryPoints: number;
};

export type Shields = {
  shields: number;
};
