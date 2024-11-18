import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

import GameBoard from "./GameBoard";
import { gameLoop, initializeGame, GameState } from "../game-logic/gameState";
import PlayerHand from "./PlayerHand";

import WonderSelector from "./3D-Effects/WonderSelector";

import {
  handleCardPlay,
  handleBuildWonder,
  handleDiscardCard,
} from "../game-logic/gameActions";
//import { SceneManager } from '../components/animations/sceneManager';
import { AiPlayersModal, WonderChoiceModal } from "./gameSetupModals";

import { fadeOut } from "./animations/fadeAnimation"; // fadeIn is used in the modals when they mount
import { blurBackground, unblurBackground } from "./animations/backgroundBlur";

type GamePhase = "home" | "playing";

const MainPage = () => {
  // State variables
  const [gamePhase, setGamePhase] = useState<GamePhase>("home");
  const [gameState, setGameState] = useState<GameState | null>(null);

  const [aiPlayerCount, setAiPlayerCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playerActionTaken, setPlayerActionTaken] = useState(false);

  const [showAiPlayersModal, setShowAiPlayersModal] = useState(false);
  const [showWonderChoiceModal, setShowWonderChoiceModal] = useState(false);
  const [isChoosingWonder, setIsChoosingWonder] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const aiPlayersModalRef = useRef<HTMLDivElement>(null);
  const wonderChoiceModalRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Initialize game loop when game state changes and game phase is "playing"
  useEffect(() => {
    if (gameState && gamePhase === "playing") {
      gameLoopRef.current = setInterval(() => {
        setGameState((prevState) => {
          if (prevState && playerActionTaken) {
            const newState = gameLoop(prevState, playerActionTaken);
            // Reset playerActionTaken after the game loop processes it
            setPlayerActionTaken(false);
            return newState;
          }
          return prevState;
        });
      }, 1000);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gamePhase]);

  // Function to start the game setup
  const startSetup = () => {
    if (titleRef.current) {
      fadeOut(titleRef.current, () => {
        if (backgroundRef.current) {
          blurBackground(backgroundRef.current);
        }
        setShowAiPlayersModal(true);
      });
    }
  };

  // Handle AI players modal submission
  const handleAiPlayersSubmit = (aiPlayerCount: number) => {
    if (aiPlayerCount < 2 || aiPlayerCount > 6) {
      console.error("Invalid AI player count");
      return;
    }

    if (aiPlayersModalRef.current) {
      fadeOut(aiPlayersModalRef.current, () => {
        setAiPlayerCount(aiPlayerCount);
        setShowAiPlayersModal(false);
        setShowWonderChoiceModal(true);
      });
    }
  };

  // Handle wonder choice modal submission
  const handleWonderChoiceSubmit = (choice: "choose" | "randomize") => {
    if (wonderChoiceModalRef.current) {
      fadeOut(wonderChoiceModalRef.current, () => {
        if (backgroundRef.current) {
          unblurBackground(backgroundRef.current);
        }
        setIsLoading(true);
        setShowWonderChoiceModal(false);

        try {
          if (choice === "choose") {
            setIsChoosingWonder(true);
            setGamePhase("playing");
            const initializedGame = initializeGame(aiPlayerCount, undefined); // temporary wonder
            setGameState(initializedGame);
          } else {
            // Randomize wonders

            const initializedGame = initializeGame(aiPlayerCount, undefined);
            setGameState(initializedGame);
            setGamePhase("playing");
          }
        } catch (error) {
          console.error("Error initializing game:", error);
          setGamePhase("home");
        } finally {
          setIsLoading(false);
        }
      });
    }
  };

  // Handle modal closes
  const handleAiPlayersClose = () => {
    setShowAiPlayersModal(false);
    setAiPlayerCount(0); // Reset the count
  };

  const handleWonderChoiceClose = () => {
    setShowWonderChoiceModal(false);
    setGamePhase("home"); // Reset the game phase
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  switch (gamePhase) {
    case "playing":
      if (isChoosingWonder) {
        return (
          <WonderSelector
            onWonderSelected={(selectedWonder) => {
              const initializedGame = initializeGame(
                aiPlayerCount,
                selectedWonder
              );
              setGameState(initializedGame);
              setIsChoosingWonder(false);
            }}
          />
        );
      }
      return (
        <div className="relative">
          <GameBoard
            playerCount={gameState?.players.length || 0}
            assignedWonders={
              gameState?.players.map((player) => player.wonder) || []
            }
          />
          {gameState && (
            <div className="relative z-10">
              {" "}
              {/* Add this wrapper */}
              <PlayerHand
                cards={gameState.players[0].playerHand}
                currentWonder={gameState.players[0].wonder}
                gameState={gameState}
                onCardPlay={(cardIndex) => {
                  const updatedState = handleCardPlay(gameState, 0, cardIndex);
                  setGameState(updatedState);
                  setPlayerActionTaken(true);
                }}
                onWonderBuild={(cardIndex) => {
                  const updatedState = handleBuildWonder(
                    gameState,
                    0,
                    gameState.players[0].wonder,
                    cardIndex
                  );
                  setGameState(updatedState);
                  setPlayerActionTaken(true);
                }}
                onCardDiscard={(cardIndex) => {
                  const updatedState = handleDiscardCard(
                    gameState,
                    0,
                    cardIndex
                  );
                  setGameState(updatedState);
                  setPlayerActionTaken(true);
                }}
              />
            </div>
          )}
        </div>
      );

    default:
      return (
        <>
          <div ref={backgroundRef} className="fixed inset-0" />
          {gamePhase === "home" && (
            <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
              <div
                ref={titleRef}
                className="flex flex-col justify-center items-center space-y-12"
              >
                <h1 className="font-serif text-9xl font-extrabold text-yellow-200 tracking-wider leading-none text-shadow-xl">
                  7 <span className="text-yellow-400">Wonders</span>
                </h1>
                <button
                  onClick={startSetup}
                  className="bg-neutral-50 bg-opacity-10 text-white font-normal italic text-5xl px-12 py-4 border-3 border-black rounded-3xl shadow-lg text-shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  Start Game
                </button>
              </div>
            </div>
          )}

          {showAiPlayersModal && (
            <div ref={aiPlayersModalRef}>
              <AiPlayersModal
                onSubmit={handleAiPlayersSubmit}
                onClose={handleAiPlayersClose}
              />
            </div>
          )}

          {showWonderChoiceModal && (
            <div ref={wonderChoiceModalRef}>
              <WonderChoiceModal
                onChoose={handleWonderChoiceSubmit}
                onClose={handleWonderChoiceClose}
              />
            </div>
          )}
        </>
      );
  }
};

export default MainPage;
