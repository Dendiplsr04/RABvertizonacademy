import portfolioData from '../data/portfolio.json';
import { getTechIcon } from './techIcons';

// Category filter buttons
const categories = [
  'All',
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'Branding',
  'Digital Marketing'
];

let currentFilter = 'All';

// Generate placeholder image with gradient
function getPlaceholderImage(title, category) {
  const colors = {
    'Web Development': ['#d4af37', '#b8960c'],
    'Mobile App': ['#c9a227', '#8b7355'],
    'UI/UX Design': ['#f4e4ba', '#d4af37'],
    Branding: ['#b8960c', '#8b6914'],
    'Digital Marketing': ['#d4af37', '#c9a227']
  };

  const [color1, color2] = colors[category] || ['#d4af37', '#b8960c'];

  return `
    <div class="aspect-video bg-gradient-to-br from-[${color1}]/20 to-[${color2}]/10 flex items-center justify-center">
      <div class="text-center p-4">
        <div class="text-4xl mb-2">${getCategoryIcon(category)}</div>
        <p class="text-gold/60 text-sm font-medium">${category}</p>
      </div>
    </div>
  `;
}

function getCategoryIcon(category) {
  const icons = {
    'Web Development': '🌐',
    'Mobile App': '📱',
    'UI/UX Design': '🎨',
    Branding: '✨',
    'Digital Marketing': '📊'
  };
  return icons[category] || '💼';
}

// Render filter buttons
function renderFilters(container) {
  container.innerHTML = categories
    .map(
      (cat) => `
    <button 
      class="filter-btn px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        currentFilter === cat
          ? 'bg-gold text-primary'
          : 'bg-tertiary text-gray-400 hover:text-gold hover:border-gold border border-transparent'
      }"
      data-category="${cat}"
    >
      ${cat}
    </button>
  `
    )
    .join('');

  // Add click handlers
  container.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.category;
      renderFilters(container);
      renderPortfolio(document.getElementById('portfolio-grid'));
    });
  });
}

// Render portfolio items with floating animation
function renderPortfolio(container) {
  const filtered =
    currentFilter === 'All'
      ? portfolioData
      : portfolioData.filter((item) => item.category === currentFilter);

  container.innerHTML = filtered
    .map(
      (item, index) => `
    <div class="portfolio-item group relative overflow-hidden rounded-lg bg-secondary border border-tertiary hover:border-gold transition-all duration-500 fade-in visible portfolio-float" data-id="${item.id}" style="animation-delay: ${index * 0.1}s">
      <!-- Image -->
      <div class="aspect-video bg-tertiary relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
          <div class="text-center p-4 icon-float">
            <div class="text-5xl mb-2">${getCategoryIcon(item.category)}</div>
          </div>
        </div>
        <!-- Overlay on hover -->
        <div class="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div class="flex gap-3">
            ${
              item.demoUrl
                ? `
              <a href="${item.demoUrl}" target="_blank" class="w-10 h-10 bg-gold rounded-full flex items-center justify-center hover:bg-gold-light transition-colors hover:scale-110" title="View Demo">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            `
                : ''
            }
            <button class="portfolio-detail-btn w-10 h-10 bg-tertiary rounded-full flex items-center justify-center hover:bg-gold hover:text-primary transition-all text-gold hover:scale-110" title="View Details">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-5">
        <span class="text-gold text-xs font-medium uppercase tracking-wider">${item.category}</span>
        <h3 class="text-lg font-bold text-white mt-1 mb-2">${item.title}</h3>
        <p class="text-gray-400 text-sm line-clamp-2 mb-3">${item.description}</p>
        
        <!-- Technologies with Icons -->
        <div class="flex flex-wrap items-center gap-2">
          ${item.technologies
            .slice(0, 4)
            .map(
              (tech) => `
            <div class="tech-icon-wrapper flex items-center gap-1.5 px-2 py-1 bg-tertiary rounded-md hover:bg-gold/20 transition-colors" title="${tech}">
              <span class="tech-icon">${getTechIcon(tech)}</span>
              <span class="text-xs text-gray-400">${tech}</span>
            </div>
          `
            )
            .join('')}
          ${item.technologies.length > 4 ? `<span class="text-xs px-2 py-1 text-gold">+${item.technologies.length - 4}</span>` : ''}
        </div>
      </div>
    </div>
  `
    )
    .join('');

  // Add click handlers for detail buttons
  container.querySelectorAll('.portfolio-detail-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const item = e.target.closest('.portfolio-item');
      const id = parseInt(item.dataset.id);
      openModal(id);
    });
  });
}

// Modal functions
function openModal(id) {
  const item = portfolioData.find((p) => p.id === id);
  if (!item) return;

  const modal = document.getElementById('portfolio-modal');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <div class="relative">
      <!-- Close button -->
      <button id="close-modal" class="absolute -top-2 -right-2 w-10 h-10 bg-tertiary rounded-full flex items-center justify-center hover:bg-gold hover:text-primary transition-colors text-gray-400 z-10">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- Image -->
      <div class="aspect-video bg-tertiary rounded-lg mb-6 flex items-center justify-center">
        <div class="text-center">
          <div class="text-6xl mb-2">${getCategoryIcon(item.category)}</div>
          <p class="text-gold/60">${item.category}</p>
        </div>
      </div>
      
      <!-- Content -->
      <span class="text-gold text-sm font-medium uppercase tracking-wider">${item.category}</span>
      <h3 class="text-2xl font-bold text-white mt-2 mb-4">${item.title}</h3>
      <p class="text-gray-400 mb-6">${item.description}</p>
      
      <!-- Technologies with Icons -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-300 mb-3">Teknologi yang digunakan:</h4>
        <div class="flex flex-wrap gap-3">
          ${item.technologies
            .map(
              (tech) => `
            <div class="tech-icon-wrapper flex items-center gap-2 px-3 py-2 bg-tertiary rounded-lg" title="${tech}">
              <span class="tech-icon">${getTechIcon(tech)}</span>
              <span class="text-sm text-gray-300">${tech}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
      
      <!-- Action buttons -->
      ${
        item.demoUrl
          ? `
        <a href="${item.demoUrl}" target="_blank" class="btn-primary inline-flex items-center gap-2">
          <span>Lihat Demo</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </a>
      `
          : ''
      }
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';

  // Close handlers
  document.getElementById('close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  const modal = document.getElementById('portfolio-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

// Initialize
export function initPortfolio() {
  const filterContainer = document.getElementById('portfolio-filters');
  const gridContainer = document.getElementById('portfolio-grid');

  if (filterContainer && gridContainer) {
    renderFilters(filterContainer);
    renderPortfolio(gridContainer);
  }

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}
