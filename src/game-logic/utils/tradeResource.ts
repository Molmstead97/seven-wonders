import { Player } from "../../data/types/player";
import { ResourceType } from "../../data/types/resource";
import { TradeDiscountEffect } from "../../data/types/wonderSpecialEffects";

export function tradeResource(player: Player, neighbor: Player, resourceType: ResourceType, amount: number): { player: Player, neighbor: Player } {
  let tradeCost = 2; // Default trade cost

  // Check for trade discount effects from wonders and cards
  const tradeEffects: TradeDiscountEffect[] = [
    ...player.wonder.wonderStages
      .filter(stage => stage.isBuilt && stage.specialEffect?.type === 'tradeDiscount')
      .map(stage => stage.specialEffect as TradeDiscountEffect),
    ...Array.from(player.playerBoard)
      .filter(card => card.specialEffect?.type === 'tradeDiscount')
      .map(card => card.specialEffect as TradeDiscountEffect)
  ];

  // Apply trade discounts if available
  for (const effect of tradeEffects) {
    const neighborMatch = effect.neighbor === 'both' || 
      (effect.neighbor === 'left' && neighbor === player.leftPlayer) ||
      (effect.neighbor === 'right' && neighbor === player.rightPlayer);
    const resourceMatch = effect.resource.includes(resourceType) || effect.resource.includes('all' as ResourceType);
    
    if (neighborMatch && resourceMatch) {
      tradeCost = 1;
      break;
    }
  }

  const totalCost = tradeCost * amount;

  // Check if the player has enough coins and the neighbor has enough resources
  if (player.gold >= totalCost && (neighbor.resources[resourceType] ?? 0) >= amount) {
    // Update player's gold and resources
    player.gold -= totalCost;
    player.tempResources[resourceType] = (player.tempResources[resourceType] || 0) + amount;
    
    // Update neighbor's gold
    neighbor.gold += totalCost;

    return { player, neighbor };
  } else {
    console.log(`Trade not possible. Either ${player.name} doesn't have enough coins or ${neighbor.name} doesn't have enough ${resourceType}.`);
    return { player, neighbor };
  }
}
