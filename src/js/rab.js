// RAB Vertizon Academy - Main JavaScript
import * as THREE from 'three';
import { eventInfo, peralatan, konsumsiNany, konsumsiKita, operasionalKendaraan, funGames, icons } from '../data/rab-data.js';
import { rundownHari1, rundownHari2 } from '../data/event-data.js';
import { initMiniGame } from './mini-game.js';
import '../css/animations.css';
import '../css/mini-game.css';

// ============================================
// THREE.JS BACKGROUND - Enhanced 3D Effect
// ============================================
function initThreeBackground() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create multiple particle systems for depth
  const createParticles = (count, size, color, spread) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * spread;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size,
      color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
  };

  // Emerald particles (main)
  const emeraldParticles = createParticles(600, 0.025, 0x10b981, 12);
  scene.add(emeraldParticles);

  // Teal particles (secondary)
  const tealParticles = createParticles(300, 0.015, 0x14b8a6, 15);
  scene.add(tealParticles);

  // White particles (accent)
  const whiteParticles = createParticles(200, 0.01, 0xffffff, 10);
  scene.add(whiteParticles);

  // Floating geometric shapes
  const geometries = [];
  const shapeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x10b981, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });

  for (let i = 0; i < 8; i++) {
    const geometry = i % 2 === 0 
      ? new THREE.OctahedronGeometry(0.3 + Math.random() * 0.3)
      : new THREE.TetrahedronGeometry(0.3 + Math.random() * 0.3);
    
    const mesh = new THREE.Mesh(geometry, shapeMaterial);
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 5 - 3
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    geometries.push(mesh);
    scene.add(mesh);
  }

  camera.position.z = 5;

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // Animation
  function animate() {
    requestAnimationFrame(animate);

    // Rotate particles
    emeraldParticles.rotation.y += 0.0003;
    emeraldParticles.rotation.x += 0.0001;
    
    tealParticles.rotation.y -= 0.0002;
    tealParticles.rotation.x += 0.00015;
    
    whiteParticles.rotation.y += 0.0004;

    // Animate geometric shapes
    geometries.forEach((mesh, i) => {
      mesh.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
      mesh.rotation.y += 0.003 * (i % 2 === 0 ? -1 : 1);
      mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.001;
    });

    // Camera follows mouse slightly
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ============================================
// DATA MANAGEMENT
// ============================================
const STORAGE_KEY = 'rab_vertizon_2026_v2';

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    peralatan: peralatan.map(item => ({ ...item })),
    konsumsiKita: konsumsiKita.map(item => ({ ...item })),
    operasionalKendaraan: operasionalKendaraan.map(item => ({ ...item })),
    funGames: funGames.map(item => ({ ...item }))
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let currentData = loadData();

// ============================================
// FORMAT HELPERS
// ============================================
function formatRupiah(number) {
  if (number === null || number === undefined) return '-';
  return 'Rp ' + number.toLocaleString('id-ID');
}

function parseRupiah(str) {
  const num = parseInt(str.replace(/[^\d]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

function getIcon(iconName) {
  return icons[iconName] || icons.default || '';
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderEventInfo() {
  document.getElementById('event-name').textContent = eventInfo.name;
  document.getElementById('event-theme').textContent = `"${eventInfo.theme}"`;
  document.getElementById('event-date').textContent = `${eventInfo.day}, ${eventInfo.date}`;
  document.getElementById('event-location').textContent = eventInfo.location;
  document.getElementById('event-participants').textContent = eventInfo.participants;
}

function renderPeralatan() {
  const grid = document.getElementById('grid-peralatan');
  grid.innerHTML = '';

  currentData.peralatan.forEach((item) => {
    let qtyHtml = '';
    let priceHtml;

    // Check if item has qty and pricePerUnit (editable qty)
    if (item.qty && item.pricePerUnit && item.editable) {
      qtyHtml = `
        <div class="qty-calculator">
          <input type="number" class="qty-input" data-type="peralatan" data-id="${item.id}" value="${item.qty}" min="1" />
          <span class="qty-unit">${item.unit}</span>
          <span class="qty-multiply">×</span>
          <span class="qty-price">Rp ${item.pricePerUnit.toLocaleString('id-ID')}</span>
        </div>
      `;
      priceHtml = `<span class="price-display price-calculated">${formatRupiah(item.price)}</span>`;
    } else if (item.qty) {
      qtyHtml = `<span class="qty-badge">${item.qty} ${item.unit}</span>`;
      if (item.price !== null && item.editable) {
        priceHtml = `<input type="text" class="price-input" data-type="peralatan" data-id="${item.id}" value="${formatRupiah(item.price)}" />`;
      } else if (item.price !== null) {
        priceHtml = `<span class="price-display">${formatRupiah(item.price)}</span>`;
      } else {
        priceHtml = `<span class="provided-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><polyline points="20 6 9 17 4 12"/></svg> Tersedia</span>`;
      }
    } else {
      if (item.price !== null && item.editable) {
        priceHtml = `<input type="text" class="price-input" data-type="peralatan" data-id="${item.id}" value="${formatRupiah(item.price)}" />`;
      } else if (item.price !== null) {
        priceHtml = `<span class="price-display">${formatRupiah(item.price)}</span>`;
      } else {
        priceHtml = `<span class="provided-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><polyline points="20 6 9 17 4 12"/></svg> Tersedia</span>`;
      }
    }

    let providerHtml = '';
    if (item.provider) {
      providerHtml = `<span class="provider-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${item.provider}</span>`;
    }

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-header">
        <div class="item-icon">${getIcon(item.icon)}</div>
        <div class="item-info">
          <div class="item-name">${item.item}</div>
          ${qtyHtml}
        </div>
      </div>
      <div class="item-footer">
        ${providerHtml || '<span></span>'}
        ${priceHtml}
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderKonsumsiNany() {
  const grid = document.getElementById('grid-konsumsi-nany');
  grid.innerHTML = '';

  konsumsiNany.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-header">
        <div class="item-icon">${getIcon(item.icon)}</div>
        <div class="item-info">
          <div class="item-name">${item.item}</div>
          ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
        </div>
      </div>
      <div class="item-footer">
        <span class="provider-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          ${item.provider}
        </span>
        <span class="provided-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><polyline points="20 6 9 17 4 12"/></svg>
          Disediakan
        </span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderKonsumsiKita() {
  const grid = document.getElementById('grid-konsumsi-kita');
  grid.innerHTML = '';

  currentData.konsumsiKita.forEach((item) => {
    const qtyNote = item.qty ? ` (${item.qty} ${item.unit})` : '';
    
    let priceHtml;
    if (item.editable) {
      priceHtml = `<input type="text" class="price-input" data-type="konsumsi" data-id="${item.id}" value="${formatRupiah(item.price)}" />`;
    } else {
      priceHtml = `<span class="price-display">${formatRupiah(item.price)}</span>`;
    }

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-header">
        <div class="item-icon">${getIcon(item.icon)}</div>
        <div class="item-info">
          <div class="item-name">${item.item}${qtyNote}</div>
          ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
        </div>
      </div>
      <div class="item-footer">
        <span></span>
        ${priceHtml}
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderOperasionalKendaraan() {
  const grid = document.getElementById('grid-operasional');
  if (!grid) return;
  
  grid.innerHTML = '';

  currentData.operasionalKendaraan.forEach((item) => {
    let qtyHtml = '';
    let priceHtml;

    if (item.qty && item.pricePerUnit && item.editable) {
      qtyHtml = `
        <div class="qty-calculator">
          <input type="number" class="qty-input" data-type="operasional" data-id="${item.id}" value="${item.qty}" min="1" />
          <span class="qty-unit">${item.unit}</span>
          <span class="qty-multiply">×</span>
          <span class="qty-price">Rp ${item.pricePerUnit.toLocaleString('id-ID')}</span>
        </div>
      `;
      priceHtml = `<span class="price-display price-calculated" style="color: #f97316;">${formatRupiah(item.price)}</span>`;
    } else if (item.editable) {
      priceHtml = `<input type="text" class="price-input" data-type="operasional" data-id="${item.id}" value="${formatRupiah(item.price)}" style="color: #f97316;" />`;
    } else {
      priceHtml = `<span class="price-display" style="color: #f97316;">${formatRupiah(item.price)}</span>`;
    }

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-header">
        <div class="item-icon" style="background: rgba(249, 115, 22, 0.15); color: #f97316;">${getIcon(item.icon)}</div>
        <div class="item-info">
          <div class="item-name">${item.item}</div>
          ${qtyHtml}
          ${item.note && !item.qty ? `<div class="item-note">${item.note}</div>` : ''}
        </div>
      </div>
      <div class="item-footer">
        <span></span>
        ${priceHtml}
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderFunGames() {
  const grid = document.getElementById('grid-fun-games');
  if (!grid) return;
  
  grid.innerHTML = '';

  currentData.funGames.forEach((item) => {
    let priceHtml;
    if (item.editable) {
      priceHtml = `<input type="text" class="price-input" data-type="games" data-id="${item.id}" value="${formatRupiah(item.price)}" style="color: #a78bfa;" />`;
    } else {
      priceHtml = `<span class="price-display" style="color: #a78bfa;">${formatRupiah(item.price)}</span>`;
    }

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-header">
        <div class="item-icon" style="background: rgba(139, 92, 246, 0.15); color: #a78bfa;">${getIcon(item.icon)}</div>
        <div class="item-info">
          <div class="item-name">${item.item}</div>
          ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
        </div>
      </div>
      <div class="item-footer">
        <a href="games.html" class="provider-badge" style="background: rgba(139, 92, 246, 0.15); color: #a78bfa; text-decoration: none;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          Lihat Detail
        </a>
        ${priceHtml}
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderRundown() {
  const timeline1 = document.getElementById('timeline-hari1');
  const timeline2 = document.getElementById('timeline-hari2');
  
  if (!timeline1 || !timeline2) return;

  // Render Hari 1
  timeline1.innerHTML = '';
  rundownHari1.jadwal.forEach((item) => {
    const timelineItem = document.createElement('div');
    timelineItem.className = `timeline-item ${item.type}`;
    timelineItem.innerHTML = `
      <div class="timeline-header">
        <span class="timeline-time">${item.jam}</span>
        <span class="timeline-agenda">${item.agenda}</span>
      </div>
      <div class="timeline-detail">${item.detail}</div>
      ${item.pic !== '-' ? `
        <span class="timeline-pic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          ${item.pic}
        </span>
      ` : ''}
    `;
    timeline1.appendChild(timelineItem);
  });

  // Render Hari 2
  timeline2.innerHTML = '';
  rundownHari2.jadwal.forEach((item) => {
    const timelineItem = document.createElement('div');
    timelineItem.className = `timeline-item ${item.type}`;
    timelineItem.innerHTML = `
      <div class="timeline-header">
        <span class="timeline-time">${item.jam}</span>
        <span class="timeline-agenda">${item.agenda}</span>
      </div>
      <div class="timeline-detail">${item.detail}</div>
      ${item.pic !== '-' ? `
        <span class="timeline-pic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          ${item.pic}
        </span>
      ` : ''}
    `;
    timeline2.appendChild(timelineItem);
  });
}

function calculateTotals() {
  const subtotalPeralatan = currentData.peralatan
    .filter(item => item.price !== null)
    .reduce((sum, item) => sum + item.price, 0);
  
  document.getElementById('subtotal-peralatan').textContent = formatRupiah(subtotalPeralatan);

  const subtotalKonsumsi = currentData.konsumsiKita
    .reduce((sum, item) => sum + (item.price || 0), 0);
  
  document.getElementById('subtotal-konsumsi').textContent = formatRupiah(subtotalKonsumsi);

  const subtotalOperasional = currentData.operasionalKendaraan
    .reduce((sum, item) => sum + (item.price || 0), 0);
  
  const operasionalEl = document.getElementById('subtotal-operasional');
  if (operasionalEl) operasionalEl.textContent = formatRupiah(subtotalOperasional);

  const subtotalGames = currentData.funGames
    .reduce((sum, item) => sum + (item.price || 0), 0);
  
  const gamesEl = document.getElementById('subtotal-games');
  if (gamesEl) gamesEl.textContent = formatRupiah(subtotalGames);

  const total = subtotalPeralatan + subtotalKonsumsi + subtotalOperasional + subtotalGames;
  document.getElementById('total-amount').textContent = formatRupiah(total);
}

// ============================================
// EVENT HANDLERS
// ============================================
function handlePriceInput(e) {
  if (!e.target.classList.contains('price-input')) return;

  const type = e.target.dataset.type;
  const id = parseInt(e.target.dataset.id, 10);
  const value = parseRupiah(e.target.value);

  if (type === 'peralatan') {
    const item = currentData.peralatan.find(p => p.id === id);
    if (item) item.price = value;
  } else if (type === 'konsumsi') {
    const item = currentData.konsumsiKita.find(k => k.id === id);
    if (item) item.price = value;
  } else if (type === 'operasional') {
    const item = currentData.operasionalKendaraan.find(o => o.id === id);
    if (item) item.price = value;
  } else if (type === 'games') {
    const item = currentData.funGames.find(g => g.id === id);
    if (item) item.price = value;
  }

  e.target.value = formatRupiah(value);
  saveData(currentData);
  calculateTotals();
}

function handleQtyInput(e) {
  if (!e.target.classList.contains('qty-input')) return;

  const type = e.target.dataset.type;
  const id = parseInt(e.target.dataset.id, 10);
  const qty = parseInt(e.target.value, 10) || 1;

  if (type === 'peralatan') {
    const item = currentData.peralatan.find(p => p.id === id);
    if (item && item.pricePerUnit) {
      item.qty = qty;
      item.price = qty * item.pricePerUnit;
      const card = e.target.closest('.item-card');
      const priceDisplay = card.querySelector('.price-calculated');
      if (priceDisplay) {
        priceDisplay.textContent = formatRupiah(item.price);
      }
    }
  } else if (type === 'operasional') {
    const item = currentData.operasionalKendaraan.find(o => o.id === id);
    if (item && item.pricePerUnit) {
      item.qty = qty;
      item.price = qty * item.pricePerUnit;
      const card = e.target.closest('.item-card');
      const priceDisplay = card.querySelector('.price-calculated');
      if (priceDisplay) {
        priceDisplay.textContent = formatRupiah(item.price);
      }
    }
  }

  saveData(currentData);
  calculateTotals();
}

function handlePriceFocus(e) {
  if (!e.target.classList.contains('price-input') && !e.target.classList.contains('qty-input')) return;
  e.target.select();
}

// ============================================
// PDF EXPORT
// ============================================
function exportToPDF() {
  const subtotalPeralatan = currentData.peralatan
    .filter(item => item.price !== null)
    .reduce((sum, item) => sum + item.price, 0);
  
  const subtotalKonsumsi = currentData.konsumsiKita
    .reduce((sum, item) => sum + (item.price || 0), 0);

  const subtotalGames = currentData.funGames
    .reduce((sum, item) => sum + (item.price || 0), 0);
  
  const total = subtotalPeralatan + subtotalKonsumsi + subtotalGames;

  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RAB - ${eventInfo.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #ffffff;
      color: #1e293b;
      padding: 40px;
      line-height: 1.6;
    }
    
    .header {
      text-align: center;
      padding-bottom: 30px;
      border-bottom: 3px solid #10b981;
      margin-bottom: 30px;
    }
    
    .header h1 {
      font-size: 28px;
      color: #10b981;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .header .event-name {
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 6px;
    }
    
    .header .theme {
      font-size: 14px;
      color: #64748b;
      font-style: italic;
      margin-bottom: 20px;
    }
    
    .event-info {
      display: flex;
      justify-content: center;
      gap: 30px;
      font-size: 13px;
      color: #475569;
    }
    
    .event-info span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section-header {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 12px 20px;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: 700;
    }
    
    .section-subtotal {
      font-size: 14px;
      font-weight: 600;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      background: #f8fafc;
      border-radius: 0 0 8px 8px;
      overflow: hidden;
    }
    
    th {
      background: #e2e8f0;
      padding: 12px 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
    }
    
    td {
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    .item-name {
      font-weight: 500;
      color: #0f172a;
    }
    
    .item-note {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    
    .provider {
      color: #10b981;
      font-weight: 500;
    }
    
    .price {
      font-weight: 600;
      color: #0f172a;
      text-align: right;
    }
    
    .provided {
      color: #10b981;
      font-weight: 500;
    }
    
    .total-section {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      margin-top: 30px;
    }
    
    .total-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .total-amount {
      font-size: 36px;
      font-weight: 800;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      color: #94a3b8;
      font-size: 12px;
    }
    
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Rencana Anggaran Biaya</h1>
    <p class="event-name">${eventInfo.name}</p>
    <p class="theme">"${eventInfo.theme}"</p>
    <div class="event-info">
      <span>📅 ${eventInfo.day}, ${eventInfo.date}</span>
      <span>📍 ${eventInfo.location}</span>
      <span>👥 ${eventInfo.participants}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <span class="section-title">📦 Peralatan</span>
      <span class="section-subtotal">${formatRupiah(subtotalPeralatan)}</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:40px">No</th>
          <th>Item</th>
          <th style="width:120px">Penyedia</th>
          <th style="width:130px;text-align:right">Biaya</th>
        </tr>
      </thead>
      <tbody>
        ${currentData.peralatan.map((item, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>
              <div class="item-name">${item.item}${item.qty ? ` (${item.qty} ${item.unit})` : ''}</div>
            </td>
            <td class="provider">${item.provider || '-'}</td>
            <td class="price">${item.price !== null ? formatRupiah(item.price) : '<span class="provided">Disediakan</span>'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-header">
      <span class="section-title">🍽️ Konsumsi (Bu Nany)</span>
      <span class="section-subtotal">Disediakan</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:40px">No</th>
          <th>Item</th>
          <th>Keterangan</th>
        </tr>
      </thead>
      <tbody>
        ${konsumsiNany.map((item, i) => `
          <tr>
            <td>${i + 1}</td>
            <td><div class="item-name">${item.item}</div></td>
            <td><div class="item-note">${item.note || '-'}</div></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-header">
      <span class="section-title">🛒 Konsumsi (Tim Kita)</span>
      <span class="section-subtotal">${formatRupiah(subtotalKonsumsi)}</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:40px">No</th>
          <th>Item</th>
          <th style="width:150px;text-align:right">Biaya</th>
        </tr>
      </thead>
      <tbody>
        ${currentData.konsumsiKita.map((item, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>
              <div class="item-name">${item.item}${item.qty ? ` (${item.qty} ${item.unit})` : ''}</div>
              ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
            </td>
            <td class="price">${formatRupiah(item.price)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-header" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
      <span class="section-title">🎮 Fun Games</span>
      <span class="section-subtotal">${formatRupiah(subtotalGames)}</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:40px">No</th>
          <th>Game</th>
          <th style="width:150px;text-align:right">Biaya</th>
        </tr>
      </thead>
      <tbody>
        ${currentData.funGames.map((item, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>
              <div class="item-name">${item.item}</div>
              ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
            </td>
            <td class="price">${formatRupiah(item.price)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="total-section">
    <div class="total-label">Total Biaya Keseluruhan</div>
    <div class="total-amount">${formatRupiah(total)}</div>
  </div>

  <div class="footer">
    <p>RAB ${eventInfo.name} | ${eventInfo.location}</p>
    <p>Dokumen ini dibuat secara otomatis</p>
  </div>
</body>
</html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  printWindow.document.write(pdfContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = function() {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

// ============================================
// ANIMATIONS & EFFECTS
// ============================================
function initAnimations() {
  // Scroll Reveal for timeline items
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe timeline items
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.classList.add('scroll-reveal');
    scrollObserver.observe(item);
  });

  // Observe item cards with stagger
  document.querySelectorAll('.item-card').forEach((card, index) => {
    card.classList.add('stagger-item');
    setTimeout(() => {
      card.classList.add('visible');
    }, 100 + index * 50);
  });

  // 3D Tilt effect for org cards
  document.querySelectorAll('.org-card').forEach(card => {
    card.classList.add('tilt-card', 'icon-pulse');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.setProperty('--rotateX', `${rotateX}deg`);
      card.style.setProperty('--rotateY', `${rotateY}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rotateX', '0deg');
      card.style.setProperty('--rotateY', '0deg');
    });
  });

  // Add shine effect to RAB divider
  const dividerText = document.querySelector('.divider-text');
  if (dividerText) {
    dividerText.classList.add('shine-effect');
  }

  // Add glow pulse to header
  const header = document.querySelector('.header');
  if (header) {
    header.classList.add('glow-pulse');
  }

  // Float animation for event info items
  document.querySelectorAll('.event-info-item').forEach(item => {
    item.classList.add('float-animation');
  });

  // Animate total on scroll into view
  const totalSection = document.querySelector('.total-section');
  if (totalSection) {
    totalSection.classList.add('gradient-animate');
    
    const totalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter();
          totalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    totalObserver.observe(totalSection);
  }
}

function animateCounter() {
  const totalEl = document.getElementById('total-amount');
  if (!totalEl) return;

  const targetText = totalEl.textContent;
  const targetNum = parseInt(targetText.replace(/[^\d]/g, ''), 10);
  
  if (isNaN(targetNum) || targetNum === 0) return;

  let current = 0;
  const increment = Math.ceil(targetNum / 50);
  const duration = 1500;
  const stepTime = duration / (targetNum / increment);

  totalEl.textContent = 'Rp 0';

  const timer = setInterval(() => {
    current += increment;
    if (current >= targetNum) {
      current = targetNum;
      clearInterval(timer);
      // Trigger sparkle effect
      createSparkles(totalEl);
    }
    totalEl.textContent = 'Rp ' + current.toLocaleString('id-ID');
  }, stepTime);
}

function createSparkles(element) {
  const rect = element.getBoundingClientRect();
  const colors = ['#10b981', '#34d399', '#fbbf24', '#ffffff'];
  
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
    sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 2000);
  }
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  initThreeBackground();
  renderEventInfo();
  renderRundown();
  renderPeralatan();
  renderKonsumsiNany();
  renderKonsumsiKita();
  renderOperasionalKendaraan();
  renderFunGames();
  calculateTotals();

  // Initialize animations after render
  setTimeout(() => {
    initAnimations();
    initMiniGame();
  }, 100);

  document.addEventListener('change', handlePriceInput);
  document.addEventListener('input', handleQtyInput);
  document.addEventListener('focus', handlePriceFocus, true);
  
  // Export PDF button
  document.getElementById('export-pdf').addEventListener('click', exportToPDF);
}

document.addEventListener('DOMContentLoaded', init);
