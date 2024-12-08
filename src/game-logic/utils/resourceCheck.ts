import { Player } from "../../data/types/player";
import { Card } from "../../data/types/card";
import { WonderStage } from "../../data/types/wonder";
import { Resource } from "../../data/types/resource";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function checkResources(
  player: Player,
  card: Card | null,
  wonderStage: WonderStage | null
): boolean {
  const cost = card?.cost || wonderStage?.cost;

  if (cost === null || cost === undefined) {
    return true;
  }

  const isDuplicate = card
    ? Array.from(player.playerBoard).some(
        (boardCard) => boardCard.name === card.name
      )
    : false;

  if (!isDuplicate) {
    const getTotalResources = (
      player: Player,
      resourceType: keyof Resource
    ): number => {
      return (
        (player.resources[resourceType] || 0) +
        (player.tempResources[resourceType] || 0)
      );
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
  return false;
}
