/**
 * Gesture Recognition & Classification System
 * Converts hand landmarks into meaningful gestures
 * Provides stable, debounced gesture events
 */

export class GestureRecognizer {
  constructor() {
    this.currentGesture = null;
    this.previousGesture = null;
    this.gestureStartTime = null;
    this.gestureDuration = 0;
    this.gestureCallbacks = {};
    this.gestureThresholds = {
      minConfidence: 0.7,
      minDuration: 100, // ms
      maxDuration: 5000, // ms
      debounceTime: 200, // ms
    };
    this.lastGestureTime = 0;
    this.gestureBuffer = [];
  }

  /**
   * Process hand data and recognize gestures
   */
  processHandData(handData) {
    if (!handData) {
      this.currentGesture = null;
      return;
    }

    const { landmarks, gesture, confidence, position } = handData;

    // Check confidence threshold
    if (confidence < this.gestureThresholds.minConfidence) {
      return;
    }

    // Check debounce
    const now = Date.now();
    if (now - this.lastGestureTime < this.gestureThresholds.debounceTime) {
      return;
    }

    // Update gesture
    if (gesture !== this.currentGesture) {
      this.previousGesture = this.currentGesture;
      this.currentGesture = gesture;
      this.gestureStartTime = now;
      this.lastGestureTime = now;

      // Trigger gesture event
      this.triggerGestureEvent(gesture, confidence, position, landmarks);
    }

    // Update duration
    this.gestureDuration = now - this.gestureStartTime;
  }

  /**
   * Trigger gesture event with callbacks
   */
  triggerGestureEvent(gesture, confidence, position, landmarks) {
    console.log(`[Gesture] ${gesture} (confidence: ${confidence.toFixed(2)})`);

    if (this.gestureCallbacks[gesture]) {
      this.gestureCallbacks[gesture]({
        gesture,
        confidence,
        position,
        landmarks,
        timestamp: Date.now(),
      });
    }

    // Trigger generic gesture event
    if (this.gestureCallbacks['*']) {
      this.gestureCallbacks['*']({
        gesture,
        confidence,
        position,
        landmarks,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Register gesture callback
   */
  on(gesture, callback) {
    this.gestureCallbacks[gesture] = callback;
  }

  /**
   * Unregister gesture callback
   */
  off(gesture) {
    delete this.gestureCallbacks[gesture];
  }

  /**
   * Get current gesture
   */
  getCurrentGesture() {
    return this.currentGesture;
  }

  /**
   * Get gesture duration
   */
  getGestureDuration() {
    return this.gestureDuration;
  }

  /**
   * Check if gesture is held
   */
  isGestureHeld(gesture, minDuration = 500) {
    return this.currentGesture === gesture && this.gestureDuration >= minDuration;
  }

  /**
   * Check if gesture just started
   */
  isGestureJustStarted(gesture) {
    return this.currentGesture === gesture && this.gestureDuration < 200;
  }

  /**
   * Check if gesture just ended
   */
  isGestureJustEnded(gesture) {
    return this.previousGesture === gesture && this.currentGesture !== gesture;
  }
}

/**
 * Gesture Action Mapper
 * Maps gestures to scene actions
 */
export class GestureActionMapper {
  constructor(scene, camera, controls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.actionCallbacks = {};
    this.setupDefaultMappings();
  }

  setupDefaultMappings() {
    // These will be overridden by specific implementations
    this.actionCallbacks = {
      'INDEX_POINTING': this.handlePointing.bind(this),
      'PALM_OPEN': this.handlePalmOpen.bind(this),
      'PINCHING': this.handlePinch.bind(this),
      'TWO_FINGERS': this.handleTwoFingers.bind(this),
      'FIST': this.handleFist.bind(this),
      'WRIST_ROTATING': this.handleWristRotation.bind(this),
    };
  }

  handlePointing(data) {
    // Point at object → Focus camera on it
    console.log('[Action] Pointing at:', data.position);
    
    if (this.controls && this.controls.focusOnPoint) {
      this.controls.focusOnPoint(data.position, data.landmarks);
    }
  }

  handlePalmOpen(data) {
    // Open palm → Confirm/Enter
    console.log('[Action] Palm open');
    
    if (this.controls && this.controls.confirmAction) {
      this.controls.confirmAction();
    }
  }

  handlePinch(data) {
    // Pinch → Zoom
    console.log('[Action] Pinching');
    
    if (this.controls && this.controls.zoom) {
      this.controls.zoom(data.confidence);
    }
  }

  handleTwoFingers(data) {
    // Two fingers → Mode switch
    console.log('[Action] Two fingers');
    
    if (this.controls && this.controls.switchMode) {
      this.controls.switchMode();
    }
  }

  handleFist(data) {
    // Fist → Reset
    console.log('[Action] Fist - Reset');
    
    if (this.controls && this.controls.reset) {
      this.controls.reset();
    }
  }

  handleWristRotation(data) {
    // Wrist rotation → Orbit
    console.log('[Action] Wrist rotating');
    
    if (this.controls && this.controls.orbit) {
      this.controls.orbit(data.position);
    }
  }

  registerAction(gesture, callback) {
    this.actionCallbacks[gesture] = callback;
  }

  executeAction(gesture, data) {
    if (this.actionCallbacks[gesture]) {
      this.actionCallbacks[gesture](data);
    }
  }
}

/**
 * Gesture Visualizer
 * Provides visual feedback for gestures
 */
export class GestureVisualizer {
  constructor(scene) {
    this.scene = scene;
    this.gestureIndicators = {};
    this.setupIndicators();
  }

  setupIndicators() {
    // Create visual indicators for gestures
    // These will be shown/hidden based on current gesture
  }

  showGestureIndicator(gesture, position) {
    console.log(`[Visualizer] Showing indicator for ${gesture}`);
    
    // Show visual feedback
    // This will be implemented with Three.js objects
  }

  hideGestureIndicator(gesture) {
    console.log(`[Visualizer] Hiding indicator for ${gesture}`);
    
    // Hide visual feedback
  }

  updateIndicatorPosition(gesture, position) {
    // Update indicator position based on hand position
  }
}
