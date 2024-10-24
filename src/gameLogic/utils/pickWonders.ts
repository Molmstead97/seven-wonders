import { Wonder } from "../types/wonder";
import { wonders } from "../../data/wonders";


// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sortKey: Math.random() }))  // Assign random sort key
    .sort((a, b) => a.sortKey - b.sortKey)               // Sort based on the key
    .map(({ value }) => value);                          // Return the shuffled values
}

// Function to group wonders by base name (without A/B suffix)
function groupWondersByName(wonders: Wonder[]): Record<string, Wonder[]> {
  return wonders.reduce((acc: Record<string, Wonder[]>, wonder) => {
    const baseName = wonder.name.slice(0, -1);  // Remove the last character (A or B)
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(wonder);
    return acc;
  }, {});
}

export function pickWonders(numPlayers: number): Wonder[] {
  // Prompt user for choice
  const userChoice = prompt("Would you like to choose a wonder or randomize? (c/r)"); // TODO: Replace with UI

  // Group wonders by base name
  const groupedWonders = groupWondersByName(wonders);

  if (userChoice?.toLowerCase() === 'c') {
    // Display available wonders (unique base names)
    const wonderNames = Object.keys(groupedWonders).join(', ');
    const chosenWonderName = prompt(`Choose your wonder from the following: ${wonderNames}`);

    if (chosenWonderName == null) {
      throw new Error("Chosen wonder name cannot be null or undefined."); // TODO: Replace with UI
    }
    
    // Prompt for side selection
    const sideChoice = prompt("Choose side A or B (a/b)"); // TODO: Replace with UI
    const side = sideChoice?.toLowerCase() === 'b' ? 'B' : 'A';

    const chosenWonder = groupedWonders[chosenWonderName]?.[side === 'A' ? 0 : 1];
    if (!chosenWonder) {
      throw new Error("Invalid wonder choice."); // TODO: Replace with UI 
    }
    
    return [chosenWonder];
  } else {
    // Randomly select wonders based on base names
    const wonderGroups = Object.values(groupedWonders);
    const shuffledWonderGroups = shuffleArray(wonderGroups);

    // Pick one random side (A or B) from each group and limit to numPlayers
    const selectedWonders = shuffledWonderGroups
      .slice(0, numPlayers)
      .map(wonderGroup => shuffleArray(wonderGroup)[0]);  // Randomly pick either A or B

    return selectedWonders;
  }
}
