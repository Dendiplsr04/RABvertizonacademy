import '../css/global.css';
import '../scss/global.scss';

import { initPortfolio } from './portfolio';
import Three from './three';

// Initialize Three.js background
window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas');
  if (canvas) {
    new Three(canvas);
  }

  // Initialize portfolio
  initPortfolio();
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Navbar background on scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('bg-primary/95', 'backdrop-blur-md', 'shadow-lg');
      } else {
        navbar.classList.remove(
          'bg-primary/95',
          'backdrop-blur-md',
          'shadow-lg'
        );
      }
    });
  }

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach((el) => {
    observer.observe(el);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Here you can integrate with your backend or email service
      console.log('Form submitted:', data);

      // Show success message
      alert(
        'Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.'
      );
      contactForm.reset();
    });
  }
});
