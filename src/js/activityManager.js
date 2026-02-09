/**
 * Activity Manager
 * Handles multiple activities per day with edit tracking
 */

export class ActivityManager {
  constructor() {
    this.storageKey = 'vertizon_activities';
    this.activities = this.loadActivities();
  }

  loadActivities() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[ActivityManager] Error loading:', error);
      return [];
    }
  }

  saveActivities() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.activities));
      return true;
    } catch (error) {
      console.error('[ActivityManager] Error saving:', error);
      return false;
    }
  }

  // Add activity
  addActivity(data) {
    const activity = {
      id: this.generateId(),
      name: data.name,
      date: new Date().toISOString().split('T')[0],
      type: data.type, // 'canvasing', 'live', 'konten'
      startTime: data.startTime,
      endTime: data.endTime,

      // Type specific data
      prospek: data.prospek || null,
      lokasi: data.lokasi || null,
      durasi: data.durasi || null,
      platform: data.platform || null,
      viewers: data.viewers || null,
      video: data.video || null,
      foto: data.foto || null,

      notes: data.notes || '',
      editCount: 0,
      maxEdits: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.activities.unshift(activity);
    this.saveActivities();
    return activity;
  }

  // Update activity (with edit limit)
  updateActivity(id, data) {
    const index = this.activities.findIndex((act) => act.id === id);
    if (index === -1) return null;

    const activity = this.activities[index];

    // Check edit limit
    if (activity.editCount >= activity.maxEdits) {
      throw new Error('Batas edit sudah tercapai (maksimal 3x)');
    }

    this.activities[index] = {
      ...activity,
      ...data,
      editCount: activity.editCount + 1,
      updatedAt: new Date().toISOString()
    };

    this.saveActivities();
    return this.activities[index];
  }

  // Delete activity
  deleteActivity(id) {
    const index = this.activities.findIndex((act) => act.id === id);
    if (index !== -1) {
      this.activities.splice(index, 1);
      this.saveActivities();
      return true;
    }
    return false;
  }

  // Get activities by date and name
  getActivities(name, date = 'today') {
    let filtered = [...this.activities];

    if (date === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter((act) => act.date === today);
    }

    if (name) {
      filtered = filtered.filter((act) => act.name === name);
    }

    return filtered;
  }

  // Get activity by ID
  getActivity(id) {
    return this.activities.find((act) => act.id === id);
  }

  // Get statistics
  getStats(date = 'today') {
    let filtered = [...this.activities];

    if (date === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter((act) => act.date === today);
    }

    const stats = {
      canvasing: 0,
      live: 0,
      konten: 0,
      total: filtered.length
    };

    for (const act of filtered) {
      if (stats.hasOwnProperty(act.type)) {
        stats[act.type]++;
      }
    }

    return stats;
  }

  generateId() {
    return `act_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  clearAll() {
    this.activities = [];
    this.saveActivities();
  }
}
