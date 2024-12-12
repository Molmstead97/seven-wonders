import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import * as THREE from "three";
import { Wonder } from "../data/types/wonder";
import { Card } from "../data/types/card";
import { GameState } from "../game-logic/gameState";
import TradeModal from "./TradeModal";
import { ResourceType, ScienceType } from "../data/types/resource";
import { handleEndGame, handleTrade } from "../game-logic/gameActions";
import ProductionChoiceModal from "./ProductionChoiceModal";
import { ProductionChoiceState } from "../data/types/productionChoice";
import { PlayerBoard } from "./PlayerBoard";
import DiscardPile from "./DiscardPile";
import EndgameRanking from "./EndgameRanking";

import woodTextureUrl from '/assets/textures/wood_texture.jpg';
import woodNormalUrl from '/assets/textures/wood_normal.jpg';
import wallTextureUrl from '/assets/textures/821.jpg';
import floorTextureUrl from '/assets/textures/floor_texture.jpg';

interface GameBoardProps {
  playerCount: number;
  assignedWonders: Wonder[];
  discardPile: Card[];
  gameState: GameState | null;
  gameLog: string[];
  setGameState: (state: GameState) => void;
  onPlayAgain: () => void;
}

const GameBoard = React.memo(
  ({
    playerCount,
    assignedWonders,
    discardPile = [],
    gameState,
    gameLog,
    setGameState,
    onPlayAgain,
  }: GameBoardProps) => {
    if (!gameState || !gameState.players) {
      return <div>Loading game state...</div>;
    }

    const [isLoading, setIsLoading] = useState(true);
    const [selectedWonder, setSelectedWonder] = useState<Wonder | null>(null);
    const [isGameLogOpen, setIsGameLogOpen] = useState(false);
    const [displayedGameLog, setDisplayedGameLog] = useState<string[]>([]);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [productionChoiceState, setProductionChoiceState] =
      useState<ProductionChoiceState | null>(null);
    const [selectedPlayerBoardIndex, setSelectedPlayerBoardIndex] = useState<
      number | null
    >(null);
    const [isDiscardPileOpen, setIsDiscardPileOpen] = useState(false);
    const [usedProductionCards, setUsedProductionCards] = useState<Set<string>>(
      new Set()
    );
    const previousTurn = useRef<number>(0);

    // Three.js refs
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const mountedRef = useRef(true);
    const initCompletedRef = useRef(false);

    // Declare textureLoader at a higher scope
    const textureLoader = new THREE.TextureLoader();

    const stableRefs = useMemo(
      () => ({
        scene: null as THREE.Scene | null,
        camera: new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.5,
          1000
        ),
      }),
      []
    );

    // Three.js setup functions
    const createTable = useCallback((woodTexture: THREE.Texture, woodNormal: THREE.Texture) => {
      const tableGroup = new THREE.Group();
      
      // Create reusable material for both table top and legs
      const woodMaterial = new THREE.MeshStandardMaterial({
        map: woodTexture,
        normalMap: woodNormal,
        roughness: 0.7,
        metalness: 0.1,
        color: 0xffffff,  // Natural wood color
        aoMapIntensity: 1.0,
      });

      // Table top
      const tableTopGeometry = new THREE.BoxGeometry(80, 2, 80);
      const tableTop = new THREE.Mesh(tableTopGeometry, woodMaterial);
      tableTop.position.set(0, 0, 0);
      tableTop.castShadow = true;
      tableTop.receiveShadow = true;
      tableGroup.add(tableTop);

      // Table legs
      const legGeometry = new THREE.CylinderGeometry(2.5, 2.5, 30, 16);
      const legPositions = [
        { x: -35, z: -35 },
        { x: -35, z: 35 },
        { x: 35, z: -35 },
        { x: 35, z: 35 },
      ];

      legPositions.forEach((pos) => {
        const leg = new THREE.Mesh(legGeometry, woodMaterial);
        leg.position.set(pos.x, -15, pos.z);
        leg.castShadow = true;
        leg.receiveShadow = true;
        tableGroup.add(leg);
      });

      return tableGroup;
    }, []);

    const setupScene = useCallback(() => {
      console.log("Starting scene setup...");
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x2c2c2c);
      console.log("Scene background set");

      // Create promises for each texture load
      const woodTexturePromise = new Promise<THREE.Texture>(resolve => {
        textureLoader.load(woodTextureUrl, resolve);
      });
      const woodNormalPromise = new Promise<THREE.Texture>(resolve => {
        textureLoader.load(woodNormalUrl, resolve);
      });
      const wallTexturePromise = new Promise<THREE.Texture>(resolve => {
        textureLoader.load(wallTextureUrl, resolve);
      });
      const floorTexturePromise = new Promise<THREE.Texture>(resolve => {
        textureLoader.load(floorTextureUrl, resolve);
      });

      // Wait for all textures to load
      Promise.all([
        woodTexturePromise,
        woodNormalPromise,
        wallTexturePromise,
        floorTexturePromise,
      ]).then(([woodTexture, woodNormal, wallTexture, floorTexture]) => {
        console.log("All textures loaded");

        // Configure textures
        woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
        woodTexture.repeat.set(2, 2);
        woodNormal.wrapS = woodNormal.wrapT = THREE.RepeatWrapping;
        woodNormal.repeat.set(2, 2);
        wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(4, 2);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(8, 8);

        // Create table and other objects that depend on textures
        const table = createTable(woodTexture, woodNormal);
        scene.add(table);

        // Back wall
        const backWallGeometry = new THREE.PlaneGeometry(200, 100);
        const wallMaterial = new THREE.MeshStandardMaterial({
          map: wallTexture,
          color: 0xcccccc,
          roughness: 0.9,
          metalness: 0.1,
        });
        
        const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
        backWall.position.set(0, 20, -60);
        backWall.receiveShadow = true;
        scene.add(backWall);

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(200, 200);
        const floorMaterial = new THREE.MeshStandardMaterial({
          map: floorTexture,
          roughness: 0.8,
          metalness: 0.1,
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -30;
        floor.receiveShadow = true;
        scene.add(floor);

        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(-30, 50, 30);
        mainLight.castShadow = true;

        // Improve shadow quality
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 500;
        mainLight.shadow.camera.left = -100;
        mainLight.shadow.camera.right = 100;
        mainLight.shadow.camera.top = 100;
        mainLight.shadow.camera.bottom = -100;
        mainLight.shadow.bias = -0.001;
        
        scene.add(mainLight);

        // Add fill lights for softer shadows
        const fillLight1 = new THREE.PointLight(0xffffff, 0.4);
        fillLight1.position.set(50, 40, 20);
        scene.add(fillLight1);

        const fillLight2 = new THREE.PointLight(0xffffff, 0.3);
        fillLight2.position.set(-50, 40, 20);
        scene.add(fillLight2);

        // Add subtle bounce light
        const bounceLight = new THREE.PointLight(0xffffff, 0.2);
        bounceLight.position.set(0, -20, 0);
        scene.add(bounceLight);

        // Make sure renderer has shadow mapping enabled
        if (rendererRef.current) {
          rendererRef.current.shadowMap.enabled = true;
          rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        console.log("Scene setup complete, objects added:", scene.children.length);

        // Force a render when all textures are loaded
        if (rendererRef.current && stableRefs.scene && stableRefs.camera) {
          rendererRef.current.render(stableRefs.scene, stableRefs.camera);
        }
      });

      return scene;
    }, [createTable]);

    // Basic initialization effect
    useEffect(() => {
      if (!canvasRef.current || initCompletedRef.current) return;

      console.log("Initializing Three.js...");
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
      });
      console.log("Renderer created");
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;

      const scene = setupScene();
      stableRefs.scene = scene;
      stableRefs.camera.position.set(0, 60, 120); // Moved camera back
      stableRefs.camera.lookAt(0, 0, 0);

      console.log("Initial render...");
      renderer.render(scene, stableRefs.camera);
      
      // Add animation loop
      const animate = () => {
        if (!mountedRef.current) return;
        
        if (rendererRef.current && stableRefs.scene && stableRefs.camera) {
          rendererRef.current.render(stableRefs.scene, stableRefs.camera);
        }
        
        requestAnimationFrame(animate);
      };
      
      animate();

      initCompletedRef.current = true;
      setIsLoading(false);

      return () => {
        mountedRef.current = false;
        renderer.dispose();
      };
    }, [setupScene]);

    // Game log animation effect
    useEffect(() => {
      if (gameLog.length > displayedGameLog.length) {
        const timer = setTimeout(() => {
          setDisplayedGameLog((prevLog) => {
            const nextIndex = prevLog.length;
            return [...prevLog, gameLog[nextIndex]];
          });
        }, 750);

        return () => {
          clearTimeout(timer);
        };
      }
    }, [gameLog, displayedGameLog]);

    // Handler for when a trade is completed through the UI
    const handleTradeAction = (resourceType: ResourceType, amount: number) => {
      if (!gameState) return;

      const tradingPlayerId = assignedWonders.findIndex(
        (w) => w.name === selectedWonder?.name
      );
      const newState = handleTrade(
        gameState,
        tradingPlayerId,
        resourceType,
        amount
      );

      setGameState(newState);
      setIsTradeModalOpen(false);
    };

    const handleProductionChoice = (choice: ResourceType | ScienceType) => {
      if (!gameState || !productionChoiceState) return;

      const currentChoice = productionChoiceState.choices[productionChoiceState.currentChoiceIndex];

      // Only track used cards if the source name doesn't contain "Stage"
      if (!currentChoice.sourceName.includes("Stage")) {
        setUsedProductionCards(
          (prev) => new Set([...prev, currentChoice.sourceName])
        );
      }

      const updatedGameState = {
        ...gameState,
        players: gameState.players.map((player, index) => {
          if (index === 0) {
            if (currentChoice.sourceType === 'science') {
              // Handle science choice
              return {
                ...player,
                science: {
                  ...player.science,
                  [choice]: (player.science[choice as ScienceType] || 0) + 1
                },
                // Clear the freeScience flag based on the source
                freeScience: {
                  ...player.freeScience,
                  fromWonder: currentChoice.sourceName === "Babylon" ? false : player.freeScience?.fromWonder,
                  fromCard: currentChoice.sourceName === "Scientists Guild" ? false : player.freeScience?.fromCard
                }
              };
            } else {
              // Handle resource choice (existing logic)
              return {
                ...player,
                tempResources: {
                  ...player.tempResources,
                  [choice as ResourceType]: (player.tempResources[choice as ResourceType] || 0) + 1,
                },
              };
            }
          }
          return player;
        }),
      };

      if (productionChoiceState.currentChoiceIndex < productionChoiceState.choices.length - 1) {
        setProductionChoiceState({
          ...productionChoiceState,
          currentChoiceIndex: productionChoiceState.currentChoiceIndex + 1,
        });
      } else {
        setProductionChoiceState(null);
      }

      setGameState(updatedGameState);
    };

    const hasProductionChoiceCard = useMemo(() => {
      if (!gameState) return false;
      const productionCards = Array.from(
        gameState.players[0].playerBoard
      ).filter((card) => card.production && "choice" in card.production);
      return (
        productionCards.length > 0 &&
        productionCards.some((card) => !usedProductionCards.has(card.name))
      );
    }, [gameState, usedProductionCards]);

    const openProductionChoiceModal = () => {
      if (!gameState) return;

      const currentPlayer = gameState.players[0];
      const choiceCards = Array.from(currentPlayer.playerBoard).filter(
        (card) =>
          card.production &&
          "choice" in card.production &&
          !usedProductionCards.has(card.name)
      );

      const choices = choiceCards.map((card) => {
        const production = card.production!;
        const choiceOptions =
          "choice" in production ? production.choice[0].options ?? [] : [];
        const choiceAmount =
          "choice" in production ? production.choice[0].amount ?? 0 : 0;

        return {
          sourceName: card.name,
          sourceImage: card.imagePath,
          options: choiceOptions,
          amount: choiceAmount,
          sourceType: "card" as const,
        };
      });

      setProductionChoiceState({
        choices,
        currentChoiceIndex: 0,
      });
    };

    // Update effect to reset usedProductionCards at the start of each turn
    useEffect(() => {
      if (gameState?.turns !== previousTurn.current) {
        setUsedProductionCards(new Set());
        previousTurn.current = gameState?.turns ?? 0;
      }
    }, [gameState?.turns]);

    const [showEndgameRanking, setShowEndgameRanking] = useState(false);

    useEffect(() => {
      if (gameState && selectedWonder) {
        // Find the matching wonder in the new game state
        const updatedWonder = gameState.players.find(
          player => player.wonder.name === selectedWonder.name
        )?.wonder;
        
        if (updatedWonder) {
          setSelectedWonder(updatedWonder);
        }
      }
    }, [gameState]);

    useEffect(() => {
      if (gameState?.productionChoiceState?.choices[0]?.sourceType === 'science') {
        // Automatically open modal for science choices
        setProductionChoiceState(gameState.productionChoiceState);
      }
    }, [gameState?.productionChoiceState]);

    useEffect(() => {
      if (gameState?.endGameTriggered) {
        setShowEndgameRanking(true);
      }
    }, [gameState?.endGameTriggered]);

    const handlePlayAgain = () => {
      setShowEndgameRanking(false);
      onPlayAgain(); // This should be passed down from Main.tsx
    };

    return (
      <div className="relative w-full h-full">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }}
        />
        {/* Age Display */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-[#E8E4D0]/90 px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-[#1A1A1A]/20">
            <h2 className="text-2xl font-bold text-[#1A1A1A] text-center">
              {gameState?.age === 4 ? "Game Over" : `Age ${gameState?.age}`}
            </h2>
            {gameState?.waitingForSeventhCard && (
              <div className="mt-2 text-center text-[#E85A3C]">
                Take final card action
              </div>
            )}
            {/* {gameState?.finalState && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowEndgameRanking(true)}
                  className="px-6 py-3 bg-[#3A6B96] text-white rounded-lg hover:bg-[#4682B4] transition-colors shadow-sm border border-[#1A1A1A]/10"
                >
                  Continue to Rankings
                </button>
              </div>
            )} */}
          </div>
        </div>

        {/* Floating UI for players/wonders */}
        {gameState && (
          <div className="fixed top-4 left-4 grid grid-cols-2 gap-4 max-w-[calc(100vw-2rem)]">
            {assignedWonders?.map((wonder) => 
              wonder ? (
                <div
                  key={wonder.name}
                  className="bg-[#E8E4D0]/90 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-[#1A1A1A]/20 flex flex-col"
                >
                  <div
                    className="p-2 cursor-pointer hover:bg-[#3A6B96]/10 transition-colors flex flex-col items-center flex-grow"
                    onClick={() => setSelectedWonder(wonder)}
                  >
                    <div className="font-medium text-md text-[#1A1A1A]">
                      {assignedWonders.findIndex(
                        (w) => w.name === wonder.name
                      ) === 0
                        ? ""
                        : `Player ${
                            assignedWonders.findIndex(
                              (w) => w.name === wonder.name
                            ) + 1
                          }`}
                    </div>
                    <div className="text-md text-[#444444] justify-center">
                      {wonder.name}
                    </div>
                  </div>
                  {gameState?.players[assignedWonders.findIndex(
                    (w) => w.name === wonder.name
                  )].playerBoard.size > 0 && (
                    <button
                      className="w-full mt-auto text-sm text-[#1A1A1A] bg-[#3A6B96]/10 hover:bg-[#3A6B96]/20 transition-colors border-t border-[#1A1A1A]/20 p-1.5 text-center"
                      onClick={() => setSelectedPlayerBoardIndex(assignedWonders.findIndex(
                        (w) => w.name === wonder.name
                      ))}
                    >
                      View Board
                    </button>
                  )}
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Wonder detail view */}
        {selectedWonder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedWonder(null)}
          >
            <div
              className="bg-[#E8E4D0] p-6 rounded-lg border border-[#5F9EA0]/30 shadow-2xl"
              style={{
                width: "750px",
                boxShadow:
                  "0 0 40px rgba(0, 0, 0, 0.5), 0 0 15px rgba(95, 158, 160, 0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl text-[#1A1A1A] font-bold">
                    {assignedWonders.findIndex(
                      (w) => w.name === selectedWonder.name
                    ) === 0
                      ? selectedWonder.name
                      : `Player ${
                          assignedWonders.findIndex(
                            (w) => w.name === selectedWonder.name
                          ) + 1
                        }`}
                  </h2>
                  <h3 className="text-lg text-[#444444]">
                    {assignedWonders.findIndex(
                      (w) => w.name === selectedWonder.name
                    ) === 0
                      ? ""
                      : selectedWonder.name}
                  </h3>
                </div>

                {assignedWonders.findIndex(
                  (w) => w.name === selectedWonder.name
                ) !== 0 && (
                  <button
                    className={`rounded-xl p-4 text-white text-md transition-colors border border-[#5F9EA0]/50 shadow-lg ${
                      gameState?.finalState
                        ? "bg-[#5F9EA0]/50 cursor-not-allowed"
                        : "bg-[#5F9EA0] hover:bg-[#4f8789]"
                    }`}
                    onClick={() => setIsTradeModalOpen(true)}
                    disabled={gameState?.finalState}
                  >
                    Trade
                  </button>
                )}

                <button
                  onClick={() => setSelectedWonder(null)}
                  className="rounded-full p-2 bg-[#5F9EA0]/10 hover:bg-[#5F9EA0]/20 transition-colors"
                >
                  <span className="text-[#1A1A1A] text-xl">×</span>
                </button>
              </div>

              {/* Wonder Image */}
              <div className="relative rounded-lg overflow-hidden mb-6 shadow-lg border border-[#5F9EA0]/20">
                <img
                  src={selectedWonder.imagePath}
                  alt={selectedWonder.name}
                  className="w-full h-auto"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(95, 158, 160, 0.2))",
                  }}
                />
              </div>

              {gameState && (
                <div className="grid grid-cols-2 gap-4 text-[#444444] text-sm">
                  {/* Resource Panels */}
                  <div className="bg-[#5F9EA0]/10 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-[#5F9EA0]/20">
                    <h3 className="font-bold mb-2 text-md text-[#1A1A1A]">Resources</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(
                        gameState.players[
                          assignedWonders.findIndex(
                            (w) => w.name === selectedWonder.name
                          )
                        ].resources
                      )
                        .filter(([type]) => type !== "choice")
                        .map(([type, count]) => (
                          <div key={type} className="flex items-center">
                            <span className="text-[#444444] mr-2">{type}:</span>
                            <span className="font-bold text-[#B8860B] text-md">
                              {count}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-[#5F9EA0]/10 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-[#5F9EA0]/20">
                    <h3 className="font-bold mb-2 text-md text-[#1A1A1A]">Temporary Resources</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(
                        gameState.players[
                          assignedWonders.findIndex(
                            (w) => w.name === selectedWonder.name
                          )
                        ].tempResources
                      ).map(([type, count]) => (
                        <div key={type} className="flex items-center">
                          <span className="text-[#444444] mr-2">{type}:</span>
                          <span className="font-bold text-[#B8860B] text-md">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#5F9EA0]/10 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-[#5F9EA0]/20">
                    <h3 className="font-bold mb-2 text-md text-[#1A1A1A]">Wonder Stages</h3>
                    <div className="space-y-2">
                      {selectedWonder.wonderStages.map((stage, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-[#444444]">Stage {index + 1}: </span>
                          <span className={`ml-2 font-bold text-md ${
                            stage.isBuilt ? "text-[#3A6B96]" : "text-[#E85A3C]"
                          }`}>
                            {stage.isBuilt ? "Built" : "Not Built"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#5F9EA0]/10 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-[#5F9EA0]/20">
                    <h3 className="font-bold mb-2 text-md text-[#1A1A1A]">Other Resources</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-[#444444] mr-2">Gold:</span>
                        <span className="font-bold text-[#B8860B] text-md">
                          {gameState.players[
                            assignedWonders.findIndex(
                              (w) => w.name === selectedWonder.name
                            )
                          ].gold}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[#444444] mr-2">Victory Points:</span>
                        <span className="font-bold text-[#3A6B96] text-md">
                          {gameState.players[
                            assignedWonders.findIndex(
                              (w) => w.name === selectedWonder.name
                            )
                          ].victoryPoints}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-[#444444] mr-2">Military Shields:</span>
                        <span className="font-bold text-[#E85A3C] text-md">
                          {gameState.players[
                            assignedWonders.findIndex(
                              (w) => w.name === selectedWonder.name
                            )
                          ].shields}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[#1A1A1A]">Loading game board...</p>
          </div>
        )}

        {/* Game Log */}
        <div className="fixed bottom-4 right-4 w-48 bg-[#E8E4D0]/90 text-[#1A1A1A] font-bold text-sm rounded-lg shadow-lg border border-[#1A1A1A]/20">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => setIsGameLogOpen(!isGameLogOpen)}
          >
            <h3 className="font-bold text-lg">Game Log</h3>
            <span
              className={`text-xl transition-transform ${
                isGameLogOpen ? "transform rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </div>
          {isGameLogOpen && (
            <div
              className="p-4 space-y-2 max-h-48 overflow-y-auto"
              ref={(el) => {
                if (el) {
                  el.scrollTop = el.scrollHeight;
                }
              }}
            >
              {displayedGameLog.map((log, index) => (
                <div key={index} className="text-[#444444]">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {(!gameState?.finalState || gameState?.productionChoiceState?.choices[0]?.sourceType === 'science') && hasProductionChoiceCard ? (
          <button
            className="bg-[#3A6B96] border border-[#1A1A1A]/20 fixed bottom-4 left-8 text-white px-4 py-2 rounded hover:bg-[#4682B4] transition-colors shadow-sm"
            onClick={openProductionChoiceModal}
          >
            Choose Production
          </button>
        ) : (
          <button
            className="bg-[#3A6B96]/50 border border-[#1A1A1A]/20 fixed bottom-4 left-8 text-white px-4 py-2 rounded cursor-not-allowed shadow-sm"
            disabled
          >
            Choose Production
          </button>
        )}

        {productionChoiceState && (
          <ProductionChoiceModal
            card={
              {
                name: productionChoiceState.choices[
                  productionChoiceState.currentChoiceIndex
                ].sourceName,
                imagePath:
                  productionChoiceState.choices[
                    productionChoiceState.currentChoiceIndex
                  ].sourceImage,
                production: {
                  choice: [
                    {
                      options:
                        productionChoiceState.choices[
                          productionChoiceState.currentChoiceIndex
                        ].options,
                      amount:
                        productionChoiceState.choices[
                          productionChoiceState.currentChoiceIndex
                        ].amount,
                    },
                  ],
                },
              } as Card
            }
            onChoiceSelected={handleProductionChoice}
            onClose={() => setProductionChoiceState(null)}
          />
        )}

        {selectedPlayerBoardIndex !== null && (
          <PlayerBoard
            player={gameState!.players[selectedPlayerBoardIndex]}
            onClose={() => setSelectedPlayerBoardIndex(null)}
            onCardClick={() => {}} // We can remove this if we don't need card interactions
          />
        )}

        {isTradeModalOpen && selectedWonder && (
          <TradeModal
            onClose={() => setIsTradeModalOpen(false)}
            onTrade={handleTradeAction}
            selectedWonder={selectedWonder}
            userWonder={assignedWonders[0]}
            gameState={gameState!}
            tradingPlayerId={assignedWonders.findIndex(
              (w) => w.name === selectedWonder?.name
            )}
          />
        )}

        {/* Discard Pile Button */}
        <button
          className="fixed bg-[#3A6B96] border border-[#1A1A1A]/20 text-white px-4 py-2 rounded hover:bg-[#4682B4] transition-colors top-4 right-4"
          onClick={() => setIsDiscardPileOpen(true)}
        >
          Discard Pile {discardPile.length > 0 && `(${discardPile.length})`}
        </button>

        {/* Discard Pile Modal */}
        {isDiscardPileOpen || gameState?.showDiscardPile ? (
          <DiscardPile
            gameState={gameState}
            onClose={() => {
              if (gameState?.showDiscardPile) {
                // Reset the flags when closing from effect
                setGameState({
                  ...gameState,
                  showDiscardPile: false,
                  players: gameState.players.map((p, i) => 
                    i === 0 ? { ...p, cardFromDiscard: false } : p
                  )
                });
              }
              setIsDiscardPileOpen(false);
            }}
            onCardClick={(card, position) => {
              if (gameState?.showDiscardPile) {
                setGameState({
                  ...gameState,
                  showDiscardPile: false,
                  players: gameState.players.map((p, i) => 
                    i === 0 ? {
                      ...p,
                      cardFromDiscard: false,
                      playerBoard: new Set([...p.playerBoard, card])
                    } : p
                  ),
                  discardPile: gameState.discardPile.filter(c => c !== card),
                  gameLog: [...gameState.gameLog, `You retrieved ${card.name} from the discard pile`]
                });
              }
            }}
            isCardFromDiscardEffect={gameState?.showDiscardPile}
          />
        ) : null}

        {showEndgameRanking && (
          <EndgameRanking
            players={gameState?.players ?? []}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    );
  }
);

export default GameBoard;
