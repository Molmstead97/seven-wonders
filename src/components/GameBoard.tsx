import React from "react";
import { GameState } from "../gameLogic/gameState";

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  return <div>Game Board</div>;
};

export default GameBoard;
