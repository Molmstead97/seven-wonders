import { Player } from "../../data/types/player";
import { Card } from "../../data/types/card";
import { WonderStage } from "../../data/types/wonder";
import { Resource, ResourceType } from "../../data/types/resource";

export function checkResources(
  player: Player,
  card: Card | null,
  wonderStage: WonderStage | null,
  tempResources: Record<ResourceType, number> = {
    Wood: 0,
    Stone: 0,
    Ore: 0,
    Clay: 0,
    Glass: 0,
    Papyrus: 0,
    Textile: 0,
  }
): boolean {
  // Combine permanent and temporary resources
  const availableResources = { ...player.resources };
  Object.entries(tempResources).forEach(([resource, amount]) => {
    availableResources[resource as keyof Resource] = (availableResources[resource as keyof Resource] || 0) + amount;
  });

  const cost = card?.cost || wonderStage?.cost;

  if (cost === null || cost === undefined) {
    return true;
  }

  const getTotalResources = (resourceType: keyof Resource): number => {
    return availableResources[resourceType] || 0;
  };

  if (typeof cost === "object") {
    for (const [resource, amount] of Object.entries(cost)) {
      if (getTotalResources(resource as keyof Resource) < amount) {
        return false;
      }
    }
  } else if (typeof cost === "number") {
    if (player.gold < cost) {
      return false;
    }
  }

  return true;
}
