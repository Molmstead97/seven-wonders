import { Player } from "../types/player";
import { Wonder } from "../types/wonder";
import { Card } from "../types/card";
import { checkResources } from "./resourceCheck";
import { GameState } from "../gameLogic/gameState";

import { freeScienceFunction, cardFromDiscardFunction, freeBuildPerAgeFunction, playSeventhCardFunction, tradeFunction, copyGuildFunction, FreeScienceEffect, CardFromDiscardEffect, FreeBuildPerAgeEffect, PlaySeventhCardEffect, TradeEffect, CopyGuildEffect } from "../types/wonderSpecialEffects";

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
    (stage) => stage.stage === updatedPlayer.wonder.builtStages.length + 1
  );

  // Check if the next stage exists and matches the card's age
  if (nextStage && checkResources(player, nextStage)) {
    // Add the next stage to the built stages
    updatedPlayer.wonder.builtStages.push(nextStage);

    // Apply the effects of the built stage
    if (nextStage.production) {
      // TODO: Apply production effects. Logic will be for handling the player choosing the production for the turn.
      // ...
    }
    if (nextStage.victoryPoints) {
      updatedPlayer.victoryPoints.victoryPoints +=
        nextStage.victoryPoints.victoryPoints;
    }
    if (nextStage.gold) {
      updatedPlayer.gold.gold += nextStage.gold.gold;
    }
    if (nextStage.science) {
      // ...
    }
    if (nextStage.shields) {
      updatedPlayer.military.shields += nextStage.shields.shields;
    }
    
    if (nextStage.specialEffect) {
      switch (true) {
        case 'scienceType' in nextStage.specialEffect:
          freeScienceFunction(player as Player & FreeScienceEffect, nextStage.specialEffect.scienceType);
          // Applied at the end of the game
          break;
        case 'freeCardFromDiscard' in nextStage.specialEffect:
          cardFromDiscardFunction(player as Player & CardFromDiscardEffect, gameState.discardPile);
          break;
        case 'usedFreeBuild' in nextStage.specialEffect:
          freeBuildPerAgeFunction(player as Player & FreeBuildPerAgeEffect, gameState, card);
          break;
        case 'playedSeventhCard' in nextStage.specialEffect:
          playSeventhCardFunction(player as Player & PlaySeventhCardEffect, gameState);
          break;
        case 'tradeResource' in nextStage.specialEffect:
          tradeFunction(player as Player & TradeEffect, nextStage.specialEffect.tradeResource);
          break;
        case 'guildCard' in nextStage.specialEffect:
          copyGuildFunction(player as Player & CopyGuildEffect, card);
          // Applied at the end of the game
          break;
      }
    }

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
