import { Player } from "./types/player";
import { Card } from "./types/card";
import { setupPlayers } from "./utils/setupPlayers";
import { dealCards } from "./utils/dealCards";
import {
  handleBuildWonder,
  handleCardPlay,
  handleDiscardCard,
  handleEndGame,
  handlePassHand,
} from "./gameActions";
import { handleAgeEnd } from "./gameActions";
import { Wonder } from "./types/wonder";
import { lastTwoCards } from "./utils/passHand";
import { tradeResource } from "./utils/tradeResource";
import { ResourceType } from "./types/resource";
import { checkResources } from "./utils/resourceCheck";
export interface GameState {
  age: number;
  players: Player[];
  discardPile: Card[];
  // ... other game state properties
}

interface PlayerAction {
  type: "playCard" | "discardCard" | "buildWonder";
  playerId: number;
  cardIndex?: number;
  wonder?: Wonder;
  card?: Card;
}

function initializeGame(): GameState {
  const players = setupPlayers();

  const dealtCards = dealCards(players.length, 1);

  players.forEach((player, index) => {
    player.playerHand = dealtCards.slice(index * 7, (index + 1) * 7);
    console.log(`Player ${player.name} has been dealt:`, player.playerHand.map(card => card.name));
  });

  return {
    age: 1,
    players,
    discardPile: [],
    // ... initialize other game state properties
  };
}

export function gameLoop(gameState: GameState): GameState {
  gameState = initializeGame();

  while (gameState.age < 4) {
    // All players select their actions simultaneously
    const playerActions = gameState.players.map((player) =>
      getPlayerAction(player)
    );

    displayPlayerState(gameState.players[0]);

    // Handle resource trading (doesn't count as an action)
    //gameState = handleAllTrades(gameState);

    // Execute all player actions simultaneously
    gameState = executePlayerActions(gameState, playerActions);

    // Pass hands
    gameState = handlePassHand(gameState);

    // Check if the age has ended
    if (gameState.players.every((player) => player.playerHand.length === 2)) {
      gameState.players = gameState.players.map((player) =>
        lastTwoCards(player, gameState)
      );
      gameState = handleAgeEnd(gameState);
    }
  }

  // Game is over, handle end game logic
  return handleEndGame(gameState);
}

function getPlayerAction(player: Player): PlayerAction {
  if (player.name === "User") {
    return getUserAction(player);
  }

  // Comment out AI decision-making for now
  /* const availableActions = getAvailableActions(player);
   const validActions = availableActions.filter(action => {
     if (action.type === "playCard" || action.type === "buildWonder") {
       const card = player.playerHand[action.cardIndex!];
       return checkResources(player, card);
     }
     return true;
   });
  const randomAction = validActions[Math.floor(Math.random() * validActions.length)];
  return randomAction;

  // Filter actions based on resource availability for AI
  const validActions = availableActions.filter((action) => {
    if (action.type === "playCard" || action.type === "buildWonder") {
      const card = player.playerHand[action.cardIndex!];
      return checkResources(player, card);
    }
    return true; // Discard action is always valid
  });

  // Log available actions for debugging
  console.log(`Valid actions for player ${player.name}:`, validActions);

  // Choose a random valid action
  const randomAction = validActions[Math.floor(Math.random() * validActions.length)];

  // Log the chosen action
  console.log(`Chosen action for player ${player.name}:`, randomAction);

  return randomAction;*/
  return { type: "discardCard", playerId: player.id, cardIndex: 0 };
}

function getUserAction(player: Player): PlayerAction {
  const availableActions = getAvailableActions(player);

  // Display available actions to the user
  console.log(`Available actions for you:`);
  availableActions.forEach((action, index) => {
    const cardName = player.playerHand[action.cardIndex!]?.name || "Unknown";
    console.log(`${index + 1}: ${action.type} - Card: ${cardName}`);
  });

  // Prompt user to select an action
  const choice = prompt("Enter the number of the action you want to take:");

  // Validate and return the chosen action
  const chosenIndex = Number(choice) - 1;
  if (chosenIndex >= 0 && chosenIndex < availableActions.length) {
    return availableActions[chosenIndex];
  } else {
    console.log("Invalid choice. Please try again.");
    return getUserAction(player); // Retry if invalid choice
  }
}

function getAvailableActions(player: Player): PlayerAction[] {
  const actions: PlayerAction[] = [];

  // Add 'playCard' action for each card in hand if resources are sufficient
  player.playerHand.forEach((card, index) => {
    if (checkResources(player, card)) {
      actions.push({ type: "playCard", playerId: player.id, cardIndex: index });
    }
  });

  // Add 'buildWonder' action if wonder stage is available and resources are sufficient
  const nextStage = player.wonder.wonderStages.find(stage => !stage.isBuilt);
  if (nextStage && checkResources(player, nextStage)) {
    actions.push({
      type: "buildWonder",
      playerId: player.id,
      wonder: player.wonder,
      card: player.playerHand[0], // Assuming first card in hand, adjust as needed
    });
  }

  // If no other actions are available, add 'discardCard' action
  if (actions.length === 0) {
    player.playerHand.forEach((_, index) => {
      actions.push({
        type: "discardCard",
        playerId: player.id,
        cardIndex: index,
      });
    });
  }

  return actions;
}

function executePlayerActions(
  gameState: GameState,
  playerActions: PlayerAction[]
): GameState {
  return playerActions.reduce((state, action) => {
    switch (action.type) {
      case "playCard":
        return handleCardPlay(state, action.playerId, action.cardIndex!);
      case "discardCard":
        return handleDiscardCard(state, action.playerId, action.cardIndex!);
      case "buildWonder":
        return handleBuildWonder(
          state,
          action.playerId,
          action.wonder!,
          action.card!
        );
      default:
        return state;
    }
  }, gameState);
}

//function handleAllTrades(gameState: GameState): GameState {} // TODO: Implement trading, will have to figure out AI decision making and everything so will do this much later

function displayPlayerState(player: Player) {
  console.log(`\nPlayer: ${player.name}`);
  console.log(`Gold: ${player.gold}`);
  console.log(`Resources:`, player.resources);
  console.log(`Wonder Stages:`);
  player.wonder.wonderStages.forEach((stage, index) => {
    console.log(`  Stage ${index + 1}: ${stage.isBuilt ? "Built" : "Not Built"}`);
  });
}
