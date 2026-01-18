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
    { geo: new THREE.OctahedronGeometry(0.4), pos: [7, -3, -7] },
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
    price: 35000000,
    components: {
      frontend: 7500000,
      backend: 11250000,
      admin: 5500000,
      member: 3000000,
      testing: 2500000,
      management: 5250000
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
  
  // Update payment scheme
  updatePaymentScheme(packageType);
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
// UPDATE PAYMENT SCHEME
// ============================================
function updatePaymentScheme(packageType) {
  const data = packageData[packageType];
  const totalPrice = data.price;
  
  // Calculate payment percentages - 30/40/30
  const downPayment = totalPrice * 0.3;
  const progressPayment = totalPrice * 0.4;
  const finalPayment = totalPrice * 0.3;
  
  console.log('Updating payment scheme for:', packageType, {
    total: totalPrice,
    down: downPayment,
    progress: progressPayment,
    final: finalPayment
  });
  
  // Update payment step amounts
  const downPaymentEl = document.querySelector('.payment-step[data-payment="down"] .step-amount');
  const progressPaymentEl = document.querySelector('.payment-step[data-payment="progress"] .step-amount');
  const finalPaymentEl = document.querySelector('.payment-step[data-payment="final"] .step-amount');
  
  if (downPaymentEl) {
    animatePaymentChange(downPaymentEl, downPayment, '30%');
  }
  
  if (progressPaymentEl) {
    animatePaymentChange(progressPaymentEl, progressPayment, '40%');
  }
  
  if (finalPaymentEl) {
    animatePaymentChange(finalPaymentEl, finalPayment, '30%');
  }
}

function animatePaymentChange(element, targetValue, percentage) {
  const currentText = element.textContent;
  const currentValue = parseFloat(currentText.replace(/[^\d]/g, '')) || 0;
  const duration = 1000;
  const steps = 30;
  const stepValue = (targetValue - currentValue) / steps;
  let currentStep = 0;
  
  element.classList.add('number-changing');
  
  const interval = setInterval(() => {
    currentStep++;
    const newValue = currentValue + (stepValue * currentStep);
    
    element.textContent = percentage + ' (' + formatRupiah(Math.floor(newValue)) + ')';
    
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
          animateCounter(totalAmount, 35000000, 3000);
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
// EXCEL EXPORT FUNCTIONALITY
// ============================================
function exportToExcel() {
  const packageType = currentPackage;
  const data = packageData[packageType];
  const today = new Date();
  const tanggalCetak = today.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Create CSV content with proper formatting
  let csvContent = '';
  
  // Header Section
  csvContent += 'RENCANA ANGGARAN BIAYA (RAB)\n';
  csvContent += `WEBSITE & APLIKASI TOP UP GAME - ${data.name.toUpperCase()}\n`;
  csvContent += `Tanggal:,${tanggalCetak}\n`;
  csvContent += 'Client:,[Nama Client]\n';
  csvContent += 'Developer:,[Nama Developer]\n';
  csvContent += '\n';
  csvContent += 'NO,KOMPONEN,DESKRIPSI,TOOLS/TEKNOLOGI,TIMELINE,HARGA\n';
  csvContent += '\n';
  
  // 1. Frontend Development
  csvContent += `1,FRONTEND DEVELOPMENT,,,5-7 hari,${formatRupiah(data.components.frontend)}\n`;
  csvContent += ',1.1,UI/UX Design & Mockup,Desain interface dan user experience,"Figma Adobe XD",1-2 hari,Rp 2.000.000\n';
  csvContent += ',1.2,Responsive Layout,"Desktop Tablet Mobile optimization","HTML5 CSS3 TailwindCSS",1-2 hari,Rp 1.750.000\n';
  csvContent += ',1.3,Game Catalog & Product Pages,Halaman katalog dan detail produk,"React/Vue.js REST API",1 hari,Rp 1.500.000\n';
  csvContent += ',1.4,Checkout Flow & Payment Interface,Proses pembelian dan pembayaran,"JavaScript Payment Gateway SDK",1 hari,Rp 1.250.000\n';
  csvContent += ',1.5,User Dashboard & Transaction History,Panel user dan riwayat transaksi,"React Dashboard Chart.js",1 hari,Rp 1.000.000\n';
  
  if (packageType === 'premium') {
    csvContent += ',1.6,3D Animations & Interactive Elements,Animasi dan elemen interaktif,"Three.js GSAP CSS Animations",0.5 hari,Rp 750.000\n';
    csvContent += ',1.7,PWA Configuration & Optimization,Progressive Web App setup,"Service Worker Manifest.json",0.5 hari,Rp 250.000\n';
  } else {
    csvContent += ',1.6,Basic Animations & Interactive Elements,Animasi dasar,"CSS Animations JavaScript",0.5 hari,Rp 500.000\n';
  }
  csvContent += '\n';
  
  // 2. Backend Development
  csvContent += `2,BACKEND DEVELOPMENT & API INTEGRATION,,,7-9 hari,${formatRupiah(data.components.backend)}\n`;
  csvContent += ',2.1,Database Design & Setup,MySQL/PostgreSQL database,"MySQL 8.0 PostgreSQL 14",1 hari,Rp 1.500.000\n';
  csvContent += ',2.2,RESTful API Development,Backend API endpoints,"Node.js Express.js JWT Auth",2 hari,Rp 2.000.000\n';
  csvContent += ',2.3,Supplier API Integration,Apigames/Digiflazz integration,"Axios API Gateway Webhook",2 hari,Rp 2.500.000\n';
  
  if (packageType === 'premium') {
    csvContent += ',2.4,Payment Gateway Integration,Multi-provider payment system (10 metode),"Midtrans Xendit Doku QRIS",2 hari,Rp 2.250.000\n';
  } else {
    csvContent += ',2.4,Payment Gateway Integration,Multi-provider payment system (6 metode),"Midtrans Xendit Doku",2 hari,Rp 2.000.000\n';
  }
  
  csvContent += ',2.5,Game ID Validation System,Nickname validation,"API Integration Regex Validation",1 hari,Rp 1.000.000\n';
  csvContent += ',2.6,Transaction Processing Engine,Automated transaction handling,"Queue System Redis Cron Jobs",1.5 hari,Rp 1.750.000\n';
  csvContent += ',2.7,WhatsApp API Integration,Notification system,"WhatsApp Business API Twilio",0.5 hari,Rp 750.000\n';
  csvContent += ',2.8,Security & Authentication System,User auth and security,"JWT bcrypt Rate Limiting CORS",1 hari,Rp 1.000.000\n';
  csvContent += '\n';
  
  // 3. Admin Dashboard
  csvContent += `3,ADMIN DASHBOARD & MANAGEMENT,,,4-5 hari,${formatRupiah(data.components.admin)}\n`;
  csvContent += ',3.1,Dashboard Overview & Statistics,Real-time analytics dan monitoring,"Chart.js D3.js WebSocket",1.5 hari,Rp 1.500.000\n';
  csvContent += ',3.2,Product Management System,CRUD untuk game dan produk,"Admin Panel DataTables",1.25 hari,Rp 1.250.000\n';
  csvContent += ',3.3,Transaction Management & Monitoring,Monitoring dan management transaksi,"Real-time Dashboard Export Excel",1 hari,Rp 1.000.000\n';
  csvContent += ',3.4,User Management & Member System,Management user dan member,"User Roles Permissions CRUD",0.75 hari,Rp 750.000\n';
  
  if (packageType === 'premium') {
    csvContent += ',3.5,Sales Reports & Advanced Analytics,Laporan penjualan dan analytics lengkap,"Excel Export PDF Report Charts",1 hari,Rp 1.000.000\n';
  } else {
    csvContent += ',3.5,Sales Reports & Analytics,Laporan penjualan dan analytics,"Excel Export PDF Report",1 hari,Rp 750.000\n';
  }
  
  csvContent += ',3.6,Website Settings & Configuration,Konfigurasi website,"Settings Panel Environment Config",0.5 hari,Rp 500.000\n';
  csvContent += ',3.7,Voucher & Promotion Management,Management voucher dan promo,"Promo Code System Discount Engine",0.25 hari,Rp 250.000\n';
  csvContent += '\n';
  
  // 4. Member System
  csvContent += `4,MEMBER SYSTEM & LOYALTY PROGRAM,,,3-4 hari,${formatRupiah(data.components.member)}\n`;
  csvContent += ',4.1,User Registration & Login System,Sistem registrasi dan login,"OAuth 2.0 Social Login Email Verification",1 hari,Rp 1.000.000\n';
  csvContent += ',4.2,Member Dashboard & Profile,Dashboard dan profile member,"User Profile Avatar Upload Edit Info",0.75 hari,Rp 750.000\n';
  csvContent += ',4.3,Point System & Rewards,Sistem poin dan reward,"Point Calculation Reward Catalog",1 hari,Rp 1.000.000\n';
  csvContent += ',4.4,Member Pricing & Discounts,Harga khusus member dan diskon,"Tier System Dynamic Pricing",0.5 hari,Rp 500.000\n';
  
  if (packageType === 'premium') {
    csvContent += ',4.5,Referral System,Sistem referral,"Referral Code Tracking Rewards",0.25 hari,Rp 250.000\n';
  }
  csvContent += '\n';
  
  // 5. Testing & Deployment
  csvContent += `5,TESTING & DEPLOYMENT,,,2-3 hari,${formatRupiah(data.components.testing)}\n`;
  csvContent += ',5.1,Unit Testing & Integration Testing,Testing komponen dan integrasi,"Jest Mocha Chai Postman",1 hari,Rp 1.000.000\n';
  csvContent += ',5.2,User Acceptance Testing (UAT),Testing oleh user,"Manual Testing Bug Tracking",0.5 hari,Rp 500.000\n';
  csvContent += ',5.3,Performance Testing & Optimization,Testing performa dan optimasi,"Lighthouse GTmetrix Load Testing",0.5 hari,Rp 500.000\n';
  csvContent += ',5.4,Security Testing & Penetration Test,Testing keamanan,"OWASP ZAP Security Audit",0.25 hari,Rp 250.000\n';
  csvContent += ',5.5,Server Setup & Domain Configuration,Setup server dan domain,"VPS/Cloud Server DNS Configuration",0.3 hari,Rp 300.000\n';
  csvContent += ',5.6,SSL Certificate & Security Setup,Setup SSL dan keamanan,"Let\'s Encrypt Cloudflare Firewall",0.2 hari,Rp 200.000\n';
  csvContent += '\n';
  
  // 6. Project Management
  csvContent += `6,PROJECT MANAGEMENT & SUPPORT,,,Ongoing,${formatRupiah(data.components.management)}\n`;
  csvContent += ',6.1,Project Planning & Coordination,Perencanaan dan koordinasi project,"Trello Jira Slack Daily Standup",1 hari,Rp 1.000.000\n';
  csvContent += ',6.2,Client Communication & Updates,Komunikasi dan update ke client,"Weekly Report Progress Updates",0.5 hari,Rp 500.000\n';
  csvContent += ',6.3,Documentation & User Manual,Dokumentasi dan manual user,"Technical Docs User Guide API Docs",0.75 hari,Rp 750.000\n';
  csvContent += ',6.4,Training & Knowledge Transfer,Training untuk client,"Video Tutorial Live Training Session",0.5 hari,Rp 500.000\n';
  
  if (packageType === 'premium') {
    csvContent += ',6.5,3 Months Bug Fixes & Updates,Bug fixes dan updates 3 bulan,"Bug Tracking Hotfix Updates",1.5 hari,Rp 1.500.000\n';
    csvContent += ',6.6,Priority Support & Consultation,Support prioritas dan konsultasi,"24/7 Support WhatsApp Email",0.75 hari,Rp 1.000.000\n';
  } else {
    csvContent += ',6.5,2 Months Bug Fixes & Updates,Bug fixes dan updates 2 bulan,"Bug Tracking Hotfix Updates",1 hari,Rp 1.000.000\n';
    csvContent += ',6.6,Standard Support & Consultation,Support standard dan konsultasi,"Email Support WhatsApp",0.5 hari,Rp 700.000\n';
  }
  csvContent += '\n';
  
  // Summary
  const subtotal = data.price - data.components.management;
  csvContent += `,SUBTOTAL DEVELOPMENT,,,21-28 hari,${formatRupiah(subtotal)}\n`;
  csvContent += `,PROJECT MANAGEMENT & SUPPORT,,,Ongoing,${formatRupiah(data.components.management)}\n`;
  csvContent += '\n';
  csvContent += `,TOTAL INVESTMENT,,,2-3 Minggu,${formatRupiah(data.price)}\n`;
  csvContent += '\n';
  csvContent += '\n';
  
  // Payment Scheme - Updated to 30/40/30
  csvContent += 'SKEMA PEMBAYARAN\n';
  csvContent += 'NO,TAHAP,PERSENTASE,JUMLAH,KETERANGAN\n';
  csvContent += `1,Down Payment (DP),30%,${formatRupiah(data.price * 0.3)},Saat kontrak ditandatangani\n`;
  csvContent += `2,Progress Payment,40%,${formatRupiah(data.price * 0.4)},Saat 70% development selesai\n`;
  csvContent += `3,Final Payment,30%,${formatRupiah(data.price * 0.3)},Saat website live & testing selesai\n`;
  csvContent += `,TOTAL,100%,${formatRupiah(data.price)},\n`;
  csvContent += '\n';
  csvContent += '\n';
  
  // Garansi & Support
  csvContent += 'GARANSI & SUPPORT\n';
  csvContent += 'NO,ITEM,DESKRIPSI,DURASI\n';
  
  if (packageType === 'premium') {
    csvContent += '1,Bug Fixes,Perbaikan bug gratis,3 Bulan\n';
    csvContent += '2,Priority Support,Support 24/7 via WhatsApp & Email,3 Bulan\n';
    csvContent += '3,Free Minor Updates,Update kecil gratis,3 Bulan\n';
    csvContent += '4,Performance Guarantee,Website load < 2 detik,Selamanya\n';
    csvContent += '5,Security Updates,Update keamanan gratis,3 Bulan\n';
    csvContent += '6,Backup & Recovery,Backup otomatis dan recovery,3 Bulan\n';
  } else {
    csvContent += '1,Bug Fixes,Perbaikan bug gratis,2 Bulan\n';
    csvContent += '2,Standard Support,Support via Email & WhatsApp,2 Bulan\n';
    csvContent += '3,Free Minor Updates,Update kecil gratis,2 Bulan\n';
    csvContent += '4,Performance Guarantee,Website load < 3 detik,Selamanya\n';
    csvContent += '5,Security Updates,Update keamanan gratis,2 Bulan\n';
    csvContent += '6,Backup & Recovery,Backup manual,2 Bulan\n';
  }
  csvContent += '\n';
  csvContent += '\n';
  
  // Deliverables
  csvContent += 'DELIVERABLES\n';
  csvContent += 'NO,ITEM,DESKRIPSI,FORMAT\n';
  csvContent += '1,Fully Functional Website,Website yang siap digunakan,Live Website\n';
  csvContent += '2,Admin Dashboard,Dashboard untuk management,Web Application\n';
  csvContent += '3,Complete Documentation,Dokumentasi lengkap,PDF + Online Docs\n';
  csvContent += '4,Source Code Access,Akses ke source code,GitHub Repository\n';
  csvContent += '5,Training Materials,Materi training,Video + PDF\n';
  csvContent += '6,Deployment Assistance,Bantuan deployment,Live Support\n';
  csvContent += '\n';
  csvContent += '\n';
  
  // Catatan Penting
  csvContent += 'CATATAN PENTING\n';
  csvContent += '1,Harga berlaku selama 30 hari dari tanggal penerbitan\n';
  csvContent += '2,Harga sudah termasuk PPN 11%\n';
  csvContent += '3,Perubahan scope akan dikenakan biaya tambahan\n';
  csvContent += '4,Timeline dapat berubah sesuai feedback dan revisi\n';
  
  if (packageType === 'premium') {
    csvContent += '5,Maintenance setelah 3 bulan: Rp 3-5 juta/bulan\n';
  } else {
    csvContent += '5,Maintenance setelah 2 bulan: Rp 2-3 juta/bulan\n';
  }

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const filename = `RAB_Website_TopUp_Game_${packageType}_${tanggalCetak.replace(/ /g, '_')}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Show success message
  console.log(`RAB ${data.name} berhasil di-download: ${filename}`);
}

// Make exportToExcel globally available
window.exportToExcel = exportToExcel;

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
 