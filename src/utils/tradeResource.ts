import { Player } from "../types/player";
import { ResourceType } from "../types/resource";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function tradeResource(player: Player, neighbor: Player, resourceType: ResourceType, amount: number): Player {
    const TRADE_COST = 2;
  
    // Check if the neighbor has enough of the resource to trade
    if (!neighbor.resources[resourceType] || neighbor.resources[resourceType]! < amount) {
      console.log(`${neighbor.name} doesn't have enough ${resourceType} to trade.`);
      return player; // No change to the player
    }
  
    // Calculate total trade cost
    const totalCost = amount * TRADE_COST;
  
    // Check if the player has enough coins
    if (player.coin.gold < totalCost) {
      console.log(`${player.name} doesn't have enough coins to trade`);
      return player; // Trade fails
    }
  
    // Deduct coins from the buying player
    player.coin.gold -= totalCost;
  
    // Log the trade (or update UI if needed)
    console.log(`${player.name} buys ${amount} ${resourceType} from ${neighbor.name} for ${totalCost} coins.`);
  
    // Temporarily make the resources available to the player for this round
    player.tempResources[resourceType] = (player.tempResources[resourceType] || 0) + amount;
  
    return player;
  }
  
