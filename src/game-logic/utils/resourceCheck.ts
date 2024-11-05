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

  if (typeof cost === "object" && !Array.isArray(cost)) {
    for (const [resource, amount] of Object.entries(cost)) {
      const totalAvailable = (player.resources[resource as keyof Resource] || 0) + (player.tempResources[resource as keyof Resource] || 0);
      if (totalAvailable < amount) {
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
