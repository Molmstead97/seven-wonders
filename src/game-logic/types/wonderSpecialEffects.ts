import { Player } from "./player";
import { ResourceType, ScienceType } from "./resource";
import { Card } from "./card";
import { GameState } from "../gameState";
import { applyGoldVictoryBonus, GoldVictoryBonus } from "./cardSpecialEffects";

export interface FreeScienceEffect {
  type: "freeScience";
  scienceType: ScienceType[];
}

export interface CardFromDiscardEffect {
  type: "cardFromDiscard";
}

export interface FreeBuildPerAgeEffect {
  type: "freeBuildPerAge";
}

export interface PlaySeventhCardEffect {
  type: "playSeventhCard";
}

export interface CopyGuildEffect {
  type: "copyGuild";
}

export interface TradeDiscountEffect {
  type: "tradeDiscount";
  neighbor: "left" | "right" | "both";
  resource: ResourceType[];
}

export type SpecialEffect =
  | FreeScienceEffect
  | CardFromDiscardEffect
  | FreeBuildPerAgeEffect
  | PlaySeventhCardEffect
  | CopyGuildEffect
  | TradeDiscountEffect;

export function freeScienceFunction(
  player: Player,
  scienceTypes: ScienceType[]
) {
  // Prompt the player to choose a science type
  const chosenScienceType = promptScienceChoice(player, scienceTypes);

  // Increment the player's science score for the chosen type
  player.science[chosenScienceType] =
    (player.science[chosenScienceType] || 0) + 1;

  console.log(
    `Player ${player.name} chose the ${chosenScienceType} science type.`
  );
}

function promptScienceChoice(
  player: Player,
  scienceTypes: ScienceType[]
): ScienceType {
  // TODO: Implement this in the UI layer, likely create a new file for this.
  // For now, we'll just return the first science type in the array
  return scienceTypes[0];
}

export function cardFromDiscardFunction(player: Player, gameState: GameState) {
  // Counts the number of stages that were previously built, and then counts the number of stages that were built this age.
  // This makes sure that the player can't select more cards than the number of stages built this age.
  const previouslyBuiltStages = player.wonder.wonderStages.filter(
    (stage) => stage.isBuilt
  ).length;
  const stagesBuiltThisAge =
    player.wonder.wonderStages.filter((stage) => stage.isBuilt).length -
    previouslyBuiltStages;
  if (stagesBuiltThisAge > 0) {
    // TODO: Replace with UI prompt, for now, just receive the first card(s) in the discard pile
    const chosenCards = gameState.discardPile.slice(0, stagesBuiltThisAge);
    chosenCards.forEach((card) => {
      player.playerBoard.add(card);
    });
    gameState.discardPile.splice(0, stagesBuiltThisAge);
  }
  return player;
}

function discardChoicePrompt(player: Player, discardPile: Card[]): Card {
  // TODO: Implement this once I figure out the UI. For now, just return the first card in the discard pile. Likely create a new file for this.
  return discardPile[0];
}

export function freeBuildPerAgeFunction(
  player: Player,
  gameState: GameState,
  chosenCard: Card | null
) {
  const currentAge = gameState.age;

  if (!player.freeBuildPerAge) {
    player.freeBuildPerAge = {};
  }

  if (!player.freeBuildPerAge[currentAge]) {
    if (chosenCard) {
      player.playerBoard.add(chosenCard);
      player.freeBuildPerAge[currentAge] = true;
      console.log(
        `Player ${player.name} built ${chosenCard.name} for free in Age ${currentAge}.`
      );
    } else {
      console.log(
        `Player ${player.name} can build a free card in Age ${currentAge}.`
      );
    }
  } else {
    console.log(
      `Player ${player.name} has already used the free build for Age ${currentAge}.`
    );
  }
  return player;
}

export function copyGuildFunction( // TODO: A lot of this will need to be moved to the UI layer
  player: Player,
  leftNeighbor: Player,
  rightNeighbor: Player
) {
  // Prompt the player to choose a guild card from their left or right neighbor
  const neighborGuilds = [
    ...leftNeighbor.playerBoard,
    ...rightNeighbor.playerBoard,
  ].filter((card) => card.cardColor === "Purple");

  if (neighborGuilds.length === 0) {
    console.log("No guild cards available to copy.");
    return 0;
  }

  const guildOptions = neighborGuilds.map((card) => ({
    id: card.name,
    label: card.name,
  }));

  const chosenGuildName = promptPlayerChoice(player, guildOptions); // TODO: Implement player choice. Again, will probably need to create a new file for this.

  const guildCard = neighborGuilds.find(
    (card) => card.name === chosenGuildName
  )!;

  applyGoldVictoryBonus(
    player,
    guildCard.specialEffect as GoldVictoryBonus,
    true
  );
}
