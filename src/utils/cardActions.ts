import { Player } from "../types/player";
import { Card } from "../types/card";
import { Production, ResourceType, ScienceType } from "../types/resource";
import { checkResources } from "./resourceCheck";
import { GameState } from "../gameLogic/gameState";

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

    const index = updatedPlayer.playerHand.indexOf(card);
    if (index > -1) {
      updatedPlayer.playerHand = [
        ...updatedPlayer.playerHand.slice(0, index),
        ...updatedPlayer.playerHand.slice(index + 1),
      ];
    }
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
    updatedPlayer.gold.gold += 3;
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
    player.victoryPoints.victoryPoints += card.victoryPoints.victoryPoints;
  }

  // Apply gold
  if (card.gold) {
    player.gold.gold += card.gold.gold;
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
    player.military.shields += card.shields.shields;
  }

  //if (card.specialEffect) {
    // TODO: Apply special effects once I figure out what the heck to do. REMINDER that all these effects are applied at the end of the game
  //}
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
