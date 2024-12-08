import { Card } from "./types/card";

// TODO: Add the chaining, all cards are currently set to null
export const cards: Card[] = [
  {
    /* ALL BROWN CARDS */
    name: "Lumber Yard",
    description: "Produces 1 Wood per turn.",
    imagePath: "/images/card-images/brown/lumber-yard.jpg",
    production: { Wood: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Stone Pit",
    description: "Produces 1 Stone per turn.",
    imagePath: "/images/card-images/brown/stone-pit.jpg",
    production: { Stone: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Clay Pool",
    description: "Produces 1 Clay per turn.",
    imagePath: "/images/card-images/brown/clay-pool.jpg",
    production: { Clay: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Ore Vein",
    description: "Produces 1 Ore per turn.",
    imagePath: "/images/card-images/brown/ore-vein.jpg",
    production: { Ore: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Tree Farm",
    description: "Produces 1 Wood or Clay per turn.",
    imagePath: "/images/card-images/brown/tree-farm.jpg",
    production: {
      choice: [{ options: ["Wood", "Clay"], amount: 1 }],
    },

    playerCount: [{ minPlayers: 6, copies: 1 }],
    upgradeCard: null,
    cost: 1,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Excavation",
    description: "Produces 1 Stone or Clay per turn.",
    imagePath: "/images/card-images/brown/excavation.jpg",
    production: {
      choice: [{ options: ["Stone", "Clay"], amount: 1 }],
    },

    playerCount: [{ minPlayers: 4, copies: 1 }],
    upgradeCard: null,
    cost: 1,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Clay Pit",
    description: "Produces 1 Clay or Ore per turn.",
    imagePath: "/images/card-images/brown/clay-pit.jpg",
    production: {
      choice: [{ options: ["Clay", "Ore"], amount: 1 }],
    },

    playerCount: [{ minPlayers: 3, copies: 1 }],
    upgradeCard: null,
    cost: 1,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Timber Yard",
    description: "Produces 1 Stone or Wood per turn.",
    imagePath: "/images/card-images/brown/timber-yard.jpg",
    production: {
      choice: [{ options: ["Stone", "Wood"], amount: 1 }],
    },
    playerCount: [{ minPlayers: 3, copies: 1 }],
    upgradeCard: null,
    cost: 1,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Forest Cave",
    description: "Produces 1 Wood or Ore per turn.",
    imagePath: "/images/card-images/brown/forest-cave.jpg",
    production: {
      choice: [{ options: ["Wood", "Ore"], amount: 1 }],
    },

    playerCount: [{ minPlayers: 5, copies: 1 }],
    upgradeCard: null,
    cost: 1,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Mine",
    description: "Produces 1 Ore or Stone per turn.",
    imagePath: "/images/card-images/brown/mine.jpg",
    production: {
      choice: [{ options: ["Ore", "Stone"], amount: 1 }],
    },

    playerCount: [{ minPlayers: 6, copies: 1 }],
    upgradeCard: null,
    cost: 1,
    age: 1,
    cardColor: "Brown",
  },

  {
    name: "Sawmill",
    description: "Produces 2 Wood per turn.",
    imagePath: "../assets/card-images/brown/sawmill.png",
    production: { Wood: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: 1,
    age: 2,
    cardColor: "Brown",
  },

  {
    name: "Quarry",
    description: "Produces 2 Stone per turn.",
    imagePath: "../assets/card-images/brown/quarry.png",
    production: { Stone: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: 1,
    age: 2,
    cardColor: "Brown",
  },

  {
    name: "Brickyard",
    description: "Produces 2 Clay per turn.",
    imagePath: "../assets/card-images/brown/brickyard.png",
    production: { Clay: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: 1,
    age: 2,
    cardColor: "Brown",
  },

  {
    name: "Foundry",
    description: "Produces 2 Ore per turn.",
    imagePath: "../assets/card-images/brown/foundry.png",
    production: { Ore: 2 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: 1,
    age: 2,
    cardColor: "Brown",
  },

  /* ALL GREY CARDS */

  {
    name: "Loom",
    description: "Produces 1 Textile per turn.",
    imagePath: "/images/card-images/grey/loom.jpg",
    production: { Textile: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Grey",
  },

  // Copy for Age 2 since data is slightly different
  {
    name: "Loom",
    description: "Produces 1 Textile per turn.",
    imagePath: "/images/card-images/grey/loom.jpg",
    production: { Textile: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 2,
    cardColor: "Grey",
  },

  {
    name: "Glassworks",
    description: "Produces 1 Glass per turn.",
    imagePath: "/images/card-images/grey/glassworks.jpg",
    production: { Glass: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Grey",
  },

  // Copy for Age 2 since data is slightly different
  {
    name: "Glassworks",
    description: "Produces 1 Glass per turn.",
    imagePath: "/images/card-images/grey/glassworks.jpg",
    production: { Glass: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 2,
    cardColor: "Grey",
  },

  {
    name: "Press",
    description: "Produces 1 Papyrus per turn.",
    imagePath: "/images/card-images/grey/press.jpg",
    production: { Papyrus: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Grey",
  },

  // Copy for Age 2 since data is slightly different
  {
    name: "Press",
    description: "Produces 1 Papyrus per turn.",
    imagePath: "/images/card-images/grey/press.jpg",
    production: { Papyrus: 1 },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 2,
    cardColor: "Grey",
  },

  /* ALL BLUE CARDS */

  {
    name: "Pawnshop",
    description: "Grants 3 Victory Points upon acquisition.",
    imagePath: "/images/card-images/blue/pawnshop.jpg",
    victoryPoints: 3,
    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Blue",
  },

  {
    name: "Baths",
    description: "Grants 3 Victory Points upon acquisition.",
    imagePath: "/images/card-images/blue/baths.jpg",
    victoryPoints: 3,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: "Aqueduct",
    cost: { Stone: 1 },
    age: 1,
    cardColor: "Blue",
  },

  {
    name: "Altar",
    description: "Grants 2 Victory Points upon acquisition.",
    victoryPoints: 2,
    imagePath: "/images/card-images/blue/altar.jpg",
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: "Temple",
    cost: null,
    age: 1,
    cardColor: "Blue",
  },

  {
    name: "Theater",
    description: "Grants 2 Victory Points upon acquisition.",
    imagePath: "/images/card-images/blue/theater.jpg",
    victoryPoints: 2,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: "Statue",
    cost: null,
    age: 1,
    cardColor: "Blue",
  },

  {
    name: "Aqueduct",
    description: "Grants 5 Victory Points upon acquisition.",
    imagePath: "../assets/card-images/blue/aqueduct.png",
    victoryPoints: 5,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Stone: 3 },
    age: 2,
    cardColor: "Blue",
  },

  {
    name: "Temple",
    description: "Grants 3 Victory Points upon acquisition.",
    imagePath: "../assets/card-images/blue/temple.png",
    victoryPoints: 3,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: "Pantheon",
    cost: { Wood: 1, Clay: 1, Glass: 1 },
    age: 2,
    cardColor: "Blue",
  },

  {
    name: "Statue",
    description: "Grants 4 Victory Points upon acquisition.",
    imagePath: "../assets/card-images/blue/statue.png",
    victoryPoints: 4,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: "Gardens",
    cost: { Ore: 2, Wood: 1 },
    age: 2,
    cardColor: "Blue",
  },

  {
    name: "Courthouse",
    description: "Grants 4 Victory Points upon acquisition.",
    imagePath: "../assets/card-images/blue/courthouse.png",
    victoryPoints: 4,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Clay: 2, Textile: 1 },
    age: 2,
    cardColor: "Blue",
  },

  {
    name: "Pantheon",
    description: "Grants 7 Victory Points upon acquisition.",
    imagePath: "../assets/card-images/blue/pantheon.png",
    victoryPoints: 7,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Clay: 2, Ore: 1, Glass: 1, Textile: 1, Papyrus: 1 },
    age: 3,
    cardColor: "Blue",
  },

  {
    name: "Gardens",
    description: "Grants 5 Victory Points upon acquisition.",
    imagePath: "../assets/card-images/blue/gardens.png",
    victoryPoints: 5,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Clay: 2, Wood: 1 },
    age: 3,
    cardColor: "Blue",
  },

  {
    name: "Town Hall",
    description: "Grants 6 Victory Points upon acquisition.",
    imagePath: "../assets/card-images/blue/town-hall.png",
    victoryPoints: 6,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 6, copies: 3 },
    ],
    upgradeCard: null,
    cost: { Stone: 2, Ore: 1, Glass: 1 },
    age: 3,
    cardColor: "Blue",
  },

  {
    name: "Palace",
    description: "Grants 8 Victory Points upon acquisition.",
    imagePath: "../assets/card-images/blue/palace.png",
    victoryPoints: 8,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
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
    imagePath: "../assets/card-images/blue/senate.png",
    victoryPoints: 6,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Wood: 2, Ore: 1, Stone: 1 },
    age: 3,
    cardColor: "Blue",
  },

  /* ALL YELLOW CARDS */

  {
    name: "Tavern",
    description: "Grants 5 gold upon acquisition.",
    imagePath: "/images/card-images/yellow/tavern.jpg",
    gold: 5,

    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Yellow",
  },

  {
    name: "East Trading Post",
    description:
      "You may purchase raw materials from the neighboring city to your right for 1 coin instead of 2.",
    imagePath: "/images/card-images/yellow/east-trading-post.jpg",
    specialEffect: {
      type: "tradeDiscount",
      neighbor: "right",
      resource: ["Wood", "Stone", "Clay", "Ore"],
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Yellow",
  },

  {
    name: "West Trading Post",
    description:
      "You may purchase raw materials from the neighboring city to your left for 1 coin instead of 2.",
    imagePath: "/images/card-images/yellow/west-trading-post.jpg",
    specialEffect: {
      type: "tradeDiscount",
      neighbor: "left",
      resource: ["Wood", "Stone", "Clay", "Ore"],
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Yellow",
  },

  {
    name: "Marketplace",
    description:
      "You may purchase manufactured goods from either neighboring city for 1 coin instead of 2.",
    imagePath: "/images/card-images/yellow/marketplace.jpg",
    specialEffect: {
      type: "tradeDiscount",
      neighbor: "both",
      resource: ["Glass", "Textile", "Papyrus"],
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Yellow",
  },

  {
    name: "Forum",
    description: "Produces 1 manufactured good of your choice per turn.",
    imagePath: "../assets/card-images/yellow/forum.png",
    production: {
      choice: [{ options: ["Glass", "Textile", "Papyrus"], amount: 1 }],
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: null,
    cost: { Clay: 2 },
    age: 2,
    cardColor: "Yellow",
  },

  {
    name: "Caravansery",
    description: "Produces 1 raw material of your choice per turn.",
    imagePath: "../assets/card-images/yellow/caravansery.png",
    production: {
      choice: [{ options: ["Wood", "Ore", "Clay", "Stone"], amount: 1 }],
    },
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 6, copies: 3 },
    ],
    upgradeCard: null,
    cost: { Wood: 2 },
    age: 2,
    cardColor: "Yellow",
  },

  {
    name: "Vineyard",
    description:
      "Upon acquisition, grants gold per brown card built by you and neighboring cities.",
    imagePath: "../assets/card-images/yellow/vineyard.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Brown",
      gold: 1,
      scope: "all",
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 2,
    cardColor: "Yellow",
  },

  {
    name: "Bazaar",
    description:
      "Upon acquisition, grants 2 gold per grey card built by you and neighboring cities.",
    imagePath: "../assets/card-images/yellow/bazaar.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Grey",
      gold: 2,
      scope: "all",
    },

    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 2,
    cardColor: "Yellow",
  },

  {
    name: "Haven",
    description:
      "Upon acquisition, grants gold per brown card you've built. Worth 1 Victory Point per brown card you've built at the end of the game.",
    imagePath: "../assets/card-images/yellow/haven.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Brown",
      gold: 1,
      victoryPoints: 1,
      scope: "self",
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Ore: 1, Wood: 1, Textile: 1 },
    age: 3,
    cardColor: "Yellow",
  },

  {
    name: "Lighthouse",
    description:
      "Upon acquisition, grants gold per yellow card you've built. Worth 1 Victory Point per yellow card you've built at the end of the game.",
    imagePath: "../assets/card-images/yellow/lighthouse.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Yellow",
      gold: 1,
      victoryPoints: 1,
      scope: "self",
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Stone: 1, Glass: 1 },
    age: 3,
    cardColor: "Yellow",
  },

  {
    name: "Chamber of Commerce",
    description:
      "Upon acquisition, grants 2 gold per grey card you've built. Worth 2 Victory Points per grey card you've built at the end of the game.",
    imagePath: "../assets/card-images/yellow/chamber-of-commerce.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Grey",
      gold: 2,
      victoryPoints: 2,
      scope: "self",
    },

    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Clay: 2, Papyrus: 1 },
    age: 3,
    cardColor: "Yellow",
  },

  {
    name: "Arena",
    description:
      "Upon acquisition, grants 3 gold per Wonder stage you've constructed. Worth 1 Victory Point per Wonder stage you've constructed at the end of the game.",
    imagePath: "../assets/card-images/yellow/arena.png",
    specialEffect: {
      type: "goldVictoryBonus",
      gold: 3,
      victoryPoints: 1,
      scope: "self",
      name: "Arena",
    },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: null,
    cost: { Stone: 2, Ore: 1 },
    age: 3,
    cardColor: "Yellow",
  },

  /* ALL RED CARDS */

  {
    name: "Stockade",
    description: "Grants 1 Shield upon acquisition.",
    imagePath: "/images/card-images/red/stockade.jpg",
    shields: 1,
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Wood: 1 },
    age: 1,
    cardColor: "Red",
  },

  {
    name: "Barracks",
    description: "Grants 1 Shield upon acquisition.",
    imagePath: "/images/card-images/red/barracks.jpg",
    shields: 1,
    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Ore: 1 },
    age: 1,
    cardColor: "Red",
  },

  {
    name: "Guard Tower",
    description: "Grants 1 Shield upon acquisition.",
    imagePath: "/images/card-images/red/guard-tower.jpg",
    shields: 1,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Clay: 1 },
    age: 1,
    cardColor: "Red",
  },

  {
    name: "Walls",
    description: "Grants 2 Shields upon acquisition.",
    imagePath: "../assets/card-images/red/walls.png",
    shields: 2,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Stone: 3 },
    age: 2,
    cardColor: "Red",
  },

  {
    name: "Training Ground",
    description: "Grants 2 Shields upon acquisition.",
    imagePath: "../assets/card-images/red/training-ground.png",
    shields: 2,

    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 6, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: null,
    cost: { Ore: 2, Wood: 1 },
    age: 2,
    cardColor: "Red",
  },

  {
    name: "Stables",
    description: "Grants 2 Shields upon acquisition.",
    imagePath: "../assets/card-images/red/stables.png",
    shields: 2,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Ore: 1, Clay: 1, Wood: 1 },
    age: 2,
    cardColor: "Red",
  },

  {
    name: "Archery Range",
    description: "Grants 2 Shields upon acquisition.",
    imagePath: "../assets/card-images/red/archery-range.png",
    shields: 2,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Wood: 3 },
    age: 2,
    cardColor: "Red",
  },

  {
    name: "Fortifications",
    description: "Grants 3 Shields upon acquisition.",
    imagePath: "../assets/card-images/red/fortifications.png",
    shields: 3,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Ore: 3, Stone: 1 },
    age: 3,
    cardColor: "Red",
  },

  {
    name: "Circus",
    description: "Grants 3 Shields upon acquisition.",
    imagePath: "../assets/card-images/red/circus.png",
    shields: 3,

    playerCount: [
      { minPlayers: 4, copies: 1 },
      { minPlayers: 5, copies: 2 },
      { minPlayers: 6, copies: 3 },
    ],
    upgradeCard: null,
    cost: { Stone: 3, Ore: 1 },
    age: 3,
    cardColor: "Red",
  },

  {
    name: "Arsenal",
    description: "Grants 3 Shields upon acquisition.",
    imagePath: "../assets/card-images/red/arsenal.png",
    shields: 3,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
      { minPlayers: 7, copies: 3 },
    ],
    upgradeCard: null,
    cost: { Ore: 1, Wood: 2, Textile: 1 },
    age: 3,
    cardColor: "Red",
  },

  {
    name: "Siege Workshop",
    description: "Grants 3 Shields upon acquisition.",
    imagePath: "../assets/card-images/red/siege-workshop.png",
    shields: 3,

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Wood: 1, Clay: 3 },
    age: 3,
    cardColor: "Red",
  },

  /* ALL GREEN CARDS */

  {
    name: "Apothecary",
    description: "Grants 1 Compass upon acquisition.",
    imagePath: "/images/card-images/green/apothecary.jpg",
    science: { Compass: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Green",
  },

  {
    name: "Workshop",
    description: "Grants 1 Cog upon acquisition.",
    imagePath: "/images/card-images/green/workshop.jpg",
    science: { Cog: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Green",
  },

  {
    name: "Scriptorium",
    description: "Grants 1 Tablet upon acquisition.",
    imagePath: "/images/card-images/green/scriptorium.jpg",
    science: { Tablet: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: null,
    age: 1,
    cardColor: "Green",
  },

  {
    name: "Dispensary",
    description: "Grants 1 Compass upon acquisition.",
    imagePath: "../assets/card-images/green/dispensary.png",
    science: { Compass: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Ore: 2, Glass: 1 },
    age: 2,
    cardColor: "Green",
  },

  {
    name: "Library",
    description: "Grants 1 Tablet upon acquisition.",
    imagePath: "../assets/card-images/green/library.png",
    science: { Tablet: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Stone: 2, Textile: 1 },
    age: 2,
    cardColor: "Green",
  },

  {
    name: "School",
    description: "Grants 1 Tablet upon acquisition.",
    imagePath: "../assets/card-images/green/school.png",
    science: { Tablet: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Wood: 1, Papyrus: 1 },
    age: 2,
    cardColor: "Green",
  },

  {
    name: "Laboratory",
    description: "Grants 1 Cog upon acquisition.",
    imagePath: "../assets/card-images/green/laboratory.png",
    science: { Cog: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Clay: 2, Papyrus: 1 },
    age: 2,
    cardColor: "Green",
  },

  {
    name: "Lodge",
    description: "Grants 1 Compass upon acquisition.",
    imagePath: "../assets/card-images/green/lodge.png",
    science: { Compass: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 6, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Clay: 2, Textile: 1, Papyrus: 1 },
    age: 3,
    cardColor: "Green",
  },

  {
    name: "Observatory",
    description: "Grants 1 Cog upon acquisition.",
    imagePath: "../assets/card-images/green/observatory.png",
    science: { Cog: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Ore: 2, Glass: 1, Textile: 1 },
    age: 3,
    cardColor: "Green",
  },

  {
    name: "University",
    description: "Grants 1 Tablet upon acquisition.",
    imagePath: "../assets/card-images/green/university.png",
    science: { Tablet: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 4, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Wood: 2, Papyrus: 1, Glass: 1 },
    age: 3,
    cardColor: "Green",
  },
  {
    name: "Academy",
    description: "Grants 1 Compass upon acquisition.",
    imagePath: "../assets/card-images/green/academy.png",
    science: { Compass: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 7, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Stone: 3, Glass: 1 },
    age: 3,
    cardColor: "Green",
  },

  {
    name: "Study",
    description: "Grants 1 Cog upon acquisition.",
    imagePath: "../assets/card-images/green/study.png",
    science: { Cog: 1 },

    playerCount: [
      { minPlayers: 3, copies: 1 },
      { minPlayers: 5, copies: 2 },
    ],
    upgradeCard: null,
    cost: { Wood: 1, Papyrus: 1, Textile: 1 },
    age: 3,
    cardColor: "Green",
  },

  /* ALL PURPLE CARDS */

  {
    name: "Workers Guild",
    description:
      "Grants 1 Victory Point per brown card built in neighboring cities at the end of the game.",
    imagePath: "../assets/card-images/purple/workers-guild.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Brown",
      victoryPoints: 1,
      scope: "neighbors",
    },
    upgradeCard: null,
    cost: { Ore: 2, Clay: 1, Stone: 1, Wood: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Craftsmen Guild",
    description:
      "Grants 2 Victory Points per grey card built in neighboring cities at the end of the game.",
    imagePath: "../assets/card-images/purple/craftsmen-guild.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Grey",
      victoryPoints: 2,
      scope: "neighbors",
    },
    upgradeCard: null,
    cost: { Ore: 2, Stone: 2 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Traders Guild",
    description:
      "Grants 1 Victory Point per yellow card built in neighboring cities at the end of the game.",
    imagePath: "../assets/card-images/purple/traders-guild.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Yellow",
      victoryPoints: 1,
      scope: "neighbors",
    },
    upgradeCard: null,
    cost: { Textile: 1, Glass: 1, Papyrus: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Philosophers Guild",
    description:
      "Grants 1 Victory Point per green card built in neighboring cities at the end of the game.",
    imagePath: "../assets/card-images/purple/philosophers-guild.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Green",
      victoryPoints: 1,
      scope: "neighbors",
    },
    upgradeCard: null,
    cost: { Clay: 3, Textile: 1, Papyrus: 3 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Spy Guild",
    description:
      "Grants 1 Victory Point per red card built in neighboring cities at the end of the game.",
    imagePath: "../assets/card-images/purple/spy-guild.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Red",
      victoryPoints: 1,
      scope: "neighbors",
    },
    upgradeCard: null,
    cost: { Clay: 3, Glass: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Strategy Guild",
    description:
      "Grants 1 Victory Point for each conflict loss in neighboring cities at the end of the game.",
    imagePath: "../assets/card-images/purple/strategy-guild.png",
    specialEffect: {
      type: "goldVictoryBonus",
      victoryPoints: 1,
      scope: "neighbors",
      name: "Strategy Guild",
    },
    upgradeCard: null,
    cost: { Ore: 2, Stone: 1, Textile: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Shipowners Guild",
    description:
      "Grants 1 Victory Point for each brown, grey, and guild card you've built at the end of the game.",
    imagePath: "../assets/card-images/purple/shipowners-guild.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: ["Brown", "Grey", "Purple"],
      victoryPoints: 1,
      scope: "self",
    },
    upgradeCard: null,
    cost: { Wood: 3, Papyrus: 1, Glass: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Magistrates Guild",
    description:
      "Grants 1 Victory Point per blue card built by neighboring cities at the end of the game.",
    imagePath: "../assets/card-images/purple/magistrates-guild.png",
    specialEffect: {
      type: "goldVictoryBonus",
      cardColor: "Blue",
      victoryPoints: 1,
      scope: "neighbors",
    },
    upgradeCard: null,
    cost: { Wood: 3, Stone: 1, Textile: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Scientists Guild",
    description:
      "Grants either 1 Compass, Cog, or Tablet at the end of the game.",
    imagePath: "../assets/card-images/purple/scientists-guild.png",
    specialEffect: {
      type: "freeScience",
      scienceType: ["Compass", "Cog", "Tablet"],
    },
    upgradeCard: null,
    cost: { Wood: 2, Ore: 2, Papyrus: 1 },
    age: 3,
    cardColor: "Purple",
  },

  {
    name: "Builders Guild",
    description:
      "Grants 1 Victory Point per Wonder stage you and neighboring cities have constructed at the end of the game.",
    imagePath: "../assets/card-images/purple/builders-guild.png",
    specialEffect: {
      type: "goldVictoryBonus",
      victoryPoints: 1,
      scope: "all",
      name: "Builders Guild",
    },
    upgradeCard: null,
    cost: { Stone: 2, Clay: 2, Glass: 1 },
    age: 3,
    cardColor: "Purple",
  },
];
