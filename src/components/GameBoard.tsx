import React from "react";
import { Wonder as WonderType } from "../game-logic/types/wonder";
import Wonder from "./Wonder";

// TODO: THIS WILL BE REPLACED WITH A THREE.JS SCENE/BLENDER MODEL, will need to find a way to pass the wonder data to the model

interface GameBoardProps {
  playerCount: number;
  assignedWonders: WonderType[];
}

const GameBoard: React.FC<GameBoardProps> = ({ playerCount, assignedWonders = [] }) => {

  // Add default empty array and check if assignedWonders exists
  if (!assignedWonders || assignedWonders.length === 0) {
    return <div>Loading wonders...</div>;
  }

  /*const getWonderPosition = (index: number): string => {
    // Human player is always at index 0
    if (index === 0) {
      return "absolute bottom-5 left-1/2 transform -translate-x-1/2";
    }

    // AI positions based on total number of AI players
    const positions = {
      2: [ // Positions for 1 human + 1 AI
        "absolute top-5 left-1/2 transform -translate-x-1/2"
      ],
      3: [ // Positions for 1 human + 2 AI
        "absolute left-5 top-[50%] transform -translate-y-1/2",
        "absolute right-5 top-[50%] transform -translate-y-1/2"
      ],
      4: [ // Positions for 1 human + 3 AI
        "absolute left-5 top-[40%] transform -translate-y-1/2",
        "absolute right-5 top-[40%] transform -translate-y-1/2",
        "absolute top-5 left-1/2 transform -translate-x-1/2"
      ]
    };

    // Get positions array for current player count
    const currentPositions = positions[playerCount as keyof typeof positions];
    return currentPositions[index - 1] || "";
  }; */

  return (
    <div className="flex flex-col flex-wrap justify-center items-center gap-8 p-8">
      {assignedWonders.map((wonder, index) => (
        <div key={index} className="w-64">
          <Wonder wonder={wonder} />
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
