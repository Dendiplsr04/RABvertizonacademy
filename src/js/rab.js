// RAB Vertizon Academy - Main JavaScript
import * as THREE from 'three';
import { eventInfo, peralatan, konsumsiNany, konsumsiKita, akomodasiTransport, funGames, hadiah, icons } from '../data/rab-data.js';
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
const STORAGE_KEY = 'rab_vertizon_2026_v3';

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    // Ensure new data structures exist
    if (!data.akomodasiTransport) {
      data.akomodasiTransport = akomodasiTransport.map(item => ({ ...item }));
    }
    if (!data.hadiah) {
      data.hadiah = hadiah.map(item => ({ ...item }));
    }
    return data;
  }
  return {
    peralatan: peralatan.map(item => ({ ...item })),
    konsumsiKita: konsumsiKita.map(item => ({ ...item })),
    akomodasiTransport: akomodasiTransport.map(item => ({ ...item })),
    funGames: funGames.map(item => ({ ...item })),
    hadiah: hadiah.map(item => ({ ...item }))
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

function renderAkomodasiTransport() {
  const grid = document.getElementById('grid-akomodasi');
  if (!grid) return;
  
  grid.innerHTML = '';

  currentData.akomodasiTransport.forEach((item) => {
    let qtyHtml = '';
    let priceHtml;

    if (item.qty && item.pricePerUnit && item.editable) {
      qtyHtml = `
        <div class="qty-calculator">
          <input type="number" class="qty-input" data-type="akomodasi" data-id="${item.id}" value="${item.qty}" min="1" />
          <span class="qty-unit">${item.unit}</span>
          <span class="qty-multiply">×</span>
          <span class="qty-price">Rp ${item.pricePerUnit.toLocaleString('id-ID')}</span>
        </div>
      `;
      priceHtml = `<span class="price-display price-calculated" style="color: #f97316;">${formatRupiah(item.price)}</span>`;
    } else if (item.editable) {
      priceHtml = `<input type="text" class="price-input" data-type="akomodasi" data-id="${item.id}" value="${formatRupiah(item.price)}" style="color: #f97316;" />`;
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

function renderHadiah() {
  const grid = document.getElementById('grid-hadiah');
  if (!grid) return;
  
  grid.innerHTML = '';

  currentData.hadiah.forEach((item) => {
    let priceHtml;
    if (item.editable) {
      priceHtml = `<input type="text" class="price-input" data-type="hadiah" data-id="${item.id}" value="${formatRupiah(item.price)}" style="color: #fbbf24;" />`;
    } else {
      priceHtml = `<span class="price-display" style="color: #fbbf24;">${formatRupiah(item.price)}</span>`;
    }

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-header">
        <div class="item-icon" style="background: rgba(251, 191, 36, 0.15); color: #fbbf24;">${getIcon(item.icon)}</div>
        <div class="item-info">
          <div class="item-name">${item.item}</div>
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

  const subtotalAkomodasi = currentData.akomodasiTransport
    .reduce((sum, item) => sum + (item.price || 0), 0);
  
  const akomodasiEl = document.getElementById('subtotal-akomodasi');
  if (akomodasiEl) akomodasiEl.textContent = formatRupiah(subtotalAkomodasi);

  const subtotalGames = currentData.funGames
    .reduce((sum, item) => sum + (item.price || 0), 0);
  
  const gamesEl = document.getElementById('subtotal-games');
  if (gamesEl) gamesEl.textContent = formatRupiah(subtotalGames);

  const subtotalHadiah = currentData.hadiah
    .reduce((sum, item) => sum + (item.price || 0), 0);
  
  const hadiahEl = document.getElementById('subtotal-hadiah');
  if (hadiahEl) hadiahEl.textContent = formatRupiah(subtotalHadiah);

  const total = subtotalPeralatan + subtotalKonsumsi + subtotalAkomodasi + subtotalGames + subtotalHadiah;
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
  } else if (type === 'akomodasi') {
    const item = currentData.akomodasiTransport.find(a => a.id === id);
    if (item) item.price = value;
  } else if (type === 'games') {
    const item = currentData.funGames.find(g => g.id === id);
    if (item) item.price = value;
  } else if (type === 'hadiah') {
    const item = currentData.hadiah.find(h => h.id === id);
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
  } else if (type === 'akomodasi') {
    const item = currentData.akomodasiTransport.find(a => a.id === id);
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
// PDF EXPORT - Format Invoice (Hanya Item dengan Harga)
// ============================================
function exportToPDF() {
  // Filter hanya item yang ada harganya (price > 0)
  const peralatanDenganHarga = currentData.peralatan.filter(item => item.price !== null && item.price > 0);
  const konsumsiDenganHarga = currentData.konsumsiKita.filter(item => item.price > 0);
  const akomodasiDenganHarga = currentData.akomodasiTransport.filter(item => item.price > 0);
  const gamesDenganHarga = currentData.funGames.filter(item => item.price > 0);
  const hadiahDenganHarga = currentData.hadiah.filter(item => item.price > 0);

  const subtotalPeralatan = peralatanDenganHarga.reduce((sum, item) => sum + item.price, 0);
  const subtotalKonsumsi = konsumsiDenganHarga.reduce((sum, item) => sum + item.price, 0);
  const subtotalAkomodasi = akomodasiDenganHarga.reduce((sum, item) => sum + item.price, 0);
  const subtotalGames = gamesDenganHarga.reduce((sum, item) => sum + item.price, 0);
  const subtotalHadiah = hadiahDenganHarga.reduce((sum, item) => sum + item.price, 0);
  
  const total = subtotalPeralatan + subtotalKonsumsi + subtotalAkomodasi + subtotalGames + subtotalHadiah;
  
  const today = new Date();
  const tanggalCetak = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice RAB - ${eventInfo.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Times, serif;
      background: #fff;
      color: #000;
      padding: 15mm 20mm;
      line-height: 1.4;
      font-size: 11pt;
    }
    .kop-surat {
      text-align: center;
      border-bottom: 3px double #000;
      padding-bottom: 12px;
      margin-bottom: 15px;
    }
    .kop-surat h1 { font-size: 14pt; font-weight: bold; text-transform: uppercase; }
    .kop-surat h2 { font-size: 12pt; font-weight: bold; margin-bottom: 3px; }
    .kop-surat p { font-size: 9pt; margin: 1px 0; }
    .judul-dokumen { text-align: center; margin: 15px 0; }
    .judul-dokumen h3 { font-size: 12pt; font-weight: bold; text-decoration: underline; margin-bottom: 3px; }
    .judul-dokumen p { font-size: 10pt; }
    .info-acara { margin-bottom: 15px; font-size: 10pt; }
    .info-acara table { border: none; width: 100%; }
    .info-acara td { padding: 2px 5px 2px 0; border: none; vertical-align: top; }
    .info-acara td:first-child { width: 90px; }
    table.invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
    table.invoice-table th, table.invoice-table td { border: 1px solid #000; padding: 6px 8px; font-size: 10pt; }
    table.invoice-table th { background: #d0d0d0; font-weight: bold; text-align: center; }
    table.invoice-table td.no { text-align: center; width: 30px; }
    table.invoice-table td.qty { text-align: center; width: 50px; }
    table.invoice-table td.satuan { text-align: center; width: 60px; }
    table.invoice-table td.harga { text-align: right; width: 110px; }
    table.invoice-table tr.section-header td { background: #f0f0f0; font-weight: bold; }
    table.invoice-table tr.subtotal td { background: #fff3cd; font-weight: bold; }
    table.invoice-table tr.total td { background: #d4edda; font-weight: bold; font-size: 11pt; }
    .total-section { margin-top: 10px; border: 2px solid #000; padding: 10px; background: #f9f9f9; }
    .terbilang { font-style: italic; font-size: 10pt; }
    .footer-doc { margin-top: 20px; text-align: center; font-size: 8pt; color: #666; border-top: 1px solid #ccc; padding-top: 8px; }
    @media print { body { padding: 10mm 15mm; } }
  </style>
</head>
<body>
  <div class="kop-surat">
    <h1>VERTIZON ACADEMY</h1>
    <h2>Super Boot Camp 2026</h2>
    <p>Marketing Properti Professional Development Program</p>
    <p>Cisarua, Bogor - Jawa Barat</p>
  </div>
  <div class="judul-dokumen">
    <h3>INVOICE RENCANA ANGGARAN BIAYA</h3>
    <p>No: INV/RAB/VA-SBC/I/2026</p>
  </div>
  <div class="info-acara">
    <table>
      <tr><td>Kegiatan</td><td>: ${eventInfo.name}</td></tr>
      <tr><td>Tanggal</td><td>: ${eventInfo.day}, ${eventInfo.date}</td></tr>
      <tr><td>Tempat</td><td>: ${eventInfo.location}</td></tr>
      <tr><td>Peserta</td><td>: ${eventInfo.participants}</td></tr>
    </table>
  </div>
  <table class="invoice-table">
    <thead>
      <tr><th>No</th><th>Item / Barang</th><th>Qty</th><th>Satuan</th><th>Harga (Rp)</th></tr>
    </thead>
    <tbody>
      ${peralatanDenganHarga.length > 0 ? `
      <tr class="section-header"><td colspan="5">A. PERALATAN</td></tr>
      ${peralatanDenganHarga.map((item, i) => `<tr><td class="no">${i + 1}</td><td>${item.item}</td><td class="qty">${item.qty || '-'}</td><td class="satuan">${item.unit || '-'}</td><td class="harga">${formatRupiah(item.price)}</td></tr>`).join('')}
      <tr class="subtotal"><td></td><td>Subtotal Peralatan</td><td></td><td></td><td class="harga">${formatRupiah(subtotalPeralatan)}</td></tr>
      ` : ''}
      ${konsumsiDenganHarga.length > 0 ? `
      <tr class="section-header"><td colspan="5">B. KONSUMSI</td></tr>
      ${konsumsiDenganHarga.map((item, i) => `<tr><td class="no">${i + 1}</td><td>${item.item}</td><td class="qty">${item.qty || '-'}</td><td class="satuan">${item.unit || '-'}</td><td class="harga">${formatRupiah(item.price)}</td></tr>`).join('')}
      <tr class="subtotal"><td></td><td>Subtotal Konsumsi</td><td></td><td></td><td class="harga">${formatRupiah(subtotalKonsumsi)}</td></tr>
      ` : ''}
      ${akomodasiDenganHarga.length > 0 ? `
      <tr class="section-header"><td colspan="5">C. AKOMODASI & TRANSPORT</td></tr>
      ${akomodasiDenganHarga.map((item, i) => `<tr><td class="no">${i + 1}</td><td>${item.item}</td><td class="qty">${item.qty || '-'}</td><td class="satuan">${item.unit || '-'}</td><td class="harga">${formatRupiah(item.price)}</td></tr>`).join('')}
      <tr class="subtotal"><td></td><td>Subtotal Akomodasi & Transport</td><td></td><td></td><td class="harga">${formatRupiah(subtotalAkomodasi)}</td></tr>
      ` : ''}
      ${gamesDenganHarga.length > 0 ? `
      <tr class="section-header"><td colspan="5">D. FUN GAMES</td></tr>
      ${gamesDenganHarga.map((item, i) => `<tr><td class="no">${i + 1}</td><td>${item.item}</td><td class="qty">${item.qty || '-'}</td><td class="satuan">${item.unit || '-'}</td><td class="harga">${formatRupiah(item.price)}</td></tr>`).join('')}
      <tr class="subtotal"><td></td><td>Subtotal Fun Games</td><td></td><td></td><td class="harga">${formatRupiah(subtotalGames)}</td></tr>
      ` : ''}
      ${hadiahDenganHarga.length > 0 ? `
      <tr class="section-header"><td colspan="5">E. HADIAH</td></tr>
      ${hadiahDenganHarga.map((item, i) => `<tr><td class="no">${i + 1}</td><td>${item.item}</td><td class="qty">${item.qty || '-'}</td><td class="satuan">${item.unit || '-'}</td><td class="harga">${formatRupiah(item.price)}</td></tr>`).join('')}
      <tr class="subtotal"><td></td><td>Subtotal Hadiah</td><td></td><td></td><td class="harga">${formatRupiah(subtotalHadiah)}</td></tr>
      ` : ''}
      <tr class="total"><td></td><td>TOTAL ANGGARAN</td><td></td><td></td><td class="harga">${formatRupiah(total)}</td></tr>
    </tbody>
  </table>
  <div class="total-section">
    <p class="terbilang"><strong>Terbilang:</strong> ${terbilang(total)} Rupiah</p>
  </div>
  <div class="footer-doc">
    <p>Invoice RAB ${eventInfo.name} | Dicetak: ${tanggalCetak}</p>
  </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(pdfContent);
  printWindow.document.close();
  printWindow.onload = function() {
    setTimeout(() => { printWindow.print(); }, 500);
  };
}

// Fungsi konversi angka ke terbilang
function terbilang(angka) {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  
  if (angka < 12) {
    return bilangan[angka];
  } else if (angka < 20) {
    return terbilang(angka - 10) + ' Belas';
  } else if (angka < 100) {
    return terbilang(Math.floor(angka / 10)) + ' Puluh ' + terbilang(angka % 10);
  } else if (angka < 200) {
    return 'Seratus ' + terbilang(angka - 100);
  } else if (angka < 1000) {
    return terbilang(Math.floor(angka / 100)) + ' Ratus ' + terbilang(angka % 100);
  } else if (angka < 2000) {
    return 'Seribu ' + terbilang(angka - 1000);
  } else if (angka < 1000000) {
    return terbilang(Math.floor(angka / 1000)) + ' Ribu ' + terbilang(angka % 1000);
  } else if (angka < 1000000000) {
    return terbilang(Math.floor(angka / 1000000)) + ' Juta ' + terbilang(angka % 1000000);
  } else {
    return terbilang(Math.floor(angka / 1000000000)) + ' Miliar ' + terbilang(angka % 1000000000);
  }
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
// EXPORT RAB TO EXCEL (CSV Format)
// ============================================
function exportRABToExcel() {
  const BOM = '\uFEFF';
  let csv = BOM;
  
  // Header
  csv += 'RENCANA ANGGARAN BIAYA\n';
  csv += `"${eventInfo.name}"\n`;
  csv += `"${eventInfo.location}"\n`;
  csv += `"${eventInfo.date}"\n\n`;
  
  csv += 'No,Item/Barang,Qty,Satuan,Harga (Rp)\n';
  
  // A. Peralatan
  const peralatanDenganHarga = currentData.peralatan.filter(item => item.price !== null && item.price > 0);
  if (peralatanDenganHarga.length > 0) {
    csv += '\nA. PERALATAN,,,,\n';
    peralatanDenganHarga.forEach((item, i) => {
      csv += `${i + 1},"${item.item}",${item.qty || '-'},${item.unit || '-'},${item.price}\n`;
    });
    const subtotal = peralatanDenganHarga.reduce((sum, item) => sum + item.price, 0);
    csv += `,Subtotal Peralatan,,,${subtotal}\n`;
  }
  
  // B. Konsumsi
  const konsumsiDenganHarga = currentData.konsumsiKita.filter(item => item.price > 0);
  if (konsumsiDenganHarga.length > 0) {
    csv += '\nB. KONSUMSI,,,,\n';
    konsumsiDenganHarga.forEach((item, i) => {
      csv += `${i + 1},"${item.item}",${item.qty || '-'},${item.unit || '-'},${item.price}\n`;
    });
    const subtotal = konsumsiDenganHarga.reduce((sum, item) => sum + item.price, 0);
    csv += `,Subtotal Konsumsi,,,${subtotal}\n`;
  }
  
  // C. Akomodasi & Transport
  const akomodasiDenganHarga = currentData.akomodasiTransport.filter(item => item.price > 0);
  if (akomodasiDenganHarga.length > 0) {
    csv += '\nC. AKOMODASI & TRANSPORT,,,,\n';
    akomodasiDenganHarga.forEach((item, i) => {
      csv += `${i + 1},"${item.item}",${item.qty || '-'},${item.unit || '-'},${item.price}\n`;
    });
    const subtotal = akomodasiDenganHarga.reduce((sum, item) => sum + item.price, 0);
    csv += `,Subtotal Akomodasi & Transport,,,${subtotal}\n`;
  }
  
  // D. Fun Games
  const gamesDenganHarga = currentData.funGames.filter(item => item.price > 0);
  if (gamesDenganHarga.length > 0) {
    csv += '\nD. FUN GAMES,,,,\n';
    gamesDenganHarga.forEach((item, i) => {
      csv += `${i + 1},"${item.item}",${item.qty || '-'},${item.unit || '-'},${item.price}\n`;
    });
    const subtotal = gamesDenganHarga.reduce((sum, item) => sum + item.price, 0);
    csv += `,Subtotal Fun Games,,,${subtotal}\n`;
  }
  
  // E. Hadiah
  const hadiahDenganHarga = currentData.hadiah.filter(item => item.price > 0);
  if (hadiahDenganHarga.length > 0) {
    csv += '\nE. HADIAH,,,,\n';
    hadiahDenganHarga.forEach((item, i) => {
      csv += `${i + 1},"${item.item}",${item.qty || '-'},${item.unit || '-'},${item.price}\n`;
    });
    const subtotal = hadiahDenganHarga.reduce((sum, item) => sum + item.price, 0);
    csv += `,Subtotal Hadiah,,,${subtotal}\n`;
  }
  
  // Total
  const total = 
    peralatanDenganHarga.reduce((sum, item) => sum + item.price, 0) +
    konsumsiDenganHarga.reduce((sum, item) => sum + item.price, 0) +
    akomodasiDenganHarga.reduce((sum, item) => sum + item.price, 0) +
    gamesDenganHarga.reduce((sum, item) => sum + item.price, 0) +
    hadiahDenganHarga.reduce((sum, item) => sum + item.price, 0);
  
  csv += `\n,TOTAL ANGGARAN,,,${total}\n`;
  csv += `\nTanggal cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n`;
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `RAB_Vertizon_Academy_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

// ============================================
// EXPORT RUNDOWN TO SPREADSHEET (HTML Table for Print/Excel)
// ============================================
function exportRundownToSpreadsheet() {
  const today = new Date();
  const tanggalCetak = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rundown Acara - ${eventInfo.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      background: #fff;
      color: #000;
      padding: 20mm;
      line-height: 1.4;
      font-size: 11pt;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 3px double #000;
    }
    .header h1 { font-size: 16pt; font-weight: bold; margin-bottom: 5px; }
    .header h2 { font-size: 12pt; font-weight: normal; font-style: italic; margin-bottom: 5px; color: #333; }
    .header p { font-size: 10pt; margin: 2px 0; }
    .section { margin-bottom: 25px; }
    .section-title {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #fff;
      padding: 10px 15px;
      font-size: 12pt;
      font-weight: bold;
      margin-bottom: 0;
    }
    .section-date {
      background: #10b981;
      color: #fff;
      padding: 6px 15px;
      font-size: 10pt;
      margin-bottom: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    th {
      background: #f1f5f9;
      border: 1px solid #000;
      padding: 8px 10px;
      text-align: center;
      font-weight: bold;
      font-size: 10pt;
    }
    td {
      border: 1px solid #000;
      padding: 6px 10px;
      font-size: 10pt;
      vertical-align: top;
    }
    td.no { text-align: center; width: 35px; }
    td.waktu { width: 120px; white-space: nowrap; }
    td.agenda { width: 150px; font-weight: 600; }
    td.detail { }
    td.pic { width: 150px; }
    tr.break { background: #fef3c7; }
    tr.materi { background: #dbeafe; }
    tr.games { background: #d1fae5; }
    tr.ceremony { background: #fce7f3; }
    tr.religious { background: #e0e7ff; }
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #ccc;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
    @media print {
      body { padding: 10mm; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>RUNDOWN ACARA</h1>
    <h2>"${eventInfo.theme}"</h2>
    <p><strong>${eventInfo.name}</strong></p>
    <p>${eventInfo.location}</p>
    <p>${eventInfo.date}</p>
  </div>

  <div class="section">
    <div class="section-title">HARI 1 - ${rundownHari1.hari.toUpperCase()}</div>
    <div class="section-date">${rundownHari1.tanggal}</div>
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Waktu</th>
          <th>Agenda</th>
          <th>Detail / Keterangan</th>
          <th>PIC</th>
        </tr>
      </thead>
      <tbody>
        ${rundownHari1.jadwal.map((item, i) => `
        <tr class="${item.type}">
          <td class="no">${i + 1}</td>
          <td class="waktu">${item.jam}</td>
          <td class="agenda">${item.agenda}</td>
          <td class="detail">${item.detail}</td>
          <td class="pic">${item.pic}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">HARI 2 - ${rundownHari2.hari.toUpperCase()}</div>
    <div class="section-date">${rundownHari2.tanggal}</div>
    <table>
      <thead>
        <tr>
          <th>No</th>
          <th>Waktu</th>
          <th>Agenda</th>
          <th>Detail / Keterangan</th>
          <th>PIC</th>
        </tr>
      </thead>
      <tbody>
        ${rundownHari2.jadwal.map((item, i) => `
        <tr class="${item.type}">
          <td class="no">${i + 1}</td>
          <td class="waktu">${item.jam}</td>
          <td class="agenda">${item.agenda}</td>
          <td class="detail">${item.detail}</td>
          <td class="pic">${item.pic}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Dokumen ini dibuat secara otomatis dari sistem RAB Vertizon Academy</p>
    <p>Tanggal cetak: ${tanggalCetak}</p>
  </div>
</body>
</html>
  `;

  // Open in new window for print
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.onload = function() {
    setTimeout(() => { printWindow.print(); }, 500);
  };
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
  renderAkomodasiTransport();
  renderFunGames();
  renderHadiah();
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
  
  // Export Rundown button
  const exportRundownBtn = document.getElementById('export-rundown');
  if (exportRundownBtn) {
    exportRundownBtn.addEventListener('click', exportRundownToSpreadsheet);
  }
  
  // Export Excel button
  const exportExcelBtn = document.getElementById('export-excel');
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', exportRABToExcel);
  }
}

document.addEventListener('DOMContentLoaded', init);
