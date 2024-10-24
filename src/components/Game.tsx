import React, { useState } from "react";
import { GameState, gameLoop } from "../gameLogic/gameState";
import { handleCardPlay, handlePassHand, handleAgeEnd, handleBuildWonder } from "../gameLogic/gameActions";
// import GameBoard from "./GameBoard";

import { Card } from "../gameLogic/types/card";
import { Wonder } from "../gameLogic/types/wonder";

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
      {/* <GameBoard 
        gameState={gameState}
        onCardPlay={onCardPlay}
        onBuildWonder={onBuildWonder}
        onPassHand={onPassHand}
        onAgeEnd={onAgeEnd}
      /> */}
    </div>
  );
};

export default Game;
