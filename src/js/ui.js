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
    this.refreshReportsList();
    this.updateStatistics();
  }

  setupEventListeners() {
    // Filter changes
    document.getElementById('filter-date')?.addEventListener('change', (e) => {
      this.currentFilter.date = e.target.value;
      this.refreshReportsList();
      this.updateStatistics();
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
      this.showToast('Data diperbarui', 'success');
    });

    document.getElementById('btn-export')?.addEventListener('click', () => {
      this.reportManager.exportToJSON();
      this.showToast('Data berhasil diexport', 'success');
    });

    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        e.currentTarget.classList.add('active');
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
          <div class="empty-state-icon">📭</div>
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
  }

  createReportCard(report) {
    const categoryEmoji = {
      canvasing: '🎯',
      live: '📹',
      konten: '✨',
    };

    const date = new Date(report.date);
    const formattedDate = date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

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

    return `
      <div class="report-card ${report.category}" data-report-id="${report.id}">
        <div class="report-header">
          <span class="report-category">
            ${categoryEmoji[report.category]} ${report.category}
          </span>
          <span class="report-date">${formattedDate}</span>
        </div>
        <h3 class="report-name">${report.name}</h3>
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

    const categoryEmoji = {
      canvasing: '🎯',
      live: '📹',
      konten: '✨',
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
        <h3 class="detail-title">${categoryEmoji[report.category]} ${report.category.toUpperCase()}</h3>
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
}
