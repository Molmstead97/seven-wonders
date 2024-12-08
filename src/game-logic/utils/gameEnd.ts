import { Player } from "../../data/types/player";
import { applyGoldVictoryBonus } from "../../data/types/cardSpecialEffects";
import { freeScienceFunction, copyGuildFunction, FreeScienceEffect } from "../../data/types/wonderSpecialEffects";
import { Science } from "../../data/types/resource";

export function gameEnd(players: Player[]): Player[] {
  return players.map(player => {
    // Apply victory points for remaining gold
    player.victoryPoints += Math.floor(player.gold / 3);

    // Apply science points
    player.victoryPoints += calculateSciencePoints(player.science);

    // Apply 'CopyGuildEffect'
    if (player.wonder.wonderStages.some(stage => stage.specialEffect?.type === 'copyGuild')) {
      copyGuildFunction(player, player.leftPlayer || player, player.rightPlayer || player);
    }

    // Apply 'FreeScienceEffect'
    const freeScienceStage = player.wonder.wonderStages.find(stage => stage.specialEffect?.type === 'freeScience');
    if (freeScienceStage && freeScienceStage.specialEffect) {
      freeScienceFunction(player, (freeScienceStage.specialEffect as FreeScienceEffect).scienceType);
    }

    // Apply Gold Victory Bonus from cards
    player.playerBoard.forEach(card => {
      if (card.specialEffect && card.specialEffect.type === 'goldVictoryBonus') {
        applyGoldVictoryBonus(player, card.specialEffect, true);
      }
    });

    return player;
  });
}

function calculateSciencePoints(science: Science): number {
  
  // Calculate points for each symbol type
  const cogPoints = (science.Cog ?? 0) ** 2;
  const compassPoints = (science.Compass ?? 0) ** 2;
  const tabletPoints = (science.Tablet ?? 0) ** 2;

  // Calculate sets of different symbols
  const sets = Math.min(science.Cog ?? 0, science.Compass ?? 0, science.Tablet ?? 0);
  const setPoints = sets * 7;

  return cogPoints + compassPoints + tabletPoints + setPoints;
}
