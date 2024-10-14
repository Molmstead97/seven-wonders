import { Player } from "../types/player";
import { ResourceType } from "../types/resource";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function tradeResource(player: Player, neighbor: Player, resourceType: ResourceType, amount: number): Player {
  const TRADE_COST = player.hasTradeEffect ? 1 : 2;
  const totalCost = TRADE_COST * amount;

  // Check if the player has enough coins and the neighbor has enough resources
  if (player.gold.gold >= totalCost && (neighbor.resources?.[resourceType] ?? 0) >= amount) {
    player.gold.gold -= totalCost;
    
    // Temp resources are used since they can only be used the same turn they're acquired. This leaves the player's resources providedd by structures/wonders unchanged.
    player.tempResources[resourceType] = (player.tempResources[resourceType] || 0) + amount;

    console.log(`${player.name} buys ${amount} ${resourceType} from ${neighbor.name} for ${totalCost} coins.`); // TODO: Replace with UI

    return player;
  } else {
    console.log(`Trade not possible. Either ${player.name} doesn't have enough coins or ${neighbor.name} doesn't have enough ${resourceType}.`);
    return player;
  }
}
