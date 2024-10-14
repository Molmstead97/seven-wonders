import { Player } from "./player";
import { ScienceType, ResourceType } from "./resource";
import { Card } from "./card";
import { GameState } from "../gameLogic/gameState";
import { checkResources } from "../utils/resourceCheck";
import { playCard } from "../utils/cardActions";
import { buildWonder } from "../utils/buildWonder";

export interface FreeScienceEffect {
  scienceType: ScienceType;
}

export interface CardFromDiscardEffect {
  freeCardFromDiscard: Card;
}

export interface FreeBuildPerAgeEffect {
  usedFreeBuild: Record<number, boolean>;
}

export interface PlaySeventhCardEffect {
  playedSeventhCard: boolean;
}

export interface CopyGuildEffect {
  guildCard: Card;
}

export interface TradeDiscountEffect {
  tradeDiscount: boolean;
}

export type SpecialEffect =
  | FreeScienceEffect
  | CardFromDiscardEffect
  | FreeBuildPerAgeEffect
  | PlaySeventhCardEffect
  | CopyGuildEffect
  | TradeDiscountEffect;

export function freeScienceFunction(
  player: Player & FreeScienceEffect,
  scienceType: ScienceType
) {
  // Have the player choose a scientific symbol to add to their score. Probably will import into gameEnd function
}

export function cardFromDiscardFunction(
  player: Player & CardFromDiscardEffect,
  discardPile: Card[]
) {
  // Check if the discard pile is not empty
  if (discardPile.length > 0) {
    let chosenCard: Card | null = null;

    // Prompt the player to choose a card from the discard pile until a valid card is selected
    while (chosenCard === null || player.playerBoard.has(chosenCard)) {
      chosenCard = discardChoicePrompt(player, discardPile);

      if (player.playerBoard.has(chosenCard)) {
        console.log("You already have this card. Please choose another card."); // TODO: Replace with UI
      }
    }

    player.playerBoard.add(chosenCard);

    const index = discardPile.indexOf(chosenCard);
    if (index !== -1) {
      discardPile.splice(index, 1);
    }

    player.freeCardFromDiscard = chosenCard;
  }
}

function discardChoicePrompt(player: Player, discardPile: Card[]): Card {
  // TODO: Implement this once I figure out the UI. For now, just return the first card in the discard pile
  return discardPile[0];
}

export function freeBuildPerAgeFunction(
  player: Player & FreeBuildPerAgeEffect,
  gameState: GameState,
  chosenCard: Card | null
) {
  const currentAge = gameState.age;

  if (!player.usedFreeBuild[currentAge]) {
    if (chosenCard) {
      player.playerBoard.add(chosenCard);

      player.usedFreeBuild[currentAge] = true;

      console.log(
        `Player ${player.name} built ${chosenCard.name} for free in Age ${currentAge}.`
      );
    }
  } else {
    console.log(
      `Player ${player.name} has already used the free build for Age ${currentAge}.`
    );
  }
}

export function playSeventhCardFunction(
  player: Player & PlaySeventhCardEffect,
  gameState: GameState,
  seventhCard: Card
) {
  const wonderStages = player.wonder.wonderStages;
  const currentStage = wonderStages.findIndex((stage) => !stage.isBuilt);

  const options = [
    { id: "play", label: "Play the card (pay its cost)" },
    { id: "discard", label: "Discard for 3 coins" },
  ]; // TODO: All of this should be handled in the UI, along with the promptPlayerChoice function.

  const choice = promptPlayerChoice(player, options);

  switch (choice) {
    case "play":
      if (checkResources(player, seventhCard)) {
        playCard(player, seventhCard);
        player.playedSeventhCard = true;
      } else {
        console.log("Player cannot afford to build this card.");
      }
      break;
    case "discard":
      player.gold.gold += 3;
      gameState.discardPile.push(seventhCard);
      player.playedSeventhCard = true;
      break;
    case "wonder":
      if (currentStage < wonderStages.length) {
        buildWonder(player, player.wonder, seventhCard, gameState);
        player.playedSeventhCard = true;
      } else {
        console.log("All Wonder stages are already built.");
      }
      break;
    default:
      console.log("Invalid choice. The seventh card will be discarded.");
      gameState.discardPile.push(seventhCard);
  }
}

// Helper functions (to be implemented elsewhere)
function promptPlayerChoice(
  player: Player,
  options: { id: string; label: string }[]
): string {
  // This should be implemented in the UI layer
  // For now, we'll just return the first option
  return options[0].id;
}

export function copyGuildFunction(
  player: Player & CopyGuildEffect,
  guildCard: Card
) {
  /* The choice of the Guild is made at the end of the game,
when counting points. The player totals the victory points as if they had
built that Guild. The player can copy a card from one of their neighbors on the left or right */
}

export function applyTradeDiscountEffect(player: Player) {
  player.hasTradeDiscount = true;
}
