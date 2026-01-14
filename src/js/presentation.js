// ============================================
// PROJECT WEB GAME - PRESENTATION JS
// ============================================

import * as THREE from 'three';

// ============================================
// THREE.JS BACKGROUND - Gaming Theme
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
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
  };

  // Purple particles (primary)
  const purpleParticles = createParticles(800, 0.03, 0x8b5cf6, 15);
  scene.add(purpleParticles);

  // Cyan particles (secondary)
  const cyanParticles = createParticles(400, 0.02, 0x06b6d4, 18);
  scene.add(cyanParticles);

  // Pink particles (accent)
  const pinkParticles = createParticles(200, 0.015, 0xec4899, 12);
  scene.add(pinkParticles);

  // Floating geometric shapes
  const geometries = [];
  
  const purpleMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x8b5cf6, 
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });

  const cyanMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x06b6d4, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });

  // Create various shapes
  const shapes = [
    { geo: new THREE.OctahedronGeometry(0.5), mat: purpleMaterial, pos: [-8, 4, -5] },
    { geo: new THREE.TetrahedronGeometry(0.4), mat: cyanMaterial, pos: [7, -3, -6] },
    { geo: new THREE.IcosahedronGeometry(0.6), mat: purpleMaterial, pos: [-6, -5, -4] },
    { geo: new THREE.DodecahedronGeometry(0.35), mat: cyanMaterial, pos: [9, 5, -7] },
    { geo: new THREE.TorusGeometry(0.4, 0.15, 8, 20), mat: purpleMaterial, pos: [0, 6, -8] },
    { geo: new THREE.OctahedronGeometry(0.3), mat: cyanMaterial, pos: [-10, 0, -5] },
  ];

  shapes.forEach(({ geo, mat, pos }) => {
    const mesh = new THREE.Mesh(geo, mat.clone());
    mesh.position.set(...pos);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    geometries.push(mesh);
    scene.add(mesh);
  });

  camera.position.z = 8;

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
    purpleParticles.rotation.y += 0.0003;
    purpleParticles.rotation.x += 0.0001;
    
    cyanParticles.rotation.y -= 0.0002;
    cyanParticles.rotation.x += 0.00015;
    
    pinkParticles.rotation.y += 0.0004;

    // Animate geometric shapes
    geometries.forEach((mesh, i) => {
      mesh.rotation.x += 0.003 * (i % 2 === 0 ? 1 : -1);
      mesh.rotation.y += 0.004 * (i % 2 === 0 ? -1 : 1);
      mesh.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
    });

    // Camera follows mouse
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
// NAVIGATION
// ============================================
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const navbar = document.querySelector('.navbar');

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.remove('active');
      if (navToggle) navToggle.classList.remove('active');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);

  // Navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
      navbar.style.background = 'rgba(10, 10, 15, 0.8)';
    }
  });
}

// ============================================
// TABS
// ============================================
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active to clicked
      btn.classList.add('active');
      document.getElementById(`tab-${tabId}`).classList.add('active');
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
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  const animateElements = document.querySelectorAll(
    '.overview-card, .feature-card, .workflow-step, .timeline-item, .tech-category'
  );

  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add animate-in styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initThreeBackground();
  initNavigation();
  initTabs();
  initScrollAnimations();
  initSmoothScroll();
});