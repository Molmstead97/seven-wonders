import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

import { gameLoop, initializeGame, GameState } from "../game-logic/gameState";
import PlayerHand from "./PlayerHand";

import WonderSelector from "./WonderSelector";

import {
  handleCardPlay,
  handleBuildWonder,
  handleDiscardCard,
} from "../game-logic/gameActions";
//import { SceneManager } from '../components/animations/sceneManager';
import { AiPlayersModal, WonderChoiceModal } from "./GameSetupModals";

import { fadeOut } from "./animations/fadeAnimation"; // fadeIn is used in the modals when they mount
import { blurBackground, unblurBackground } from "./animations/backgroundBlur";
import GameBoard from "./GameBoard";
import EndgameRanking from "./EndgameRanking";
import { wonders } from "../data/wonders";

type GamePhase = "home" | "playing";

const Main = () => {
  // State variables
  const [gamePhase, setGamePhase] = useState<GamePhase>("home");
  const [gameState, setGameState] = useState<GameState | null>(null);

  const [aiPlayerCount, setAiPlayerCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const [showAiPlayersModal, setShowAiPlayersModal] = useState(false);
  const [showWonderChoiceModal, setShowWonderChoiceModal] = useState(false);
  const [isChoosingWonder, setIsChoosingWonder] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const aiPlayersModalRef = useRef<HTMLDivElement>(null);
  const wonderChoiceModalRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

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

  const handlePlayerAction = (
    actionType: "play" | "wonder" | "discard",
    cardIndex: number
  ) => {
    if (!gameState) return;

    // First, apply the specific action
    let actionState;
    switch (actionType) {
      case "play":
        actionState = handleCardPlay(gameState, 0, cardIndex);
        break;
      case "wonder":
        actionState = handleBuildWonder(gameState, 0, cardIndex);
        break;
      case "discard":
        actionState = handleDiscardCard(gameState, 0, cardIndex);
        break;
    }

    console.log("Game log before gameLoop:", actionState?.gameLog);

    // Then, run the game loop with the updated state
    if (actionState) {
      const updatedState = gameLoop(actionState, true);
      console.log("Game log after gameLoop:", updatedState.gameLog);
      setGameState(updatedState);
    }
  };

  // Add a state change monitor
  useEffect(() => {
    console.log("GameState changed:", {
      age: gameState?.age,
      turns: gameState?.turns,
      playerCount: gameState?.players.length,
      handSize: gameState?.players[0]?.playerHand.length,
      timestamp: new Date().toISOString(),
    });
  }, [gameState]);

  // Add this to handle play again
  const handlePlayAgain = () => {
    setGamePhase("home");
    setGameState(null);
    setAiPlayerCount(0);
    setIsChoosingWonder(false);
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
      if (gameState?.age === 4) {
        return (
          <EndgameRanking
            players={gameState.players}
            onPlayAgain={handlePlayAgain}
          />
        );
      }

      console.log(
        "Game phase is 'playing', isChoosingWonder:",
        isChoosingWonder
      ); // Debug log

      if (isChoosingWonder) {
        return (
          <div className="min-h-screen bg-gray-900">
            <WonderSelector
              onWonderSelected={(selectedWonder) => {
                try {
                  const initializedGame = initializeGame(aiPlayerCount, selectedWonder);
                  setGameState(initializedGame);
                  setGamePhase("playing");
                  setIsChoosingWonder(false);
                } catch (error) {
                  console.error("Error initializing game with selected wonder:", error);
                  setGamePhase("home");
                }
              }}
              availableWonders={wonders}
            />
          </div>
        );
      }

      return (
        <div className="w-screen h-screen overflow-hidden">
          <GameBoard
            playerCount={gameState?.players.length ?? 0}
            assignedWonders={
              gameState?.players.map((player) => player.wonder) || []
            }
            discardPile={gameState?.discardPile || []}
            gameState={gameState}
            gameLog={gameState?.gameLog || []}
            setGameState={setGameState}
          />
          {gameState && (
            <PlayerHand
              cards={gameState.players[0].playerHand}
              currentWonder={gameState.players[0].wonder}
              gameState={gameState}
              onCardPlay={(cardIndex) => handlePlayerAction("play", cardIndex)}
              onWonderBuild={(cardIndex) =>
                handlePlayerAction("wonder", cardIndex)
              }
              onCardDiscard={(cardIndex) =>
                handlePlayerAction("discard", cardIndex)
              }
            />
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

export default Main;
