import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import * as THREE from "three";
import { Wonder } from "../game-logic/types/wonder";
import { Card } from "../game-logic/types/card";

interface GameBoardProps {
  playerCount: number;
  assignedWonders: Wonder[];
  discardPile: Card[];
}

const GameBoard = React.memo(({ playerCount, assignedWonders, discardPile = [] }: GameBoardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWonder, setSelectedWonder] = useState<Wonder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mountedRef = useRef(true);
  const initCompletedRef = useRef(false);

  const stableRefs = useMemo(() => ({
    scene: null as THREE.Scene | null,
    camera: new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.5, 500),
  }), []);

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

    legPositions.forEach((pos, index) => {
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

    const hemisphereLight = new THREE.HemisphereLight(
      0xffffff,
      0x444444,
      0.3
    );
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
      antialias: true 
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

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Floating UI for players/wonders */}
      <div className="absolute top-4 left-4 space-y-2">
        {assignedWonders.map((wonder, index) => (
          <div 
            key={wonder.name}
            className="bg-black/80 text-white p-2 rounded cursor-pointer hover:bg-black/90"
            onClick={() => setSelectedWonder(wonder)}
          >
            <div>Player {index + 1}</div>
            <div className="text-sm opacity-80">{wonder.name}</div>
          </div>
        ))}
      </div>

      {/* Wonder detail view */}
      {selectedWonder && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-black p-4 rounded max-w-2xl">
            <h2 className="text-xl text-white mb-2">{selectedWonder.name}</h2>
            <img src={selectedWonder.imagePath} alt={selectedWonder.name} className="w-full h-auto mb-4" />
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setSelectedWonder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white">Loading game board...</p>
        </div>
      )}
    </div>
  );
});

export default GameBoard;
