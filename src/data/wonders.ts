import { Wonder } from "../gameLogic/types/wonder";

// TODO: Add special effects to wonders

export const wonders: Wonder[] = [
  {
    name: "Alexandria A",
    production: { Glass: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 2 },
        victoryPoints: 3,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Ore: 2 },
        production: {
          resources: ["Clay", "Ore", "Wood", "Stone"],
        },
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Glass: 2 },
        victoryPoints: 7,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Alexandria B",
    production: { Glass: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Clay: 2 },
        production: {
          resources: ["Wood", "Stone", "Ore", "Clay"],
        },
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Wood: 2 },
        production: {
          resources: ["Glass", "Textile", "Papyrus"],
        },
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Glass: 2 },
        victoryPoints: 7,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Babylon A",
    production: { Clay: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Clay: 2 },
        victoryPoints: 3,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Wood: 3 },
        specialEffect: {
          type: "freeScience",
          scienceType: ["Cog", "Compass", "Tablet"],
        },
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Clay: 4 },
        victoryPoints: 7,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Babylon B",
    production: { Clay: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: {
          Textile: 1,
          Clay: 1,
        },
        victoryPoints: 3,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: {
          Glass: 1,
          Wood: 2,
        },
        specialEffect: { type: "playSeventhCard" },
        isBuilt: false,
      },
      {
        stage: 3,
        cost: {
          Papyrus: 1,
          Clay: 3,
        },
        isBuilt: false,
      },
    ],
  },
  {
    name: "Éphesos A",
    production: { Papyrus: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 2 },
        victoryPoints: 3,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Wood: 2 },
        gold: 9,
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Papyrus: 2 },
        victoryPoints: 7,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Éphesos B",
    production: { Papyrus: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 2 },
        victoryPoints: 2,
        gold: 4,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Wood: 2 },
        victoryPoints: 3,
        gold: 4,
        isBuilt: false,
      },
      {
        stage: 3,
        cost: {
          Papyrus: 1,
          Textile: 1,
          Glass: 1,
        },
        victoryPoints: 5,
        gold: 4,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Gizah A",
    production: { Stone: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 2 },
        victoryPoints: 3,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Wood: 3 },
        victoryPoints: 5,
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Stone: 4 },
        victoryPoints: 7,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Gizah B",
    production: { Stone: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Wood: 2 },
        victoryPoints: 3,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Stone: 3 },
        victoryPoints: 5,
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Clay: 3 },
        victoryPoints: 5,
        isBuilt: false,
      },
      {
        stage: 4,
        cost: { Papyrus: 1, Stone: 4 },
        victoryPoints: 7,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Halikarnassós A",
    production: { Textile: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Clay: 2 },
        victoryPoints: 3,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Ore: 3 },
        specialEffect: { type: "cardFromDiscard" },
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Textile: 2 },
        victoryPoints: 7,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Halikarnassós B",
    production: { Textile: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Ore: 2 },
        victoryPoints: 2,
        specialEffect: { type: "cardFromDiscard" },
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Clay: 3 },
        victoryPoints: 1,
        specialEffect: { type: "cardFromDiscard" },
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Glass: 1, Papyrus: 1, Textile: 1 },
        specialEffect: { type: "cardFromDiscard" },
        isBuilt: false,
      },
    ],
  },
  {
    name: "Olympía A",
    production: { Wood: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Wood: 2 },
        victoryPoints: 3,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Stone: 2 },
        specialEffect: { type: "freeBuildPerAge" },
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Ore: 2 },
        victoryPoints: 7,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Olympía B",
    production: { Wood: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Wood: 2 },
        specialEffect: {
          type: "tradeDiscount",
          neighbor: "both",
          resource: ["Wood", "Stone", "Clay", "Ore"],
        },
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Stone: 2 },
        victoryPoints: 5,
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Textile: 1, Ore: 2 },
        specialEffect: { type: "copyGuild" },
        isBuilt: false,
      },
    ],
  },
  {
    name: "Rhódos A",
    production: { Ore: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Wood: 2 },
        victoryPoints: 3,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Clay: 3 },
        shields: 2,
        isBuilt: false,
      },
      {
        stage: 3,
        cost: { Ore: 4 },
        victoryPoints: 7,
        isBuilt: false,
      },
    ],
  },
  {
    name: "Rhódos B",
    production: { Ore: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 3 },
        victoryPoints: 3,
        gold: 3,
        shields: 1,
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Ore: 4 },
        victoryPoints: 4,
        gold: 4,
        shields: 1,
        isBuilt: false,
      },
    ],
  },
];
