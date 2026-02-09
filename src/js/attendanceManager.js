/**
 * Attendance Manager
 * Handles daily attendance tracking
 */

export class AttendanceManager {
  constructor() {
    this.storageKey = 'vertizon_attendance';
    this.attendances = this.loadAttendances();
  }

  loadAttendances() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[AttendanceManager] Error loading:', error);
      return [];
    }
  }

  saveAttendances() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.attendances));
      return true;
    } catch (error) {
      console.error('[AttendanceManager] Error saving:', error);
      return false;
    }
  }

  // Check if already attended today
  hasAttendedToday(marketingName) {
    const today = new Date().toISOString().split('T')[0];
    return this.attendances.some(
      (att) => att.name === marketingName && att.date === today
    );
  }

  // Add attendance
  addAttendance(data) {
    const attendance = {
      id: this.generateId(),
      name: data.name,
      date: new Date().toISOString().split('T')[0],
      status: data.status, // 'hadir', 'tidak_hadir', 'project_lain'
      reason: data.reason || null,
      projectLocation: data.projectLocation || null,
      projectNote: data.projectNote || null,
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      createdAt: new Date().toISOString()
    };

    this.attendances.unshift(attendance);
    this.saveAttendances();
    return attendance;
  }

  // Get today's attendance
  getTodayAttendance(marketingName) {
    const today = new Date().toISOString().split('T')[0];
    return this.attendances.find(
      (att) => att.name === marketingName && att.date === today
    );
  }

  // Get attendance stats
  getAttendanceStats(date = 'today') {
    let filtered = [...this.attendances];

    if (date === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter((att) => att.date === today);
    }

    const stats = {
      hadir: 0,
      tidak_hadir: 0,
      project_lain: 0,
      total: filtered.length
    };

    for (const att of filtered) {
      if (stats.hasOwnProperty(att.status)) {
        stats[att.status]++;
      }
    }

    return stats;
  }

  generateId() {
    return `att_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  clearAll() {
    this.attendances = [];
    this.saveAttendances();
  }
}
