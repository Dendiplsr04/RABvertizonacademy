/**
 * Hand Gesture Detection System
 * Uses MediaPipe Hands for real-time hand tracking
 * Provides 21 hand landmarks and gesture classification
 */

export class HandTracker {
  constructor() {
    this.handLandmarker = null;
    this.video = null;
    this.isInitialized = false;
    this.lastResults = null;
    this.smoothedLandmarks = null;
    this.gestureHistory = [];
    this.currentGesture = null;
    this.gestureConfidence = 0;
  }

  async init() {
    try {
      console.log('[HandTracker] Initializing...');
      
      this.video = document.getElementById('video');
      if (!this.video) throw new Error('Video element not found');

      // Load MediaPipe
      await this.loadMediaPipe();
      console.log('[HandTracker] MediaPipe loaded');

      // Setup camera
      await this.setupCamera();
      console.log('[HandTracker] Camera setup complete');

      this.isInitialized = true;
      this.detectLoop();
      console.log('[HandTracker] Initialization complete');
    } catch (error) {
      console.error('[HandTracker] Initialization failed:', error);
      throw error;
    }
  }

  async loadMediaPipe() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8';
      script.async = true;
      script.crossOrigin = 'anonymous';

      script.onload = async () => {
        try {
          // Wait for MediaPipe to be available
          let attempts = 0;
          while (!window.FilesetResolver && attempts < 50) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
          }

          const { FilesetResolver, HandLandmarker } = window;
          if (!FilesetResolver || !HandLandmarker) {
            throw new Error('MediaPipe not available');
          }

          const wasmPath = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm';
          const filesetResolver = await FilesetResolver.forVisionTasks(wasmPath);

          this.handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            },
            runningMode: 'VIDEO',
            numHands: 1,
          });

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      script.onerror = () => reject(new Error('Failed to load MediaPipe'));
      document.head.appendChild(script);
    });
  }

  async setupCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      this.video.srcObject = stream;

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Camera timeout')), 5000);

        this.video.onloadedmetadata = () => {
          clearTimeout(timeout);
          this.video.play().catch(err => console.warn('Video play error:', err));
          resolve();
        };
      });
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera permission denied');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found');
      }
      throw error;
    }
  }

  detectLoop = () => {
    if (!this.isInitialized || !this.handLandmarker) return;

    try {
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        const startTimeMs = performance.now();
        this.lastResults = this.handLandmarker.detectForVideo(this.video, startTimeMs);
        
        // Smooth landmarks
        if (this.lastResults.landmarks.length > 0) {
          this.smoothedLandmarks = this.smoothLandmarks(this.lastResults.landmarks[0]);
          
          // Classify gesture
          this.classifyGesture();
        }
      }
    } catch (error) {
      console.error('[HandTracker] Detection error:', error);
    }

    requestAnimationFrame(this.detectLoop);
  };

  smoothLandmarks(landmarks) {
    const smoothingFactor = 0.7;
    
    if (!this.smoothedLandmarks) {
      return landmarks.map(lm => ({ ...lm }));
    }

    return landmarks.map((lm, i) => ({
      x: this.smoothedLandmarks[i].x * smoothingFactor + lm.x * (1 - smoothingFactor),
      y: this.smoothedLandmarks[i].y * smoothingFactor + lm.y * (1 - smoothingFactor),
      z: this.smoothedLandmarks[i].z * smoothingFactor + lm.z * (1 - smoothingFactor),
      visibility: lm.visibility,
    }));
  }

  classifyGesture() {
    if (!this.smoothedLandmarks) return;

    const landmarks = this.smoothedLandmarks;
    
    // Calculate gesture metrics
    const metrics = {
      indexExtension: this.getFingerExtension(landmarks, 8),
      middleExtension: this.getFingerExtension(landmarks, 12),
      ringExtension: this.getFingerExtension(landmarks, 16),
      pinkyExtension: this.getFingerExtension(landmarks, 20),
      thumbExtension: this.getFingerExtension(landmarks, 4),
      
      pinchDistance: this.getPinchDistance(landmarks),
      wristRotation: this.getWristRotation(landmarks),
      handOpenness: this.getHandOpenness(landmarks),
      palmFacing: this.getPalmFacing(landmarks),
    };

    // Classify gesture based on metrics
    let gesture = null;
    let confidence = 0;

    if (metrics.handOpenness > 0.7 && metrics.palmFacing > 0.6) {
      gesture = 'PALM_OPEN';
      confidence = metrics.handOpenness;
    } else if (metrics.indexExtension > 0.7 && metrics.middleExtension < 0.3) {
      gesture = 'INDEX_POINTING';
      confidence = metrics.indexExtension;
    } else if (metrics.pinchDistance < 0.05) {
      gesture = 'PINCHING';
      confidence = 1 - metrics.pinchDistance;
    } else if (metrics.indexExtension > 0.6 && metrics.middleExtension > 0.6) {
      gesture = 'TWO_FINGERS';
      confidence = (metrics.indexExtension + metrics.middleExtension) / 2;
    } else if (metrics.handOpenness < 0.2) {
      gesture = 'FIST';
      confidence = 1 - metrics.handOpenness;
    } else if (Math.abs(metrics.wristRotation) > 15) {
      gesture = 'WRIST_ROTATING';
      confidence = Math.min(1, Math.abs(metrics.wristRotation) / 45);
    }

    // Update gesture with debouncing
    if (gesture && confidence > 0.7) {
      if (gesture !== this.currentGesture) {
        this.gestureHistory.push({ gesture, confidence, timestamp: Date.now() });
        
        // Keep only recent history
        const now = Date.now();
        this.gestureHistory = this.gestureHistory.filter(g => now - g.timestamp < 500);
        
        // Require gesture to be stable
        if (this.gestureHistory.length > 3) {
          const recentGestures = this.gestureHistory.slice(-5);
          const sameGesture = recentGestures.every(g => g.gesture === gesture);
          
          if (sameGesture) {
            this.currentGesture = gesture;
            this.gestureConfidence = confidence;
          }
        }
      }
    } else if (confidence < 0.5) {
      this.currentGesture = null;
      this.gestureConfidence = 0;
    }
  }

  getFingerExtension(landmarks, tipIndex) {
    // Calculate distance from finger tip to base
    const tip = landmarks[tipIndex];
    const base = landmarks[tipIndex - 3];
    
    const distance = Math.sqrt(
      Math.pow(tip.x - base.x, 2) +
      Math.pow(tip.y - base.y, 2) +
      Math.pow(tip.z - base.z, 2)
    );

    // Normalize (0-1)
    return Math.min(1, distance * 3);
  }

  getPinchDistance(landmarks) {
    const thumb = landmarks[4];
    const index = landmarks[8];
    
    const distance = Math.sqrt(
      Math.pow(thumb.x - index.x, 2) +
      Math.pow(thumb.y - index.y, 2) +
      Math.pow(thumb.z - index.z, 2)
    );

    return Math.max(0, 1 - distance * 2);
  }

  getWristRotation(landmarks) {
    // Calculate wrist rotation based on hand orientation
    const wrist = landmarks[0];
    const middle = landmarks[9];
    const pinky = landmarks[17];
    
    const v1 = { x: middle.x - wrist.x, y: middle.y - wrist.y };
    const v2 = { x: pinky.x - wrist.x, y: pinky.y - wrist.y };
    
    const angle = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
    return (angle * 180) / Math.PI;
  }

  getHandOpenness(landmarks) {
    const palmCenter = landmarks[9];
    const fingerTips = [4, 8, 12, 16, 20];
    
    let totalDistance = 0;
    fingerTips.forEach(tipIndex => {
      const tip = landmarks[tipIndex];
      const distance = Math.sqrt(
        Math.pow(tip.x - palmCenter.x, 2) +
        Math.pow(tip.y - palmCenter.y, 2) +
        Math.pow(tip.z - palmCenter.z, 2)
      );
      totalDistance += distance;
    });

    const averageDistance = totalDistance / fingerTips.length;
    return Math.min(1, Math.max(0, averageDistance * 4));
  }

  getPalmFacing(landmarks) {
    // Calculate palm normal direction
    const wrist = landmarks[0];
    const middle = landmarks[9];
    const index = landmarks[5];
    const pinky = landmarks[17];
    
    const v1 = { x: index.x - wrist.x, y: index.y - wrist.y, z: index.z - wrist.z };
    const v2 = { x: pinky.x - wrist.x, y: pinky.y - wrist.y, z: pinky.z - wrist.z };
    
    // Cross product
    const normal = {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x,
    };

    // Normalize
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
    
    // Check if facing camera (z > 0)
    return Math.max(0, normal.z / length);
  }

  getHandData() {
    if (!this.lastResults || !this.lastResults.landmarks || this.lastResults.landmarks.length === 0) {
      return null;
    }

    const landmarks = this.smoothedLandmarks || this.lastResults.landmarks[0];
    const wrist = landmarks[0];

    return {
      landmarks,
      gesture: this.currentGesture,
      confidence: this.gestureConfidence,
      position: {
        x: wrist.x,
        y: wrist.y,
        z: wrist.z,
      },
      handedness: this.lastResults.handedness[0]?.displayName || 'Right',
    };
  }

  dispose() {
    if (this.video && this.video.srcObject) {
      this.video.srcObject.getTracks().forEach(track => track.stop());
    }
  }
}
