# 🎯 Hand Gesture Interaction Design

## Gesture Mapping Strategy

### Primary Gestures (Core Interactions)

#### 1. **Index Finger Pointing** → Camera Focus/Direction
- **Detection:** Index finger extended, other fingers folded
- **Action:** 
  - Point at object → Camera smoothly orbits to focus on that object
  - Point at room entrance → Smooth transition to that room
  - Point at light → Highlight/focus on that light source
- **Visual Feedback:** Subtle ray/beam from finger to target

#### 2. **Open Palm** → Confirm/Enter/Activate
- **Detection:** All fingers extended, palm facing camera
- **Action:**
  - Hold for 0.5s → Enter room / activate scene
  - Quick gesture → Confirm action / toggle feature
  - Swipe palm → Cycle through lighting presets
- **Visual Feedback:** Glow effect on palm, haptic-like visual response

#### 3. **Pinch (Thumb + Index)** → Zoom/Focus Detail
- **Detection:** Thumb and index finger close together
- **Action:**
  - Pinch distance increases → Zoom out
  - Pinch distance decreases → Zoom in
  - Hold pinch + move hand → Pan camera
- **Visual Feedback:** Zoom indicator, depth of field effect

#### 4. **Two Fingers Raised** → Mode Switch
- **Detection:** Index + Middle finger extended, others folded
- **Action:**
  - Raise up → Switch to exterior view
  - Raise down → Switch to interior view
  - Rotate two fingers → Rotate camera around vertical axis
- **Visual Feedback:** Mode indicator, smooth transition animation

#### 5. **Closed Fist** → Reset/Home
- **Detection:** All fingers folded, hand closed
- **Action:**
  - Hold for 1s → Reset camera to cinematic home position
  - Quick close → Cancel current action
  - Shake fist → Cycle through rooms
- **Visual Feedback:** Pulse effect, confirmation message

#### 6. **Wrist Rotation** → Orbit Camera
- **Detection:** Wrist angle change (roll)
- **Action:**
  - Rotate wrist clockwise → Orbit camera clockwise
  - Rotate wrist counter-clockwise → Orbit camera counter-clockwise
  - Combine with pinch → Free orbit with zoom
- **Visual Feedback:** Rotation indicator, smooth interpolation

### Secondary Gestures (Advanced)

#### 7. **Thumbs Up** → Lighting Increase
- **Detection:** Thumb extended upward, other fingers folded
- **Action:** Increase brightness/warmth of current lighting state

#### 8. **Thumbs Down** → Lighting Decrease
- **Detection:** Thumb extended downward, other fingers folded
- **Action:** Decrease brightness/warmth of current lighting state

#### 9. **Peace Sign (V)** → Toggle UI/Info
- **Detection:** Index + Middle extended, others folded
- **Action:** Show/hide information panel, property details

#### 10. **Hand Swipe** → Navigate Rooms
- **Detection:** Open hand moving left/right
- **Action:**
  - Swipe left → Previous room
  - Swipe right → Next room
  - Swipe up → Go to upper floor
  - Swipe down → Go to lower floor

## Gesture Recognition Parameters

```javascript
const GESTURE_CONFIG = {
  // Temporal smoothing
  smoothingFactor: 0.7,
  minFramesForGesture: 5,
  maxFramesForGesture: 30,
  
  // Confidence thresholds
  minConfidence: 0.7,
  minHandPresence: 0.8,
  
  // Gesture-specific thresholds
  pinchThreshold: 0.05,
  fingerExtensionThreshold: 0.7,
  wristRotationThreshold: 15, // degrees
  
  // Debounce
  gestureCooldown: 300, // ms
  doubleTapWindow: 500, // ms
};
```

## Gesture State Machine

```
IDLE
  ↓
DETECTING (hand visible)
  ├→ POINTING (index extended)
  ├→ PALM_OPEN (all fingers extended)
  ├→ PINCHING (thumb + index close)
  ├→ TWO_FINGERS (index + middle extended)
  ├→ FIST (all fingers folded)
  ├→ WRIST_ROTATING (wrist angle changing)
  └→ SWIPING (hand moving)
  
Each state can trigger actions and transitions
```

## Visual Feedback System

### Feedback Types

1. **Gesture Recognition Feedback**
   - Subtle glow on detected hand
   - Gesture icon appears near hand
   - Color change based on gesture type

2. **Action Feedback**
   - Camera movement animation
   - Light transition effects
   - Object highlight/focus effect
   - Particle effects for emphasis

3. **State Feedback**
   - Current mode indicator (interior/exterior)
   - Current room name
   - Lighting state indicator
   - Gesture hint (what gesture is available)

## Gesture Accuracy & Filtering

### Temporal Smoothing
- Use exponential moving average for hand position
- Filter out jitter with Kalman filter
- Require gesture to be held for minimum frames

### Confidence Scoring
- Combine multiple hand landmarks for gesture detection
- Use hand presence confidence from MediaPipe
- Require minimum confidence threshold before action

### False Positive Prevention
- Gesture cooldown between actions
- Require clear gesture transition
- Validate gesture with multiple frames
- Context-aware gesture recognition

## Interaction Flow Example: Entering a Room

```
1. User points at room entrance
   → Camera focuses on entrance
   → Entrance highlights
   → Gesture hint: "Open palm to enter"

2. User opens palm
   → Smooth camera transition to room
   → Lights fade in
   → Room details become visible
   → Gesture hint: "Point to explore, pinch to zoom"

3. User points at object
   → Camera orbits to focus on object
   → Object highlights
   → Information appears

4. User pinches to zoom
   → Camera smoothly zooms in
   → Details become visible
   → Depth of field effect

5. User makes fist to reset
   → Camera returns to room overview
   → Lights return to default
   → Ready for next interaction
```

## Performance Considerations

- Gesture detection runs at 30 FPS (independent of render FPS)
- Hand landmarks cached and reused
- Gesture state machine updates only on changes
- Visual feedback uses GPU-accelerated animations
- No blocking operations in gesture detection loop

## Accessibility & Comfort

- Gestures are natural and intuitive
- No extreme hand positions required
- Gestures work from various angles
- Clear visual feedback for all actions
- Gesture hints available on demand
- Adjustable sensitivity settings

---

**This design prioritizes elegance, accuracy, and user comfort.**
