import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);
    this.isReconstructing = false;
  }

  createFromMesh(mesh, count = 1000) {
    this.clear();

    const positions = [];
    const colors = [];
    const velocities = [];

    // Get random points from mesh
    mesh.traverse((child) => {
      if (child.geometry) {
        const geometry = child.geometry;
        geometry.computeBoundingBox();

        for (let i = 0; i < count; i++) {
          // Random position within bounding box
          const bbox = geometry.boundingBox;
          const x = Math.random() * (bbox.max.x - bbox.min.x) + bbox.min.x;
          const y = Math.random() * (bbox.max.y - bbox.min.y) + bbox.min.y;
          const z = Math.random() * (bbox.max.z - bbox.min.z) + bbox.min.z;

          positions.push(x, y, z);

          // Random color (golden/glowing)
          const hue = Math.random() * 0.15 + 0.08; // Yellow to orange
          const color = new THREE.Color().setHSL(hue, 1, 0.6);
          colors.push(color.r, color.g, color.b);

          // Random velocity (explosion effect)
          const vx = (Math.random() - 0.5) * 0.3;
          const vy = (Math.random() - 0.5) * 0.3 + 0.1;
          const vz = (Math.random() - 0.5) * 0.3;
          velocities.push(vx, vy, vz);

          // Create particle
          const particle = {
            position: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(vx, vy, vz),
            color: color,
            life: 1,
            maxLife: 1,
            size: Math.random() * 0.3 + 0.1,
          };

          this.particles.push(particle);
        }
      }
    });

    // Create particle geometry
    this.createParticleGeometry();
  }

  createParticleGeometry() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    this.particles.forEach((particle) => {
      positions.push(particle.position.x, particle.position.y, particle.position.z);
      colors.push(particle.color.r, particle.color.g, particle.color.b);
      sizes.push(particle.size);
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(new Float32Array(sizes), 1));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    this.particleGroup.add(points);
  }

  update() {
    if (this.particles.length === 0) return;

    const positions = [];
    const opacities = [];

    this.particles.forEach((particle) => {
      // Apply physics
      particle.velocity.y -= 0.008; // Gravity
      particle.velocity.multiplyScalar(0.98); // Air resistance
      particle.position.add(particle.velocity);

      // Fade out
      particle.life -= 0.008;
      if (particle.life < 0) particle.life = 0;

      positions.push(particle.position.x, particle.position.y, particle.position.z);
      opacities.push(particle.life);
    });

    // Update geometry
    if (this.particleGroup.children.length > 0) {
      const points = this.particleGroup.children[0];
      if (points.geometry.attributes.position) {
        points.geometry.attributes.position.array = new Float32Array(positions);
        points.geometry.attributes.position.needsUpdate = true;
      }

      // Update opacity
      const maxOpacity = Math.max(...opacities);
      points.material.opacity = Math.max(0.1, maxOpacity);
    }

    // Remove dead particles
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  reconstructToMesh(targetMesh, onComplete) {
    if (this.particles.length === 0) {
      onComplete?.();
      return;
    }

    this.isReconstructing = true;
    let progress = 0;
    const duration = 1000; // 1 second
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(1, elapsed / duration);

      // Move particles towards center
      this.particles.forEach((particle) => {
        const targetPos = new THREE.Vector3(0, 0, 0);
        particle.position.lerp(targetPos, progress * 0.1);
        particle.life = 1 - progress * 0.5;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isReconstructing = false;
        onComplete?.();
      }
    };

    animate();
  }

  clear() {
    this.particles = [];
    this.particleGroup.clear();
  }

  dispose() {
    this.clear();
    this.particleGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
  }
}
