/**
 * Main Application Entry Point
 * Daily Report Marketing Vertizon
 */

import '../css/global.css';
import { SceneManager } from './scene.js';
import { ReportManager } from './reportManager.js';
import { FormManager } from './formManager.js';
import { UIManager } from './ui.js';

class DailyReportApp {
  constructor() {
    this.sceneManager = null;
    this.reportManager = null;
    this.formManager = null;
    this.uiManager = null;
    this.isInitialized = false;
  }

  async init() {
    try {
      console.log('[App] Initializing Daily Report Marketing Vertizon...');

      // Initialize Report Manager
      this.reportManager = new ReportManager();
      console.log('[App] Report Manager initialized');

      // Load dummy data if localStorage is empty (first time)
      if (this.reportManager.getAllReports().length === 0) {
        console.log('[App] No data found, loading dummy data...');
        const { loadDummyData } = await import('./dummyData.js');
        loadDummyData();
        this.reportManager = new ReportManager(); // Reload to get dummy data
      }

      // Initialize UI Manager
      this.uiManager = new UIManager(this.reportManager);
      this.uiManager.init();
      console.log('[App] UI Manager initialized');

      // Initialize Form Manager
      this.formManager = new FormManager(this.reportManager, this.uiManager);
      console.log('[App] Form Manager initialized');

      // Initialize Three.js Scene
      this.sceneManager = new SceneManager();
      await this.sceneManager.init();
      console.log('[App] 3D Scene initialized');

      // Setup animation loop
      this.setupAnimationLoop();

      // Hide loading screen
      setTimeout(() => {
        this.uiManager.hideLoadingScreen();
        this.isInitialized = true;
        console.log('[App] Initialization complete!');
      }, 1000);

    } catch (error) {
      console.error('[App] Initialization failed:', error);
      this.uiManager?.showToast('Gagal memuat aplikasi: ' + error.message, 'error');
    }
  }

  setupAnimationLoop() {
    const animate = () => {
      requestAnimationFrame(animate);

      // Update scene animations
      this.sceneManager.update();

      // Render scene
      this.sceneManager.render();
    };

    animate();
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const app = new DailyReportApp();
  await app.init();
  window.app = app; // For debugging
});


// Expose helper functions to window for console access
window.loadDummyData = async () => {
  const { loadDummyData } = await import('./dummyData.js');
  loadDummyData();
  window.location.reload();
};

window.clearAllData = () => {
  if (confirm('Yakin ingin menghapus semua data?')) {
    localStorage.removeItem('vertizon_daily_reports');
    window.location.reload();
  }
};

window.exportData = () => {
  window.app?.reportManager?.exportToJSON();
};

console.log('%c🚀 Daily Report Marketing Vertizon', 'color: #556B2F; font-size: 20px; font-weight: bold;');
console.log('%cHelper Functions:', 'color: #9ACD32; font-size: 14px; font-weight: bold;');
console.log('%c- loadDummyData() : Load 15 dummy reports', 'color: #8FBC8F;');
console.log('%c- clearAllData()  : Clear all reports', 'color: #8FBC8F;');
console.log('%c- exportData()    : Export to JSON', 'color: #8FBC8F;');
