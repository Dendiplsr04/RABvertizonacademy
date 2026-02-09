/**
 * UI Manager
 * Handles all UI interactions and feedback for Daily Report
 */

export class UIManager {
  constructor(reportManager) {
    this.reportManager = reportManager;
    this.loadingScreen = null;
    this.currentFilter = {
      date: 'today',
      category: 'all',
      marketing: 'all',
    };
  }

  init() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.setupEventListeners();
    this.updateMarketingFilter();
    this.updateTargetProgress();
    this.refreshReportsList();
    this.updateStatistics();
    this.updateLeaderboardPreview();
  }

  setupEventListeners() {
    // Filter changes
    document.getElementById('filter-date')?.addEventListener('change', (e) => {
      this.currentFilter.date = e.target.value;
      this.refreshReportsList();
      this.updateStatistics();
      this.updateTargetProgress();
    });

    document.getElementById('filter-category')?.addEventListener('change', (e) => {
      this.currentFilter.category = e.target.value;
      this.refreshReportsList();
    });

    document.getElementById('filter-marketing')?.addEventListener('change', (e) => {
      this.currentFilter.marketing = e.target.value;
      this.refreshReportsList();
    });

    // Header actions
    document.getElementById('btn-refresh')?.addEventListener('click', () => {
      this.refreshReportsList();
      this.updateStatistics();
      this.updateTargetProgress();
      this.showToast('Data diperbarui', 'success');
    });

    document.getElementById('btn-export')?.addEventListener('click', () => {
      this.reportManager.exportToJSON();
      this.showToast('Data berhasil diexport', 'success');
    });

    // Quick actions
    document.getElementById('quick-canvasing')?.addEventListener('click', () => {
      this.openAddReportModal('canvasing');
    });

    document.getElementById('quick-live')?.addEventListener('click', () => {
      this.openAddReportModal('live');
    });

    document.getElementById('quick-konten')?.addEventListener('click', () => {
      this.openAddReportModal('konten');
    });

    // Leaderboard
    document.getElementById('leaderboard-card')?.addEventListener('click', () => {
      this.showLeaderboard();
    });

    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        if (view === 'add') {
          this.openAddReportModal();
        } else if (view === 'team') {
          this.showLeaderboard();
        }
      });
    });
  }

  hideLoadingScreen() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
      }, 500);
    }
  }

  updateStatistics() {
    const stats = this.reportManager.getStatistics(this.currentFilter.date);
    
    document.getElementById('stat-canvasing').textContent = stats.canvasing;
    document.getElementById('stat-live').textContent = stats.live;
    document.getElementById('stat-konten').textContent = stats.konten;
  }

  updateMarketingFilter() {
    const select = document.getElementById('filter-marketing');
    if (!select) return;

    const names = this.reportManager.getMarketingNames();
    
    // Clear existing options except "Semua Marketing"
    while (select.options.length > 1) {
      select.remove(1);
    }

    // Add marketing names
    names.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });
  }

  refreshReportsList() {
    const container = document.getElementById('reports-list');
    if (!container) return;

    const reports = this.reportManager.filterReports(this.currentFilter);

    if (reports.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="64" height="64">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <p class="empty-state-text">Belum ada laporan</p>
          <p class="empty-state-subtext">Klik tombol + untuk menambah laporan baru</p>
        </div>
      `;
      return;
    }

    container.innerHTML = reports.map(report => this.createReportCard(report)).join('');

    // Add click listeners
    container.querySelectorAll('.report-card').forEach(card => {
      card.addEventListener('click', () => {
        const reportId = card.dataset.reportId;
        this.showReportDetail(reportId);
      });
    });

    // Update leaderboard preview
    this.updateLeaderboardPreview();
  }

  createReportCard(report) {
    const date = new Date(report.date);
    const formattedDate = date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

    const initial = this.reportManager.getInitial(report.name);

    let details = '';
    if (report.category === 'canvasing') {
      details = `
        <div class="report-detail-item">
          <span class="report-detail-label">Prospek:</span>
          <span>${report.prospek || 0}</span>
        </div>
        <div class="report-detail-item">
          <span class="report-detail-label">Lokasi:</span>
          <span>${report.lokasi || '-'}</span>
        </div>
      `;
    } else if (report.category === 'live') {
      details = `
        <div class="report-detail-item">
          <span class="report-detail-label">Durasi:</span>
          <span>${report.durasi || 0} menit</span>
        </div>
        <div class="report-detail-item">
          <span class="report-detail-label">Viewers:</span>
          <span>${report.viewers || 0}</span>
        </div>
      `;
    } else if (report.category === 'konten') {
      details = `
        <div class="report-detail-item">
          <span class="report-detail-label">Jumlah:</span>
          <span>${report.jumlahKonten || 0} konten</span>
        </div>
        <div class="report-detail-item">
          <span class="report-detail-label">Jenis:</span>
          <span>${report.jenisKonten?.join(', ') || '-'}</span>
        </div>
      `;
    }

    const categoryIcons = {
      canvasing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
      live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3" fill="currentColor"></circle></svg>',
      konten: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
    };

    return `
      <div class="report-card ${report.category}" data-report-id="${report.id}">
        <div class="report-header">
          <span class="report-category">
            ${categoryIcons[report.category]} ${report.category}
          </span>
          <span class="report-date">${formattedDate}</span>
        </div>
        <div class="report-user-info">
          <div class="report-avatar">${initial}</div>
          <div class="report-user-details">
            <h3 class="report-user-name">${report.name}</h3>
            <p class="report-user-role">Marketing Specialist</p>
          </div>
        </div>
        <div class="report-details">
          ${details}
        </div>
        ${report.notes ? `<p class="report-notes">${report.notes}</p>` : ''}
      </div>
    `;
  }

  showReportDetail(reportId) {
    const report = this.reportManager.getReport(reportId);
    if (!report) return;

    const modal = document.getElementById('modal-report-detail');
    const content = document.getElementById('report-detail-content');

    const categoryIcons = {
      canvasing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
      live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3" fill="currentColor"></circle></svg>',
      konten: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
    };

    let categoryDetails = '';
    if (report.category === 'canvasing') {
      categoryDetails = `
        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-item-label">Jumlah Prospek</div>
            <div class="detail-item-value">${report.prospek || 0}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Lokasi</div>
            <div class="detail-item-value">${report.lokasi || '-'}</div>
          </div>
        </div>
      `;
    } else if (report.category === 'live') {
      categoryDetails = `
        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-item-label">Durasi</div>
            <div class="detail-item-value">${report.durasi || 0} menit</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Platform</div>
            <div class="detail-item-value">${report.platform || '-'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Viewers</div>
            <div class="detail-item-value">${report.viewers || 0}</div>
          </div>
        </div>
      `;
    } else if (report.category === 'konten') {
      categoryDetails = `
        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-item-label">Jumlah Konten</div>
            <div class="detail-item-value">${report.jumlahKonten || 0}</div>
          </div>
          <div class="detail-item">
            <div class="detail-item-label">Jenis Konten</div>
            <div class="detail-item-value">${report.jenisKonten?.join(', ') || '-'}</div>
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="detail-section">
        <h3 class="detail-title">${categoryIcons[report.category]} ${report.category.toUpperCase()}</h3>
        <div class="detail-content">
          <p><strong>Nama:</strong> ${report.name}</p>
          <p><strong>Tanggal:</strong> ${this.reportManager.formatDate(report.date)}</p>
        </div>
      </div>

      <div class="detail-section">
        <h3 class="detail-title">Detail Aktivitas</h3>
        ${categoryDetails}
      </div>

      ${report.hasil ? `
        <div class="detail-section">
          <h3 class="detail-title">Hasil/Achievement</h3>
          <div class="detail-content">${report.hasil}</div>
        </div>
      ` : ''}

      ${report.notes ? `
        <div class="detail-section">
          <h3 class="detail-title">Catatan Tambahan</h3>
          <div class="detail-content">${report.notes}</div>
        </div>
      ` : ''}
    `;

    modal.classList.add('active');

    // Setup modal actions
    const btnClose = document.getElementById('btn-close-detail');
    const btnDelete = document.getElementById('btn-delete-report');
    const btnWhatsApp = document.getElementById('btn-send-whatsapp');
    const overlay = modal.querySelector('.modal-overlay');

    const closeModal = () => modal.classList.remove('active');

    btnClose.onclick = closeModal;
    overlay.onclick = closeModal;

    btnDelete.onclick = () => {
      if (confirm('Yakin ingin menghapus laporan ini?')) {
        this.reportManager.deleteReport(reportId);
        this.showToast('Laporan berhasil dihapus', 'success');
        closeModal();
        this.refreshReportsList();
        this.updateStatistics();
        this.updateTargetProgress();
        this.updateMarketingFilter();
      }
    };

    btnWhatsApp.onclick = () => {
      const message = this.reportManager.generateWhatsAppMessage(report);
      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/?text=${encodedMessage}`;
      window.open(waUrl, '_blank');
      this.showToast('Membuka WhatsApp...', 'success');
    };
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  updateTargetProgress() {
    const progress = this.reportManager.getTargetProgress(this.currentFilter.date);
    
    document.getElementById('target-percentage').textContent = `${progress.percentage}%`;
    document.getElementById('target-current').textContent = progress.current;
    document.getElementById('target-total').textContent = progress.total;
    
    const progressFill = document.getElementById('target-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress.percentage}%`;
    }
  }

  updateLeaderboardPreview() {
    const leaderboard = this.reportManager.getLeaderboard(this.currentFilter.date);
    const topPerformer = leaderboard[0];
    
    const nameEl = document.getElementById('top-performer-name');
    if (nameEl && topPerformer) {
      nameEl.textContent = topPerformer.name;
    } else if (nameEl) {
      nameEl.textContent = '-';
    }
  }

  openAddReportModal(category = null) {
    const modal = document.getElementById('modal-add-report');
    modal?.classList.add('active');
    
    // Pre-select category if provided
    if (category) {
      const categoryInput = document.querySelector(`input[name="category"][value="${category}"]`);
      if (categoryInput) {
        categoryInput.checked = true;
        categoryInput.dispatchEvent(new Event('change'));
      }
    }
  }

  showLeaderboard() {
    const modal = document.getElementById('modal-leaderboard');
    const content = document.getElementById('leaderboard-content');
    
    const leaderboard = this.reportManager.getLeaderboard(this.currentFilter.date);
    
    if (leaderboard.length === 0) {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="64" height="64">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
          </div>
          <p class="empty-state-text">Belum ada data leaderboard</p>
        </div>
      `;
    } else {
      content.innerHTML = leaderboard.map((item, index) => {
        const initial = this.reportManager.getInitial(item.name);
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
        
        return `
          <div class="leaderboard-item">
            <div class="leaderboard-rank ${rankClass}">${rankIcon}</div>
            <div class="leaderboard-avatar">${initial}</div>
            <div class="leaderboard-info">
              <h3 class="leaderboard-name">${item.name}</h3>
              <p class="leaderboard-stats">
                ${item.activities} aktivitas • 
                ${item.canvasing} prospek • 
                ${item.live} menit live • 
                ${item.konten} konten
              </p>
            </div>
            <div class="leaderboard-score">${item.score}</div>
          </div>
        `;
      }).join('');
    }
    
    modal.classList.add('active');
    
    // Setup close
    const btnClose = document.getElementById('btn-close-leaderboard');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => modal.classList.remove('active');
    
    btnClose.onclick = closeModal;
    overlay.onclick = closeModal;
  }
}
