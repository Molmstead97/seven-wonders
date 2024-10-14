import React, { useState } from "react";
import { GameState, initializeGame } from "../gameLogic/gameState";
import { handleCardPlay, handlePassHand, handleAgeEnd, handleBuildWonder } from "../gameLogic/gameActions";
// import GameBoard from "./GameBoard";

import { Card } from "../types/card";
import { Wonder } from "../types/wonder";

interface GameProps {
  numPlayers: number;
  initialAge: number;
  initialGameState: GameState;
}

const Game: React.FC<GameProps> = ({ numPlayers, initialAge }) => {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame(numPlayers, initialAge));

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
