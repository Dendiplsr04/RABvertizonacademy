export class HandGestureDetector {
  constructor() {
    this.handLandmarker = null;
    this.video = null;
    this.lastResults = null;
    this.isInitialized = false;
  }

  async init() {
    try {
      this.video = document.getElementById('video');
      if (!this.video) throw new Error('Video element not found');

      await this.loadMediaPipeFromCDN();
      await this.setupCamera();
      this.isInitialized = true;
      this.detectHands();
    } catch (error) {
      console.error('Hand detection init failed:', error);
      throw error;
    }
  }

  async loadMediaPipeFromCDN() {
    return new Promise((resolve, reject) => {
      console.log('Loading MediaPipe from CDN...');
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = async () => {
        try {
          console.log('MediaPipe script loaded, initializing...');
          
          // Wait for MediaPipe to be available
          let attempts = 0;
          while (!window.FilesetResolver && attempts < 50) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
          }
          
          const { FilesetResolver, HandLandmarker } = window;
          if (!FilesetResolver || !HandLandmarker) {
            throw new Error('MediaPipe objects not available after loading');
          }

          console.log('Initializing HandLandmarker...');
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

          console.log('HandLandmarker initialized successfully');
          resolve();
        } catch (error) {
          console.error('MediaPipe initialization error:', error);
          reject(error);
        }
      };
      
      script.onerror = (error) => {
        console.error('Failed to load MediaPipe script:', error);
        reject(new Error('Failed to load MediaPipe from CDN'));
      };
      
      document.head.appendChild(script);
    });
  }

  async setupCamera() {
    try {
      console.log('Requesting camera access...');
      
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained');
      
      this.video.srcObject = stream;

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Camera stream timeout - video did not load'));
        }, 5000);

        this.video.onloadedmetadata = () => {
          clearTimeout(timeout);
          console.log('Video metadata loaded, starting playback');
          
          this.video.play()
            .then(() => {
              console.log('Video playback started');
              resolve();
            })
            .catch((err) => {
              console.warn('Video play error:', err);
              resolve(); // Still resolve even if play fails
            });
        };

        this.video.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Video element error'));
        };
      });
    } catch (error) {
      console.error('Camera setup error:', error);
      
      // Provide helpful error messages
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera permission denied. Please allow camera access in browser settings.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found on this device.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera is already in use by another application.');
      }
      
      throw new Error('Camera access failed: ' + error.message);
    }
  }

  detectHands = () => {
    if (!this.isInitialized || !this.handLandmarker) return;

    try {
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        const startTimeMs = performance.now();
        this.lastResults = this.handLandmarker.detectForVideo(this.video, startTimeMs);
      }
    } catch (error) {
      console.error('Hand detection error:', error);
    }

    requestAnimationFrame(this.detectHands);
  };

  getHandData() {
    if (!this.lastResults || !this.lastResults.landmarks || this.lastResults.landmarks.length === 0) {
      return null;
    }

    try {
      const landmarks = this.lastResults.landmarks[0];
      const handedness = this.lastResults.handedness[0];

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
    } catch (error) {
      console.error('Error processing hand data:', error);
      return null;
    }
  }

  calculateHandOpenness(landmarks) {
    const palmCenter = landmarks[9];
    const fingerTips = [4, 8, 12, 16, 20];

    let totalDistance = 0;
    fingerTips.forEach((tipIndex) => {
      const tip = landmarks[tipIndex];
      const distance = Math.sqrt(
        Math.pow(tip.x - palmCenter.x, 2) + Math.pow(tip.y - palmCenter.y, 2)
      );
      totalDistance += distance;
    });

    const averageDistance = totalDistance / fingerTips.length;
    return Math.min(1, Math.max(0, averageDistance * 4));
  }

  calculateHandPosition(landmarks) {
    const wrist = landmarks[0];
    return {
      x: Math.max(0, Math.min(1, wrist.x)),
      y: Math.max(0, Math.min(1, wrist.y)),
    };
  }

  calculatePinchDistance(landmarks) {
    const thumb = landmarks[4];
    const index = landmarks[8];
    const distance = Math.sqrt(
      Math.pow(thumb.x - index.x, 2) + Math.pow(thumb.y - index.y, 2)
    );
    return Math.max(0, 1 - distance * 2);
  }

  dispose() {
    if (this.video && this.video.srcObject) {
      this.video.srcObject.getTracks().forEach((track) => track.stop());
    }
  }
}
