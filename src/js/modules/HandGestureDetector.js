import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export class HandGestureDetector {
  constructor() {
    this.handLandmarker = null;
    this.video = null;
    this.canvasCtx = null;
    this.lastResults = null;
    this.isInitialized = false;
  }

  async init() {
    try {
      // Get video element
      this.video = document.getElementById('video');

      // Initialize MediaPipe Hand Landmarker
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });

      // Request camera access
      await this.setupCamera();
      this.isInitialized = true;
      this.detectHands();
    } catch (error) {
      console.error('Failed to initialize hand detection:', error);
      throw error;
    }
  }

  async setupCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });

      this.video.srcObject = stream;

      return new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          this.video.play();
          resolve();
        };
      });
    } catch (error) {
      console.error('Failed to access camera:', error);
      throw error;
    }
  }

  detectHands = () => {
    if (!this.isInitialized) return;

    const startTimeMs = performance.now();
    this.lastResults = this.handLandmarker.detectForVideo(this.video, startTimeMs);

    requestAnimationFrame(this.detectHands);
  };

  getHandData() {
    if (!this.lastResults || !this.lastResults.landmarks || this.lastResults.landmarks.length === 0) {
      return null;
    }

    const landmarks = this.lastResults.landmarks[0];
    const handedness = this.lastResults.handedness[0];

    // Calculate hand metrics
    const openness = this.calculateHandOpenness(landmarks);
    const position = this.calculateHandPosition(landmarks);
    const pinchDistance = this.calculatePinchDistance(landmarks);

    return {
      landmarks,
      handedness: handedness.displayName,
      openness,
      x: position.x,
      y: position.y,
      pinchDistance,
    };
  }

  calculateHandOpenness(landmarks) {
    // Calculate based on distance between palm and fingers
    const palmCenter = landmarks[9]; // Palm center
    const fingerTips = [4, 8, 12, 16, 20]; // Thumb, index, middle, ring, pinky tips

    let totalDistance = 0;
    fingerTips.forEach((tipIndex) => {
      const tip = landmarks[tipIndex];
      const distance = Math.sqrt(
        Math.pow(tip.x - palmCenter.x, 2) + Math.pow(tip.y - palmCenter.y, 2)
      );
      totalDistance += distance;
    });

    const averageDistance = totalDistance / fingerTips.length;
    // Normalize to 0-1 range (0 = closed fist, 1 = open hand)
    return Math.min(1, Math.max(0, averageDistance * 4));
  }

  calculateHandPosition(landmarks) {
    // Use wrist position as reference
    const wrist = landmarks[0];
    return {
      x: wrist.x,
      y: wrist.y,
    };
  }

  calculatePinchDistance(landmarks) {
    // Distance between thumb and index finger
    const thumb = landmarks[4];
    const index = landmarks[8];

    const distance = Math.sqrt(
      Math.pow(thumb.x - index.x, 2) + Math.pow(thumb.y - index.y, 2)
    );

    // Normalize to 0-1 range
    return Math.max(0, 1 - distance * 2);
  }

  dispose() {
    if (this.video && this.video.srcObject) {
      this.video.srcObject.getTracks().forEach((track) => track.stop());
    }
  }
}
