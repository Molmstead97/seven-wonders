import React, { useState } from "react";
import { GameState, gameLoop } from "../game-logic/gameState";
import { handleCardPlay, handlePassHand, handleAgeEnd, handleBuildWonder } from "../game-logic/gameActions";

import { Card } from "../game-logic/types/card";
import { Wonder } from "../game-logic/types/wonder";
import GameBoard from "./GameBoard";

interface GameProps {
  numPlayers: number;
  initialAge: number;
  initialGameState: GameState;
}

const Game: React.FC<GameProps> = ({ numPlayers, initialAge, initialGameState }) => {
  const [gameState, setGameState] = useState<GameState>(() => gameLoop(initialGameState));

  const onCardPlay = (playerId: number, cardIndex: number) => {
    setGameState(prevState => handleCardPlay(prevState, playerId, cardIndex));
  };

  const onBuildWonder = (playerId: number, wonder: Wonder, card: Card) => {
    setGameState(prevState => handleBuildWonder(prevState, playerId, wonder, card));
  };

  const onPassHand = () => {
    setGameState(prevState => handlePassHand(prevState));
  };

  const onAgeEnd = () => {
    setGameState(prevState => handleAgeEnd(prevState));
  };

  return (
    <div>
      <GameBoard />
    </div>
  );
};

export default Game;
