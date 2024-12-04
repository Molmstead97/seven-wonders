import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

import { gameLoop, initializeGame, GameState } from "../game-logic/gameState";
import PlayerHand from "./PlayerHand";

import WonderSelector from "./3D-Effects/WonderSelector";

import {
  handleCardPlay,
  handleBuildWonder,
  handleDiscardCard,
} from "../game-logic/gameActions";
//import { SceneManager } from '../components/animations/sceneManager';
import { AiPlayersModal, WonderChoiceModal } from "./GameSetupModals";

import { fadeOut } from "./animations/fadeAnimation"; // fadeIn is used in the modals when they mount
import { blurBackground, unblurBackground } from "./animations/backgroundBlur";
import ProductionChoiceModal from "./ProductionChoiceModal";
import { ProductionChoiceState } from "../game-logic/types/productionChoice";
import { ResourceType } from "../game-logic/types/resource";
import { Card } from "../game-logic/types/card";
import GameBoard from "./GameBoard";

type GamePhase = "home" | "playing";

const MainPage = () => {
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

  const [productionChoiceState, setProductionChoiceState] =
    useState<ProductionChoiceState | null>(null);

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

  const handleProductionChoice = (resource: ResourceType) => {
    if (!gameState || !productionChoiceState) return;

    // Update the game state with the chosen resource
    const updatedGameState = {
      ...gameState,
      players: gameState.players.map((player, index) => {
        if (index === 0) {
          // Current player
          return {
            ...player,
            tempResources: {
              ...player.tempResources,
              [resource]: (player.tempResources[resource] || 0) + 1,
            },
          };
        }
        return player;
      }),
    };

    // Move to next choice or finish
    if (
      productionChoiceState.currentChoiceIndex <
      productionChoiceState.choices.length - 1
    ) {
      setProductionChoiceState({
        ...productionChoiceState,
        currentChoiceIndex: productionChoiceState.currentChoiceIndex + 1,
      });
    } else {
      setProductionChoiceState(null);
    }

    setGameState(updatedGameState);
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
        <div
          style={{
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#121212",
          }}
        >
          <GameBoard
            playerCount={gameState?.players.length ?? 0}
            assignedWonders={
              gameState?.players.map((player) => player.wonder) || []
            }
            discardPile={gameState?.discardPile || []}
          />
          {gameState && (
            <div className="relative z-10">
              <PlayerHand
                cards={gameState.players[0].playerHand}
                currentWonder={gameState.players[0].wonder}
                gameState={gameState}
                onCardPlay={(cardIndex) => {
                  const updatedState = handleCardPlay(gameState, 0, cardIndex);

                  const nextState = gameLoop(updatedState, true);

                  setGameState(nextState);
                }}
                onWonderBuild={(cardIndex) => {
                  if (!gameState) return;
                  const updatedState = handleBuildWonder(
                    gameState,
                    0,
                    cardIndex
                  );
                  const nextState = gameLoop(updatedState, true);
                  setGameState(nextState);
                }}
                onCardDiscard={(cardIndex) => {
                  if (!gameState) return;
                  const updatedState = handleDiscardCard(
                    gameState,
                    0,
                    cardIndex
                  );
                  const nextState = gameLoop(updatedState, true);
                  setGameState(nextState);
                }}
              />
            </div>
          )}
          {productionChoiceState && (
            <ProductionChoiceModal
              card={
                {
                  name: productionChoiceState.choices[
                    productionChoiceState.currentChoiceIndex
                  ].cardName,
                  imagePath:
                    productionChoiceState.choices[
                      productionChoiceState.currentChoiceIndex
                    ].cardImage,
                } as Card
              }
              onChoiceSelected={handleProductionChoice}
              onClose={() => setProductionChoiceState(null)}
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

export default MainPage;
