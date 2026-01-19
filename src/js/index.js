import * as THREE from 'three';
import { HandGestureDetector } from './modules/HandGestureDetector.js';
import { VillaModel } from './modules/VillaModel.js';
import { ParticleSystem } from './modules/ParticleSystem.js';
import { UIManager } from './modules/UIManager.js';

class VillaGestureApp {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.villa = null;
    this.particles = null;
    this.gestureDetector = null;
    this.uiManager = null;
    this.isDeconstructed = false;
    this.reconstructionProgress = 0;
    this.handPosition = { x: 0, y: 0 };
    this.lastHandOpenness = 0;
  }

  async init() {
    try {
      // Setup Three.js
      this.setupThreeJS();

      // Initialize Hand Gesture Detector
      this.gestureDetector = new HandGestureDetector();
      await this.gestureDetector.init();

      // Create Villa Model
      this.villa = new VillaModel(this.scene);
      await this.villa.create();

      // Create Particle System
      this.particles = new ParticleSystem(this.scene);

      // Initialize UI Manager
      this.uiManager = new UIManager();
      this.uiManager.init();

      // Setup event listeners
      this.setupEventListeners();

      // Hide loading screen
      this.hideLoadingScreen();

      // Start animation loop
      this.animate();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.uiManager?.showError('Failed to initialize application');
    }
  }

  setupThreeJS() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e27);
    this.scene.fog = new THREE.Fog(0x0a0e27, 100, 1000);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('canvas'),
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Lighting
    this.setupLighting();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);

    // Point light for accent
    const pointLight = new THREE.PointLight(0x8b5cf6, 0.5);
    pointLight.position.set(-10, 10, 10);
    this.scene.add(pointLight);

    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  setupEventListeners() {
    document.getElementById('btn-reset').addEventListener('click', () => {
      this.resetView();
    });

    document.getElementById('btn-toggle-info').addEventListener('click', () => {
      this.uiManager.togglePropertyPanel();
    });

    document.querySelector('.btn-inquiry').addEventListener('click', () => {
      this.uiManager.showInquiryForm();
    });
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    // Get hand data
    const handData = this.gestureDetector.getHandData();

    if (handData) {
      this.updateHandInteraction(handData);
      this.uiManager.updateHandStatus(true);
    } else {
      this.uiManager.updateHandStatus(false);
    }

    // Update particles
    if (this.particles) {
      this.particles.update();
    }

    // Render
    this.renderer.render(this.scene, this.camera);
  };

  updateHandInteraction(handData) {
    const openness = handData.openness;

    // Detect hand state change dengan hysteresis
    if (openness > 0.65 && this.lastHandOpenness <= 0.65) {
      // Hand opened - start deconstruction
      this.startDeconstruction();
    } else if (openness < 0.35 && this.lastHandOpenness >= 0.35) {
      // Hand closed - start reconstruction
      this.startReconstruction();
    }

    this.lastHandOpenness = openness;

    // Update hand position for rotation (smooth lerp)
    const targetX = (handData.x - 0.5) * Math.PI * 0.6;
    const targetY = (handData.y - 0.5) * Math.PI * 0.6;

    if (this.villa) {
      this.villa.group.rotation.x = THREE.MathUtils.lerp(
        this.villa.group.rotation.x,
        targetX,
        0.08
      );
      this.villa.group.rotation.y = THREE.MathUtils.lerp(
        this.villa.group.rotation.y,
        targetY,
        0.08
      );
    }

    // Handle zoom with pinch
    if (handData.pinchDistance > 0.1) {
      this.updateZoom(handData.pinchDistance);
    }
  }

  startDeconstruction() {
    if (this.isDeconstructed) return;

    this.isDeconstructed = true;
    this.uiManager.showMessage('Deconstructing villa...');

    // Create particles from villa
    if (this.villa && this.particles) {
      this.particles.createFromMesh(this.villa.group, 1000);
      this.villa.hide();
    }
  }

  startReconstruction() {
    if (!this.isDeconstructed) return;

    this.isDeconstructed = false;
    this.uiManager.showMessage('Reconstructing villa...');

    // Reconstruct villa
    if (this.villa && this.particles) {
      this.particles.reconstructToMesh(this.villa.group, () => {
        this.villa.show();
        this.particles.clear();
      });
    }
  }

  updateZoom(pinchDistance) {
    const targetDistance = 10 + pinchDistance * 20;
    const currentDistance = this.camera.position.length();
    const newDistance = THREE.MathUtils.lerp(currentDistance, targetDistance, 0.1);

    const direction = this.camera.position.normalize();
    this.camera.position.copy(direction.multiplyScalar(newDistance));
  }

  resetView() {
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 0, 0);
    this.isDeconstructed = false;
    if (this.villa) this.villa.show();
    if (this.particles) this.particles.clear();
    this.uiManager.showMessage('View reset');
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const app = new VillaGestureApp();
  await app.init();
});
