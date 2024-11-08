import * as THREE from "three";

export const fadeOut = (scene: THREE.Scene, onComplete: () => void) => {
  const fadeMesh = scene.children.find((child) => child.name === "fadeMesh");
  if (fadeMesh instanceof THREE.Mesh) {
    const fadeMaterial = fadeMesh.material as THREE.MeshBasicMaterial;
    fadeMaterial.opacity = 0; // Start fully transparent
    
    const fadeOutAnimation = () => {
      fadeMaterial.opacity += 0.05;
      if (fadeMaterial.opacity < 1) {
        requestAnimationFrame(fadeOutAnimation);
      } else {
        onComplete();
      }
    };
    fadeOutAnimation();
  }
};

export const fadeIn = (scene: THREE.Scene, onComplete: () => void) => {
  const fadeMesh = scene.children.find((child) => child.name === "fadeMesh");
  if (fadeMesh instanceof THREE.Mesh) {
    const fadeMaterial = fadeMesh.material as THREE.MeshBasicMaterial;
    fadeMaterial.opacity = 1; // Start fully opaque
    
    const fadeInAnimation = () => {
      fadeMaterial.opacity -= 0.05;
      if (fadeMaterial.opacity > 0) {
        requestAnimationFrame(fadeInAnimation);
      } else {
        onComplete();
      }
    };
    fadeInAnimation();
  }
};