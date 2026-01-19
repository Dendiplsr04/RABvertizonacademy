# 🏢 Villa Gesture Control - Interactive 3D Configurator

A professional, interactive 3D villa configurator powered by hand gesture recognition. Control and manipulate a 3D villa model using your hand gestures captured via webcam.

## ✨ Features

### Hand Gesture Control
- **Open Hand** - Deconstruct villa into glowing particles
- **Closed Fist** - Reconstruct villa from particles
- **Hand Movement** - Rotate villa in 3D space
- **Pinch Gesture** - Zoom in/out

### 3D Visualization
- **Realistic Villa Model** - Detailed 3D architecture with multiple wings
- **Particle Effects** - Smooth deconstruction/reconstruction animations
- **Professional Lighting** - Ambient, directional, and accent lighting
- **Shadow Mapping** - Realistic shadows for depth perception

### User Interface
- **Real-time Hand Detection** - Visual feedback when hand is detected
- **Property Information Panel** - Display villa details and pricing
- **Gesture Instructions** - On-screen guide for hand gestures
- **Control Buttons** - Reset view and toggle information

## 🛠️ Tech Stack

- **Three.js** - 3D graphics rendering
- **MediaPipe** - Hand gesture detection and tracking
- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - No framework dependencies

## 📦 Installation

```bash
cd vite-three-js
npm install
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── js/
│   ├── index.js                 # Main application entry
│   └── modules/
│       ├── HandGestureDetector.js   # MediaPipe hand tracking
│       ├── VillaModel.js            # 3D villa geometry
│       ├── ParticleSystem.js        # Particle effects
│       └── UIManager.js             # UI interactions
├── css/
│   ├── global.css               # Global styles
│   └── villa.css                # Villa-specific styles
└── shaders/
    ├── vertex.glsl              # Vertex shader
    └── fragment.glsl            # Fragment shader
```

## 🎮 How to Use

1. **Allow Camera Access** - Grant permission to access your webcam
2. **Position Your Hand** - Place your hand in front of the camera
3. **Open Hand** - Spread fingers to deconstruct the villa
4. **Close Fist** - Make a fist to reconstruct the villa
5. **Rotate** - Move your hand to rotate the villa
6. **Zoom** - Pinch fingers together to zoom

## 🎨 Customization

### Change Villa Colors
Edit `VillaModel.js` and modify material colors:

```javascript
const mainMaterial = new THREE.MeshStandardMaterial({
  color: 0xf5deb3, // Change this hex color
  roughness: 0.7,
  metalness: 0.1,
});
```

### Adjust Gesture Sensitivity
Edit `HandGestureDetector.js` and modify thresholds:

```javascript
// In updateHandInteraction()
if (openness > 0.65 && this.lastHandOpenness <= 0.65) {
  // Adjust 0.65 to change sensitivity
}
```

### Modify Particle Count
Edit `index.js` in `startDeconstruction()`:

```javascript
this.particles.createFromMesh(this.villa.group, 1000); // Change 1000 for more/less particles
```

## 🔧 Configuration

### Camera Settings
Edit `HandGestureDetector.js`:

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: 'user' }, // Change to 'environment' for rear camera
});
```

### Lighting
Edit `index.js` in `setupLighting()` to adjust light intensity and position.

## 📊 Performance

- **Target FPS**: 60 FPS
- **Particle Count**: 1000 particles (adjustable)
- **Hand Detection**: Real-time at 30 FPS
- **Bundle Size**: ~500KB (gzipped: ~125KB)

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions for camera access
- Ensure HTTPS is used (required for camera access)
- Try a different browser

### Hand Not Detected
- Ensure good lighting conditions
- Position hand clearly in front of camera
- Keep hand within frame

### Low Performance
- Reduce particle count in `startDeconstruction()`
- Lower camera resolution
- Disable shadows in `setupThreeJS()`

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with camera support

## 🚀 Deployment

### Vercel
```bash
npm run build
# Push to GitHub and connect to Vercel
```

### Manual Hosting
```bash
npm run build
# Upload dist/ folder to your hosting
```

## 📝 License

MIT License - Feel free to use for personal and commercial projects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ using Three.js and MediaPipe**
