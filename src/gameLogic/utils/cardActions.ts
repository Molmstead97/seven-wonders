import { Player } from "../types/player";
import { Card } from "../types/card";
import { Production, ResourceType, ScienceType } from "../types/resource";
import { checkResources } from "./resourceCheck";
import { GameState } from "../gameState";
import { applyGoldVictoryBonus } from "../types/cardSpecialEffects";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function playCard(player: Player, card: Card) {
  const updatedPlayer = { ...player };
  
  // Check if the player already has a card with the same name on their board
  if (Array.from(updatedPlayer.playerBoard).some(boardCard => boardCard.name === card.name)) {
    alert("You cannot play a card with the same name as a card already on your board"); // TODO: Replace with UI
    return updatedPlayer; // Return the player without modifying their hand or board
  }

  // Check if the player has enough resources to play the card
  if (checkResources(player, card)) {
    updatedPlayer.playerBoard = new Set([...updatedPlayer.playerBoard, card]);
    applyCardEffects(updatedPlayer, card);
    if (typeof card.cost === "number") {
      updatedPlayer.gold -= card.cost;
    }

    const index = updatedPlayer.playerHand.indexOf(card);
    if (index > -1) {
      updatedPlayer.playerHand = [
        ...updatedPlayer.playerHand.slice(0, index),
        ...updatedPlayer.playerHand.slice(index + 1),
      ];
    }

    // Log the card played and updated resources
    console.log(`Played card: ${card.name}`);
    console.log(`Updated resources:`, updatedPlayer.resources);
  } else {
    alert("Not enough resources to play this card"); // TODO: Replace with UI
    return updatedPlayer; // Return the player without modifying their hand
  }

  return updatedPlayer;
}

export function discardCard(player: Player, card: Card, gameState: GameState) {
  const updatedPlayer = { ...player };
  const updatedGameState = { ...gameState };
  
  const index = updatedPlayer.playerHand.indexOf(card);
  if (index > -1) {
    updatedPlayer.playerHand = [
      ...updatedPlayer.playerHand.slice(0, index),
      ...updatedPlayer.playerHand.slice(index + 1),
    ];
    updatedPlayer.gold += 3;
    updatedGameState.discardPile = [...updatedGameState.discardPile, card];
  }
  
  return { player: updatedPlayer, gameState: updatedGameState };
}

function applyCardEffects(player: Player, card: Card) {
  // Apply resource production
  if (card.production) {
    applyProduction(player, card.production);
  }

  // Apply victory points
  if (card.victoryPoints) {
    player.victoryPoints += card.victoryPoints;
  }

  // Apply gold
  if (card.gold) {
    player.gold += card.gold;
  }

  // Apply science
  if (card.science) {
    Object.entries(card.science).forEach(([resource, amount]) => {
      if (amount !== undefined) {
        player.science[resource as ScienceType] =
          (player.science[resource as ScienceType] || 0) + amount;
      }
    });
  }

  // Apply shields
  if (card.shields) {
    player.shields += card.shields;
  }

  if (card.specialEffect && card.specialEffect.type === "goldVictoryBonus") {
    applyGoldVictoryBonus(player, card.specialEffect);
  }
}

function applyProduction(player: Player, production: Production) {
  // Handle resource production based on card effects
  Object.entries(production).forEach(([resource, amount]) => {
    if (amount !== undefined) {
      player.resources[resource as ResourceType] =
        (player.resources[resource as ResourceType] || 0) + amount;
    }
  });
}
