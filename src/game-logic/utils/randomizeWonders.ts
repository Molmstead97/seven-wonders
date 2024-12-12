import { Wonder } from "../../data/types/wonder";
import { wonders } from "../../data/wonders";

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function groupWondersByName(wonders: Wonder[]): Record<string, Wonder[]> {
  return wonders.reduce((groups, wonder) => {
    const baseName = wonder.name.replace(/ [AB]$/, "");
    return {
      ...groups,
      [baseName]: [...(groups[baseName] || []), wonder]
    };
  }, {} as Record<string, Wonder[]>);
}

export function randomizeWonders(numPlayers: number, selectedWonder?: Wonder): Wonder[] {
  if (numPlayers <= 0) {
    throw new Error("Number of players must be greater than 0");
  }

  const groupedWonders = groupWondersByName(wonders);

  if (selectedWonder) {
    const baseNameToExclude = selectedWonder.name.replace(/ [AB]$/, "");
    delete groupedWonders[baseNameToExclude];
  }

  // Select one wonder randomly from each group
  const availableWonders = Object.values(groupedWonders)
    .map(group => group[Math.floor(Math.random() * group.length)]);

  if (availableWonders.length < numPlayers) {
    throw new Error(`Not enough unique wonders available for ${numPlayers} players`);
  }

  return shuffleArray(availableWonders).slice(0, numPlayers);
}
