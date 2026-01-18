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
// BREAKDOWN TOGGLE FUNCTIONALITY
// ============================================
function initBreakdownToggles() {
  const breakdownHeaders = document.querySelectorAll('.breakdown-header');
  
  breakdownHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const toggleId = header.dataset.toggle;
      const content = document.getElementById(toggleId);
      const toggle = header.querySelector('.breakdown-toggle');
      
      // Toggle content
      content.classList.toggle('active');
      toggle.classList.toggle('active');
      
      // Smooth animation
      if (content.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });
}

// ============================================
// PACKAGE HOVER EFFECTS
// ============================================
function initPackageEffects() {
  const packageCards = document.querySelectorAll('.package-card');
  
  packageCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Add glow effect
      if (card.classList.contains('basic')) {
        card.style.boxShadow = '0 20px 40px rgba(107, 114, 128, 0.3)';
      } else if (card.classList.contains('standard')) {
        card.style.boxShadow = '0 25px 50px rgba(139, 92, 246, 0.4)';
      } else if (card.classList.contains('premium')) {
        card.style.boxShadow = '0 25px 50px rgba(251, 191, 36, 0.4)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
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
  initThreeBackground();
  initBreakdownToggles();
  initPackageEffects();
  initScrollAnimations();
  initCounterAnimation();
});