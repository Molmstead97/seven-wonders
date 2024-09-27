import { Card } from '../types/card';

export const cards: Card[] = [
  {
    name: "Lumber Yard",
    description: "Produces 1 Wood per turn.",
    resources: { Wood: 1 },
    minPlayers: 3,
    maxPlayers: 4,
    thirdCard: null,
    cost: null,
    age: 1
  },