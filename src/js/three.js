import * as T from 'three';

const device = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio
};

export default class Three {
  constructor(canvas) {
    this.canvas = canvas;
    this.particles = null;
    this.mouseX = 0;
    this.mouseY = 0;

    this.scene = new T.Scene();

    this.camera = new T.PerspectiveCamera(
      75,
      device.width / device.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 50);

    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.clock = new T.Clock();

    this.createParticles();
    this.createGeometricShapes();
    this.setMouseMove();
    this.render();
    this.setResize();
  }

  createParticles() {
    const particleCount = 1500;
    const geometry = new T.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Gold color variations
    const goldColors = [
      { r: 0.83, g: 0.69, b: 0.22 }, // #d4af37
      { r: 0.96, g: 0.89, b: 0.73 }, // #f4e4ba
      { r: 0.72, g: 0.59, b: 0.05 }, // #b8960c
      { r: 1.0, g: 0.84, b: 0.0 }    // Pure gold
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spread particles in a sphere
      const radius = 80 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random gold color
      const color = goldColors[Math.floor(Math.random() * goldColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new T.BufferAttribute(colors, 3));

    const material = new T.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: T.AdditiveBlending
    });

    this.particles = new T.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createGeometricShapes() {
    // Create floating geometric shapes with gold wireframe
    const goldMaterial = new T.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });

    // Icosahedron
    const icosahedron = new T.Mesh(
      new T.IcosahedronGeometry(8, 1),
      goldMaterial
    );
    icosahedron.position.set(-30, 10, -20);
    this.scene.add(icosahedron);
    this.icosahedron = icosahedron;

    // Octahedron
    const octahedron = new T.Mesh(
      new T.OctahedronGeometry(6, 0),
      goldMaterial.clone()
    );
    octahedron.position.set(35, -15, -30);
    this.scene.add(octahedron);
    this.octahedron = octahedron;

    // Torus
    const torus = new T.Mesh(
      new T.TorusGeometry(10, 2, 16, 50),
      goldMaterial.clone()
    );
    torus.position.set(0, -30, -40);
    this.scene.add(torus);
    this.torus = torus;

    // Dodecahedron
    const dodecahedron = new T.Mesh(
      new T.DodecahedronGeometry(5, 0),
      goldMaterial.clone()
    );
    dodecahedron.position.set(-40, -20, -25);
    this.scene.add(dodecahedron);
    this.dodecahedron = dodecahedron;
  }

  setMouseMove() {
    window.addEventListener('mousemove', (event) => {
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();

    // Rotate particles slowly
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.05;
      this.particles.rotation.x = elapsedTime * 0.02;
    }

    // Animate geometric shapes
    if (this.icosahedron) {
      this.icosahedron.rotation.x = elapsedTime * 0.3;
      this.icosahedron.rotation.y = elapsedTime * 0.2;
      this.icosahedron.position.y = 10 + Math.sin(elapsedTime * 0.5) * 5;
    }

    if (this.octahedron) {
      this.octahedron.rotation.x = elapsedTime * 0.4;
      this.octahedron.rotation.z = elapsedTime * 0.3;
      this.octahedron.position.y = -15 + Math.sin(elapsedTime * 0.7) * 4;
    }

    if (this.torus) {
      this.torus.rotation.x = elapsedTime * 0.2;
      this.torus.rotation.y = elapsedTime * 0.3;
    }

    if (this.dodecahedron) {
      this.dodecahedron.rotation.y = elapsedTime * 0.5;
      this.dodecahedron.rotation.z = elapsedTime * 0.2;
      this.dodecahedron.position.y = -20 + Math.sin(elapsedTime * 0.6) * 3;
    }

    // Camera follows mouse slightly
    this.camera.position.x += (this.mouseX * 10 - this.camera.position.x) * 0.02;
    this.camera.position.y += (this.mouseY * 10 - this.camera.position.y) * 0.02;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    device.width = window.innerWidth;
    device.height = window.innerHeight;

    this.camera.aspect = device.width / device.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
  }
}
