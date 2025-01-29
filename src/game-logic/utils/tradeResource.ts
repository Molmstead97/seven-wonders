import { Player } from "../../data/types/player";
import { ResourceType } from "../../data/types/resource";
import { TradeDiscountEffect } from "../../data/types/wonderSpecialEffects";

export function tradeResource(player: Player, neighbor: Player, resourceType: ResourceType, amount: number) {
  let tradeCost = 2;

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
      (effect.neighbor === 'left' && neighbor.id === player.leftPlayer?.id) ||
      (effect.neighbor === 'right' && neighbor.id === player.rightPlayer?.id);
    const resourceMatch = effect.resource.includes(resourceType) || effect.resource.includes('all' as ResourceType);
    
    if (neighborMatch && resourceMatch) {
      tradeCost = 1;
      break;
    }
  }

  const totalCost = tradeCost * amount;

  // Create new objects instead of modifying existing ones
  if (player.gold >= totalCost && (neighbor.resources[resourceType] ?? 0) >= amount) {
    const updatedPlayer = {
      ...player,
      gold: player.gold - totalCost,
      tempResources: {
        ...player.tempResources,
        [resourceType]: (player.tempResources[resourceType] || 0) + amount
      }
    };

    const updatedNeighbor = {
      ...neighbor,
      gold: neighbor.gold + totalCost
    };

    return { player: updatedPlayer, neighbor: updatedNeighbor, tradeCost };
  }

  // Return unmodified objects if trade can't be completed
  return { player, neighbor, tradeCost };
}
