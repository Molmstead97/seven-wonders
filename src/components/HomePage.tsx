import { useState } from "react";
import Game, { initializeGame, InitialGameState } from "../components/Game";

const HomePage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<InitialGameState | null>(null);

  const startGame = () => {
    const initialGameState = initializeGame(4, 1);
    setGameState(initialGameState);
    setGameStarted(true);
  };

  if (gameStarted && gameState) {
    return <Game initialGameState={gameState} />;
  }

  return (
    <body className="max-h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center space-y-12">
        <h1 className="font-serif text-9xl font-extrabold text-yellow-200 tracking-wider leading-none text-shadow-xl">
          7 <span className="text-yellow-400">Wonders</span>
        </h1>
        <button
          onClick={startGame}
          className="bg-neutral-50 bg-opacity-10 text-white font-normal italic text-5xl px-12 py-4 border-3 border-black rounded-3xl shadow-lg text-shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          Start Game
        </button>
      </div>
    </body>
  );
};

export default HomePage;