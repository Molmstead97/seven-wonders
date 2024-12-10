import { Player } from "../../data/types/player";
import { applyGoldVictoryBonus } from "../../data/types/cardSpecialEffects";
import { freeScienceFunction, copyGuildFunction, FreeScienceEffect } from "../../data/types/wonderSpecialEffects";
import { Science } from "../../data/types/resource";

export function gameEnd(players: Player[]): Player[] {
  console.log("=== CALCULATING FINAL POINTS ===");
  
  return players.map(player => {
    console.log(`Processing ${player.name}:`);
    
    const initialPoints = player.victoryPoints;
    
    // Apply victory points for remaining gold
    const goldPoints = Math.floor(player.gold / 3);
    player.victoryPoints += goldPoints;
    console.log(`Gold points: ${goldPoints} (from ${player.gold} gold)`);

    // Apply gold victory bonus from cards
    player.playerBoard.forEach(card => {
      if (card.specialEffect?.type === 'goldVictoryBonus') {
        console.log(`Processing gold victory bonus for ${card.name}`);
        const points = applyGoldVictoryBonus(player, card.specialEffect, true);
        console.log(`Added ${points} points from ${card.name}`);
      }
    });

    // Apply 'CopyGuildEffect'
    if (player.wonder.wonderStages.some(stage => stage.specialEffect?.type === 'copyGuild')) {
      console.log("Processing Copy Guild effect");
      copyGuildFunction(player, player.leftPlayer || player, player.rightPlayer || player);
    }

    console.log(`Total points change: ${player.victoryPoints - initialPoints}`);
    console.log(`Final victory points: ${player.victoryPoints}\n`);

    return player;
  });
}

export function calculateSciencePoints(science: Science): number {
  
  // Calculate points for each symbol type
  const cogPoints = (science.Cog ?? 0) ** 2;
  const compassPoints = (science.Compass ?? 0) ** 2;
  const tabletPoints = (science.Tablet ?? 0) ** 2;

  // Calculate sets of different symbols
  const sets = Math.min(science.Cog ?? 0, science.Compass ?? 0, science.Tablet ?? 0);
  const setPoints = sets * 7;

  return cogPoints + compassPoints + tabletPoints + setPoints;
}
