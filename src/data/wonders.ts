import { Wonder } from "../types/wonder";

// TODO: Add special effects to wonders

export const wonders: Wonder[] = [
  {
    name: "Alexandria A",
    production: { Glass: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 2 },
        victoryPoints: { victoryPoints: 3 },
      },
      {
        stage: 2,
        cost: { Ore: 2 },
        production: {
          type: "option",
          options: [
            { resource: "Clay", amount: 1 },
            { resource: "Ore", amount: 1 },
            { resource: "Wood", amount: 1 },
            { resource: "Stone", amount: 1 },
          ],
        },
      },
      {
        stage: 3,
        cost: { Glass: 2 },
        victoryPoints: { victoryPoints: 7 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Alexandria B",
    production: { Glass: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Clay: 2 },
        production: {
          type: "option",
          options: [
            { resource: "Wood", amount: 1 },
            { resource: "Stone", amount: 1 },
            { resource: "Ore", amount: 1 },
            { resource: "Clay", amount: 1 },
          ],
        },
      },
      {
        stage: 2,
        cost: { Wood: 2 },
        production: {
          type: "option",
          options: [
            { resource: "Glass", amount: 1 },
            { resource: "Cloth", amount: 1 },
            { resource: "Papyrus", amount: 1 },
          ],
        },
      },
      {
        stage: 3,
        cost: { Stone: 3 },
        victoryPoints: { victoryPoints: 7 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Babylon A",
    production: { Clay: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Clay: 2 },
        victoryPoints: { victoryPoints: 3 },
      },
      {
        stage: 2,
        cost: { Wood: 3 },
      },
      {
        stage: 3,
        cost: { Clay: 4 },
        victoryPoints: { victoryPoints: 7 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Babylon B",
    production: { Clay: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: {
          Cloth: 1,
          Clay: 1,
        },
        victoryPoints: { victoryPoints: 3 },
      },
      {
        stage: 2,
        cost: {
          Glass: 1,
          Wood: 2,
        },
      },
      {
        stage: 3,
        cost: {
          Papyrus: 1,
          Clay: 3,
        },
      },
    ],
    builtStages: [],
  },
  {
    name: "Éphesos A",
    production: { Papyrus: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 2 },
        victoryPoints: { victoryPoints: 3 },
      },
      {
        stage: 2,
        cost: { Wood: 2 },
        gold: { gold: 9 },
      },
      {
        stage: 3,
        cost: { Papyrus: 2 },
        victoryPoints: { victoryPoints: 7 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Éphesos B",
    production: { Papyrus: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 2 },
        victoryPoints: { victoryPoints: 2 },
        gold: { gold: 4 },
      },
      {
        stage: 2,
        cost: { Wood: 2 },
        victoryPoints: { victoryPoints: 3 },
        gold: { gold: 4 },
      },
      {
        stage: 3,
        cost: {
          Papyrus: 1,
          Cloth: 1,
          Glass: 1,
        },
        victoryPoints: { victoryPoints: 5 },
        gold: { gold: 4 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Gizah A",
    production: { Stone: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 2 },
        victoryPoints: { victoryPoints: 3 },
      },
      {
        stage: 2,
        cost: { Wood: 3 },
        victoryPoints: { victoryPoints: 5 },
      },
      {
        stage: 3,
        cost: { Stone: 4 },
        victoryPoints: { victoryPoints: 7 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Gizah B",
    production: { Stone: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Wood: 2 },
        victoryPoints: { victoryPoints: 3 },
      },
      {
        stage: 2,
        cost: { Stone: 3 },
        victoryPoints: { victoryPoints: 5 },
      },
      {
        stage: 3,
        cost: { Clay: 3 },
        victoryPoints: { victoryPoints: 5 },
      },
      {
        stage: 4,
        cost: { Papyrus: 1, Stone: 4 },
        victoryPoints: { victoryPoints: 7 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Halikarnassós A",
    production: { Cloth: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Clay: 2 },
        victoryPoints: { victoryPoints: 3 },
      },
      {
        stage: 2,
        cost: { Ore: 3 },
        /* Add special effect here */
      },
      {
        stage: 3,
        cost: { Cloth: 2 },
        victoryPoints: { victoryPoints: 7 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Halikarnassós B",
    production: { Cloth: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Ore: 2 },
        victoryPoints: { victoryPoints: 2 },
        /* Add special effect here */
      },
      {
        stage: 2,
        cost: { Clay: 3 },
        victoryPoints: { victoryPoints: 1 },
        /* Add special effect here */
      },
      {
        stage: 3,
        cost: { Glass: 1, Papyrus: 1, Cloth: 1 },
        /* Add special effect here */
      },
    ],
    builtStages: [],
  },
  {
    name: "Olympía A",
    production: { Wood: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Wood: 2 },
        victoryPoints: { victoryPoints: 3 },
      },
      {
        stage: 2,
        cost: { Stone: 2 },
        /* Add special effect here */
      },
      {
        stage: 3,
        cost: { Ore: 2 },
        victoryPoints: { victoryPoints: 7 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Olympía B",
    production: { Wood: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Wood: 2 },
        /* Add special effect here */
      },
      {
        stage: 2,
        cost: { Stone: 2 },
        victoryPoints: { victoryPoints: 5 },
      },
      {
        stage: 3,
        cost: { Cloth: 1, Ore: 2 },
        /* Add special effect here */
      },
    ],
    builtStages: [],
  },
  {
    name: "Rhódos A",
    production: { Ore: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Wood: 2 },
        victoryPoints: { victoryPoints: 3 },
      },
      {
        stage: 2,
        cost: { Clay: 3 },
        shields: { shields: 2 },
      },
      {
        stage: 3,
        cost: { Ore: 4 },
        victoryPoints: { victoryPoints: 7 },
      },
    ],
    builtStages: [],
  },
  {
    name: "Rhódos B",
    production: { Ore: 1 },
    wonderStages: [
      {
        stage: 1,
        cost: { Stone: 3 },
        victoryPoints: { victoryPoints: 3 },
        gold: { gold: 3 },
        shields: { shields: 1 },
      },
      {
        stage: 2,
        cost: { Ore: 4 },
        victoryPoints: { victoryPoints: 4 },
        gold: { gold: 4 },
        shields: { shields: 1 },
      },
    ],
    builtStages: [],
  },
];
