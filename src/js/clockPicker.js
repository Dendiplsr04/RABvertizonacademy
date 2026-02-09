/**
 * 3D Clock Picker
 * Interactive 3D clock for time selection
 */

import * as THREE from 'three';

export class ClockPicker {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.hourHand = null;
    this.minuteHand = null;
    this.isDragging = false;
    this.dragTarget = null;
    this.selectedHour = 8;
    this.selectedMinute = 0;
    this.onTimeChange = null;
  }

  init() {
    if (!this.container) return;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 8);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.append(this.renderer.domElement);

    // Create clock
    this.createClock();
    this.createHands();
    this.createLights();

    // Setup interaction
    this.setupInteraction();

    // Animation loop
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  createClock() {
    // Clock face
    const faceGeometry = new THREE.CircleGeometry(3, 64);
    const faceMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e_21_39,
      roughness: 0.3,
      metalness: 0.7
    });
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    this.scene.add(face);

    // Clock border
    const borderGeometry = new THREE.RingGeometry(2.9, 3.1, 64);
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0xff_6b_35,
      roughness: 0.2,
      metalness: 0.8
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = 0.01;
    this.scene.add(border);

    // Hour markers
    for (let index = 0; index < 12; index++) {
      const angle = (index * 30 - 90) * (Math.PI / 180);
      const radius = 2.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const markerGeometry = new THREE.CircleGeometry(0.15, 16);
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: index % 3 === 0 ? 0xf7_b8_01 : 0xff_ff_ff,
        roughness: 0.3
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, 0.02);
      this.scene.add(marker);
    }

    // Center dot
    const centerGeometry = new THREE.CircleGeometry(0.2, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0xff_6b_35,
      roughness: 0.2,
      metalness: 0.8
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.z = 0.1;
    this.scene.add(center);

    this.clock = face;
  }

  createHands() {
    // Hour hand
    const hourGeometry = new THREE.BoxGeometry(0.15, 1.5, 0.1);
    const hourMaterial = new THREE.MeshStandardMaterial({
      color: 0xf7_b8_01,
      roughness: 0.3,
      metalness: 0.7
    });
    this.hourHand = new THREE.Mesh(hourGeometry, hourMaterial);
    this.hourHand.position.y = 0.75;
    this.hourHand.position.z = 0.05;
    this.hourHand.userData.type = 'hour';

    const hourGroup = new THREE.Group();
    hourGroup.add(this.hourHand);
    this.scene.add(hourGroup);
    this.hourHand.parent = hourGroup;

    // Minute hand
    const minuteGeometry = new THREE.BoxGeometry(0.1, 2.2, 0.1);
    const minuteMaterial = new THREE.MeshStandardMaterial({
      color: 0xff_6b_35,
      roughness: 0.3,
      metalness: 0.7
    });
    this.minuteHand = new THREE.Mesh(minuteGeometry, minuteMaterial);
    this.minuteHand.position.y = 1.1;
    this.minuteHand.position.z = 0.06;
    this.minuteHand.userData.type = 'minute';

    const minuteGroup = new THREE.Group();
    minuteGroup.add(this.minuteHand);
    this.scene.add(minuteGroup);
    this.minuteHand.parent = minuteGroup;

    // Set initial time
    this.updateHandsRotation();
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xff_ff_ff, 0.6);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff_6b_35, 1, 20);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);
  }

  setupInteraction() {
    const canvas = this.renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getMousePosition = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    canvas.addEventListener('mousedown', (event) => {
      getMousePosition(event);
      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObjects([
        this.hourHand,
        this.minuteHand
      ]);
      if (intersects.length > 0) {
        this.isDragging = true;
        this.dragTarget = intersects[0].object;
        canvas.style.cursor = 'grabbing';
      }
    });

    canvas.addEventListener('mousemove', (event) => {
      if (this.isDragging && this.dragTarget) {
        getMousePosition(event);

        const angle = Math.atan2(mouse.y, mouse.x);
        const degrees = angle * (180 / Math.PI) + 90;

        if (this.dragTarget.userData.type === 'hour') {
          this.selectedHour = Math.round(((degrees + 360) % 360) / 30) % 12;
          if (this.selectedHour === 0) this.selectedHour = 12;
        } else {
          this.selectedMinute = Math.round(((degrees + 360) % 360) / 6) % 60;
        }

        this.updateHandsRotation();

        if (this.onTimeChange) {
          this.onTimeChange(this.getTime());
        }
      } else {
        getMousePosition(event);
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObjects([
          this.hourHand,
          this.minuteHand
        ]);
        canvas.style.cursor = intersects.length > 0 ? 'grab' : 'default';
      }
    });

    canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.dragTarget = null;
      canvas.style.cursor = 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.dragTarget = null;
      canvas.style.cursor = 'default';
    });
  }

  updateHandsRotation() {
    if (this.hourHand && this.hourHand.parent) {
      const hourAngle = ((this.selectedHour % 12) * 30 - 90) * (Math.PI / 180);
      this.hourHand.parent.rotation.z = -hourAngle;
    }

    if (this.minuteHand && this.minuteHand.parent) {
      const minuteAngle = (this.selectedMinute * 6 - 90) * (Math.PI / 180);
      this.minuteHand.parent.rotation.z = -minuteAngle;
    }
  }

  setTime(hour, minute) {
    this.selectedHour = hour;
    this.selectedMinute = minute;
    this.updateHandsRotation();
  }

  getTime() {
    return {
      hour: this.selectedHour,
      minute: this.selectedMinute,
      formatted: `${String(this.selectedHour).padStart(2, '0')}:${String(this.selectedMinute).padStart(2, '0')}`
    };
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Gentle rotation
    if (this.clock && !this.isDragging) {
      this.clock.rotation.z += 0.001;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    if (!this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        this.renderer.domElement.remove();
      }
    }
  }
}
