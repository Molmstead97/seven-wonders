import { Player } from "../../data/types/player";
import { Wonder } from "../../data/types/wonder";
import { Card } from "../../data/types/card";
import { Resource } from "../../data/types/resource";


import { checkResources } from "./resourceCheck";

import { GameState } from "../gameState";

import { SpecialEffect } from "../../data/types/wonderSpecialEffects";
import {
  cardFromDiscardFunction,
  freeBuildPerAgeFunction,
} from "../../data/types/wonderSpecialEffects";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function buildWonder(
  player: Player,
  wonder: Wonder,
  card: Card,
  gameState: GameState
): { updatedPlayer: Player; hasProductionChoice: boolean } {
  let updatedPlayer = { ...player };
  const updatedWonder = {
    ...wonder,
    wonderStages: wonder.wonderStages.map((stage) => ({ ...stage })),
  };
  updatedPlayer.wonder = updatedWonder;

  const nextStageIndex = updatedWonder.wonderStages.findIndex(
    (stage) => stage.isBuilt === false
  );

  if (nextStageIndex === -1) {
    return { updatedPlayer, hasProductionChoice: false };
  }

  const nextStage = updatedWonder.wonderStages[nextStageIndex];
  
  // Check for production choices before building
  const hasProductionChoice = nextStage.production ? "choice" in nextStage.production : false;

  if (checkResources(player, null, nextStage)) {
    updatedWonder.wonderStages[nextStageIndex].isBuilt = true;

    // Apply the effects of the built stage
    if (nextStage.production) {
      Object.entries(nextStage.production).forEach(([resource, amount]) => {
        updatedPlayer.resources[resource as keyof Resource] =
          (updatedPlayer.resources[resource as keyof Resource] || 0) +
          (amount as number);
      });
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
  return { updatedPlayer, hasProductionChoice };
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
