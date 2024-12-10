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
import { ResourceType } from "../data/types/resource";
import { handleTrade } from "../game-logic/gameActions";
import ProductionChoiceModal from "./ProductionChoiceModal";
import { ProductionChoiceState } from "../data/types/productionChoice";
import { PlayerBoard } from "./PlayerBoard";
import DiscardPile from "./DiscardPile";

interface GameBoardProps {
  playerCount: number;
  assignedWonders: Wonder[];
  discardPile: Card[];
  gameState: GameState | null;
  gameLog: string[];
  setGameState: (state: GameState) => void;
}

const GameBoard = React.memo(
  ({
    playerCount,
    assignedWonders,
    discardPile = [],
    gameState,
    gameLog,
    setGameState,
  }: GameBoardProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWonder, setSelectedWonder] = useState<Wonder | null>(null);
    const [isGameLogOpen, setIsGameLogOpen] = useState(false);
    const [displayedGameLog, setDisplayedGameLog] = useState<string[]>([]);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [productionChoiceState, setProductionChoiceState] =
      useState<ProductionChoiceState | null>(null);
    const [selectedPlayerBoardIndex, setSelectedPlayerBoardIndex] = useState<number | null>(null);
    const [isDiscardPileOpen, setIsDiscardPileOpen] = useState(false);
    const [usedProductionCards, setUsedProductionCards] = useState<Set<string>>(new Set());
    const previousTurn = useRef<number>(0);

    // Three.js refs
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const mountedRef = useRef(true);
    const initCompletedRef = useRef(false);

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
    const createTable = useCallback(() => {
      const tableGroup = new THREE.Group();

      // Table top
      const tableTopGeometry = new THREE.BoxGeometry(80, 2, 80);
      const tableTopMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
      });
      const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
      tableTop.position.set(0, 0, 0);
      tableTop.castShadow = true;
      tableTop.receiveShadow = true;
      tableGroup.add(tableTop);

      // Table legs
      const legGeometry = new THREE.CylinderGeometry(2.5, 2.5, 30, 16);
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const legPositions = [
        { x: -35, z: -35 },
        { x: -35, z: 35 },
        { x: 35, z: -35 },
        { x: 35, z: 35 },
      ];

      legPositions.forEach((pos) => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos.x, -15, pos.z);
        leg.castShadow = true;
        leg.receiveShadow = true;
        tableGroup.add(leg);
      });

      return tableGroup;
    }, []);

    const setupScene = useCallback(() => {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
      mainLight.position.set(10, 10, 10);
      mainLight.castShadow = true;

      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 100;
      mainLight.shadow.bias = -0.001;

      const shadowSize = 50;
      mainLight.shadow.camera.left = -shadowSize;
      mainLight.shadow.camera.right = shadowSize;
      mainLight.shadow.camera.top = shadowSize;
      mainLight.shadow.camera.bottom = -shadowSize;

      scene.add(mainLight);

      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
      scene.add(hemisphereLight);

      const table = createTable();
      scene.add(table);

      return scene;
    }, [createTable]);

    // Basic initialization effect
    useEffect(() => {
      if (!canvasRef.current || initCompletedRef.current) return;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current = renderer;

      const scene = setupScene();
      stableRefs.scene = scene;
      stableRefs.camera.position.set(0, 60, 80);
      stableRefs.camera.lookAt(0, 0, 0);

      renderer.render(scene, stableRefs.camera);
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

    const handleProductionChoice = (resource: ResourceType) => {
      if (!gameState || !productionChoiceState) return;

      setUsedProductionCards(prev => new Set([...prev, productionChoiceState.choices[productionChoiceState.currentChoiceIndex].cardName]));

      const updatedGameState = {
        ...gameState,
        players: gameState.players.map((player, index) => {
          if (index === 0) {
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

    const hasProductionChoiceCard = useMemo(() => {
      if (!gameState) return false;
      const productionCards = Array.from(gameState.players[0].playerBoard).filter(card => 
        card.production && "choice" in card.production
      );
      return productionCards.length > 0 && productionCards.some(card => !usedProductionCards.has(card.name));
    }, [gameState, usedProductionCards]);

    const openProductionChoiceModal = () => {
      if (!gameState) return;

      const currentPlayer = gameState.players[0];
      const choiceCards = Array.from(currentPlayer.playerBoard).filter(
        (card) => card.production && 
        "choice" in card.production && 
        !usedProductionCards.has(card.name)
      );

      const choices = choiceCards.map((card) => {
        const production = card.production!;
        const choiceOptions = "choice" in production ? production.choice[0].options ?? [] : [];
        const choiceAmount = "choice" in production ? production.choice[0].amount ?? 0 : 0;

        return {
          cardName: card.name,
          cardImage: card.imagePath,
          options: choiceOptions,
          amount: choiceAmount,
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

    return (
      <div className="relative w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Floating UI for players/wonders */}
        {gameState && (
          <div className="fixed top-4 left-4 grid grid-cols-2 gap-4 max-w-[calc(100vw-2rem)]">
            {assignedWonders.map((wonder, index) => (
              <div
                key={wonder.name}
                className="bg-gray-700/50 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 flex flex-col"
              >
                <div
                  className="p-2 cursor-pointer hover:bg-black/90 transition-colors flex flex-col items-center flex-grow"
                  onClick={() => setSelectedWonder(wonder)}
                >
                  <div className="font-medium text-md text-white">
                    {index === 0 ? "" : `Player ${index + 1}`}
                  </div>
                  <div className="text-md text-white/80 justify-center">
                    {wonder.name}
                  </div>
                </div>
                {gameState?.players[index].playerBoard.size > 0 && (
                  <button
                    className="w-full mt-auto text-sm text-white bg-white/10 hover:bg-white/20 transition-colors border-t border-gray-700/50 p-1.5 text-center"
                    onClick={() => setSelectedPlayerBoardIndex(index)}
                  >
                    View Board
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Wonder detail view */}
        {selectedWonder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedWonder(null)}
          >
            <div
              className="bg-gray-900 p-6 rounded-lg border border-white/10 shadow-2xl"
              style={{
                width: "750px",
                boxShadow:
                  "0 0 40px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 255, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl text-white font-bold">
                    {assignedWonders.findIndex((w) => w.name === selectedWonder.name) === 0 
                      ? selectedWonder.name
                      : `Player ${assignedWonders.findIndex((w) => w.name === selectedWonder.name) + 1}`
                    }
                  </h2>
                  <h3 className="text-lg text-white/80">
                    {assignedWonders.findIndex((w) => w.name === selectedWonder.name) === 0 
                      ? ""
                      : selectedWonder.name
                    }
                  </h3>
                </div>

                {assignedWonders.findIndex(
                  (w) => w.name === selectedWonder.name
                ) !== 0 && (
                  <button
                    onClick={() => setIsTradeModalOpen(true)}
                    className="rounded-xl p-4 text-white text-md bg-white/10 hover:bg-white/20 transition-colors border border-gray-700/50 shadow-lg"
                  >
                    Trade
                  </button>
                )}

                <button
                  onClick={() => setSelectedWonder(null)}
                  className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <span className="text-white/80 text-xl">×</span>
                </button>
              </div>

              {/* Wonder Image */}
              <div className="relative rounded-lg overflow-hidden mb-6">
                <img
                  src={selectedWonder.imagePath}
                  alt={selectedWonder.name}
                  className="rounded shadow-2xl"
                  style={{
                    width: "auto",
                    height: "auto",
                    objectFit: "cover",
                    filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))",
                  }}
                />
              </div>

              {gameState && (
                <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
                  {/* Permanent Resources Panel */}
                  <div className="bg-gray-700/50 p-4 rounded-lg shadow-lg backdrop-blur-sm">
                    <h3 className="font-bold mb-2 text-md">Resources</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(
                        gameState.players[
                          assignedWonders.findIndex(
                            (w) => w.name === selectedWonder.name
                          )
                        ].resources
                      )
                        .filter(([type]) => type !== 'choice')
                        .map(([type, count]) => (
                          <div key={type} className="flex items-center">
                            <span className="text-white/80 mr-2">{type}:</span>
                            <span className="font-bold text-white">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Temporary Resources Panel */}
                  <div className="bg-gray-700/50 p-4 rounded-lg shadow-lg backdrop-blur-sm">
                    <h3 className="font-bold mb-2 text-md">
                      Temporary Resources
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(
                        gameState.players[
                          assignedWonders.findIndex(
                            (w) => w.name === selectedWonder.name
                          )
                        ].tempResources
                      ).map(([type, count]) => (
                        <div key={type} className="flex items-center">
                          <span className="text-white/80 mr-2">{type}:</span>
                          <span className="font-bold text-white">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wonder Stages */}
                  <div className="bg-gray-700/50 p-4 rounded-lg shadow-lg backdrop-blur-sm">
                    <h3 className="font-bold mb-2 text-md">Wonder Stages</h3>
                    <div className="space-y-2">
                      {selectedWonder.wonderStages.map((stage, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-white/80">
                            Stage {index + 1}:{" "}
                          </span>
                          <span
                            className={`ml-2 font-bold text-md ${
                              stage.isBuilt ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {stage.isBuilt ? "Built" : "Not Built"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Player Stats */}
                  <div className="bg-gray-700/50 p-4 rounded-lg shadow-lg backdrop-blur-sm">
                    <h3 className="font-bold mb-2 text-md">Other Resources</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">Gold:</span>
                        <span className="font-bold text-yellow-400 text-md">
                          {
                            gameState.players[
                              assignedWonders.findIndex(
                                (w) => w.name === selectedWonder.name
                              )
                            ].gold
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">Victory Points:</span>
                        <span className="font-bold text-blue-400 text-md">
                          {
                            gameState.players[
                              assignedWonders.findIndex(
                                (w) => w.name === selectedWonder.name
                              )
                            ].victoryPoints
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">Military Shields:</span>
                        <span className="font-bold text-red-400 text-md">
                          {
                            gameState.players[
                              assignedWonders.findIndex(
                                (w) => w.name === selectedWonder.name
                              )
                            ].shields
                          }
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
            <p className="text-white">Loading game board...</p>
          </div>
        )}

        {/* Game Log */}
        <div className="fixed bottom-4 right-4 w-48 bg-black/80 text-white font-bold text-sm rounded-lg shadow-2xl border border-gray-400">
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
                <div key={index} className="opacity-80">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {hasProductionChoiceCard ? (
          <button
            className="bg-gray-700/50 border border-gray-400 fixed bottom-4 left-8 text-white px-4 py-2 rounded hover:bg-black/90 transition-colors"
            onClick={openProductionChoiceModal}
          >
            Choose Production
          </button>
        ) : (
          <button
            className="bg-gray-500/50 border border-gray-400 fixed bottom-4 left-8 text-white px-4 py-2 rounded cursor-not-allowed"
            disabled
          >
            Choose Production
          </button>
        )}

        {productionChoiceState && (
          <ProductionChoiceModal
            card={{
              name: productionChoiceState.choices[productionChoiceState.currentChoiceIndex].cardName,
              imagePath: productionChoiceState.choices[productionChoiceState.currentChoiceIndex].cardImage,
              production: {
                choice: [{
                  options: productionChoiceState.choices[productionChoiceState.currentChoiceIndex].options,
                  amount: productionChoiceState.choices[productionChoiceState.currentChoiceIndex].amount
                }]
              }
            } as Card}
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
          className="fixed bg-gray-700/50 border border-gray-400 text-white px-4 py-2 rounded hover:bg-black/90 transition-colors top-4 right-4"
          onClick={() => setIsDiscardPileOpen(true)}
        >
          Discard Pile {discardPile.length > 0 && `(${discardPile.length})`}
        </button>

        {/* Discard Pile Modal */}
        {isDiscardPileOpen && gameState && (
          <DiscardPile
            gameState={gameState}
            onClose={() => setIsDiscardPileOpen(false)}
            onCardClick={() => {}} // You can implement card click handling if needed
          />
        )}
      </div>
    );
  }
);

export default GameBoard;
