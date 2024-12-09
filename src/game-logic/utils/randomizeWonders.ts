import { Wonder } from "../../data/types/wonder";

import { wonders } from "../../data/wonders";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sortKey: Math.random() })) // Assign random sort key
    .sort((a, b) => a.sortKey - b.sortKey) // Sort based on the key
    .map(({ value }) => value); // Return the shuffled values
}

// Function to group wonders by base name (without A/B suffix)
function groupWondersByName(wonders: Wonder[]): Record<string, Wonder[]> {
  return wonders.reduce((acc: Record<string, Wonder[]>, wonder) => {
    const baseName = wonder.name.replace(/ [AB]$/, '');  // Remove A or B suffix with space
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(wonder);
    return acc;
  }, {});
}

export function randomizeWonders(numPlayers: number, selectedWonder?: Wonder): Wonder[] {
  const groupedWonders = groupWondersByName(wonders);
  
  if (numPlayers <= 0) {
    throw new Error("Number of players must be greater than 0");
  }

  if (selectedWonder) {
    // Remove the chosen wonder's group from available wonders
    const baseName = selectedWonder.name.replace(/ [AB]$/, '');  // Remove A or B suffix
    delete groupedWonders[baseName];

    // Randomly select remaining wonders for AI players
    const remainingWonderGroups = Object.values(groupedWonders);
    const shuffledGroups = shuffleArray(remainingWonderGroups);
    const aiWonders = shuffledGroups
      .slice(0, numPlayers - 1)
      .map(group => group[Math.floor(Math.random() * group.length)]);

    return [selectedWonder, ...aiWonders];
  } else {
    // Randomly select wonders for all players
    const wonderGroups = Object.values(groupedWonders);
    const shuffledGroups = shuffleArray(wonderGroups);
    
    return shuffledGroups
      .slice(0, numPlayers)
      .map(group => group[Math.floor(Math.random() * group.length)]);
  }
}
