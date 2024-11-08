import { Player } from "../types/player";
import { Card } from "../types/card";
import { WonderStage } from "../types/wonder";
import { Resource } from "../types/resource";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function checkResources(
  player: Player,
  gameItem: Card | WonderStage
): boolean {
  if (gameItem.cost === null) {
    return true;
  }

  const cost = gameItem.cost;

  const getTotalResources = (player: Player, resourceType: keyof Resource): number => {
    return (player.resources[resourceType] || 0) + (player.tempResources[resourceType] || 0);
  };

  if (typeof cost === "object") {
    for (const [resource, amount] of Object.entries(cost)) {
      if (getTotalResources(player, resource as keyof Resource) < amount) {
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
