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
    this.scene.background = new THREE.Color(0x0a_0e_27);
    this.scene.fog = new THREE.Fog(0x0a_0e_27, 30, 100);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 25);
    this.camera.lookAt(0, 2, -5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#canvas'),
      antialias: true,
      alpha: true
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
    // Ground with gradient
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a_0e_27,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Animated waves background
    this.createWaves();

    // Floating particles (confetti style)
    this.createConfettiParticles();
  }

  createWaves() {
    const waveGeometry = new THREE.PlaneGeometry(80, 40, 32, 16);
    const waveMaterial = new THREE.MeshStandardMaterial({
      color: 0xff_6b_35,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });

    for (let index = 0; index < 3; index++) {
      const wave = new THREE.Mesh(waveGeometry, waveMaterial.clone());
      wave.rotation.x = -Math.PI / 3;
      wave.position.z = -20 - index * 10;
      wave.position.y = -2;
      this.scene.add(wave);

      if (!this.waves) this.waves = [];
      this.waves.push({ mesh: wave, offset: index * 2 });
    }
  }

  createConfettiParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorPalette = [
      new THREE.Color(0xff_6b_35), // Orange
      new THREE.Color(0xf7_b8_01), // Yellow
      new THREE.Color(0x66_7e_ea), // Purple
      new THREE.Color(0xf0_93_fb), // Pink
      new THREE.Color(0x4f_ac_fe), // Cyan
      new THREE.Color(0x06_d6_a0) // Teal
    ];

    for (let index = 0; index < particlesCount; index++) {
      positions[index * 3] = (Math.random() - 0.5) * 60;
      positions[index * 3 + 1] = Math.random() * 40 - 10;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 60;

      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(particles);
    this.particles = particles;
  }

  createPillars() {
    // Create floating achievement badges instead of pillars
    const badgePositions = [
      { x: -10, color: 0x66_7e_ea, name: 'Canvasing' },
      { x: 0, color: 0xf0_93_fb, name: 'Live' },
      { x: 10, color: 0x4f_ac_fe, name: 'Konten' }
    ];

    for (const [index, config] of badgePositions.entries()) {
      const badge = this.createFloatingBadge(config.color, config.name);
      badge.position.set(config.x, 3, -5);
      this.scene.add(badge);
      this.pillars.push(badge);
    }
  }

  createFloatingBadge(color, name) {
    const group = new THREE.Group();

    // Main badge circle
    const badgeGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const badgeMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.2,
      metalness: 0.8,
      emissive: color,
      emissiveIntensity: 0.3
    });
    const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
    badge.rotation.x = Math.PI / 2;
    badge.castShadow = true;
    group.add(badge);

    // Inner ring
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.15, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xff_ff_ff,
      roughness: 0.3,
      metalness: 0.7
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Glow effect
    const glowGeometry = new THREE.CircleGeometry(2.5, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.3;
    group.add(glow);

    group.userData = { name, color, glow, ring };
    return group;
  }

  createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xff_6b_35, 0.3);
    this.scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xff_ff_ff, 1.2);
    mainLight.position.set(15, 25, 15);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 60;
    mainLight.shadow.camera.left = -25;
    mainLight.shadow.camera.right = 25;
    mainLight.shadow.camera.top = 25;
    mainLight.shadow.camera.bottom = -25;
    this.scene.add(mainLight);

    // Accent lights for each badge
    const accentColors = [0x66_7e_ea, 0xf0_93_fb, 0x4f_ac_fe];
    const positions = [-10, 0, 10];

    for (const [index, x] of positions.entries()) {
      const light = new THREE.PointLight(accentColors[index], 2, 20);
      light.position.set(x, 5, -5);
      this.scene.add(light);
    }

    // Hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xff_6b_35, 0x0a_0e_27, 0.8);
    this.scene.add(hemiLight);

    // Spotlight for dramatic effect
    const spotLight = new THREE.SpotLight(0xf7_b8_01, 1.5);
    spotLight.position.set(0, 20, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.decay = 2;
    spotLight.distance = 50;
    this.scene.add(spotLight);
  }

  update() {
    this.time += 0.01;

    // Animate floating badges
    for (const [index, badge] of this.pillars.entries()) {
      // Float up and down
      badge.position.y = 3 + Math.sin(this.time * 1.5 + index * 2) * 0.5;

      // Gentle rotation
      badge.rotation.y = this.time * 0.3 + index;

      // Pulse glow
      const glow = badge.userData.glow;
      if (glow) {
        glow.material.opacity = 0.2 + Math.sin(this.time * 2 + index) * 0.1;
      }

      // Rotate ring
      const ring = badge.userData.ring;
      if (ring) {
        ring.rotation.z = this.time * 0.5;
      }
    }

    // Animate waves
    if (this.waves) {
      for (const [index, wave] of this.waves.entries()) {
        const positions = wave.mesh.geometry.attributes.position;
        for (let index_ = 0; index_ < positions.count; index_++) {
          const x = positions.getX(index_);
          const y = positions.getY(index_);
          const waveX = Math.sin(x * 0.5 + this.time + wave.offset) * 0.5;
          const waveY = Math.sin(y * 0.5 + this.time + wave.offset) * 0.5;
          positions.setZ(index_, waveX + waveY);
        }
        positions.needsUpdate = true;
      }
    }

    // Animate confetti particles (falling and rotating)
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position;
      for (let index = 0; index < positions.count; index++) {
        let y = positions.getY(index);
        y -= 0.02; // Fall speed

        // Reset to top when reaching bottom
        if (y < -10) {
          y = 30;
          positions.setX(index, (Math.random() - 0.5) * 60);
          positions.setZ(index, (Math.random() - 0.5) * 60);
        }

        positions.setY(index, y);
      }
      positions.needsUpdate = true;

      // Gentle rotation
      this.particles.rotation.y = this.time * 0.1;
    }

    // Smooth camera movement
    this.camera.position.x = Math.sin(this.time * 0.15) * 2;
    this.camera.position.y = 10 + Math.sin(this.time * 0.2) * 0.5;
    this.camera.lookAt(0, 2, -5);
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
