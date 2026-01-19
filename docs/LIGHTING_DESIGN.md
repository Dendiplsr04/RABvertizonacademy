# 💡 Lighting System Design

## Lighting States (8 Presets)

### 1. **Golden Hour (Sunset)** - Warm & Romantic
```javascript
{
  name: 'Golden Hour',
  ambientIntensity: 0.4,
  ambientColor: 0xFFD700,
  directionalIntensity: 0.8,
  directionalColor: 0xFFA500,
  directionalPosition: [15, 25, 15],
  bloomIntensity: 0.6,
  bloomThreshold: 0.8,
  fogColor: 0xFFB347,
  fogDensity: 0.001,
  temperature: 'warm',
  mood: 'romantic'
}
```

### 2. **Blue Hour (Dusk)** - Cool & Mysterious
```javascript
{
  name: 'Blue Hour',
  ambientIntensity: 0.3,
  ambientColor: 0x4A90E2,
  directionalIntensity: 0.6,
  directionalColor: 0x87CEEB,
  directionalPosition: [10, 20, 10],
  bloomIntensity: 0.5,
  bloomThreshold: 0.7,
  fogColor: 0x1E3A8A,
  fogDensity: 0.0005,
  temperature: 'cool',
  mood: 'mysterious'
}
```

### 3. **Midday Sun** - Bright & Clear
```javascript
{
  name: 'Midday Sun',
  ambientIntensity: 0.7,
  ambientColor: 0xFFFFFF,
  directionalIntensity: 1.0,
  directionalColor: 0xFFFFFF,
  directionalPosition: [0, 30, 0],
  bloomIntensity: 0.3,
  bloomThreshold: 0.9,
  fogColor: 0xE0F6FF,
  fogDensity: 0.0001,
  temperature: 'neutral',
  mood: 'energetic'
}
```

### 4. **Soft Morning** - Gentle & Peaceful
```javascript
{
  name: 'Soft Morning',
  ambientIntensity: 0.5,
  ambientColor: 0xFFF8DC,
  directionalIntensity: 0.7,
  directionalColor: 0xFFE4B5,
  directionalPosition: [-15, 20, 10],
  bloomIntensity: 0.4,
  bloomThreshold: 0.8,
  fogColor: 0xFFF0E6,
  fogDensity: 0.0008,
  temperature: 'warm',
  mood: 'peaceful'
}
```

### 5. **Night - Exterior** - Dramatic & Luxurious
```javascript
{
  name: 'Night Exterior',
  ambientIntensity: 0.15,
  ambientColor: 0x1A1A2E,
  directionalIntensity: 0.3,
  directionalColor: 0x4A90E2,
  directionalPosition: [20, 15, 20],
  pointLights: [
    { position: [10, 5, 10], color: 0xFFD700, intensity: 1.5 },
    { position: [-10, 5, -10], color: 0x87CEEB, intensity: 1.0 },
    { position: [0, 8, 15], color: 0xFFFFFF, intensity: 0.8 }
  ],
  bloomIntensity: 0.8,
  bloomThreshold: 0.6,
  fogColor: 0x0A0E27,
  fogDensity: 0.002,
  temperature: 'cool',
  mood: 'dramatic'
}
```

### 6. **Night - Interior** - Cozy & Intimate
```javascript
{
  name: 'Night Interior',
  ambientIntensity: 0.2,
  ambientColor: 0x2C1810,
  directionalIntensity: 0.2,
  directionalColor: 0x8B7355,
  pointLights: [
    { position: [5, 3, 5], color: 0xFFD700, intensity: 2.0 },
    { position: [-5, 3, -5], color: 0xFFA500, intensity: 1.5 },
    { position: [0, 2, 8], color: 0xFFE4B5, intensity: 1.2 }
  ],
  bloomIntensity: 0.7,
  bloomThreshold: 0.5,
  fogColor: 0x1A1410,
  fogDensity: 0.001,
  temperature: 'warm',
  mood: 'intimate'
}
```

### 7. **Overcast Day** - Neutral & Professional
```javascript
{
  name: 'Overcast',
  ambientIntensity: 0.6,
  ambientColor: 0xD3D3D3,
  directionalIntensity: 0.5,
  directionalColor: 0xC0C0C0,
  directionalPosition: [5, 15, 5],
  bloomIntensity: 0.2,
  bloomThreshold: 0.95,
  fogColor: 0xE8E8E8,
  fogDensity: 0.0003,
  temperature: 'neutral',
  mood: 'professional'
}
```

### 8. **Twilight** - Magical & Ethereal
```javascript
{
  name: 'Twilight',
  ambientIntensity: 0.35,
  ambientColor: 0x9370DB,
  directionalIntensity: 0.4,
  directionalColor: 0xDDA0DD,
  directionalPosition: [10, 18, 10],
  pointLights: [
    { position: [8, 4, 8], color: 0xFF69B4, intensity: 1.2 },
    { position: [-8, 4, -8], color: 0x9370DB, intensity: 1.0 }
  ],
  bloomIntensity: 0.6,
  bloomThreshold: 0.7,
  fogColor: 0x6A5ACD,
  fogDensity: 0.0012,
  temperature: 'cool',
  mood: 'magical'
}
```

## Lighting Transition System

### Smooth Transitions
```javascript
const TRANSITION_CONFIG = {
  duration: 3000, // 3 seconds
  easing: 'easeInOutCubic',
  
  // Animate these properties
  animateProperties: [
    'ambientIntensity',
    'directionalIntensity',
    'bloomIntensity',
    'fogDensity',
    'ambientColor',
    'directionalColor'
  ]
};
```

### Transition Easing Functions
- **easeInOutCubic** - Smooth, natural feeling
- **easeInOutQuad** - Faster, more responsive
- **easeInOutQuart** - Slower, more dramatic

## Advanced Lighting Features

### 1. **Bloom Effect**
- Subtle glow on bright surfaces
- Adjustable threshold and intensity
- Creates premium, cinematic feel

### 2. **Depth of Field**
- Subtle focus effect on main subject
- Blurs background for depth
- Adjustable aperture and focus distance

### 3. **Light Rays (Volumetric Lighting)**
- Subtle god rays through windows
- Adds atmosphere and depth
- Performance-optimized implementation

### 4. **Color Grading**
- Subtle color correction per lighting state
- Warm/cool temperature adjustment
- Saturation and contrast control

### 5. **Ambient Occlusion**
- Subtle shadows in crevices
- Adds realism and depth
- Screen-space AO for performance

## Lighting Control via Gesture

### Gesture-Based Lighting Control
```
Thumbs Up → Increase brightness (intensity * 1.1)
Thumbs Down → Decrease brightness (intensity * 0.9)
Two Fingers Rotate → Rotate light direction
Palm Swipe Up → Next lighting preset
Palm Swipe Down → Previous lighting preset
```

### Real-time Adjustment
- Smooth interpolation between values
- Immediate visual feedback
- No jarring transitions
- Respects current lighting state

## Performance Optimization

### Lighting Optimization Techniques
1. **Shadow Map Optimization**
   - 2048x2048 resolution
   - Optimized frustum
   - Cascaded shadow maps for large scenes

2. **Light Culling**
   - Only active lights rendered
   - Distance-based light culling
   - Deferred rendering for many lights

3. **Bloom Optimization**
   - Downsampled bloom texture
   - Efficient blur passes
   - Adjustable quality levels

4. **Fog Optimization**
   - Linear fog for performance
   - Adjustable density per state
   - Helps with depth perception

## Lighting State Transitions

### Automatic Transitions
- When entering/exiting rooms
- When changing time of day
- When user selects new preset
- Smooth 3-second interpolation

### Manual Transitions
- User can adjust brightness via gesture
- Real-time feedback
- Smooth interpolation
- Respects current state

## Research Metrics

### Lighting Analysis
- Track which lighting states are used most
- Measure user preference patterns
- Analyze transition smoothness
- Monitor performance impact

---

**Lighting is the soul of this experience. Every state is carefully crafted for maximum impact.**
