import { Player } from "../types/player";
import { Wonder } from "../types/wonder";
import { Card } from "../types/card";
import { checkResources } from "./resourceCheck";
import { Resource } from "../types/resource";
import { GameState } from "../gameState";
import { SpecialEffect } from "../types/wonderSpecialEffects";
import {
  cardFromDiscardFunction,
  freeBuildPerAgeFunction,
  applySeventhCardEffect,
} from "../types/wonderSpecialEffects";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function buildWonder(
  player: Player,
  wonder: Wonder,
  card: Card,
  gameState: GameState
): Player {
  const updatedPlayer = { ...player };

  // Find the next stage to be built
  const nextStage = wonder.wonderStages.find(
    (stage) => stage.isBuilt === false
  );

  if (!nextStage) {
    console.log("All Wonder stages have been built.");
    return updatedPlayer;
  }

  if (checkResources(player, nextStage)) {
    nextStage.isBuilt = true;

    // Apply the effects of the built stage
    if (nextStage.production) {
      if (nextStage.production.choice) {
       // promptChoiceProduction(player, nextStage.production.choice); // TODO: Implement this
      } else {
        Object.entries(nextStage.production).forEach(([resource, amount]) => {
          player.resources[resource as keyof Resource] =
            (player.resources[resource as keyof Resource] || 0) + (amount as number);
        });
      }
    }
    if (nextStage.victoryPoints) {
      updatedPlayer.victoryPoints += nextStage.victoryPoints;
    }
    if (nextStage.gold) {
      updatedPlayer.gold += nextStage.gold;
    }
    if (nextStage.shields) {
      updatedPlayer.shields += nextStage.shields;
    }

    // Apply special effects
    if (nextStage.specialEffect) {
      applySpecialEffect(
        updatedPlayer,
        nextStage.specialEffect,
        gameState,
        card
      );
    }

    // Remove the card from the player's hand
    updatedPlayer.playerHand = updatedPlayer.playerHand.filter(
      (c) => c !== card
    );
  } else {
    console.log("Not enough resources to build this stage"); // TODO: Replace with UI
  }
  return updatedPlayer;
}

function applySpecialEffect(
  player: Player,
  effect: SpecialEffect,
  gameState: GameState,
  card: Card
) {
  switch (effect.type) {
    case "cardFromDiscard":
      cardFromDiscardFunction(player, gameState.discardPile);
      break;
    case "freeBuildPerAge":
      freeBuildPerAgeFunction(player, gameState, card);
      break;
    case "playSeventhCard":
      applySeventhCardEffect(player);
      break;
    // Both copyGuild and freeScience effects are applied at the end of the game, not when you build the card
  }
}
