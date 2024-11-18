import * as THREE from "three";

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor() {
    // Create a new Three.js scene
    this.scene = new THREE.Scene();

    // Create a perspective camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Create a WebGL renderer
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
    
    // Set initial camera position
    this.camera.position.z = 5;

    // Add the fade mesh to the scene
    this.scene.add(fadeMesh);
  }

  // Animation loop
  private animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  // Initialize the scene manager
  init(): HTMLCanvasElement {
    // Start the animation loop
    this.animate();
    
    // Return the renderer's DOM element
    return this.renderer.domElement;
  }

  // Get the Three.js scene
  getScene(): THREE.Scene {
    return this.scene;
  }

  // Cleanup resources
  cleanup() {
    this.renderer.dispose();
  }
}