import { Card } from "../types/card";

// TODO: Add special effects to cards

export const cards: Card[] = [
  {
    /* ALL BROWN CARDS */
    name: "Lumber Yard",
    description: "Produces 1 Wood per turn.",
    production: { Wood: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Stone Pit",
    description: "Produces 1 Stone per turn.",
    production: { Stone: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Clay Pool",
    description: "Produces 1 Clay per turn.",
    production: { Clay: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Ore Vein",
    description: "Produces 1 Ore per turn.",
    production: { Ore: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Tree Farm",
    description: "Produces 1 Wood or Clay per turn.",
    production: {
      resources: ["Wood", "Clay"],
    },

    playerCount: [{ minPlayers: 6, copies: 1 }],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Excavation",
    description: "Produces 1 Stone or Clay per turn.",
    production: {
      resources: ["Stone", "Clay"],
    },

    playerCount: [{ minPlayers: 4, copies: 1 }],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Clay Pit",
    description: "Produces 1 Clay or Ore per turn.",
    production: {
      resources: ["Clay", "Ore"],
    },

    playerCount: [{ minPlayers: 3, copies: 1 }],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Timber Yard",
    description: "Produces 1 Stone or Wood per turn.",
    production: {
      resources: ["Stone", "Wood"],
    },
    playerCount: [{ minPlayers: 3, copies: 1 }],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Forest Cave",
    description: "Produces 1 Wood or Ore per turn.",
    production: {
      resources: ["Wood", "Ore"],
    },

    playerCount: [{ minPlayers: 5, copies: 1 }],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Mine",
    description: "Produces 1 Ore or Stone per turn.",
    production: {
      resources: ["Ore", "Stone"],
    },

    playerCount: [{ minPlayers: 5, copies: 1 }],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Sawmill",
    description: "Produces 2 Wood per turn.",
    production: { Wood: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 2,
    cardColor: "Brown",
  },

  {
    name: "Quarry",
    description: "Produces 2 Stone per turn.",
    production: { Stone: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 2,
    cardColor: "Brown",
  },

  {
    name: "Brickyard",
    description: "Produces 2 Clay per turn.",
    production: { Clay: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 2,
    cardColor: "Brown",
  },

  {
    name: "Foundry",
    description: "Produces 2 Ore per turn.",
    production: { Ore: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: { gold: 1 },
    age: 2,
    cardColor: "Brown",
  },

  /* ALL GRAY CARDS */

  {
    name: "Loom",
    description: "Produces 1 Cloth per turn.",
    production: { Textile: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    cardColor: "Grey",
    ageVariant: { age: 2, maxPlayers: 5 },
  },

  {
    name: "Glassworks",
    description: "Produces 1 Glass per turn.",
    production: { Glass: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    cardColor: "Grey",
    ageVariant: { age: 2, maxPlayers: 5 },
  },

  {
    name: "Press",
    description: "Produces 1 Papyrus per turn.",
    production: { Papyrus: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    cardColor: "Grey",
    ageVariant: { age: 2, maxPlayers: 5 },
  },

  /* ALL BLUE CARDS */

  {
    name: "Pawnshop",
    description: "Grants 3 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 3 },
    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: true,
    cost: null,
    age: 1,
    cardColor: "Blue",
  },

  {
    name: "Baths",
    description: "Grants 3 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 3 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: true,
    cost: { Stone: 1 },
    age: 1,
    cardColor: "Blue",
  },

  {
    name: "Altar",
    description: "Grants 2 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: true,
    cost: null,
    age: 1,
    cardColor: "Blue",
  },

  {
    name: "Theater",
    description: "Grants 2 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 3 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: true,
    cost: null,
    age: 1,
    cardColor: "Blue",
  },

  {
    name: "Aqueduct",
    description: "Grants 5 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 5 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Stone: 3 },
    age: 2,
    cardColor: "Blue",
  },

  {
    name: "Temple",
    description: "Grants 3 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 3 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Wood: 1, Clay: 1, Glass: 1 },
    age: 2,
    cardColor: "Blue",
  },

  {
    name: "Statue",
    description: "Grants 4 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 4 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Ore: 2, Wood: 1 },
    age: 2,
    cardColor: "Blue",
  },

  {
    name: "Courthouse",
    description: "Grants 4 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 4 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Clay: 2, Textile: 1 },
    age: 2,
    cardColor: "Blue",
  },

  {
    name: "Pantheon",
    description: "Grants 7 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 7 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Clay: 2, Ore: 1, Glass: 1, Textile: 1, Papyrus: 1 },
    age: 3,
    cardColor: "Blue",
  },

  {
    name: "Gardens",
    description: "Grants 5 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 5 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Clay: 2, Wood: 1 },
    age: 3,
    cardColor: "Blue",
  },

  {
    name: "Town Hall",
    description: "Grants 6 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 6 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 6, copies: 3 },
    ],
    upgradeCard: false,
    cost: { Stone: 2, Ore: 1, Glass: 1 },
    age: 3,
    cardColor: "Blue",
  },

  {
    name: "Palace",
    description: "Grants 8 Victory Points upon acquisition.",
    victoryPoints: { victoryPoints: 8 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: false,
    cost: {
      Clay: 1,
      Stone: 1,
      Ore: 1,
      Wood: 1,
      Glass: 1,
      Textile: 1,
      Papyrus: 1,
    },
    age: 3,
    cardColor: "Blue",
  },

  {
    name: "Senate",
    description: "Grants 6 Victory Points upon acquisition.",

    victoryPoints: { victoryPoints: 6 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Wood: 2, Ore: 1, Stone: 1 },
    age: 3,
    cardColor: "Blue",
  },

  /* ALL YELLOW CARDS */

  {
    name: "Tavern",
    description: "Grants 5 gold upon acquisition.",
    gold: { gold: 5 },
    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: false,
    cost: null,
    age: 1,
    cardColor: "Yellow",
  },

  {
    name: "East Trading Post",
    description:
      "You may purchase raw materials from the neighboring city to your right for 1 coin instead of 2.",
    specialEffect: {
      type: "trade",
      neighbor: "right",
      resource: ["Wood", "Stone", "Clay", "Ore"],
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: true,
    cost: null,
    age: 1,
    cardColor: "Yellow",
  },

  {
    name: "West Trading Post",
    description:
      "You may purchase raw materials from the neighboring city to your left for 1 coin instead of 2.",
    specialEffect: {
      type: "trade",
      neighbor: "left",
      resource: ["Wood", "Stone", "Clay", "Ore"],
    },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: true,
    cost: null,
    age: 1,
    cardColor: "Yellow",
  },

  {
    name: "Marketplace",
    description:
      "You may purchase manufactured goods from either neighboring city for 1 coin instead of 2.",
    specialEffect: {
      type: "trade",
      neighbor: "both",
      resource: ["Glass", "Textile", "Papyrus"],
    },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: true,
    cost: null,
    age: 1,
    cardColor: "Yellow",
  },

  {
    name: "Forum",
    description: "Produces 1 Glass, Cloth, or Papyrus per turn.",
    production: {
      resources: ["Glass", "Textile", "Papyrus"],
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: true,
    cost: { Clay: 2 },
    age: 2,
    cardColor: "Yellow",
  },

  {
    name: "Caravansery",
    description: "Produces 1 Wood, Ore, Clay, or Stone per turn.",
    production: {
      resources: ["Wood", "Ore", "Clay", "Stone"],
    },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 6, copies: 3 },
    ],
    upgradeCard: true,
    cost: { Wood: 2 },
    age: 2,
    cardColor: "Yellow",
  },

  {
    name: "Vineyard",
    description:
      "Upon acquisition, grants gold per brown card built by you and neighboring cities.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Brown"],
      gold: { gold: 1 },
      scope: "all",
    },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 2,
    cardColor: "Yellow",
  },

  {
    name: "Vineyard",
    description:
      "Upon acquisition, grants gold per brown card built by you and neighboring cities.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Brown"],
      gold: { gold: 1 },
      scope: "all",
    },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 2,
    cardColor: "Yellow",
  },

  {
    name: "Bazaar",
    description:
      "Upon acquisition, grants 2 gold per grey card built by you and neighboring cities.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Grey"],
      gold: { gold: 2 },
      scope: "all",
    },
    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: false,
    cost: null,
    age: 2,
    cardColor: "Yellow",
  },

  {
    name: "Haven",
    description:
      "Upon acquisition, grants gold per brown card you've built. Worth 1 Victory Point per brown card you've built at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Brown"],
      gold: { gold: 1 },
      victoryPoints: { victoryPoints: 1 },
      scope: "self",
    },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Ore: 1, Wood: 1, Textile: 1 },
    age: 3,
    cardColor: "Yellow",
  },

  {
    name: "Lighthouse",
    description:
      "Upon acquisition, grants gold per yellow card you've built. Worth 1 Victory Point per yellow card you've built at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Yellow"],
      gold: { gold: 1 },
      victoryPoints: { victoryPoints: 1 },
      scope: "self",
    },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Stone: 1, Glass: 1 },
    age: 3,
    cardColor: "Yellow",
  },

  {
    name: "Chamber of Commerce",
    description:
      "Upon acquisition, grants 2 gold per grey card you've built. Worth 2 Victory Points per grey card you've built at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Grey"],
      gold: { gold: 2 },
      victoryPoints: { victoryPoints: 2 },
      scope: "self",
    },
    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Clay: 2, Papyrus: 1 },
    age: 3,
    cardColor: "Yellow",
  },

  {
    name: "Arena",
    description:
      "Upon acquisition, grants 3 gold per Wonder stage you've constructed. Worth 1 Victory Point per Wonder stage you've constructed at the end of the game.",
    // TODO: ADD THIS EFFECT LATER
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: false,
    cost: { Stone: 2, Ore: 1 },
    age: 3,
    cardColor: "Yellow",
  },

  /* ALL RED CARDS */

  {
    name: "Stockade",
    description: "Grants 1 Military upon acquisition.",
    shields: { shields: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Wood: 1 },
    age: 1,
    cardColor: "Red",
  },

  {
    name: "Barracks",
    description: "Grants 1 Military upon acquisition.",
    shields: { shields: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Ore: 1 },
    age: 1,
    cardColor: "Red",
  },

  {
    name: "Guard Tower",
    description: "Grants 1 Shield upon acquisition.",
    shields: { shields: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Clay: 1 },
    age: 1,
    cardColor: "Red",
  },

  {
    name: "Walls",
    description: "Grants 2 Shields upon acquisition.",
    shields: { shields: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: true,
    cost: { Stone: 3 },
    age: 2,
    cardColor: "Red",
  },

  {
    name: "Training Ground",
    description: "Grants 2 Shields upon acquisition.",
    shields: { shields: 2 },
    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 6, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: true,
    cost: { Ore: 2, Wood: 1 },
    age: 2,
    cardColor: "Red",
  },

  {
    name: "Stables",
    description: "Grants 2 Shields upon acquisition.",
    shields: { shields: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Ore: 1, Clay: 1, Wood: 1 },
    age: 2,
    cardColor: "Red",
  },

  {
    name: "Archery Range",
    description: "Grants 2 Shields upon acquisition.",
    shields: { shields: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Wood: 3 },
    age: 2,
    cardColor: "Red",
  },

  {
    name: "Fortifications",
    description: "Grants 3 Shields upon acquisition.",
    shields: { shields: 3 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Ore: 3, Stone: 1 },
    age: 3,
    cardColor: "Red",
  },

  {
    name: "Circus",
    description: "Grants 3 Shields upon acquisition.",
    shields: { shields: 3 },
    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 6, copies: 3 },
    ],
    upgradeCard: false,
    cost: { Stone: 3, Ore: 1 },
    age: 3,
    cardColor: "Red",
  },

  {
    name: "Arsenal",
    description: "Grants 3 Shields upon acquisition.",
    shields: { shields: 3 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: false,
    cost: { Ore: 1, Wood: 2, Textile: 1 },
    age: 3,
    cardColor: "Red",
  },

  {
    name: "Siege Workshop",
    description: "Grants 3 Shields upon acquisition.",
    shields: { shields: 3 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Wood: 1, Clay: 3 },
    age: 3,
    cardColor: "Red",
  },

  /* ALL GREEN CARDS */

  {
    name: "Apothecary",
    description: "Grants 1 Compass symbol upon acquisition.",
    science: { Compass: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: true,
    cost: null,
    age: 1,
    cardColor: "Green",
  },

  {
    name: "Workshop",
    description: "Grants 1 Cog symbol upon acquisition.",
    science: { Cog: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: true,
    cost: null,
    age: 1,
    cardColor: "Green",
  },

  {
    name: "Scriptorium",
    description: "Grants 1 Tablet symbol upon acquisition.",
    science: { Tablet: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: true,
    cost: null,
    age: 1,
    cardColor: "Green",
  },

  {
    name: "Dispensary",
    description: "Grants 1 Compass symbol upon acquisition.",
    science: { Compass: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: true,
    cost: { Ore: 2, Glass: 1 },
    age: 2,
    cardColor: "Green",
  },

  {
    name: "Library",
    description: "Grants 1 Tablet symbol upon acquisition.",
    science: { Tablet: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: true,
    cost: { Stone: 2, Textile: 1 },
    age: 2,
    cardColor: "Green",
  },

  {
    name: "School",
    description: "Grants 1 Tablet symbol upon acquisition.",
    science: { Tablet: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: true,
    cost: { Wood: 1, Papyrus: 1 },
    age: 2,
    cardColor: "Green",
  },

  {
    name: "Laboratory",
    description: "Grants 1 Cog symbol upon acquisition.",
    science: { Cog: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: true,
    cost: { Clay: 2, Papyrus: 1 },
    age: 2,
    cardColor: "Green",
  },

  {
    name: "Lodge",
    description: "Grants 1 Compass symbol upon acquisition.",
    science: { Compass: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Clay: 2, Textile: 1, Papyrus: 1 },
    age: 3,
    cardColor: "Green",
  },

  {
    name: "Observatory",
    description: "Grants 1 Cog symbol upon acquisition.",
    science: { Cog: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Ore: 2, Glass: 1, Textile: 1 },
    age: 3,
    cardColor: "Green",
  },

  {
    name: "University",
    description: "Grants 1 Tablet symbol upon acquisition.",
    science: { Tablet: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Wood: 2, Papyrus: 1, Glass: 1 },
    age: 3,
    cardColor: "Green",
  },
  {
    name: "Academy",
    description: "Grants 1 Compass symbol upon acquisition.",
    science: { Compass: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Stone: 3, Glass: 1 },
    age: 3,
    cardColor: "Green",
  },

  {
    name: "Study",
    description: "Grants 1 Cog symbol upon acquisition.",
    science: { Cog: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: false,
    cost: { Wood: 1, Papyrus: 1, Textile: 1 },
    age: 3,
    cardColor: "Green",
  },

  /* ALL PURPLE CARDS */

  {
    name: "Workers Guild",
    description:
      "Grants 1 Victory Point per brown card built in neighboring cities at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Brown"],
      victoryPoints: { victoryPoints: 1 },
      scope: "neighbors",
    },
    upgradeCard: false,
    cost: { Ore: 2, Clay: 1, Stone: 1, Wood: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Craftsmen Guild",
    description:
      "Grants 2 Victory Points per grey card built in neighboring cities at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Grey"],
      victoryPoints: { victoryPoints: 2 },
      scope: "neighbors",
    },
    upgradeCard: false,
    cost: { Ore: 2, Stone: 2 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Traders Guild",
    description:
      "Grants 1 Victory Point per yellow card built in neighboring cities at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Yellow"],
      victoryPoints: { victoryPoints: 1 },
      scope: "neighbors",
    },
    upgradeCard: false,
    cost: { Textile: 1, Glass: 1, Papyrus: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Philosophers Guild",
    description:
      "Grants 1 Victory Point per green card built in neighboring cities at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Green"],
      victoryPoints: { victoryPoints: 1 },
      scope: "neighbors",
    },
    upgradeCard: false,
    cost: { Clay: 3, Textile: 1, Papyrus: 3 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Spy Guild",
    description:
      "Grants 1 Victory Point per red card built in neighboring cities at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Red"],
      victoryPoints: { victoryPoints: 1 },
      scope: "neighbors",
    },
    upgradeCard: false,
    cost: { Clay: 3, Glass: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Strategy Guild",
    description:
      "Grants 1 Victory Point for each conflict loss in neighboring cities at the end of the game.",
    // TODO: Add this effect later
    upgradeCard: false,
    cost: { Ore: 2, Stone: 1, Textile: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Shipowners Guild",
    description:
      "Grants 1 Victory Point for each brown, grey, and guild card you've built at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Brown", "Grey", "Purple"],
      victoryPoints: { victoryPoints: 1 },
      scope: "self",
    },
    upgradeCard: false,
    cost: { Wood: 3, Papyrus: 1, Glass: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Magistrates Guild",
    description:
      "Grants 1 Victory Point per blue card built by neighboring cities at the end of the game.",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Blue"],
      victoryPoints: { victoryPoints: 1 },
      scope: "neighbors",
    },
    upgradeCard: false,
    cost: { Wood: 3, Stone: 1, Textile: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Scientists Guild",
    description:
      "Grants either 1 Compass, Cog, or Tablet at the end of the game.",
    specialEffect: { type: "science", symbol: ["Compass", "Cog", "Tablet"] },
    upgradeCard: false,
    cost: { Wood: 2, Ore: 2, Papyrus: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Builders Guild",
    description:
      "Grants 1 Victory Point per Wonder stage you and neighboring cities have constructed at the end of the game.",
    upgradeCard: false,
    cost: { Stone: 2, Clay: 2, Glass: 1 },
    age: 3,
    cardColor: "Purple",
  },
];
