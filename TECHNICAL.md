# Technical Documentation - Daily Report Marketing Vertizon

## 🏗️ Architecture

### File Structure

```
vite-three-js/
├── src/
│   ├── js/
│   │   ├── main.js           # Entry point & app initialization
│   │   ├── scene.js          # Three.js 3D scene management
│   │   ├── reportManager.js  # Data CRUD & localStorage
│   │   ├── formManager.js    # Form handling & validation
│   │   ├── ui.js             # UI updates & interactions
│   │   └── dummyData.js      # Dummy data generator
│   ├── css/
│   │   └── global.css        # All styles (moss green theme)
│   └── assets/
│       └── fonts/            # Custom fonts
├── public/
│   ├── favicon/              # App icons
│   └── app.webmanifest       # PWA manifest
├── index.html                # Main HTML
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
├── README.md                 # Project overview
├── USAGE.md                  # User guide
└── TECHNICAL.md              # This file
```

## 📦 Core Modules

### 1. ReportManager (`reportManager.js`)

**Purpose**: Handle all data operations

**Key Methods**:
```javascript
// CRUD Operations
addReport(reportData)           // Create new report
getReport(id)                   // Read single report
getAllReports()                 // Read all reports
updateReport(id, updatedData)   // Update report
deleteReport(id)                // Delete report

// Filtering & Statistics
filterReports(filters)          // Filter by date/category/marketing
getStatistics(date)             // Get stats for date range
getMarketingNames()             // Get unique marketing names

// Import/Export
exportToJSON()                  // Export to JSON file
importFromJSON(file)            // Import from JSON file

// WhatsApp
generateWhatsAppMessage(report) // Generate formatted message
```

**Data Structure**:
```javascript
{
  id: string,              // Unique ID
  name: string,            // Marketing name
  date: string,            // ISO date (YYYY-MM-DD)
  category: string,        // 'canvasing' | 'live' | 'konten'
  notes: string,           // Optional notes
  createdAt: string,       // ISO timestamp
  
  // Category-specific fields
  // Canvasing:
  prospek: number,
  lokasi: string,
  hasil: string,
  
  // Live:
  durasi: number,
  platform: string,
  viewers: number,
  hasil: string,
  
  // Konten:
  jumlahKonten: number,
  jenisKonten: string[],
  hasil: string
}
```

### 2. FormManager (`formManager.js`)

**Purpose**: Handle form interactions and validation

**Key Features**:
- Multi-step form (2 steps)
- Category-specific fields
- Real-time validation
- Modal management

**Key Methods**:
```javascript
openModal()                     // Open add report modal
closeModal()                    // Close modal
handleCategoryChange(category)  // Show/hide category fields
validateStep(step)              // Validate current step
handleSubmit(e)                 // Process form submission
collectFormData()               // Collect all form data
```

### 3. UIManager (`ui.js`)

**Purpose**: Handle UI updates and user feedback

**Key Methods**:
```javascript
init()                          // Initialize UI
updateStatistics()              // Update stats cards
refreshReportsList()            // Refresh reports display
createReportCard(report)        // Generate report card HTML
showReportDetail(reportId)      // Show detail modal
showToast(message, type)        // Show notification
updateMarketingFilter()         // Update marketing dropdown
```

### 4. SceneManager (`scene.js`)

**Purpose**: Manage Three.js 3D visualization

**Key Features**:
- 3 animated pillars (one per category)
- Particle system
- Dynamic lighting
- Smooth camera movement

**Key Methods**:
```javascript
init()                          // Initialize Three.js
createEnvironment()             // Create ground & particles
createPillars()                 // Create 3 category pillars
createLights()                  // Setup lighting
update()                        // Animation loop
render()                        // Render scene
```

## 🎨 Styling System

### CSS Custom Properties

```css
/* Colors */
--color-primary: #556B2F;       /* Dark Moss Green */
--color-primary-light: #6B8E23; /* Olive Drab */
--color-accent: #9ACD32;        /* Yellow Green */
--color-secondary: #8FBC8F;     /* Dark Sea Green */

/* Category Colors */
--color-canvasing: #4169E1;     /* Royal Blue */
--color-live: #DC143C;          /* Crimson */
--color-konten: #32CD32;        /* Lime Green */

/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;

/* Border Radius */
--radius-sm: 6px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
```

### Component Classes

```css
/* Layout */
.ui-container          /* Main UI overlay */
.header                /* Top header */
.main-content          /* Scrollable content area */
.bottom-nav            /* Mobile navigation */

/* Cards */
.stat-card             /* Statistics card */
.report-card           /* Report card */
.category-card         /* Category selector card */

/* Forms */
.form-step             /* Multi-step form step */
.form-group            /* Form field group */
.form-input            /* Input field */
.form-textarea         /* Textarea field */

/* Buttons */
.btn-primary           /* Primary action button */
.btn-secondary         /* Secondary action button */
.btn-icon              /* Icon button */
.fab                   /* Floating action button */

/* Modals */
.modal                 /* Modal container */
.modal-overlay         /* Modal backdrop */
.modal-content         /* Modal content */
```

## 🔄 Data Flow

### Adding a Report

```
User clicks FAB
    ↓
FormManager.openModal()
    ↓
User fills form (Step 1 & 2)
    ↓
FormManager.handleSubmit()
    ↓
FormManager.collectFormData()
    ↓
ReportManager.addReport(data)
    ↓
Save to localStorage
    ↓
UIManager.refreshReportsList()
    ↓
UIManager.updateStatistics()
    ↓
Show success toast
```

### Filtering Reports

```
User changes filter
    ↓
UIManager event listener
    ↓
Update currentFilter
    ↓
ReportManager.filterReports(filters)
    ↓
UIManager.refreshReportsList()
    ↓
Display filtered results
```

### WhatsApp Integration

```
User clicks "Kirim ke WhatsApp"
    ↓
ReportManager.generateWhatsAppMessage(report)
    ↓
Format message with emojis & data
    ↓
Encode message for URL
    ↓
Open WhatsApp with pre-filled message
```

## 🎯 Three.js Scene Details

### Scene Setup

```javascript
// Camera
PerspectiveCamera(60°, aspect, 0.1, 1000)
Position: (0, 8, 20)

// Renderer
WebGLRenderer with:
- Antialiasing
- Shadow mapping (PCFSoftShadowMap)
- Tone mapping (ACESFilmicToneMapping)
- Pixel ratio: min(devicePixelRatio, 2)

// Fog
Fog(0x0F1419, 30, 100)
```

### 3D Objects

**Pillars** (3x):
- Base: Cylinder (r: 1.5-1.8, h: 0.5)
- Main: Cylinder (r: 1.2, h: 8)
- Cap: Cylinder (r: 1.5-1.2, h: 0.8)
- Ring: Torus (r: 1.3, tube: 0.1)

**Particles**:
- 200 points
- Random positions in 50x50x50 cube
- Moss green color with additive blending

**Lighting**:
- Ambient: Moss green, intensity 0.4
- Directional: Yellow green, intensity 1
- Point lights: 3x (one per pillar)
- Hemisphere: Sky/ground gradient

### Animations

```javascript
// Pillar rings
rotation.z = time + index
position.y = 2.5 + sin(time * 2 + index) * 0.2

// Particles
rotation.y = time * 0.05

// Camera sway
position.x = sin(time * 0.2) * 0.5
position.y = 8 + sin(time * 0.3) * 0.3
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
  /* Extra small adjustments */
}

/* Tablet */
@media (max-width: 768px) {
  /* Main mobile layout */
  - Single column grids
  - Stacked filters
  - Full-screen modals
  - Smaller buttons
}

/* Desktop */
@media (min-width: 769px) {
  /* Default desktop layout */
  - Multi-column grids
  - Horizontal filters
  - Centered modals
}
```

## 🔧 Build Configuration

### Vite Config

```javascript
// vite.config.js
export default {
  plugins: [
    legacy(),           // Browser compatibility
    glsl()              // GLSL shader support
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three']
        }
      }
    }
  }
}
```

## 🚀 Performance Optimizations

1. **Three.js**:
   - Pixel ratio capped at 2
   - Soft shadows (PCFSoftShadowMap)
   - Fog for depth culling
   - Minimal geometry complexity

2. **DOM**:
   - Event delegation where possible
   - Debounced filter updates
   - Virtual scrolling for large lists (future)

3. **Storage**:
   - Lazy loading of reports
   - Indexed data structure
   - Compressed JSON export

4. **CSS**:
   - Hardware-accelerated transforms
   - Will-change hints
   - Optimized animations

## 🐛 Debugging

### Console Helpers

```javascript
// Load dummy data
loadDummyData()

// Clear all data
clearAllData()

// Export data
exportData()

// Access app instance
window.app
window.app.reportManager
window.app.uiManager
window.app.sceneManager
```

### Common Issues

**Reports not showing**:
- Check filter settings
- Verify localStorage data
- Check console for errors

**3D scene not rendering**:
- Check WebGL support
- Verify canvas element
- Check Three.js errors

**Form not submitting**:
- Check validation errors
- Verify all required fields
- Check console for errors

## 📊 Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 12+)
- Opera: ✅ Full support

**Requirements**:
- ES2015+ support
- WebGL support
- LocalStorage API
- CSS Grid & Flexbox

## 🔐 Security Considerations

1. **XSS Prevention**:
   - All user input is escaped
   - No innerHTML with user data
   - Sanitized before display

2. **Data Privacy**:
   - Data stored locally only
   - No external API calls
   - No tracking/analytics

3. **Input Validation**:
   - Client-side validation
   - Type checking
   - Length limits

## 📈 Future Enhancements

### Planned Features

1. **Backend Integration**:
   - REST API
   - Real-time sync
   - Multi-user support

2. **Advanced Analytics**:
   - Charts & graphs
   - Trend analysis
   - Performance metrics

3. **Export Options**:
   - PDF reports
   - Excel spreadsheets
   - Email integration

4. **Collaboration**:
   - Team comments
   - Approval workflow
   - Notifications

5. **PWA Features**:
   - Offline mode
   - Push notifications
   - Install prompt

---

**Last Updated**: February 9, 2026
**Version**: 1.0.0
