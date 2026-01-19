# 🎥 Cinematic Camera System Design

## Camera Philosophy

The camera is not a tool—it's a **storyteller**. Every movement should feel:
- **Cinematic** - Like a professional film camera
- **Smooth** - No jarring transitions
- **Intuitive** - Responds naturally to hand gestures
- **Elegant** - Premium, luxury feel
- **Non-intrusive** - Never breaks immersion

## Camera Modes

### 1. **Orbit Mode** (Default)
- Camera orbits around a focal point
- Smooth rotation via wrist gesture
- Zoom via pinch gesture
- Perfect for examining objects/rooms

```javascript
{
  type: 'orbit',
  target: Vector3,
  distance: 15,
  minDistance: 5,
  maxDistance: 50,
  rotationSpeed: 0.005,
  zoomSpeed: 0.1,
  autoRotate: false,
  autoRotateSpeed: 0.5
}
```

### 2. **Free Look Mode** (Advanced)
- First-person style camera
- Controlled by hand position
- Smooth interpolation
- For exploring interior spaces

```javascript
{
  type: 'freeLook',
  position: Vector3,
  target: Vector3,
  fov: 75,
  moveSpeed: 0.1,
  rotationSpeed: 0.003,
  smoothing: 0.1
}
```

### 3. **Cinematic Path Mode** (Transitions)
- Pre-defined camera paths
- Smooth spline interpolation
- Used for room-to-room transitions
- Automatic or gesture-triggered

```javascript
{
  type: 'path',
  path: [Vector3, Vector3, Vector3, ...],
  duration: 3000,
  easing: 'easeInOutCubic',
  lookAtTarget: Vector3
}
```

### 4. **Focus Mode** (Detail Inspection)
- Camera focuses on specific object
- Smooth zoom and orbit
- Triggered by pointing gesture
- Automatic depth of field

```javascript
{
  type: 'focus',
  targetObject: Mesh,
  distance: 8,
  duration: 1500,
  dof: {
    enabled: true,
    aperture: 0.5,
    focusDistance: 8
  }
}
```

## Camera Movement Characteristics

### Smooth Interpolation
```javascript
const CAMERA_CONFIG = {
  // Position interpolation
  positionSmoothing: 0.08,
  
  // Rotation interpolation
  rotationSmoothing: 0.1,
  
  // Zoom interpolation
  zoomSmoothing: 0.12,
  
  // Look-at interpolation
  lookAtSmoothing: 0.09,
  
  // Easing function
  easing: 'easeInOutCubic'
};
```

### Acceleration & Deceleration
- Smooth start and stop
- No sudden movements
- Natural feeling motion
- Prevents motion sickness

## Gesture-Based Camera Control

### 1. **Wrist Rotation** → Orbit
```
Rotate wrist clockwise → Camera orbits clockwise
Rotate wrist counter-clockwise → Camera orbits counter-clockwise
Speed: Proportional to rotation angle
Smoothing: Exponential moving average
```

### 2. **Pinch Gesture** → Zoom
```
Pinch closer → Zoom in (decrease distance)
Pinch farther → Zoom out (increase distance)
Speed: Proportional to pinch distance change
Limits: minDistance = 5, maxDistance = 50
```

### 3. **Index Finger Pointing** → Focus
```
Point at object → Camera smoothly orbits to focus
Point at room entrance → Smooth transition to room
Point at light → Camera focuses on light source
Transition time: 1.5 seconds
```

### 4. **Hand Position** → Free Look
```
Hand position X → Camera horizontal rotation
Hand position Y → Camera vertical rotation
Hand position Z → Camera forward/backward
Smoothing: High (0.1) for comfort
```

### 5. **Two Fingers Raised** → Mode Switch
```
Raise up → Switch to exterior view (zoom out, raise camera)
Raise down → Switch to interior view (zoom in, lower camera)
Rotate two fingers → Rotate camera around vertical axis
Transition time: 2 seconds
```

## Predefined Camera Positions

### Exterior Views
```javascript
const EXTERIOR_POSITIONS = {
  overview: {
    position: [30, 20, 30],
    target: [0, 5, 0],
    fov: 60
  },
  frontView: {
    position: [0, 10, 40],
    target: [0, 5, 0],
    fov: 50
  },
  sideView: {
    position: [40, 15, 0],
    target: [0, 5, 0],
    fov: 50
  },
  aerialView: {
    position: [25, 35, 25],
    target: [0, 0, 0],
    fov: 70
  }
};
```

### Interior Views
```javascript
const INTERIOR_POSITIONS = {
  livingRoom: {
    position: [5, 1.5, 8],
    target: [0, 1.5, 0],
    fov: 75
  },
  bedroom: {
    position: [3, 1.5, 5],
    target: [0, 1.5, 0],
    fov: 75
  },
  kitchen: {
    position: [4, 1.5, 6],
    target: [0, 1.5, 0],
    fov: 75
  },
  bathroom: {
    position: [2, 1.5, 3],
    target: [0, 1.5, 0],
    fov: 75
  }
};
```

## Room-to-Room Transitions

### Transition Flow
```
1. User points at room entrance
   → Camera focuses on entrance
   → Entrance highlights
   
2. User opens palm
   → Smooth camera transition to room
   → Follows predefined path
   → Lights fade in
   → Duration: 2-3 seconds
   
3. Camera arrives at room
   → Settles into room overview position
   → Lights fully on
   → Ready for exploration
```

### Transition Animation
```javascript
const TRANSITION_CONFIG = {
  duration: 2500, // 2.5 seconds
  easing: 'easeInOutCubic',
  
  // Animate these properties
  animateProperties: [
    'position',
    'target',
    'fov',
    'lighting'
  ],
  
  // Path interpolation
  pathInterpolation: 'catmullRom',
  pathSegments: 50
};
```

## Depth of Field (DOF)

### DOF Parameters
```javascript
const DOF_CONFIG = {
  enabled: true,
  aperture: 0.5, // 0-1, higher = more blur
  focusDistance: 10,
  blurRadius: 5,
  
  // Auto-adjust based on camera mode
  autoAdjust: true,
  
  // Smooth transitions
  smoothing: 0.1
};
```

### DOF Use Cases
- Focus on main object during inspection
- Blur background for depth perception
- Create cinematic feel
- Guide user attention

## Camera Constraints & Limits

### Position Constraints
```javascript
const CAMERA_LIMITS = {
  // Orbit mode
  minDistance: 5,
  maxDistance: 50,
  
  // Free look mode
  minHeight: 0.5,
  maxHeight: 10,
  
  // Rotation limits
  minPolarAngle: 0.1,
  maxPolarAngle: Math.PI - 0.1,
  
  // FOV limits
  minFOV: 30,
  maxFOV: 100
};
```

### Collision Detection
- Camera doesn't go through walls
- Respects room boundaries
- Smooth collision response
- Prevents clipping

## Performance Optimization

### Camera Optimization
1. **Frustum Culling**
   - Only render visible objects
   - Reduces draw calls
   - Improves performance

2. **LOD (Level of Detail)**
   - High detail near camera
   - Lower detail far away
   - Smooth transitions

3. **Viewport Optimization**
   - Adaptive resolution
   - Dynamic quality adjustment
   - Maintains 60 FPS

## Camera Animation Library

### Easing Functions
```javascript
const EASING = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1
};
```

## Research Metrics

### Camera Analysis
- Track camera movement patterns
- Measure user exploration behavior
- Analyze gesture-to-camera response latency
- Monitor frame rate during transitions
- Measure user comfort (motion sickness indicators)

---

**The camera is the window to the experience. Make every frame count.**
