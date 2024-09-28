import { Card } from "../types/card";

export const cards: Card[] = [
  {
    /* ALL BROWN CARDS */
    name: "Lumber Yard",
    description: "Produces 1 Wood per turn.",
    production: { Wood: 1 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 3, copies: 1 },
      { minPlayers: 4, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    color: "Brown",
  },

  {
    name: "Stone Pit",
    description: "Produces 1 Stone per turn.",
    production: { Stone: 1 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 4, copies: 1 },
      { minPlayers: 5, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    color: "Brown",
  },

  {
    name: "Clay Pool",
    description: "Produces 1 Clay per turn.",
    production: { Clay: 1 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 4, copies: 1 },
      { minPlayers: 5, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    color: "Brown",
  },

  {
    name: "Ore Vein",
    description: "Produces 1 Ore per turn.",
    production: { Ore: 1 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 3, copies: 1 },
      { minPlayers: 4, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    color: "Brown",
  },

  {
    name: "Tree Farm",
    description: "Produces 1 Wood or Clay per turn.",
    production: { Wood: 1, Clay: 1 },
    playerCount: [{ minPlayers: 6, maxPlayers: null, copies: 1 }],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 1,
    color: "Brown",
  },

  {
    name: "Excavation",
    description: "Produces 1 Stone or Clay per turn.",
    production: { Stone: 1, Clay: 1 },
    playerCount: [{ minPlayers: 4, maxPlayers: null, copies: 1 }],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 1,
    color: "Brown",
  },

  {
    name: "Clay Pit",
    description: "Produces 1 Clay or Ore per turn.",
    production: { Clay: 1, Ore: 1 },
    playerCount: [{ minPlayers: 3, maxPlayers: null, copies: 1 }],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 1,
    color: "Brown",
  },

  {
    name: "Timber Yard",
    description: "Produces 1 Stone or Wood per turn.",
    production: { Stone: 1, Wood: 1 },
    playerCount: [{ minPlayers: 3, maxPlayers: null, copies: 1 }],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 1,
    color: "Brown",
  },

  {
    name: "Forest Cave",
    description: "Produces 1 Wood or Ore per turn.",
    production: { Wood: 1, Ore: 1 },
    playerCount: [{ minPlayers: 5, maxPlayers: null, copies: 1 }],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 1,
    color: "Brown",
  },

  {
    name: "Mine",
    description: "Produces 1 Ore or Stone per turn.",
    production: { Ore: 1, Stone: 1 },
    playerCount: [{ minPlayers: 5, maxPlayers: null, copies: 1 }],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 1,
    color: "Brown",
  },

  {
    name: "Sawmill",
    description: "Produces 2 Wood per turn.",
    production: { Wood: 2 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 3, copies: 1 },
      { minPlayers: 4, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 2,
    color: "Brown",
  },

  {
    name: "Quarry",
    description: "Produces 2 Stone per turn.",
    production: { Stone: 2 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 3, copies: 1 },
      { minPlayers: 4, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 2,
    color: "Brown",
  },

  {
    name: "Brickyard",
    description: "Produces 2 Clay per turn.",
    production: { Clay: 2 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 3, copies: 1 },
      { minPlayers: 4, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 2,
    color: "Brown",
  },

  {
    name: "Foundry",
    description: "Produces 2 Ore per turn.",
    production: { Ore: 2 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 3, copies: 1 },
      { minPlayers: 4, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Gold: 1 },
    age: 2,
    color: "Brown",
  },

  /* ALL GRAY CARDS */

  {
    name: "Loom",
    description: "Produces 1 Cloth per turn.",
    production: { Cloth: 1 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 5, copies: 1 },
      { minPlayers: 6, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    color: "Grey",
    ageVariant: { age: 2, maxPlayers: 5 },
  },

  {
    name: "Glassworks",
    description: "Produces 1 Glass per turn.",
    production: { Glass: 1 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 5, copies: 1 },
      { minPlayers: 6, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    color: "Grey",
    ageVariant: { age: 2, maxPlayers: 5 },
  },

  {
    name: "Press",
    description: "Produces 1 Papyrus per turn.",
    production: { Papyrus: 1 },
    playerCount: [
      { minPlayers: 3, maxPlayers: 5, copies: 1 },
      { minPlayers: 6, maxPlayers: null, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    color: "Grey",
    ageVariant: { age: 2, maxPlayers: 5 },
  },
];
