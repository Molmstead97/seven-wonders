import React from "react";
import { GameState } from "../game-logic/gameState";
import Wonder from "./Wonder";
import { wonders } from "../data/wonders";

const GameBoard: React.FC = () => {
  const playerCount = wonders.length;
  const aiPlayers = playerCount - 1; // Excluding human player

  const getWonderPosition = (index: number): string => {
    if (index === 0) return "absolute bottom-5 left-1/2 transform -translate-x-1/2"; // Human player

    const aiPosition = index - 1; // Adjust index for AI positions
    switch (aiPosition) {
      case 0: return "absolute left-5 top-[40%] transform -translate-y-1/2";
      case 1: return "absolute right-5 top-[40%] transform -translate-y-1/2";
      case 2: return "absolute top-5 left-1/2 transform -translate-x-1/2";
      case 3: return "absolute left-5 top-[60%] transform -translate-y-1/2";
      case 4: return "absolute right-5 top-[60%] transform -translate-y-1/2";
      default: return "";
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {wonders.map((wonder, index) => (
        <div key={index} className={getWonderPosition(index)}>
          <Wonder wonder={wonder} />
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
