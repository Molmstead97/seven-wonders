import { gameLoop, GameState } from "../game-logic/gameState";
import { handleCardPlay, handleBuildWonder, handleDiscardCard } from "../game-logic/gameActions";
import { handleAITurn } from "../game-logic/gameState";
import { setupPlayers } from "../game-logic/utils/setupPlayers";
import { dealCards } from "../game-logic/utils/dealCards";
import { PRESET_PERSONALITIES } from "../game-logic/types/aiPlayer";
import { gameEnd } from "../game-logic/utils/gameEnd";

function initializeAutomatedGame(aiPlayerCount: number): GameState {
  // Force all players (including first player) to be AI
  const players = setupPlayers(aiPlayerCount - 1);
  
  players.forEach((player, index) => {
    const presetTypes = Object.keys(PRESET_PERSONALITIES);
    const personalityType = presetTypes[index % presetTypes.length];
    player.aiPersonality = PRESET_PERSONALITIES[personalityType as keyof typeof PRESET_PERSONALITIES];
  });

  const dealtCards = dealCards(players.length, 1);
  players.forEach((player, index) => {
    player.playerHand = dealtCards.slice(index * 7, (index + 1) * 7);
  });

  return {
    age: 1,
    turns: 0,
    players,
    discardPile: [],
    isAutomated: true,
    productionChoiceState: {
      choices: [],
      currentChoiceIndex: 0
    }
  };
}

export function automateGame(aiPlayerCount: number = 3): void {
  let gameState = initializeAutomatedGame(aiPlayerCount);
  
  console.log("\n=== STARTING AUTOMATED GAME ===\n");
  console.log(`Number of AI players: ${aiPlayerCount}`);

  while (gameState.age <= 3) {
    console.log(`\n=== AGE ${gameState.age}, TURN ${gameState.turns + 1} ===\n`);
    
    // Process all players' turns
    for (let i = 0; i < gameState.players.length; i++) {
      const player = gameState.players[i];
      const aiAction = handleAITurn(player, gameState);
      const cardName = player.playerHand[aiAction.cardIndex].name;

      switch (aiAction.action) {
        case "play":
          gameState = handleCardPlay(gameState, i, aiAction.cardIndex);
          console.log(`Player ${i} played: ${cardName}`);
          break;
        case "wonder":
          gameState = handleBuildWonder(gameState, i, aiAction.cardIndex);
          console.log(`Player ${i} built wonder using: ${cardName}`);
          break;
        case "discard":
          gameState = handleDiscardCard(gameState, i, aiAction.cardIndex);
          console.log(`Player ${i} discarded: ${cardName}`);
          break;
      }
    }

    // Handle end of turn effects
    gameState = gameLoop(gameState, true);
  }

  console.log("\n=== GAME FINISHED ===\n");
  gameState.players = gameEnd(gameState.players);
  console.log("Final Scores:");
  gameState.players.forEach(player => {
    console.log(`${player.name}: ${player.victoryPoints} points`);
  });
}