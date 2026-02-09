/**
 * Report Manager
 * Handles all report data operations (CRUD + LocalStorage)
 */

export class ReportManager {
  constructor() {
    this.storageKey = 'vertizon_daily_reports';
    this.reports = this.loadReports();
  }

  // Load reports from localStorage
  loadReports() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[ReportManager] Error loading reports:', error);
      return [];
    }
  }

  // Save reports to localStorage
  saveReports() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.reports));
      return true;
    } catch (error) {
      console.error('[ReportManager] Error saving reports:', error);
      return false;
    }
  }

  // Add new report
  addReport(reportData) {
    const report = {
      id: this.generateId(),
      ...reportData,
      createdAt: new Date().toISOString(),
    };

    this.reports.unshift(report);
    this.saveReports();
    return report;
  }

  // Get report by ID
  getReport(id) {
    return this.reports.find(report => report.id === id);
  }

  // Get all reports
  getAllReports() {
    return this.reports;
  }

  // Update report
  updateReport(id, updatedData) {
    const index = this.reports.findIndex(report => report.id === id);
    if (index !== -1) {
      this.reports[index] = {
        ...this.reports[index],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };
      this.saveReports();
      return this.reports[index];
    }
    return null;
  }

  // Delete report
  deleteReport(id) {
    const index = this.reports.findIndex(report => report.id === id);
    if (index !== -1) {
      this.reports.splice(index, 1);
      this.saveReports();
      return true;
    }
    return false;
  }

  // Filter reports
  filterReports(filters = {}) {
    let filtered = [...this.reports];

    // Filter by date
    if (filters.date && filters.date !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date);
        reportDate.setHours(0, 0, 0, 0);

        switch (filters.date) {
          case 'today':
            return reportDate.getTime() === today.getTime();
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return reportDate.getTime() === yesterday.getTime();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return reportDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return reportDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(report => report.category === filters.category);
    }

    // Filter by marketing name
    if (filters.marketing && filters.marketing !== 'all') {
      filtered = filtered.filter(report => report.name === filters.marketing);
    }

    return filtered;
  }

  // Get statistics
  getStatistics(date = 'today') {
    const filtered = this.filterReports({ date });

    const stats = {
      canvasing: 0,
      live: 0,
      konten: 0,
      total: filtered.length,
    };

    filtered.forEach(report => {
      if (stats.hasOwnProperty(report.category)) {
        stats[report.category]++;
      }
    });

    return stats;
  }

  // Get unique marketing names
  getMarketingNames() {
    const names = new Set();
    this.reports.forEach(report => {
      if (report.name) {
        names.add(report.name);
      }
    });
    return Array.from(names).sort();
  }

  // Generate unique ID
  generateId() {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export to JSON
  exportToJSON() {
    const dataStr = JSON.stringify(this.reports, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vertizon_reports_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Import from JSON
  importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            this.reports = imported;
            this.saveReports();
            resolve(imported.length);
          } else {
            reject(new Error('Invalid JSON format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Generate WhatsApp message
  generateWhatsAppMessage(report) {
    const categoryEmoji = {
      canvasing: '🎯',
      live: '📹',
      konten: '✨',
    };

    let message = `📊 *LAPORAN HARIAN MARKETING VERTIZON*\n\n`;
    message += `${categoryEmoji[report.category]} *${report.category.toUpperCase()}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `👤 *Nama:* ${report.name}\n`;
    message += `📅 *Tanggal:* ${this.formatDate(report.date)}\n\n`;

    // Category specific details
    if (report.category === 'canvasing') {
      message += `🎯 *Jumlah Prospek:* ${report.prospek || 0}\n`;
      message += `📍 *Lokasi:* ${report.lokasi || '-'}\n`;
      message += `✅ *Hasil:* ${report.hasil || '-'}\n`;
    } else if (report.category === 'live') {
      message += `⏱️ *Durasi:* ${report.durasi || 0} menit\n`;
      message += `📱 *Platform:* ${report.platform || '-'}\n`;
      message += `👥 *Viewers:* ${report.viewers || 0}\n`;
      message += `✅ *Hasil:* ${report.hasil || '-'}\n`;
    } else if (report.category === 'konten') {
      message += `📝 *Jumlah Konten:* ${report.jumlahKonten || 0}\n`;
      message += `🎨 *Jenis:* ${report.jenisKonten?.join(', ') || '-'}\n`;
      message += `✅ *Hasil:* ${report.hasil || '-'}\n`;
    }

    if (report.notes) {
      message += `\n📌 *Catatan:*\n${report.notes}\n`;
    }

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `_Dikirim dari Daily Report Marketing Vertizon_`;

    return message;
  }

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
  }

  // Clear all reports (for testing)
  clearAllReports() {
    this.reports = [];
    this.saveReports();
  }
}
