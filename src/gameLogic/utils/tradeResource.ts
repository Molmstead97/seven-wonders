import { Player } from "../types/player";
import { ResourceType } from "../types/resource";
import { TradeDiscountEffect } from "../types/wonderSpecialEffects";

export function tradeResource(player: Player, neighbor: Player, resourceType: ResourceType, amount: number): Player {
  let tradeCost = 2; // Default trade cost
  let canTrade = false;

  // Check for trade discount effects from wonders and cards
  const tradeEffects: TradeDiscountEffect[] = [
    ...player.wonder.wonderStages
      .filter(stage => stage.isBuilt && stage.specialEffect?.type === 'tradeDiscount')
      .map(stage => stage.specialEffect as TradeDiscountEffect),
    ...Array.from(player.playerBoard)
      .filter(card => card.specialEffect?.type === 'tradeDiscount')
      .map(card => card.specialEffect as TradeDiscountEffect)
  ];

  for (const effect of tradeEffects) {
    const neighborMatch = effect.neighbor === 'both' || 
      (effect.neighbor === 'left' && neighbor === player.leftPlayer) ||
      (effect.neighbor === 'right' && neighbor === player.rightPlayer);
    const resourceMatch = effect.resource.includes(resourceType) || effect.resource.includes('all' as ResourceType);
    
    if (neighborMatch && resourceMatch) { // TODO: This should probably be handled in the UI, such as greying out or hiding invalid options.
      canTrade = true;
      tradeCost = 1;
      break; // We can stop checking once we find a valid discount
    }
  }

  if (!canTrade) {
    console.log(`Trade not possible. No valid trade discount effect for this neighbor and resource.`);
    return player;
  }

  const totalCost = tradeCost * amount;

  // Check if the player has enough coins and the neighbor has enough resources
  if (player.gold >= totalCost && (neighbor.resources[resourceType] ?? 0) >= amount) {
    player.gold -= totalCost;
    
    // Temp resources are used since they can only be used the same turn they're acquired
    player.tempResources[resourceType] = (player.tempResources[resourceType] || 0) + amount;

    console.log(`${player.name} buys ${amount} ${resourceType} from ${neighbor.name} for ${totalCost} coins.`); // TODO: Replace with UI

    return player;
  } else {
    console.log(`Trade not possible. Either ${player.name} doesn't have enough coins or ${neighbor.name} doesn't have enough ${resourceType}.`); // TODO: Replace with UI. 
    return player;
  }
}
