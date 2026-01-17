// ============================================
// DEMO PREVIEW - JavaScript
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

  // Create particle systems with elegant colors
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
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
  };

  // Elegant particle systems
  const primaryParticles = createParticles(600, 0.025, 0x8b5cf6, 15);
  scene.add(primaryParticles);

  const secondaryParticles = createParticles(400, 0.02, 0x06b6d4, 18);
  scene.add(secondaryParticles);

  const accentParticles = createParticles(200, 0.015, 0x10b981, 12);
  scene.add(accentParticles);

  // Floating geometric shapes for elegance
  const geometries = [];
  
  const materials = [
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
    }),
    new THREE.MeshBasicMaterial({ 
      color: 0x10b981, 
      wireframe: true,
      transparent: true,
      opacity: 0.1
    })
  ];

  // Create elegant geometric shapes
  const shapes = [
    { geo: new THREE.OctahedronGeometry(0.4), pos: [-8, 4, -6] },
    { geo: new THREE.TetrahedronGeometry(0.35), pos: [7, -3, -7] },
    { geo: new THREE.IcosahedronGeometry(0.5), pos: [-6, -5, -5] },
    { geo: new THREE.DodecahedronGeometry(0.3), pos: [9, 5, -8] },
    { geo: new THREE.TorusGeometry(0.35, 0.12, 8, 20), pos: [0, 6, -9] },
    { geo: new THREE.OctahedronGeometry(0.25), pos: [-10, 0, -6] },
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
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse following
    mouseX += (targetMouseX - mouseX) * 0.02;
    mouseY += (targetMouseY - mouseY) * 0.02;

    // Elegant particle rotation
    primaryParticles.rotation.y += 0.0002;
    primaryParticles.rotation.x += 0.0001;
    
    secondaryParticles.rotation.y -= 0.00015;
    secondaryParticles.rotation.x += 0.00012;
    
    accentParticles.rotation.y += 0.0003;
    accentParticles.rotation.z += 0.0001;

    // Smooth geometric shape animation
    geometries.forEach((mesh, i) => {
      mesh.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
      mesh.rotation.y += 0.0025 * (i % 2 === 0 ? -1 : 1);
      mesh.position.y += Math.sin(Date.now() * 0.0008 + i) * 0.001;
    });

    // Smooth camera movement
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.015;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.015;
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
// DEMO NAVIGATION
// ============================================
function initDemoNavigation() {
  const navBtns = document.querySelectorAll('.demo-nav-btn');
  const demoContents = document.querySelectorAll('.demo-content');

  // Handle hash navigation from external links
  function showDemoFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetBtn = document.querySelector(`[data-demo="${hash}"]`);
      const targetContent = document.getElementById(`demo-${hash}`);
      
      if (targetBtn && targetContent) {
        // Remove active from all
        navBtns.forEach(b => b.classList.remove('active'));
        demoContents.forEach(c => c.classList.remove('active'));

        // Add active to target
        targetBtn.classList.add('active');
        targetContent.classList.add('active');

        // Smooth scroll to demo content
        setTimeout(() => {
          document.querySelector('.demo-content-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }

  // Check hash on load
  showDemoFromHash();

  // Handle hash changes
  window.addEventListener('hashchange', showDemoFromHash);

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDemo = btn.dataset.demo;

      // Remove active from all
      navBtns.forEach(b => b.classList.remove('active'));
      demoContents.forEach(c => c.classList.remove('active'));

      // Add active to clicked
      btn.classList.add('active');
      document.getElementById(`demo-${targetDemo}`).classList.add('active');

      // Update hash
      window.history.pushState(null, null, `#${targetDemo}`);

      // Smooth scroll to demo content
      document.querySelector('.demo-content-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================
function initInteractiveElements() {
  // Game card hover effects
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Package card selection
  const packageCards = document.querySelectorAll('.package-card');
  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      packageCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Payment option selection
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });

  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Validate button animation
  const validateBtn = document.querySelector('.validate-btn');
  if (validateBtn) {
    validateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Add loading state
      const originalText = validateBtn.innerHTML;
      validateBtn.innerHTML = '🔄 Memvalidasi...';
      validateBtn.disabled = true;
      
      // Simulate validation
      setTimeout(() => {
        validateBtn.innerHTML = originalText;
        validateBtn.disabled = false;
        
        // Show result with animation
        const result = document.querySelector('.validation-result');
        if (result) {
          result.style.opacity = '0';
          result.style.transform = 'translateY(20px)';
          result.style.display = 'flex';
          
          setTimeout(() => {
            result.style.transition = 'all 0.5s ease';
            result.style.opacity = '1';
            result.style.transform = 'translateY(0)';
          }, 100);
        }
      }, 1500);
    });
  }

  // Chart bar hover effects
  const chartBars = document.querySelectorAll('.bar');
  chartBars.forEach((bar, index) => {
    bar.addEventListener('mouseenter', () => {
      bar.style.background = 'linear-gradient(135deg, #06b6d4, #10b981)';
      bar.style.transform = 'scaleY(1.1)';
    });
    
    bar.addEventListener('mouseleave', () => {
      bar.style.background = 'linear-gradient(135deg, #8b5cf6, #06b6d4)';
      bar.style.transform = 'scaleY(1)';
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
        
        // Special animations for specific elements
        if (entry.target.classList.contains('mockup-browser')) {
          entry.target.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe mockup browsers and other elements
  const animateElements = document.querySelectorAll(
    '.mockup-browser, .demo-title, .game-card, .package-card, .transaction-item, .stat-card'
  );

  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

  // Add animate-in styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    
    .mockup-browser {
      transition: transform 0.6s ease, opacity 0.6s ease;
    }
    
    .package-card.selected {
      border-color: var(--accent-primary) !important;
      background: rgba(139, 92, 246, 0.1) !important;
      transform: translateY(-3px) scale(1.02) !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
function initTypewriterEffect() {
  const typewriterElements = document.querySelectorAll('.nickname');
  
  typewriterElements.forEach(element => {
    const text = element.textContent;
    element.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      
      if (i >= text.length) {
        clearInterval(typeInterval);
      }
    }, 100);
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initThreeBackground();
  initDemoNavigation();
  initInteractiveElements();
  initScrollAnimations();
  
  // Delay typewriter effect
  setTimeout(initTypewriterEffect, 2000);
});