import { Player } from "../../data/types/player";
import { Wonder, WonderStage } from "../../data/types/wonder";
import { Card } from "../../data/types/card";
import { Resource } from "../../data/types/resource";


import { checkResources } from "./resourceCheck";

import { GameState } from "../gameState";

import { copyGuildFunction, playSeventhCardFunction, SpecialEffect } from "../../data/types/wonderSpecialEffects";
import {
  cardFromDiscardFunction,
  freeBuildPerAgeFunction,
  freeScienceFunction,
} from "../../data/types/wonderSpecialEffects";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function buildWonder(
  player: Player,
  wonder: Wonder,
  card: Card,
  gameState: GameState
): { updatedPlayer: Player; hasProductionChoice: boolean; stageBuilt: WonderStage | null } {
  // First verify this is actually the player's wonder
  if (wonder.name !== player.wonder.name) {
    return { updatedPlayer: player, hasProductionChoice: false, stageBuilt: null };
  }

  let updatedPlayer = {
    ...player,
    resources: { ...player.resources },
    tempResources: { ...player.tempResources },
    playerHand: [...player.playerHand],
    playerBoard: new Set([...player.playerBoard]),
    wonder: {
      ...wonder,
      wonderStages: wonder.wonderStages.map((stage) => ({ ...stage })),
    }
  };

  const nextStageIndex = updatedPlayer.wonder.wonderStages.findIndex(
    (stage) => !stage.isBuilt
  );

  if (nextStageIndex === -1) {
    return { updatedPlayer: player, hasProductionChoice: false, stageBuilt: null };
  }

  const nextStage = updatedPlayer.wonder.wonderStages[nextStageIndex];
  const hasProductionChoice = Boolean(nextStage.production && 'choice' in nextStage.production);

  // Pass the player's temporary resources to checkResources
  if (!checkResources(updatedPlayer, null, nextStage, updatedPlayer.tempResources)) {
    console.log("Wonder build failed - Insufficient resources:", {
      required: nextStage.cost,
      playerResources: updatedPlayer.resources,
      playerTempResources: updatedPlayer.tempResources
    });
    return { 
      updatedPlayer: updatedPlayer,
      hasProductionChoice: false, 
      stageBuilt: null 
    };
  }

  updatedPlayer.wonder.wonderStages[nextStageIndex].isBuilt = true;

  // Apply the effects of the built stage
  if (nextStage.production) {
    Object.entries(nextStage.production).forEach(([resource, amount]) => {
      if (resource !== "choice") {
        const resourceKey = resource as keyof Resource;
        updatedPlayer.resources[resourceKey] = 
          (updatedPlayer.resources[resourceKey] || 0) + (amount as number);
      }
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

  // Remove the card used to build the wonder
  updatedPlayer.playerHand = updatedPlayer.playerHand.filter(c => c !== card);

  return { updatedPlayer, hasProductionChoice, stageBuilt: nextStage };
}
function applySpecialEffect(
  player: Player,
  effect: SpecialEffect,
  gameState: GameState,
  card: Card
): Player {
  switch (effect.type) {
    case "cardFromDiscard":
      return cardFromDiscardFunction(player);
    case "freeBuildPerAge":
      return freeBuildPerAgeFunction(player);
    case "freeScience":
      freeScienceFunction(player, 'wonder');
      return player;
    case "playSeventhCard":
      return playSeventhCardFunction(player);
    case "copyGuild":
      return copyGuildFunction(player);
    default:
      return player;
  }
}

