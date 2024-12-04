import { Wonder } from "../game-logic/types/wonder";

// TODO: Add special effects to wonders
// TODO: MAKE SURE ALL ARE PNG NOT JPG

export const wonders: Wonder[] = [
  {
    name: "Alexandria A",
    imagePath: "/images/wonder-images/alexandriaA.png",
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
          choice: [
            { options: ["Clay", "Ore", "Wood", "Stone"], amount: 1 },
          ],
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
    imagePath: "/images/wonder-images/alexandriaB.jpg",
    production: { Glass: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Clay: 2 },
        production: {
          choice: [
            { options: ["Wood", "Stone", "Ore", "Clay"], amount: 1 },
          ],
        },
        isBuilt: false,
      },
      {
        stage: 2,
        cost: { Wood: 2 },
        production: {
          choice: [
            { options: ["Glass", "Textile", "Papyrus"], amount: 1 },
          ],
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
    imagePath: "/images/wonder-images/babylonA.png",
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
    imagePath: "/images/wonder-images/babylonB.png",
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
    imagePath: "/images/wonder-images/ephesosA.png",
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
    imagePath: "/images/wonder-images/ephesosB.png",
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
    imagePath: "/images/wonder-images/gizahA.png",
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
    imagePath: "/images/wonder-images/gizahB.png",
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
    imagePath: "/images/wonder-images/halikarnassosA.png",
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
    imagePath: "/images/wonder-images/halikarnassosB.png",
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
    imagePath: "/images/wonder-images/olympiaA.png",
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
    imagePath: "/images/wonder-images/olympiaB.png",
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
    imagePath: "/images/wonder-images/rhodosA.png",
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
    imagePath: "/images/wonder-images/rhodosB.png",
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
