import { Player } from "../types/player";
import { Wonder } from "../types/wonder";
import { Card } from "../types/card";
import { checkResources } from "./resourceCheck";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function buildWonder(
  player: Player,
  wonder: Wonder,
  card: Card
): Player {
  const updatedPlayer = { ...player };

  // Find the next stage to be built
  const nextStage = wonder.wonderStages.find(
    (stage) => stage.stage === updatedPlayer.wonder.builtStages.length + 1
  );

  // Check if the next stage exists and matches the card's age
  if (nextStage && checkResources(player, nextStage)) {
    // Add the next stage to the built stages
    updatedPlayer.wonder.builtStages.push(nextStage);

    // Apply the effects of the built stage
    if (nextStage.production) {
      // TODO: Apply production effects, probably have use specialEffect for this
      // ...
    }
    if (nextStage.victoryPoints) {
      updatedPlayer.victoryPoints.victoryPoints +=
        nextStage.victoryPoints.victoryPoints;
    }
    if (nextStage.gold) {
      updatedPlayer.coin.gold += nextStage.gold.gold;
    }
    if (nextStage.science) {
      // TODO: Maybe do science scoring here instead of in ageEnd?
      // ...
    }
    if (nextStage.shields) {
      updatedPlayer.military.shields += nextStage.shields.shields;
    }
    
    //if (nextStage.specialEffect) {
      // TODO: Apply special effects, trying to decide if they should be split into 'wonderEffects'/'cardEffects'/'sharedEffects' or all in one file
    //}

    // Remove the card from the player's hand
    const index = updatedPlayer.playerHand.indexOf(card);
    if (index > -1) {
      updatedPlayer.playerHand = [
        ...updatedPlayer.playerHand.slice(0, index),
        ...updatedPlayer.playerHand.slice(index + 1),
      ];
    }
  } else {
    alert("Not enough resources to build this stage");
  }
  return updatedPlayer;
}
