import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Wonder } from '../../data/types/wonder';
import { wonders } from '../../data/wonders';

interface WonderSelectorProps {
  onWonderSelected: (wonder: Wonder) => void;
}

const WonderSelector: React.FC<WonderSelectorProps> = ({ onWonderSelected }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Group wonders by base name (without A/B suffix)
  const wonderGroups = wonders.reduce((acc: Record<string, Wonder[]>, wonder) => {
    const baseName = wonder.name.slice(0, -2); // Remove the " A" or " B"
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(wonder);
    return acc;
  }, {});

  // Flatten the grouped wonders into a single array that matches our image order
  const flatWonders = Object.values(wonderGroups).flat();
  const wonderImages = flatWonders.map(wonder => wonder.imagePath);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const loader = new THREE.TextureLoader();
    const geometry = new THREE.PlaneGeometry(4, 3);
    const materials = wonderImages.map((image) => {
      const texture = loader.load(image);
      return new THREE.MeshBasicMaterial({ map: texture });
    });

    const imagePlanes = materials.map((material) => {
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return mesh;
    });

    const updateCurrentImage = () => {
      imagePlanes.forEach((plane, index) => {
        plane.visible = index === currentIndex;
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      updateCurrentImage();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      scene.remove(...imagePlanes);
      renderer.dispose();
    };
  }, [wonderImages, currentIndex]);

  const handleArrowClick = (direction: number) => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + direction + wonderImages.length) % wonderImages.length;
      return newIndex;
    });
  };

  const handleSelectWonder = () => {
    const currentWonder = flatWonders[currentIndex];
    if (!currentWonder) {
      console.error('No wonder found at index:', currentIndex);
      return;
    }
    console.log('Selected wonder:', currentWonder.name);
    onWonderSelected(currentWonder);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={containerRef} className="relative w-full h-[500px]">
        <div 
          className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer z-10" 
          onClick={() => handleArrowClick(-1)}
        >
          <ArrowLeft size={32} className="text-white" />
        </div>
        <div 
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer z-10" 
          onClick={() => handleArrowClick(1)}
        >
          <ArrowRight size={32} className="text-white" />
        </div>
      </div>
      <button
        onClick={handleSelectWonder}
        className="bg-neutral-50 bg-opacity-10 text-white font-normal italic text-2xl px-6 py-2 border-3 border-black rounded-3xl"
      >
        Select Wonder
      </button>
    </div>
  );
};

export default WonderSelector;