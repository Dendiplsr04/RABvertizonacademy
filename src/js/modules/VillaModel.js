import * as THREE from 'three';

export class VillaModel {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.isVisible = true;
  }

  async create() {
    // Create a simple villa structure
    this.createMainStructure();
    this.createRoof();
    this.createWindows();
    this.createDoor();
    this.createPool();
    this.createGarden();

    this.scene.add(this.group);
  }

  createMainStructure() {
    // Main building
    const mainGeometry = new THREE.BoxGeometry(8, 6, 10);
    const mainMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5deb3,
      roughness: 0.7,
      metalness: 0.1,
    });
    const mainBuilding = new THREE.Mesh(mainGeometry, mainMaterial);
    mainBuilding.position.y = 3;
    mainBuilding.castShadow = true;
    mainBuilding.receiveShadow = true;
    this.group.add(mainBuilding);

    // Left wing
    const leftWingGeometry = new THREE.BoxGeometry(4, 5, 6);
    const leftWing = new THREE.Mesh(leftWingGeometry, mainMaterial);
    leftWing.position.set(-6, 2.5, 0);
    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    this.group.add(leftWing);

    // Right wing
    const rightWingGeometry = new THREE.BoxGeometry(4, 5, 6);
    const rightWing = new THREE.Mesh(rightWingGeometry, mainMaterial);
    rightWing.position.set(6, 2.5, 0);
    rightWing.castShadow = true;
    rightWing.receiveShadow = true;
    this.group.add(rightWing);
  }

  createRoof() {
    // Main roof
    const roofGeometry = new THREE.ConeGeometry(6, 3, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0xd2691e,
      roughness: 0.8,
      metalness: 0,
    });
    const mainRoof = new THREE.Mesh(roofGeometry, roofMaterial);
    mainRoof.position.y = 9;
    mainRoof.rotation.y = Math.PI / 4;
    mainRoof.castShadow = true;
    this.group.add(mainRoof);

    // Left wing roof
    const leftRoofGeometry = new THREE.ConeGeometry(3, 2.5, 4);
    const leftRoof = new THREE.Mesh(leftRoofGeometry, roofMaterial);
    leftRoof.position.set(-6, 7.5, 0);
    leftRoof.rotation.y = Math.PI / 4;
    leftRoof.castShadow = true;
    this.group.add(leftRoof);

    // Right wing roof
    const rightRoof = new THREE.Mesh(leftRoofGeometry, roofMaterial);
    rightRoof.position.set(6, 7.5, 0);
    rightRoof.rotation.y = Math.PI / 4;
    rightRoof.castShadow = true;
    this.group.add(rightRoof);
  }

  createWindows() {
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x87ceeb,
      roughness: 0.1,
      metalness: 0.8,
    });

    // Front windows
    const windowPositions = [
      [-2, 5, 5.1],
      [2, 5, 5.1],
      [-2, 2, 5.1],
      [2, 2, 5.1],
    ];

    windowPositions.forEach((pos) => {
      const windowGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.2);
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(...pos);
      window.castShadow = true;
      this.group.add(window);
    });
  }

  createDoor() {
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.6,
      metalness: 0.2,
    });

    const doorGeometry = new THREE.BoxGeometry(2, 3, 0.2);
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.5, 5.1);
    door.castShadow = true;
    this.group.add(door);

    // Door handle
    const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 1,
      roughness: 0.2,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0.8, 1.5, 5.2);
    handle.rotation.z = Math.PI / 2;
    handle.castShadow = true;
    this.group.add(handle);
  }

  createPool() {
    // Pool
    const poolGeometry = new THREE.BoxGeometry(6, 0.5, 4);
    const poolMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e90ff,
      roughness: 0.3,
      metalness: 0.5,
    });
    const pool = new THREE.Mesh(poolGeometry, poolMaterial);
    pool.position.set(0, -2.5, -8);
    pool.castShadow = true;
    pool.receiveShadow = true;
    this.group.add(pool);

    // Pool border
    const borderGeometry = new THREE.BoxGeometry(6.5, 0.3, 4.5);
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      roughness: 0.4,
      metalness: 0.6,
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.set(0, -2.2, -8);
    border.castShadow = true;
    this.group.add(border);
  }

  createGarden() {
    // Garden area
    const gardenGeometry = new THREE.PlaneGeometry(20, 15);
    const gardenMaterial = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      roughness: 0.9,
      metalness: 0,
    });
    const garden = new THREE.Mesh(gardenGeometry, gardenMaterial);
    garden.rotation.x = -Math.PI / 2;
    garden.position.y = -5;
    garden.receiveShadow = true;
    this.group.add(garden);

    // Trees
    this.createTree(-8, -5, -6);
    this.createTree(8, -5, -6);
    this.createTree(-8, -5, 6);
    this.createTree(8, -5, 6);
  }

  createTree(x, y, z) {
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 3, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.8,
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, y + 1.5, z);
    trunk.castShadow = true;
    this.group.add(trunk);

    // Foliage
    const foliageGeometry = new THREE.SphereGeometry(2, 8, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      roughness: 0.7,
    });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(x, y + 4, z);
    foliage.castShadow = true;
    this.group.add(foliage);
  }

  setRotation(rotationX, rotationY) {
    this.group.rotation.x = rotationX;
    this.group.rotation.y = rotationY;
  }

  hide() {
    this.group.visible = false;
    this.isVisible = false;
  }

  show() {
    this.group.visible = true;
    this.isVisible = true;
  }

  dispose() {
    this.group.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
