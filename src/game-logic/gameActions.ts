import { GameState, handleAITurn } from "./gameState";

import { ResourceType, ScienceType } from "../data/types/resource";
import { Wonder } from "../data/types/wonder";
import { ProductionChoice } from "../data/types/productionChoice";

import { applyCardEffects } from "./utils/applyCardEffects";
import { buildWonder } from "./utils/buildWonder";
import { tradeResource } from "./utils/tradeResource";
import { ageEnd } from "./utils/ageEnd";
import { passHands } from "./utils/passHand";
import { checkResources } from "./utils/resourceCheck";
import { Card } from "../data/types/card";
import { dealCards } from "./utils/dealCards";
import { Player } from "../data/types/player";
import { calculateSciencePoints } from "../components/EndgameRanking";

export const addToGameLog = (gameLog: string[], message: string) => {
  console.log("Adding to game log:", message);
  return [...gameLog, message];
};

export function handleCardPlay(
  gameState: GameState,
  playerId: number,
  cardIndex: number
): GameState {
  if (!gameState || !gameState.players[playerId]) {
    console.error("Invalid game state or player ID");
    return gameState;
  }

  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p, index) => ({
      ...p,
      playerHand: index === playerId ? [...p.playerHand] : p.playerHand,
      playerBoard:
        index === playerId ? new Set([...p.playerBoard]) : p.playerBoard,
    })),
    gameLog: [...(gameState.gameLog || [])], // Ensure gameLog exists
  };

  // Get current player and card
  const currentPlayer = newState.players[playerId];
  const cardToPlay = currentPlayer.playerHand[cardIndex];

  if (!cardToPlay) {
    console.error("Invalid card index");
    return gameState;
  }

  // Check for production choices
  if (cardToPlay.production && "choice" in cardToPlay.production) {
    const choices = cardToPlay.production.choice.map((choice) => ({
      sourceName: cardToPlay.name,
      sourceImage: cardToPlay.imagePath,
      options: choice.options,
      amount: choice.amount,
      sourceType: "card" as const,
    }));

    newState.productionChoiceState = {
      choices,
      currentChoiceIndex: 0,
    };
  }

  // Update player state
  currentPlayer.playerBoard.add(cardToPlay);
  currentPlayer.playerHand.splice(cardIndex, 1);

  // Update the game log
  newState.gameLog = addToGameLog(
    newState.gameLog,
    playerId === 0
      ? `You constructed ${cardToPlay.name}`
      : `Player ${playerId + 1} constructed ${cardToPlay.name}`
  );

  // Apply cost
  if (typeof cardToPlay.cost === "number") {
    currentPlayer.gold -= cardToPlay.cost;
  }

  // Apply card effects (except for production choices which will be handled by the UI)
  const effectsUpdate = applyCardEffects(currentPlayer, cardToPlay);
  Object.assign(currentPlayer, effectsUpdate);

  return {
    ...newState,
    waitingForSeventhCard: false,
  };
}

export function handleDiscardCard(
  gameState: GameState,
  playerId: number,
  cardIndex: number
): GameState {
  if (!gameState || !gameState.players[playerId]) {
    console.error("Invalid game state or player ID");
    return gameState;
  }

  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p, index) => ({
      ...p,
      playerHand: index === playerId ? [...p.playerHand] : p.playerHand,
      playerBoard:
        index === playerId ? new Set([...p.playerBoard]) : p.playerBoard,
    })),
    discardPile: [...gameState.discardPile],
    gameLog: [...(gameState.gameLog || [])], // Ensure gameLog exists
  };

  // Get current player and card
  const currentPlayer = newState.players[playerId];
  const cardToDiscard = currentPlayer.playerHand[cardIndex];

  if (!cardToDiscard) {
    console.error("Invalid card index");
    return gameState;
  }

  // Add 3 gold for discarding
  currentPlayer.gold += 3;

  // Remove card from hand
  currentPlayer.playerHand.splice(cardIndex, 1);

  // Add card to discard pile
  newState.discardPile.push(cardToDiscard);

  // Update the game log
  newState.gameLog = addToGameLog(
    newState.gameLog,
    playerId === 0
      ? `You discarded ${cardToDiscard.name}`
      : `Player ${playerId + 1} discarded ${cardToDiscard.name}`
  );

  return {
    ...newState,
    waitingForSeventhCard: false,
  };
}

export function handleBuildWonder(
  gameState: GameState,
  playerId: number,
  cardIndex: number
): GameState {
  console.log(`Attempting wonder build - Player ${playerId}`);

  if (!gameState?.players[playerId]) {
    console.error(`Invalid player ID: ${playerId}`);
    return gameState;
  }

  // Create deep copy of state
  const newState = {
    ...gameState,
    players: gameState.players.map((p, index) => ({
      ...p,
      playerHand: index === playerId ? [...p.playerHand] : p.playerHand,
      playerBoard:
        index === playerId ? new Set([...p.playerBoard]) : p.playerBoard,
      wonder:
        index === playerId
          ? {
              ...p.wonder,
              wonderStages: p.wonder.wonderStages.map((stage) => ({
                ...stage,
              })),
            }
          : p.wonder,
    })),
    gameLog: [...gameState.gameLog],
  };

  const currentPlayer = newState.players[playerId];
  console.log(`Player ${playerId} hand:`, currentPlayer.playerHand);
  console.log(`Attempting to use card at index:`, cardIndex);
  console.log(`Player wonder:`, currentPlayer.wonder.name);

  const cardToUse = currentPlayer.playerHand[cardIndex];
  if (!cardToUse) {
    console.error(`No card found at index ${cardIndex} for player ${playerId}`);
    return gameState;
  }

  const { updatedPlayer, hasProductionChoice, stageBuilt } = buildWonder(
    currentPlayer,
    currentPlayer.wonder,
    cardToUse,
    newState
  );

  console.log(`Build wonder result:`, {
    wonderBuilt: !!stageBuilt,
    hasProductionChoice,
    playerUpdated: updatedPlayer !== currentPlayer,
  });

  if (!stageBuilt) {
    console.log(`Wonder build failed for player ${playerId}`);
    return gameState;
  }

  // Update player in game state
  newState.players[playerId] = updatedPlayer;

  // Add to game log
  newState.gameLog = addToGameLog(
    newState.gameLog,
    playerId === 0
      ? `You built Wonder stage ${stageBuilt.stage}`
      : `Player ${playerId + 1} built Wonder stage ${stageBuilt.stage}`
  );

  // Handle production choices if needed
  if (
    hasProductionChoice &&
    stageBuilt.production &&
    "choice" in stageBuilt.production
  ) {
    const production = stageBuilt.production as {
      choice: Array<{ options: string[]; amount: number }>;
    };
    newState.productionChoiceState = {
      choices: production.choice.map((choice) => ({
        sourceName: `${newState.players[playerId].wonder.name} Stage ${stageBuilt.stage}`,
        sourceImage: newState.players[playerId].wonder.imagePath,
        options: choice.options as ResourceType[],
        amount: choice.amount || 1,
        sourceType: "wonder" as const,
      })),
      currentChoiceIndex: 0,
    };
  }

  return {
    ...newState,
    waitingForSeventhCard: false,
  };
}

export function handlePassHand(gameState: GameState): GameState {
  return passHands(gameState);
}

export function handleTrade(
  gameState: GameState,
  tradingPlayerId: number,
  resourceType: ResourceType,
  amount: number
): GameState {
  if (!gameState) return gameState;

  const tradingPlayer = gameState.players[tradingPlayerId];
  const userPlayer = gameState.players[0];

  const { player: updatedUserPlayer, neighbor: updatedTradingPlayer } =
    tradeResource(userPlayer, tradingPlayer, resourceType, amount);

  // Update game state
  const newState: GameState = {
    ...gameState,
    players: gameState.players.map((player, index) =>
      index === 0
        ? updatedUserPlayer
        : index === tradingPlayerId
        ? updatedTradingPlayer
        : player
    ),
  };

  return newState;
}

export function handleEndAge(gameState: GameState): GameState {
  let newState = {
    ...gameState,
    gameLog: addToGameLog(gameState.gameLog, `=== AGE ${gameState.age} END ===`)
  };

  // Skip the seventh card handling if we just finished handling it
  /*if (!newState.waitingForSeventhCard) {
    // First, handle the seventh card for the player with the ability
    const playerWithAbility = newState.players.find((p) => p.playSeventhCard);

    if (playerWithAbility && playerWithAbility.playerHand.length > 0) {
      const playerIndex = newState.players.indexOf(playerWithAbility);

      if (playerIndex === 0) {
        // Human player with ability
        return {
          ...newState,
          waitingForSeventhCard: true,
        };
      } else {
        // AI player with ability
        const aiAction = handleAITurn(playerWithAbility, newState);
        switch (aiAction.action) {
          case "play":
            newState = handleCardPlay(newState, playerIndex, aiAction.cardIndex);
            break;
          case "wonder":
            newState = handleBuildWonder(newState, playerIndex, aiAction.cardIndex);
            break;
          case "discard":
            newState = handleDiscardCard(newState, playerIndex, aiAction.cardIndex);
            break;
        }
      }
    }
  } */
  
  // Then automatically discard seventh cards for all other players
  /*newState = {
    ...newState,
    discardPile: [
      ...newState.discardPile,
      ...newState.players.flatMap((player) =>
        player.playSeventhCard ? [] : player.playerHand
      ),
    ],
    players: newState.players.map((player) => ({
      ...player,
      playerHand: player.playSeventhCard ? player.playerHand : [],
    })),
  }; */

  // Process age end effects
  newState = ageEnd(newState.players, newState);

  // Handle end of game
  /* if (newState.age === 4) {
    newState = handleScienceChoices(newState);
    return handleEndGame(newState);
  } */

  if (newState.endGameTriggered) {
    return handleEndGame(newState);
  }

  // Deal new cards
  const newCards = dealCards(newState.players.length, newState.age + 1);
  
  return {
    ...newState,
    players: newState.players.map((player, index) => ({
      ...player,
      playerHand: newCards.slice(index * 7, (index + 1) * 7),
    })),
    age: newState.age + 1,
    turns: 0,
    waitingForSeventhCard: false,
  };
}

export function handleEndGame(gameState: GameState): GameState {
  console.log("=== PREPARING FINAL GAME STATE ===");

  // Create final state with all trading and production disabled
  const finalState = {
    ...gameState,
    finalState: true, // This will disable interactions
    players: gameState.players.map((player) => ({
      ...player,
      canTrade: false,
      canChooseProduction: false,
    })),
  };

  console.log(
    "Final player state:",
    finalState.players.map((p) => ({
      name: p.name,
      points: p.victoryPoints,
      gold: p.gold,
    }))
  );

  return finalState;
}

export function canPlayCard(
  gameState: GameState,
  playerId: number,
  card: Card
): boolean {
  if (!gameState?.players?.[playerId]?.playerBoard) {
    return false;
  }

  const player = gameState.players[playerId];

  // Check if the card has already been played by the player
  const isCardPlayed = Array.from(player.playerBoard).some(
    (playedCard) => playedCard && playedCard.name === card.name
  );

  if (isCardPlayed) {
    return false;
  }

  // Check resources including temporary resources
  return checkResources(player, card, null, player.tempResources);
}

function calculateOptimalScienceChoice(player: Player): ScienceType {
  const currentScience = { ...player.science };
  const options = ["Cog", "Compass", "Tablet"] as ScienceType[];
  let bestChoice = options[0];
  let maxPoints = calculateSciencePoints(currentScience);

  // Try each option and calculate resulting points
  options.forEach((option) => {
    const testScience = { ...currentScience };
    testScience[option] = (testScience[option] || 0) + 1;
    const points = calculateSciencePoints(testScience);

    if (points > maxPoints) {
      maxPoints = points;
      bestChoice = option;
    }
  });

  return bestChoice;
}

function handleScienceChoices(gameState: GameState): GameState {
  const newState = {
    ...gameState,
    players: gameState.players.map((player) => ({
      ...player,
      science: { ...player.science },
    })),
  };

  // Handle AI players first
  newState.players.forEach((player, index) => {
    if (
      index !== 0 &&
      (player.freeScience?.fromWonder || player.freeScience?.fromCard)
    ) {
      if (player.freeScience.fromWonder) {
        const choice = calculateOptimalScienceChoice(player);
        player.science[choice] = (player.science[choice] || 0) + 1;
      }
      if (player.freeScience.fromCard) {
        const choice = calculateOptimalScienceChoice(player);
        player.science[choice] = (player.science[choice] || 0) + 1;
      }
    }
  });

  // Handle human player
  const humanPlayer = newState.players[0];
  if (
    humanPlayer.freeScience?.fromWonder ||
    humanPlayer.freeScience?.fromCard
  ) {
    const choices: ProductionChoice[] = [];

    const scienceOptions: ScienceType[] = ["Cog", "Compass", "Tablet"];

    if (humanPlayer.freeScience.fromWonder) {
      choices.push({
        sourceName: "Babylon",
        sourceImage: humanPlayer.wonder.imagePath,
        options: scienceOptions,
        amount: 1,
        sourceType: "science" as const,
      });
    }

    if (humanPlayer.freeScience.fromCard) {
      choices.push({
        sourceName: "Scientists Guild",
        sourceImage: "../assets/card-images/purple/scientists-guild.png",
        options: scienceOptions,
        amount: 1,
        sourceType: "science" as const,
      });
    }

    if (choices.length > 0) {
      newState.productionChoiceState = {
        choices,
        currentChoiceIndex: 0,
      };
    }
  }

  return newState;
}
