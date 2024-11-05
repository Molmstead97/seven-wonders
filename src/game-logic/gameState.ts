import { Player } from "./types/player";
import { Card } from "./types/card";
import { Wonder } from "./types/wonder";
import { ResourceType, Resource } from "./types/resource";

import { setupPlayers } from "./utils/setupPlayers";
import { dealCards } from "./utils/dealCards";
import { ageEnd } from "./utils/ageEnd";
import { tradeResource } from "./utils/tradeResource";
import { checkResources } from "./utils/resourceCheck";

import {
  handleBuildWonder,
  handleCardPlay,
  handleDiscardCard,
  handleEndGame,
  handlePassHand,
} from "./gameActions";

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

  // Shuffle the dealt cards
  const shuffledCards = dealtCards.sort(() => Math.random() - 0.5);

  // Distribute 7 cards to each player
  players.forEach((player, index) => {
    player.playerHand = shuffledCards.slice(index * 7, (index + 1) * 7);
    console.log(
      `Player ${player.name} has been dealt:`,
      player.playerHand.map((card) => card.name)
    );
  });

  return {
    age: 1,
    players,
    discardPile: [],
    // ... initialize other game state properties
  };
}

export function gameLoop(gameState: GameState): GameState {
  gameState = initializeGame(); // TODO: Remember to move this out of the loop
  let turns = 0;
  const TURNS_PER_AGE = 6;

  while (gameState.age < 4) {
    turns += 1;

    // Regular turn actions (all turns including 6)
    gameState.players.forEach((player) => {
      addRandomResourceFromCards(player);
    });

    displayPlayerState(gameState.players[0]); // Only return the user

    const playerActions = gameState.players.map((player) =>
      getPlayerAction(player)
    );

    gameState = executePlayerActions(gameState, playerActions);

    gameState.players.forEach((player) => {
      player.tempResources = {};
    });

    // Pass hands (only for turns 1-5)
    if (turns < TURNS_PER_AGE) {
      gameState = handlePassHand(gameState);
    }

    // Handle Babylon B and end of age (turn 6)
    if (turns === TURNS_PER_AGE) {
      if (gameState.players.some((player) => player.wonder.name === "Babylon B")) {
        // Babylon B logic
      }

      // Handle end of age
      gameState.discardPile.push(
        ...gameState.players.flatMap((player) => player.playerHand)
      );

      gameState.players.forEach((player) => {
        player.playerHand = [];
      });

      gameState = ageEnd(gameState.players, gameState);
      dealCards(gameState.players.length, gameState.age);
      turns = 0;
    }
  }

  // Game is over, handle end game logic
  return handleEndGame(gameState);
}

// TODO: This is a function for TESTING PURPOSES ONLY, remove before finalizing
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

// TODO: This is a function for TESTING PURPOSES ONLY, remove before finalizing
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
    } else if (!checkResources(player, card)) {
      actions.push({
        type: "discardCard",
        playerId: player.id,
        cardIndex: index,
      });
    }
  });

  // Add 'buildWonder' action if wonder stage is available and resources are sufficient
  const nextStage = player.wonder.wonderStages.find((stage) => !stage.isBuilt);
  if (nextStage && checkResources(player, nextStage)) {
    actions.push({
      type: "buildWonder",
      playerId: player.id,
      wonder: player.wonder,
      card: player.playerHand[0], // Assuming first card in hand, adjust as needed
    });
  }

  return actions;
}

// TODO: This is a function for TESTING PURPOSES ONLY, remove before finalizing
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

// TODO: This is a function for TESTING PURPOSES ONLY, remove before finalizing
function displayPlayerState(player: Player) {
  console.log(`\nPlayer: ${player.name}`);
  console.log(`Gold: ${player.gold}`);
  console.log(`Shields: ${player.shields}`);
  console.log(`Victory Points: ${player.victoryPoints}`);
  console.log(`Science:`, player.science);
  console.log(`Resources:`, player.resources);
  console.log(`Built Structures:`);
  player.playerBoard.forEach((card) => {
    console.log(`Structure: ${card.name}`);
  });
  console.log(`Wonder Stages:`);
  player.wonder.wonderStages.forEach((stage, index) => {
    console.log(
      `  Stage ${index + 1}: ${stage.isBuilt ? "Built" : "Not Built"}`
    );
  });
}

// TODO: This is a function for TESTING PURPOSES ONLY, remove before finalizing
function addRandomResourceFromCards(player: Player) {
  player.playerBoard.forEach((card) => {
    if (card.production) {
      Object.entries(card.production).forEach(([resource, amount]) => {
        if (typeof resource === "string" && resource.includes(",")) {
          const choices = resource
            .split(",")
            .map((r) => r.trim()) as ResourceType[];
          const randomChoice =
            choices[Math.floor(Math.random() * choices.length)];

          player.tempResources[randomChoice] =
            (player.tempResources[randomChoice] || 0) + (amount as number);
        }
      });
    }
  });
}
