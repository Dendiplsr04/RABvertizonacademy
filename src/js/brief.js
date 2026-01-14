// ============================================
// BRIEF FORM - JavaScript
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

  // Create particle systems
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

  // Purple particles
  const purpleParticles = createParticles(500, 0.025, 0x8b5cf6, 15);
  scene.add(purpleParticles);

  // Cyan particles
  const cyanParticles = createParticles(300, 0.02, 0x06b6d4, 18);
  scene.add(cyanParticles);

  camera.position.z = 8;

  // Animation
  function animate() {
    requestAnimationFrame(animate);

    purpleParticles.rotation.y += 0.0002;
    purpleParticles.rotation.x += 0.0001;
    
    cyanParticles.rotation.y -= 0.00015;
    cyanParticles.rotation.x += 0.0001;

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
// FORM HANDLING
// ============================================
function initFormHandling() {
  const form = document.getElementById('briefForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    
    // Handle regular inputs
    formData.forEach((value, key) => {
      if (data[key]) {
        // If key exists, convert to array
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    // Collect checkboxes
    const checkboxGroups = ['games', 'otherProducts', 'features', 'payment'];
    checkboxGroups.forEach(group => {
      const checked = form.querySelectorAll(`input[name="${group}"]:checked`);
      data[group] = Array.from(checked).map(cb => cb.value);
    });

    console.log('Brief Form Data:', data);

    // Show success message
    showSuccessMessage(data);
  });
}

function showSuccessMessage(data) {
  const form = document.getElementById('briefForm');
  
  // Create success message
  const successDiv = document.createElement('div');
  successDiv.className = 'form-success show';
  successDiv.innerHTML = `
    <div class="success-icon">✅</div>
    <h3>Brief Form Terkirim!</h3>
    <p>Terima kasih ${data.contactName || 'Klien'}! Kami akan segera menghubungi Anda melalui WhatsApp untuk diskusi lebih lanjut.</p>
    <a href="index.html" class="btn btn-primary">
      <span>← Kembali ke Proposal</span>
    </a>
  `;

  // Replace form with success message
  form.style.display = 'none';
  form.parentNode.insertBefore(successDiv, form.nextSibling);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Optional: Send data to server or WhatsApp
  // sendToWhatsApp(data);
}

// Optional: Send to WhatsApp
function sendToWhatsApp(data) {
  const phone = '6281234567890'; // Ganti dengan nomor WhatsApp Anda
  
  let message = `*BRIEF FORM - PROJECT WEB GAME*\n\n`;
  message += `*Nama:* ${data.contactName}\n`;
  message += `*WhatsApp:* ${data.contactWhatsapp}\n`;
  message += `*Brand:* ${data.brandName}\n\n`;
  
  if (data.games && data.games.length > 0) {
    message += `*Game:* ${data.games.join(', ')}\n`;
  }
  
  if (data.platform) {
    message += `*Platform:* ${data.platform}\n`;
  }
  
  if (data.timeline) {
    message += `*Timeline:* ${data.timeline}\n`;
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initThreeBackground();
  initFormHandling();
});
