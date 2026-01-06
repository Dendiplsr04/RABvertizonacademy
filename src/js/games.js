// Fun Games - Vertizon Academy
import * as THREE from 'three';
import { gamesData, scheduleRecommendation } from '../data/games-data.js';

// ============================================
// THREE.JS BACKGROUND
// ============================================
function initThreeBackground() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Colorful particles
  const colors = [0x3b82f6, 0x10b981, 0xf59e0b, 0xec4899, 0x8b5cf6];
  const particleGroups = [];

  colors.forEach((color, index) => {
    const geometry = new THREE.BufferGeometry();
    const count = 150;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      color,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = { speed: 0.0002 + index * 0.0001, direction: index % 2 === 0 ? 1 : -1 };
    particleGroups.push(particles);
    scene.add(particles);
  });

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);

    particleGroups.forEach((group) => {
      group.rotation.y += group.userData.speed * group.userData.direction;
      group.rotation.x += group.userData.speed * 0.5;
    });

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function getDifficultyClass(difficulty) {
  const map = {
    'Mudah': 'difficulty-easy',
    'Sedang': 'difficulty-medium',
    'Menantang': 'difficulty-hard',
    'Seru': 'difficulty-fun'
  };
  return map[difficulty] || 'difficulty-easy';
}

function renderSchedule() {
  const grid = document.getElementById('schedule-grid');
  grid.innerHTML = scheduleRecommendation.map(item => `
    <div class="schedule-item">
      <div class="schedule-time">⏰ ${item.time}</div>
      <div class="schedule-game">${item.game}</div>
      <div class="schedule-type">${item.type}</div>
    </div>
  `).join('');
}

function renderGames() {
  const grid = document.getElementById('games-grid');
  
  grid.innerHTML = gamesData.map(game => `
    <div class="game-card" data-game-id="${game.id}">
      <div class="game-card-header" style="background: linear-gradient(135deg, ${game.color}22, ${game.color}11);">
        <span class="game-emoji">${game.emoji}</span>
        <h3 class="game-name">${game.name}</h3>
        <span class="game-category" style="background: ${game.color}33; color: ${game.color};">${game.category}</span>
      </div>
      <div class="game-card-body">
        <p class="game-desc">${game.description}</p>
        <div class="game-meta">
          <div class="game-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            ${game.duration}
          </div>
          <div class="game-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            ${game.participants}
          </div>
          <div class="game-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            </svg>
            ${game.timing}
          </div>
          <div class="game-meta-item" style="color: #10b981;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Rp ${game.totalBudget ? game.totalBudget.toLocaleString('id-ID') : '0'}
          </div>
        </div>
      </div>
      <div class="game-card-footer">
        <span class="difficulty ${getDifficultyClass(game.difficulty)}">${game.difficulty}</span>
        <button class="btn-detail">
          Lihat Detail
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

function renderModal(game) {
  const modal = document.getElementById('modal-content');
  
  modal.innerHTML = `
    <button class="modal-close" id="modal-close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    
    <div class="modal-header" style="background: linear-gradient(135deg, ${game.color}22, ${game.color}11);">
      <span class="modal-emoji">${game.emoji}</span>
      <h2 class="modal-title">${game.name}</h2>
      <span class="game-category" style="background: ${game.color}33; color: ${game.color};">${game.category}</span>
      
      <div class="modal-meta">
        <div class="modal-meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          ${game.duration}
        </div>
        <div class="modal-meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          ${game.participants}
        </div>
        <div class="modal-meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
          </svg>
          ${game.timing}
        </div>
      </div>
    </div>
    
    <div class="modal-body">
      <!-- Objective -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
          </svg>
          Tujuan Permainan
        </h3>
        <p class="modal-text">${game.objective}</p>
      </div>
      
      <!-- Materials -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
          </svg>
          Perlengkapan
        </h3>
        <ul class="modal-list">
          ${game.materials.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>
      
      <!-- Rules -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Aturan Main
        </h3>
        <ul class="modal-list">
          ${game.rules.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
      
      <!-- Steps -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Cara Main (Step by Step)
        </h3>
        <div class="steps-container">
          ${game.steps.map(step => `
            <div class="step-card">
              <div class="step-number">${step.step}</div>
              <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.desc}</p>
              </div>
              <span class="step-duration">${step.duration}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      ${game.scenarios ? `
      <!-- Scenarios (for Handle Objection) -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Contoh Skenario Objection
        </h3>
        <ul class="modal-list">
          ${game.scenarios.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      ${game.clueExamples ? `
      <!-- Clue Examples (for Treasure Hunt) -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Contoh Clue
        </h3>
        <ul class="modal-list">
          ${game.clueExamples.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
      ` : ''}
      
      <!-- Scoring -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Sistem Penilaian
        </h3>
        <div class="scoring-grid">
          ${game.scoring.map(s => {
            const parts = s.split('=');
            return `
              <div class="scoring-item">
                <span>${parts[0]}</span>
                <span>${parts[1] || ''}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Winner -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
          </svg>
          Pemenang
        </h3>
        <p class="modal-text">🏆 ${game.winner}</p>
      </div>
      
      <!-- Tips -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          Tips untuk Panitia
        </h3>
        <div class="tips-list">
          ${game.tips.map(t => `<div class="tip-item">${t}</div>`).join('')}
        </div>
      </div>

      <!-- Budget -->
      ${game.budget ? `
      <div class="modal-section">
        <h3 class="modal-section-title" style="color: #10b981;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          Estimasi Biaya
        </h3>
        <div class="scoring-grid">
          ${game.budget.map(b => `
            <div class="scoring-item">
              <span>${b.item} ${b.qty ? `(${b.qty} ${b.unit})` : ''}</span>
              <span style="color: #10b981;">Rp ${b.total.toLocaleString('id-ID')}</span>
            </div>
          `).join('')}
          <div class="scoring-item" style="background: rgba(16, 185, 129, 0.15); border-radius: 8px; margin-top: 8px;">
            <span style="font-weight: 700;">TOTAL</span>
            <span style="color: #10b981; font-weight: 700; font-size: 1.1rem;">Rp ${game.totalBudget.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
      ` : ''}
    </div>
  `;
  
  // Re-attach close button event
  document.getElementById('modal-close').addEventListener('click', closeModal);
}

// ============================================
// MODAL HANDLERS
// ============================================
function openModal(gameId) {
  const game = gamesData.find(g => g.id === gameId);
  if (!game) return;
  
  renderModal(game);
  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEventListeners() {
  // Game card clicks
  document.getElementById('games-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (card) {
      const gameId = parseInt(card.dataset.gameId, 10);
      openModal(gameId);
    }
  });
  
  // Modal overlay click (close)
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
      closeModal();
    }
  });
  
  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  initThreeBackground();
  renderSchedule();
  renderGames();
  initEventListeners();
}

document.addEventListener('DOMContentLoaded', init);
