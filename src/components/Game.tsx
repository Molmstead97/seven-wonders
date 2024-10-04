import React, { useState, useEffect } from "react";
import { Card } from "../types/card";
import { Player } from "../types/player";
import { playCard } from "../utils/cardActions";
//import GameBoard from "./GameBoard";
//import PlayerArea from "./PlayerArea";
//import PlayerHand from "./PlayerHand";
//import ActionPanel from "./components/ActionPanel";
import { dealCards } from "../utils/cardDealer";
import { setupPlayers } from "../utils/setupPlayers";

interface InitialGameState {
  age: number;
  players: Player[];
  discardPile: Card[];
}

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<InitialGameState | null>(null);

  const initializeGame = (
    numPlayers: number,
    age: number
  ): InitialGameState => {
    const players = setupPlayers();
    dealCards(numPlayers, age);
    const discardPile = [];

    return {
      age: 1,
      players,
      discardPile: [],
      // ... other game state properties
    };
  };

  useEffect(() => {
    const gameState = initializeGame(4, 1); // Example with 4 players, age 1
    setGameState(gameState);
  }, []);

  const handleCardPlay = (playerId: number, cardIndex: number) => {
    if (gameState) {
      setGameState((prevState) => {
        const newState = { ...prevState! };
        const player = newState.players[playerId];
        const card = player.playerHand[cardIndex];

        const updatedPlayer = playCard(player, card);
        newState.players[playerId] = updatedPlayer;

        return newState;
      });
    }
  };

  /*const handleWonderBuild = () => {
    // Logic for building a wonder stage
  };*/

  /*const handleCardDiscard = (card: Card) => {
    // Logic for discarding a card
  };*/

  /*const handleResourceTrade = () => {
    // Logic for trading with players
  };*/

  const handlePassHand = () => {
    if (gameState) {
      const { age, players } = gameState; // Destructure 'age' and 'players' from 'gameState'
      const direction = age === 2 ? -1 : 1; // Determine the direction of hand passing: left (-1) for Age 2, right (1) for Ages 1 and 3

      const newHands = players.map((_, index) => {
        const nextPlayerIndex =
          (index + direction + players.length) % players.length; // Calculate the index of the next player

        return players[nextPlayerIndex].playerHand; // Return the hand of the next player (in the determined direction) to be passed to the current player
      });

      setGameState((prevState) => ({
        ...prevState!,
        players: prevState!.players.map((player, index) => ({
          ...player,
          playerHand: newHands[index],
        })),
      }));
    }
  };

  /*const regenerateResources = () => {
    // Logic for regenerating resources at the start of the round
  };*/

  const handleAgeEnd = () => {
    if (gameState) {
      const { age, players } = gameState; // Destructure age and players from gameState

      for (const player of players) {
        if (
          player.military.shields > player.rightPlayer.military.shields ??
          0
        ) {
          player.victoryPoints.victoryPoints += 1;
        } else if (
          player.military.shields < player.rightPlayer.military.shields ??
          0
        ) {
          player.victoryPoints.victoryPoints -= 1;
        }

        // Compare shields with left neighbor
        if (player.military.shields > player.leftPlayer.military.shields) {
          player.victoryPoints.victoryPoints += 1;
        } else if (
          player.military.shields < player.leftPlayer.military.shields
        ) {
          player.victoryPoints.victoryPoints -= 1;
        }

        // Adjust victory points based on age
        if (age === 2) {
          player.victoryPoints.victoryPoints +=
            player.victoryPoints.victoryPoints * 3;
        } else if (age === 3) {
          player.victoryPoints.victoryPoints +=
            player.victoryPoints.victoryPoints * 5;
        }
      }
    }
  };
  /*const handleEndGame = () => {
    // Logic for ending the game
  };*/

  return <div>{/* Render your game state or other components here */}</div>;
};

export default Game;
