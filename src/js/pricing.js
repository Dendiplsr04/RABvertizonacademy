// ============================================
// PRICING & RAB - JavaScript
// ============================================

import * as THREE from 'three';

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

  // Create elegant particle systems with gold theme
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
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
  };

  // Gold and premium themed particles
  const goldParticles = createParticles(500, 0.03, 0xfbbf24, 15);
  scene.add(goldParticles);

  const purpleParticles = createParticles(400, 0.025, 0x8b5cf6, 18);
  scene.add(purpleParticles);

  const cyanParticles = createParticles(300, 0.02, 0x06b6d4, 12);
  scene.add(cyanParticles);

  // Floating diamond shapes for premium feel
  const geometries = [];
  
  const materials = [
    new THREE.MeshBasicMaterial({ 
      color: 0xfbbf24, 
      wireframe: true,
      transparent: true,
      opacity: 0.2
    }),
    new THREE.MeshBasicMaterial({ 
      color: 0x8b5cf6, 
      wireframe: true,
      transparent: true,
      opacity: 0.15
    }),
    new THREE.MeshBasicMaterial({ 
      color: 0x06b6d4, 
      wireframe: true,
      transparent: true,
      opacity: 0.12
    })
  ];

  // Create premium geometric shapes
  const shapes = [
    { geo: new THREE.OctahedronGeometry(0.5), pos: [-8, 4, -6] },
    { geo: new THREE.DiamondGeometry ? new THREE.DiamondGeometry(0.4) : new THREE.OctahedronGeometry(0.4), pos: [7, -3, -7] },
    { geo: new THREE.IcosahedronGeometry(0.6), pos: [-6, -5, -5] },
    { geo: new THREE.DodecahedronGeometry(0.35), pos: [9, 5, -8] },
    { geo: new THREE.TorusGeometry(0.4, 0.15, 8, 20), pos: [0, 6, -9] },
    { geo: new THREE.TetrahedronGeometry(0.3), pos: [-10, 0, -6] },
  ];

  shapes.forEach(({ geo, pos }, i) => {
    const mesh = new THREE.Mesh(geo, materials[i % materials.length]);
    mesh.position.set(...pos);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    geometries.push(mesh);
    scene.add(mesh);
  });

  camera.position.z = 8;

  // Smooth mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse following
    mouseX += (targetMouseX - mouseX) * 0.02;
    mouseY += (targetMouseY - mouseY) * 0.02;

    // Premium particle rotation
    goldParticles.rotation.y += 0.0003;
    goldParticles.rotation.x += 0.0001;
    
    purpleParticles.rotation.y -= 0.0002;
    purpleParticles.rotation.x += 0.00015;
    
    cyanParticles.rotation.y += 0.0004;
    cyanParticles.rotation.z += 0.0001;

    // Elegant geometric shape animation
    geometries.forEach((mesh, i) => {
      mesh.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
      mesh.rotation.y += 0.003 * (i % 2 === 0 ? -1 : 1);
      mesh.position.y += Math.sin(Date.now() * 0.0008 + i) * 0.002;
    });

    // Smooth camera movement
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
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
// PACKAGE DATA
// ============================================
const packageData = {
  standard: {
    name: 'Standard Package',
    price: 30900000,
    components: {
      frontend: 7200000,
      backend: 10500000,
      admin: 5000000,
      member: 2800000,
      testing: 2200000,
      management: 3200000
    }
  },
  premium: {
    name: 'Premium Package', 
    price: 38750000,
    components: {
      frontend: 8500000,
      backend: 12750000,
      admin: 6250000,
      member: 3500000,
      testing: 2750000,
      management: 5000000
    }
  }
};

let currentPackage = 'premium';

// ============================================
// PACKAGE SELECTION & DYNAMIC PRICING
// ============================================
function initPackageSelection() {
  console.log('Initializing package selection...');
  
  const packageCards = document.querySelectorAll('.package-card[data-package]');
  const selectorBtns = document.querySelectorAll('.selector-btn[data-package]');
  const packageSelectBtns = document.querySelectorAll('.package-select-btn[data-package]');
  
  console.log('Found elements:', {
    packageCards: packageCards.length,
    selectorBtns: selectorBtns.length,
    packageSelectBtns: packageSelectBtns.length
  });
  
  // Package card selection
  packageCards.forEach((card, index) => {
    const packageType = card.dataset.package;
    console.log(`Adding click listener to package card ${index}:`, packageType);
    
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on the select button
      if (e.target.closest('.package-select-btn')) {
        return;
      }
      
      console.log('Package card clicked:', packageType);
      if (packageType) {
        selectPackage(packageType);
      }
    });
  });
  
  // Selector button clicks
  selectorBtns.forEach((btn, index) => {
    const packageType = btn.dataset.package;
    console.log(`Adding click listener to selector btn ${index}:`, packageType);
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Selector button clicked:', packageType);
      
      if (packageType) {
        selectPackage(packageType);
      }
    });
  });
  
  // Package select button clicks
  packageSelectBtns.forEach((btn, index) => {
    const packageType = btn.dataset.package;
    console.log(`Adding click listener to select btn ${index}:`, packageType);
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Package select button clicked:', packageType);
      
      if (packageType) {
        selectPackage(packageType);
        
        // Scroll to breakdown with smooth animation
        setTimeout(() => {
          const breakdownSection = document.querySelector('.breakdown-section');
          if (breakdownSection) {
            breakdownSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 300);
      }
    });
  });
  
  // Initialize with premium package
  selectPackage('premium');
}

function selectPackage(packageType) {
  console.log('Selecting package:', packageType);
  
  if (!packageData[packageType]) {
    console.error('Package data not found for:', packageType);
    return;
  }
  
  currentPackage = packageType;
  
  // Update package cards visual state
  document.querySelectorAll('.package-card').forEach(card => {
    if (card.dataset.package === packageType) {
      card.classList.add('selected');
      card.style.transform = card.classList.contains('premium') ? 'scale(1.08)' : 'scale(1.05)';
    } else {
      card.classList.remove('selected');
      card.style.transform = 'scale(1)';
    }
  });
  
  // Update selector buttons
  document.querySelectorAll('.selector-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.package === packageType);
  });
  
  // Update package name in breakdown title with animation
  const packageNameEl = document.querySelector('.selected-package-name');
  if (packageNameEl) {
    packageNameEl.style.opacity = '0';
    packageNameEl.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      packageNameEl.textContent = packageData[packageType].name;
      packageNameEl.style.opacity = '1';
      packageNameEl.style.transform = 'scale(1)';
    }, 150);
  } else {
    console.warn('Package name element not found');
  }
  
  // Update breakdown prices with staggered animation
  updateBreakdownPrices(packageType);
  
  // Update total summary
  updateTotalSummary(packageType);
  
  // Update main total amount
  updateMainTotal(packageType);
  
  // Add success feedback
  showPackageSelectionFeedback(packageType);
}

function showPackageSelectionFeedback(packageType) {
  // Create temporary success indicator
  const feedback = document.createElement('div');
  feedback.className = 'package-selection-feedback';
  feedback.innerHTML = `
    <div class="feedback-content">
      <span class="feedback-icon">✅</span>
      <span class="feedback-text">${packageData[packageType].name} Selected!</span>
    </div>
  `;
  
  // Add styles
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--accent-tertiary), var(--accent-secondary));
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-weight: 600;
  `;
  
  document.body.appendChild(feedback);
  
  // Animate in
  setTimeout(() => {
    feedback.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after delay
  setTimeout(() => {
    feedback.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 300);
  }, 2000);
}

function updateBreakdownPrices(packageType) {
  const data = packageData[packageType];
  const components = data.components;
  
  // Update each breakdown price with stagger animation
  const priceElements = [
    { selector: '.breakdown-item[data-component="frontend"] .breakdown-price', value: components.frontend },
    { selector: '.breakdown-item[data-component="backend"] .breakdown-price', value: components.backend },
    { selector: '.breakdown-item[data-component="admin"] .breakdown-price', value: components.admin },
    { selector: '.breakdown-item[data-component="member"] .breakdown-price', value: components.member },
    { selector: '.breakdown-item[data-component="testing"] .breakdown-price', value: components.testing },
    { selector: '.breakdown-item[data-component="management"] .breakdown-price', value: components.management }
  ];
  
  priceElements.forEach((item, index) => {
    setTimeout(() => {
      const element = document.querySelector(item.selector);
      if (element) {
        // Add animation class
        element.classList.add('price-updating');
        
        setTimeout(() => {
          element.textContent = formatRupiah(item.value);
          element.classList.remove('price-updating');
          element.classList.add('price-updated');
          
          setTimeout(() => {
            element.classList.remove('price-updated');
          }, 500);
        }, 200);
      }
    }, index * 100);
  });
}

function updateTotalSummary(packageType) {
  const data = packageData[packageType];
  const subtotal = Object.values(data.components).reduce((sum, val) => sum + val, 0) - data.components.management;
  
  setTimeout(() => {
    const subtotalEl = document.querySelector('.subtotal-amount');
    const managementEl = document.querySelector('.management-amount');
    const totalEl = document.querySelector('.total-investment');
    
    if (subtotalEl) {
      animateNumberChange(subtotalEl, subtotal);
    }
    if (managementEl) {
      animateNumberChange(managementEl, data.components.management);
    }
    if (totalEl) {
      animateNumberChange(totalEl, data.price);
    }
  }, 600);
}

function updateMainTotal(packageType) {
  const data = packageData[packageType];
  const mainTotalEl = document.querySelector('.total-amount');
  
  if (mainTotalEl) {
    setTimeout(() => {
      animateNumberChange(mainTotalEl, data.price, true);
    }, 800);
  }
}

function animateNumberChange(element, targetValue, isMainTotal = false) {
  const currentValue = parseFloat(element.textContent.replace(/[^\d]/g, '')) || 0;
  const duration = 1000;
  const steps = 30;
  const stepValue = (targetValue - currentValue) / steps;
  let currentStep = 0;
  
  element.classList.add('number-changing');
  
  const interval = setInterval(() => {
    currentStep++;
    const newValue = currentValue + (stepValue * currentStep);
    
    if (isMainTotal) {
      element.textContent = 'Rp ' + Math.floor(newValue).toLocaleString('id-ID');
    } else {
      element.textContent = formatRupiah(Math.floor(newValue));
    }
    
    if (currentStep >= steps) {
      clearInterval(interval);
      element.classList.remove('number-changing');
      element.classList.add('number-changed');
      
      setTimeout(() => {
        element.classList.remove('number-changed');
      }, 500);
    }
  }, duration / steps);
}

function formatRupiah(number) {
  return 'Rp ' + number.toLocaleString('id-ID');
}

// ============================================
// BREAKDOWN TOGGLE FUNCTIONALITY
// ============================================
function initBreakdownToggles() {
  console.log('Initializing breakdown toggles...');
  
  const breakdownHeaders = document.querySelectorAll('.breakdown-header[data-toggle]');
  console.log('Found breakdown headers:', breakdownHeaders.length);
  
  breakdownHeaders.forEach((header, index) => {
    const toggleId = header.dataset.toggle;
    console.log(`Setting up toggle ${index} for:`, toggleId);
    
    header.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Breakdown header clicked:', toggleId);
      
      const content = document.getElementById(toggleId);
      const toggle = header.querySelector('.breakdown-toggle');
      const breakdownItem = header.closest('.breakdown-item');
      
      if (!content) {
        console.error('Content element not found for:', toggleId);
        return;
      }
      
      console.log('Toggling content for:', toggleId);
      
      // Toggle content
      const isActive = content.classList.contains('active');
      
      if (isActive) {
        // Close
        content.classList.remove('active');
        toggle?.classList.remove('active');
        breakdownItem?.classList.remove('expanded');
        content.style.maxHeight = '0';
        if (breakdownItem) breakdownItem.style.transform = 'scale(1)';
      } else {
        // Open
        content.classList.add('active');
        toggle?.classList.add('active');
        breakdownItem?.classList.add('expanded');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (breakdownItem) breakdownItem.style.transform = 'scale(1.02)';
      }
      
      console.log('Toggle completed. Active:', !isActive);
    });
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Special animation for breakdown items
        if (entry.target.classList.contains('breakdown-item')) {
          entry.target.style.transform = 'translateX(0) scale(1)';
          entry.target.style.opacity = '1';
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  const animateElements = document.querySelectorAll(
    '.package-card, .breakdown-item, .terms-card, .summary-card'
  );

  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    
    if (el.classList.contains('breakdown-item')) {
      el.style.transform = 'translateX(-30px) scale(0.95)';
    } else {
      el.style.transform = 'translateY(30px)';
    }
    
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

  // Add animate-in styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) translateX(0) scale(1) !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
  const totalAmount = document.querySelector('.total-amount');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      if (element === totalAmount) {
        element.textContent = 'Rp ' + Math.floor(current).toLocaleString('id-ID');
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }
  
  // Animate when elements come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target === totalAmount) {
          animateCounter(totalAmount, 38750000, 3000);
        } else {
          const targetValue = parseInt(entry.target.textContent);
          animateCounter(entry.target, targetValue, 1500);
        }
        observer.unobserve(entry.target);
      }
    });
  });
  
  if (totalAmount) observer.observe(totalAmount);
  statNumbers.forEach(stat => observer.observe(stat));
}

// ============================================
// PDF EXPORT FUNCTIONALITY
// ============================================
function exportToPDF() {
  const today = new Date();
  const tanggalCetak = today.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RAB Website Top Up Game - Premium Package</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      background: #fff;
      color: #000;
      padding: 20mm;
      line-height: 1.5;
      font-size: 11pt;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #8b5cf6;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 { font-size: 18pt; font-weight: bold; color: #8b5cf6; }
    .header h2 { font-size: 14pt; margin-bottom: 5px; }
    .header p { font-size: 10pt; color: #666; }
    .total-box {
      background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
      border: 2px solid #8b5cf6;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .total-amount {
      font-size: 24pt;
      font-weight: bold;
      color: #8b5cf6;
      margin: 10px 0;
    }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #f8f9fa; font-weight: bold; }
    .section-header { background: #8b5cf6; color: white; font-weight: bold; }
    .price { text-align: right; font-weight: bold; }
    .subitem { background: #f8f9fa; font-size: 10pt; }
    .total-row { background: #e5e7eb; font-weight: bold; font-size: 12pt; }
    .footer { margin-top: 30px; text-align: center; font-size: 9pt; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>RENCANA ANGGARAN BIAYA</h1>
    <h2>Website & Aplikasi Top Up Game</h2>
    <p>Premium Package - Full Featured Solution</p>
  </div>
  
  <div class="total-box">
    <h3>Total Investment</h3>
    <div class="total-amount">Rp 38.750.000</div>
    <p>Termasuk 3 bulan maintenance & priority support</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Komponen</th>
        <th>Deskripsi</th>
        <th>Timeline</th>
        <th class="price">Harga</th>
      </tr>
    </thead>
    <tbody>
      <tr class="section-header">
        <td colspan="4">FRONTEND DEVELOPMENT</td>
      </tr>
      <tr class="subitem">
        <td>UI/UX Design & Mockup</td>
        <td>Desain interface dan user experience</td>
        <td>1-2 hari</td>
        <td class="price">Rp 2.000.000</td>
      </tr>
      <tr class="subitem">
        <td>Responsive Layout</td>
        <td>Desktop, tablet, mobile optimization</td>
        <td>1-2 hari</td>
        <td class="price">Rp 1.750.000</td>
      </tr>
      <tr class="subitem">
        <td>Game Catalog & Product Pages</td>
        <td>Halaman katalog dan detail produk</td>
        <td>1 hari</td>
        <td class="price">Rp 1.500.000</td>
      </tr>
      <tr class="subitem">
        <td>Checkout Flow & Payment Interface</td>
        <td>Proses pembelian dan pembayaran</td>
        <td>1 hari</td>
        <td class="price">Rp 1.250.000</td>
      </tr>
      <tr class="subitem">
        <td>User Dashboard & History</td>
        <td>Panel user dan riwayat transaksi</td>
        <td>1 hari</td>
        <td class="price">Rp 1.000.000</td>
      </tr>
      <tr class="subitem">
        <td>3D Animations & Interactive Elements</td>
        <td>Animasi dan elemen interaktif</td>
        <td>0.5 hari</td>
        <td class="price">Rp 750.000</td>
      </tr>
      <tr class="subitem">
        <td>PWA Configuration</td>
        <td>Progressive Web App setup</td>
        <td>0.5 hari</td>
        <td class="price">Rp 250.000</td>
      </tr>
      <tr>
        <td colspan="3"><strong>Subtotal Frontend</strong></td>
        <td class="price"><strong>Rp 8.500.000</strong></td>
      </tr>
      
      <tr class="section-header">
        <td colspan="4">BACKEND DEVELOPMENT & API INTEGRATION</td>
      </tr>
      <tr class="subitem">
        <td>Database Design & Setup</td>
        <td>MySQL/PostgreSQL database</td>
        <td>1 hari</td>
        <td class="price">Rp 1.500.000</td>
      </tr>
      <tr class="subitem">
        <td>RESTful API Development</td>
        <td>Backend API endpoints</td>
        <td>2 hari</td>
        <td class="price">Rp 2.000.000</td>
      </tr>
      <tr class="subitem">
        <td>Supplier API Integration</td>
        <td>Apigames/Digiflazz integration</td>
        <td>2 hari</td>
        <td class="price">Rp 2.500.000</td>
      </tr>
      <tr class="subitem">
        <td>Payment Gateway Integration</td>
        <td>Multi-provider payment system</td>
        <td>2 hari</td>
        <td class="price">Rp 2.250.000</td>
      </tr>
      <tr class="subitem">
        <td>Game ID Validation System</td>
        <td>Nickname validation</td>
        <td>1 hari</td>
        <td class="price">Rp 1.000.000</td>
      </tr>
      <tr class="subitem">
        <td>Transaction Processing Engine</td>
        <td>Automated transaction handling</td>
        <td>1.5 hari</td>
        <td class="price">Rp 1.750.000</td>
      </tr>
      <tr class="subitem">
        <td>WhatsApp API Integration</td>
        <td>Notification system</td>
        <td>0.5 hari</td>
        <td class="price">Rp 750.000</td>
      </tr>
      <tr class="subitem">
        <td>Security & Authentication</td>
        <td>User auth and security</td>
        <td>1 hari</td>
        <td class="price">Rp 1.000.000</td>
      </tr>
      <tr>
        <td colspan="3"><strong>Subtotal Backend</strong></td>
        <td class="price"><strong>Rp 12.750.000</strong></td>
      </tr>
      
      <tr class="section-header">
        <td colspan="4">ADMIN DASHBOARD & MANAGEMENT</td>
      </tr>
      <tr>
        <td>Complete Admin Panel</td>
        <td>Dashboard, analytics, management tools</td>
        <td>4-5 hari</td>
        <td class="price">Rp 6.250.000</td>
      </tr>
      
      <tr class="section-header">
        <td colspan="4">MEMBER SYSTEM & LOYALTY PROGRAM</td>
      </tr>
      <tr>
        <td>Member & Loyalty System</td>
        <td>Registration, points, rewards</td>
        <td>3-4 hari</td>
        <td class="price">Rp 3.500.000</td>
      </tr>
      
      <tr class="section-header">
        <td colspan="4">TESTING & DEPLOYMENT</td>
      </tr>
      <tr>
        <td>Complete Testing & Go Live</td>
        <td>QA, deployment, SSL setup</td>
        <td>2-3 hari</td>
        <td class="price">Rp 2.750.000</td>
      </tr>
      
      <tr class="section-header">
        <td colspan="4">PROJECT MANAGEMENT & SUPPORT</td>
      </tr>
      <tr>
        <td>PM & 3 Months Support</td>
        <td>Coordination, training, maintenance</td>
        <td>Ongoing</td>
        <td class="price">Rp 5.000.000</td>
      </tr>
      
      <tr class="total-row">
        <td colspan="3"><strong>TOTAL INVESTMENT</strong></td>
        <td class="price"><strong>Rp 38.750.000</strong></td>
      </tr>
    </tbody>
  </table>
  
  <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
    <h4>Skema Pembayaran:</h4>
    <p>• Down Payment: 50% (Rp 19.375.000) - Saat kontrak</p>
    <p>• Progress Payment: 30% (Rp 11.625.000) - 70% development selesai</p>
    <p>• Final Payment: 20% (Rp 7.750.000) - Website live & testing selesai</p>
  </div>
  
  <div style="margin-top: 20px; padding: 15px; background: #e5f3ff; border-radius: 5px;">
    <h4>Garansi & Support:</h4>
    <p>✅ 3 bulan bug fixes gratis | ✅ 24/7 priority support | ✅ Performance guarantee</p>
    <p>✅ Security updates | ✅ Backup & recovery | ✅ Training & documentation</p>
  </div>
  
  <div class="footer">
    <p>RAB Website Top Up Game Premium Package | Dicetak: ${tanggalCetak}</p>
    <p>Harga berlaku selama 30 hari dari tanggal penerbitan</p>
  </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(pdfContent);
  printWindow.document.close();
  printWindow.onload = function() {
    setTimeout(() => { 
      printWindow.print(); 
    }, 500);
  };
}

// Make exportToPDF globally available
window.exportToPDF = exportToPDF;

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded - Initializing pricing page...');
  
  // Initialize in sequence with delays to ensure proper setup
  initThreeBackground();
  
  setTimeout(() => {
    initPackageSelection();
  }, 100);
  
  setTimeout(() => {
    initBreakdownToggles();
  }, 200);
  
  setTimeout(() => {
    initScrollAnimations();
  }, 300);
  
  setTimeout(() => {
    initCounterAnimation();
  }, 400);
  
  console.log('All pricing page components initialized');
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
  // Document still loading, wait for DOMContentLoaded
} else {
  // Document already loaded
  console.log('Document already loaded - initializing immediately...');
  setTimeout(() => {
    initThreeBackground();
    initPackageSelection();
    initBreakdownToggles();
    initScrollAnimations();
    initCounterAnimation();
  }, 100);
}