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
      createdAt: new Date().toISOString()
    };

    this.reports.unshift(report);
    this.saveReports();
    return report;
  }

  // Get report by ID
  getReport(id) {
    return this.reports.find((report) => report.id === id);
  }

  // Get all reports
  getAllReports() {
    return this.reports;
  }

  // Check if marketing has attended today
  hasAttendedToday(name, date) {
    return this.reports.some(
      (report) => report.name === name && report.date === date
    );
  }

  // Update report
  updateReport(id, updatedData) {
    const index = this.reports.findIndex((report) => report.id === id);
    if (index !== -1) {
      this.reports[index] = {
        ...this.reports[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      this.saveReports();
      return this.reports[index];
    }
    return null;
  }

  // Delete report
  deleteReport(id) {
    const index = this.reports.findIndex((report) => report.id === id);
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

      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.date);
        reportDate.setHours(0, 0, 0, 0);

        switch (filters.date) {
          case 'today': {
            return reportDate.getTime() === today.getTime();
          }
          case 'yesterday': {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return reportDate.getTime() === yesterday.getTime();
          }
          case 'week': {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return reportDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return reportDate >= monthAgo;
          }
          default: {
            return true;
          }
        }
      });
    }

    // Filter by marketing name
    if (filters.marketing && filters.marketing !== 'all') {
      filtered = filtered.filter((report) => report.name === filters.marketing);
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
      attendance: {
        hadir: 0,
        tidak_hadir: 0,
        project_lain: 0
      }
    };

    for (const report of filtered) {
      // Count by category
      if (stats.hasOwnProperty(report.category)) {
        stats[report.category]++;
      }
      
      // Count by attendance
      if (report.attendance) {
        const attendanceType = report.attendance;
        if (stats.attendance.hasOwnProperty(attendanceType)) {
          stats.attendance[attendanceType]++;
        }
      }
    }

    return stats;
  }

  // Get unique marketing names
  getMarketingNames() {
    const names = new Set();
    for (const report of this.reports) {
      if (report.name) {
        names.add(report.name);
      }
    }
    return [...names].sort();
  }

  // Generate unique ID
  generateId() {
    return `report_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  // Export to JSON
  exportToJSON() {
    const dataString = JSON.stringify(this.reports, null, 2);
    const dataBlob = new Blob([dataString], { type: 'application/json' });
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
      reader.addEventListener('load', (e) => {
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
      });
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Generate WhatsApp message
  generateWhatsAppMessage(report) {
    const categoryEmoji = {
      canvasing: '🎯',
      live: '📹',
      konten: '✨'
    };

    let message = '📊 *LAPORAN HARIAN MARKETING VERTIZON*\n\n';
    message += `${categoryEmoji[report.category]} *${report.category.toUpperCase()}*\n`;
    message += '━━━━━━━━━━━━━━━━━━━━\n\n';
    message += `👤 *Nama:* ${report.name}\n`;
    message += `📅 *Tanggal:* ${this.formatDate(report.date)}\n\n`;

    // Category specific details
    switch (report.category) {
      case 'canvasing': {
        message += `🎯 *Jumlah Prospek:* ${report.prospek || 0}\n`;
        message += `📍 *Lokasi:* ${report.lokasi || '-'}\n`;
        message += `✅ *Hasil:* ${report.hasil || '-'}\n`;

        break;
      }
      case 'live': {
        message += `⏱️ *Durasi:* ${report.durasi || 0} menit\n`;
        message += `📱 *Platform:* ${report.platform || '-'}\n`;
        message += `👥 *Viewers:* ${report.viewers || 0}\n`;
        message += `✅ *Hasil:* ${report.hasil || '-'}\n`;

        break;
      }
      case 'konten': {
        message += `📝 *Jumlah Konten:* ${report.jumlahKonten || 0}\n`;
        message += `🎨 *Jenis:* ${report.jenisKonten?.join(', ') || '-'}\n`;
        message += `✅ *Hasil:* ${report.hasil || '-'}\n`;

        break;
      }
      // No default
    }

    if (report.notes) {
      message += `\n📌 *Catatan:*\n${report.notes}\n`;
    }

    message += '\n━━━━━━━━━━━━━━━━━━━━\n';
    message += '_Dikirim dari Daily Report Marketing Vertizon_';

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

  // Get leaderboard
  getLeaderboard(date = 'today') {
    const filtered = this.filterReports({ date });
    const leaderboard = {};

    // Calculate scores per marketing
    for (const report of filtered) {
      if (!leaderboard[report.name]) {
        leaderboard[report.name] = {
          name: report.name,
          activities: 0,
          canvasing: 0,
          live: 0,
          konten: 0,
          score: 0
        };
      }

      leaderboard[report.name].activities++;

      switch (report.category) {
        case 'canvasing': {
          leaderboard[report.name].canvasing += report.prospek || 0;
          leaderboard[report.name].score += (report.prospek || 0) * 2; // 2 points per prospek

          break;
        }
        case 'live': {
          leaderboard[report.name].live += report.durasi || 0;
          leaderboard[report.name].score += (report.durasi || 0) * 1; // 1 point per minute

          break;
        }
        case 'konten': {
          leaderboard[report.name].konten += report.jumlahKonten || 0;
          leaderboard[report.name].score += (report.jumlahKonten || 0) * 3; // 3 points per konten

          break;
        }
        // No default
      }
    }

    // Convert to array and sort by score
    return Object.values(leaderboard).sort((a, b) => b.score - a.score);
  }

  // Get target progress
  getTargetProgress(date = 'today') {
    const stats = this.getStatistics(date);

    // Default targets
    const targets = {
      canvasing: 10,
      live: 5,
      konten: 15,
      total: 30
    };

    const current = stats.canvasing + stats.live + stats.konten;
    const percentage = Math.min(
      Math.round((current / targets.total) * 100),
      100
    );

    return {
      current,
      total: targets.total,
      percentage,
      targets,
      stats
    };
  }

  // Get initial from name
  getInitial(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
