import * as THREE from "three";

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Setup fade mesh
    const fadeGeometry = new THREE.PlaneGeometry(2, 2);
    const fadeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      transparent: true,
      opacity: 0 
    });
    const fadeMesh = new THREE.Mesh(fadeGeometry, fadeMaterial);
    fadeMesh.name = "fadeMesh";
    
    this.camera.position.z = 5;
    this.scene.add(fadeMesh);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  init(): HTMLCanvasElement {
    this.animate();
    
    return this.renderer.domElement;
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  cleanup() {
    this.renderer.dispose();
  }
}