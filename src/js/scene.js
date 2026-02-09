/**
 * Scene Manager
 * Handles Three.js scene setup and 3D visualization for Daily Report
 */

import * as THREE from 'three';

export class SceneManager {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.reportCards = [];
    this.pillars = [];
    this.time = 0;
  }

  async init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0F1419);
    this.scene.fog = new THREE.Fog(0x0F1419, 30, 100);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 8, 20);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('canvas'),
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Create 3D elements
    this.createEnvironment();
    this.createPillars();
    this.createLights();

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  createEnvironment() {
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1A1F26,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid helper (subtle)
    const gridHelper = new THREE.GridHelper(50, 50, 0x556B2F, 0x2A3139);
    gridHelper.position.y = -1.9;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);

    // Ambient particles
    this.createParticles();
  }

  createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x556B2F,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(particles);
    this.particles = particles;
  }

  createPillars() {
    const pillarPositions = [
      { x: -8, color: 0x4169E1, name: 'Canvasing' },
      { x: 0, color: 0xDC143C, name: 'Live' },
      { x: 8, color: 0x32CD32, name: 'Konten' },
    ];

    pillarPositions.forEach((config, index) => {
      const pillar = this.createPillar(config.color, config.name);
      pillar.position.set(config.x, 0, 0);
      this.scene.add(pillar);
      this.pillars.push(pillar);
    });
  }

  createPillar(color, name) {
    const group = new THREE.Group();

    // Base
    const baseGeometry = new THREE.CylinderGeometry(1.5, 1.8, 0.5, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x556B2F,
      roughness: 0.4,
      metalness: 0.6,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.75;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Main pillar
    const pillarGeometry = new THREE.CylinderGeometry(1.2, 1.2, 8, 32);
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.3,
      metalness: 0.7,
      emissive: color,
      emissiveIntensity: 0.2,
    });
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar.position.y = 2.5;
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    group.add(pillar);

    // Top cap
    const capGeometry = new THREE.CylinderGeometry(1.5, 1.2, 0.8, 32);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0x556B2F,
      roughness: 0.4,
      metalness: 0.6,
    });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 7;
    cap.castShadow = true;
    group.add(cap);

    // Glow ring
    const ringGeometry = new THREE.TorusGeometry(1.3, 0.1, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = 2.5;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    group.userData = { name, color, ring };
    return group;
  }

  createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x556B2F, 0.4);
    this.scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0x9ACD32, 1);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    this.scene.add(mainLight);

    // Accent lights for each pillar
    const accentColors = [0x4169E1, 0xDC143C, 0x32CD32];
    const positions = [-8, 0, 8];

    positions.forEach((x, i) => {
      const light = new THREE.PointLight(accentColors[i], 1, 15);
      light.position.set(x, 5, 0);
      this.scene.add(light);
    });

    // Hemisphere light for better ambient
    const hemiLight = new THREE.HemisphereLight(0x9ACD32, 0x1A1F26, 0.6);
    this.scene.add(hemiLight);
  }

  update() {
    this.time += 0.01;

    // Animate pillars
    this.pillars.forEach((pillar, index) => {
      const ring = pillar.userData.ring;
      if (ring) {
        ring.rotation.z = this.time + index;
        ring.position.y = 2.5 + Math.sin(this.time * 2 + index) * 0.2;
      }
    });

    // Animate particles
    if (this.particles) {
      this.particles.rotation.y = this.time * 0.05;
    }

    // Gentle camera sway
    this.camera.position.x = Math.sin(this.time * 0.2) * 0.5;
    this.camera.position.y = 8 + Math.sin(this.time * 0.3) * 0.3;
    this.camera.lookAt(0, 2, 0);
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
