import { Player } from "../types/player";
import { Wonder } from "../types/wonder";
import { Card } from "../types/card";
import { Resource } from "../types/resource";

import { checkResources } from "./resourceCheck";

import { GameState } from "../gameState";

import { SpecialEffect } from "../types/wonderSpecialEffects";
import {
  cardFromDiscardFunction,
  freeBuildPerAgeFunction,
} from "../types/wonderSpecialEffects";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function buildWonder(
  player: Player,
  wonder: Wonder,
  card: Card,
  gameState: GameState
): Player {
  let updatedPlayer = { ...player };
  const updatedWonder = { 
    ...wonder,
    wonderStages: wonder.wonderStages.map(stage => ({ ...stage }))
  };
  updatedPlayer.wonder = updatedWonder;

  // Find the next stage to be built
  const nextStageIndex = updatedWonder.wonderStages.findIndex(
    (stage) => stage.isBuilt === false
  );

  if (nextStageIndex === -1) {
    console.log("All Wonder stages have been built.");
    return updatedPlayer;
  }

  const nextStage = updatedWonder.wonderStages[nextStageIndex];

  if (checkResources(player, nextStage)) {
    updatedWonder.wonderStages[nextStageIndex].isBuilt = true;

    // Apply the effects of the built stage
    if (nextStage.production) {
      if (nextStage.production.choice) {
        // promptChoiceProduction(player, nextStage.production.choice);
      } else {
        Object.entries(nextStage.production).forEach(([resource, amount]) => {
          updatedPlayer.resources[resource as keyof Resource] =
            (updatedPlayer.resources[resource as keyof Resource] || 0) + (amount as number);
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
      updatedPlayer = applySpecialEffect(
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
): Player {
  switch (effect.type) {
    case "cardFromDiscard":
      return cardFromDiscardFunction(player, gameState);
    case "freeBuildPerAge":
      return freeBuildPerAgeFunction(player, gameState, card);
    default:
      return player;
  }
}
