/**
 * Form Manager
 * Handles form interactions for attendance and activities
 * Version: 2.1.0 - Production Ready
 */

import { ClockPicker } from './clockPicker.js';

console.log('%c✅ FormManager v2.1.0 loaded', 'color: #9ACD32; font-size: 12px;');

export class FormManager {
  constructor(reportManager, uiManager) {
    this.reportManager = reportManager;
    this.uiManager = uiManager;
    
    this.currentStep = 1;
    this.currentName = '';
    this.currentAttendance = null;
    this.tempActivities = [];
    this.editingActivityIndex = null;
    
    this.clockPicker = null;
    this.clockTarget = null;
    
    // Auto-save name
    this.storageKeyName = 'vertizon_marketing_name';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Modal open/close
    const btnAdd = document.getElementById('btn-add-report');
    const btnClose = document.getElementById('btn-close-modal');
    const modal = document.getElementById('modal-add-report');
    const overlay = modal?.querySelector('.modal-overlay');

    btnAdd?.addEventListener('click', () => this.openModal());
    btnClose?.addEventListener('click', () => this.closeModal());
    overlay?.addEventListener('click', () => this.closeModal());

    // Step navigation
    document.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => this.previousStep());
    });

    // Attendance selection
    document.querySelectorAll('input[name="attendance"]').forEach(input => {
      input.addEventListener('change', (e) => this.handleAttendanceChange(e.target.value));
    });

    // Activity modal
    document.getElementById('btn-add-activity')?.addEventListener('click', () => this.openActivityModal());
    document.getElementById('btn-close-activity')?.addEventListener('click', () => this.closeActivityModal());
    document.getElementById('btn-cancel-activity')?.addEventListener('click', () => this.closeActivityModal());
    document.getElementById('btn-save-activity')?.addEventListener('click', () => this.saveActivity());

    // Clock picker buttons
    document.getElementById('btn-start-clock')?.addEventListener('click', () => this.openClockPicker('start'));
    document.getElementById('btn-end-clock')?.addEventListener('click', () => this.openClockPicker('end'));
    document.getElementById('btn-close-clock')?.addEventListener('click', () => this.closeClockPicker());
    document.getElementById('btn-cancel-clock')?.addEventListener('click', () => this.closeClockPicker());
    document.getElementById('btn-confirm-clock')?.addEventListener('click', () => this.confirmClockTime());

    // Form submission
    const form = document.getElementById('form-report');
    form?.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Setup activity modal event listeners (called once)
    this.setupActivityModalListeners();
  }
  
  setupActivityModalListeners() {
    // Activity type selection
    document.querySelectorAll('input[name="activity-type"]').forEach(input => {
      input.addEventListener('change', (e) => {
        console.log('[FormManager] Activity type radio changed:', e.target.value);
        this.handleActivityTypeChange(e.target.value);
      });
    });

    // Canvasing lokasi dropdown
    document.getElementById('activity-lokasi-dropdown')?.addEventListener('change', (e) => {
      const lokasiLain = document.getElementById('canvasing-lokasi-lain');
      const fotoUpload = document.getElementById('canvasing-foto-upload');
      if (e.target.value === 'Lokasi Lain') {
        lokasiLain?.classList.remove('hidden');
        fotoUpload?.classList.remove('hidden');
      } else {
        lokasiLain?.classList.add('hidden');
        fotoUpload?.classList.add('hidden');
      }
    });

    // Platform checkboxes for konten
    document.querySelectorAll('input[name="platform"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const platform = e.target.value.toLowerCase();
        const detail = document.getElementById(`detail-${platform}`);
        if (e.target.checked) {
          detail?.classList.remove('hidden');
        } else {
          detail?.classList.add('hidden');
          // Reset values
          const videoInput = document.getElementById(`${platform}-video`);
          const fotoInput = document.getElementById(`${platform}-foto`);
          if (videoInput) videoInput.value = '0';
          if (fotoInput) fotoInput.value = '0';
        }
      });
    });
  }

  openModal() {
    const modal = document.getElementById('modal-add-report');
    modal?.classList.add('active');
    this.resetForm();
    
    // Auto-fill nama dari localStorage
    const savedName = localStorage.getItem(this.storageKeyName);
    if (savedName) {
      const nameInput = document.getElementById('input-name');
      if (nameInput) {
        nameInput.value = savedName;
      }
    }
  }

  closeModal() {
    const modal = document.getElementById('modal-add-report');
    modal?.classList.remove('active');
    this.resetForm();
  }

  resetForm() {
    const form = document.getElementById('form-report');
    form?.reset();
    this.currentStep = 1;
    this.currentName = '';
    this.currentAttendance = null;
    this.tempActivities = [];
    this.editingActivityIndex = null;
    this.updateSteps();
    this.hideAllAttendanceReasons();
    this.renderActivitiesList();
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep === 1) {
        // Save name
        this.currentName = document.getElementById('input-name')?.value.trim();
        
        // Save to localStorage for auto-fill
        localStorage.setItem(this.storageKeyName, this.currentName);
        
        // Check if already attended today
        const today = new Date().toISOString().split('T')[0];
        const hasAttended = this.reportManager.hasAttendedToday(this.currentName, today);
        
        if (hasAttended) {
          this.uiManager.showToast('Anda sudah absen hari ini!', 'error');
          return;
        }
      }
      
      if (this.currentStep === 2) {
        // Save attendance
        const attendanceValue = document.querySelector('input[name="attendance"]:checked')?.value;
        
        if (attendanceValue === 'hadir') {
          // Continue to activities
          this.currentStep++;
        } else {
          // Save attendance and close
          this.saveAttendanceOnly();
          return;
        }
      } else {
        this.currentStep++;
      }
      
      this.updateSteps();
    }
  }

  previousStep() {
    this.currentStep--;
    this.updateSteps();
  }

  updateSteps() {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((step, index) => {
      if (index + 1 === this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  validateStep(step) {
    if (step === 1) {
      const name = document.getElementById('input-name')?.value.trim();
      if (!name) {
        this.uiManager.showToast('Nama marketing harus diisi', 'error');
        return false;
      }
      return true;
    }

    if (step === 2) {
      const attendance = document.querySelector('input[name="attendance"]:checked');
      if (!attendance) {
        this.uiManager.showToast('Pilih status kehadiran', 'error');
        return false;
      }

      const value = attendance.value;
      
      if (value === 'tidak_hadir') {
        const reasonType = document.getElementById('input-reason-type')?.value;
        const reason = document.getElementById('input-reason-tidak-hadir')?.value.trim();
        if (!reasonType) {
          this.uiManager.showToast('Pilih alasan tidak hadir', 'error');
          return false;
        }
        if (!reason) {
          this.uiManager.showToast('Keterangan tidak hadir harus diisi', 'error');
          return false;
        }
      }

      if (value === 'project_lain') {
        const location = document.getElementById('input-project-location')?.value.trim();
        if (!location) {
          this.uiManager.showToast('Lokasi project harus diisi', 'error');
          return false;
        }
      }

      return true;
    }

    return true;
  }

  handleAttendanceChange(value) {
    this.hideAllAttendanceReasons();
    
    if (value === 'tidak_hadir') {
      document.getElementById('reason-tidak-hadir')?.classList.remove('hidden');
    } else if (value === 'project_lain') {
      document.getElementById('reason-project-lain')?.classList.remove('hidden');
    }
  }

  hideAllAttendanceReasons() {
    document.getElementById('reason-tidak-hadir')?.classList.add('hidden');
    document.getElementById('reason-project-lain')?.classList.add('hidden');
  }

  saveAttendanceOnly() {
    const attendanceValue = document.querySelector('input[name="attendance"]:checked')?.value;
    
    const reportData = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: this.currentName,
      date: new Date().toISOString().split('T')[0],
      category: 'attendance_only',
      attendance: attendanceValue,
      notes: '',
    };

    if (attendanceValue === 'tidak_hadir') {
      const reasonType = document.getElementById('input-reason-type')?.value || '';
      const reasonNote = document.getElementById('input-reason-tidak-hadir')?.value.trim() || '';
      reportData.reasonType = reasonType;
      reportData.notes = `${reasonType}: ${reasonNote}`;
    } else if (attendanceValue === 'project_lain') {
      reportData.projectLocation = document.getElementById('input-project-location')?.value.trim() || '';
      reportData.notes = document.getElementById('input-project-note')?.value.trim() || '';
    }

    try {
      this.reportManager.addReport(reportData);
      
      this.uiManager.showToast('Absensi berhasil disimpan!', 'success');
      this.closeModal();
      this.uiManager.refreshReportsList();
      this.uiManager.updateStatistics();
    } catch (error) {
      console.error('[FormManager] Error saving attendance:', error);
      this.uiManager.showToast('Gagal menyimpan absensi', 'error');
    }
  }

  // Activity Management
  openActivityModal(activityIndex = null) {
    const modal = document.getElementById('modal-activity');
    const title = document.getElementById('activity-modal-title');
    
    this.editingActivityIndex = activityIndex;
    
    if (activityIndex !== null) {
      const activity = this.tempActivities[activityIndex];
      title.textContent = `Edit Aktivitas (${activity.editCount}/3 edit)`;
      this.populateActivityForm(activity);
    } else {
      title.textContent = 'Tambah Aktivitas';
      this.resetActivityForm();
    }
    
    modal?.classList.add('active');
  }

  closeActivityModal() {
    const modal = document.getElementById('modal-activity');
    modal?.classList.remove('active');
    this.resetActivityForm();
    this.editingActivityIndex = null;
  }

  resetActivityForm() {
    // Reset activity type
    document.querySelectorAll('input[name="activity-type"]').forEach(input => {
      input.checked = false;
    });
    
    // Reset time inputs
    const startTime = document.getElementById('input-start-time');
    const endTime = document.getElementById('input-end-time');
    if (startTime) startTime.value = '';
    if (endTime) endTime.value = '';
    
    // Reset canvasing fields
    const lokasiDropdown = document.getElementById('activity-lokasi-dropdown');
    const lokasiCustom = document.getElementById('activity-lokasi-custom');
    const prospek = document.getElementById('activity-prospek');
    const fotoLokasi = document.getElementById('activity-foto-lokasi');
    if (lokasiDropdown) lokasiDropdown.value = '';
    if (lokasiCustom) lokasiCustom.value = '';
    if (prospek) prospek.value = '';
    if (fotoLokasi) fotoLokasi.value = '';
    
    // Reset konten platform checkboxes
    document.querySelectorAll('input[name="platform"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Reset konten platform details
    const platforms = ['instagram', 'tiktok', 'facebook'];
    platforms.forEach(platform => {
      const video = document.getElementById(`${platform}-video`);
      const foto = document.getElementById(`${platform}-foto`);
      const detail = document.getElementById(`detail-${platform}`);
      if (video) video.value = '0';
      if (foto) foto.value = '0';
      if (detail) detail.classList.add('hidden');
    });
    
    // Reset notes
    const notes = document.getElementById('activity-notes');
    if (notes) notes.value = '';
    
    // Hide lokasi lain fields
    const lokasiLain = document.getElementById('canvasing-lokasi-lain');
    const fotoUpload = document.getElementById('canvasing-foto-upload');
    if (lokasiLain) lokasiLain.classList.add('hidden');
    if (fotoUpload) fotoUpload.classList.add('hidden');
    
    this.hideAllActivityFields();
  }

  populateActivityForm(activity) {
    const typeInput = document.querySelector(`input[name="activity-type"][value="${activity.type}"]`);
    if (typeInput) {
      typeInput.checked = true;
      this.handleActivityTypeChange(activity.type);
    }
    
    document.getElementById('input-start-time').value = activity.startTime;
    document.getElementById('input-end-time').value = activity.endTime;
    
    if (activity.type === 'canvasing') {
      document.getElementById('activity-prospek').value = activity.prospek || '';
      document.getElementById('activity-lokasi').value = activity.lokasi || '';
    } else if (activity.type === 'live') {
      document.getElementById('activity-platform').value = activity.platform || '';
      document.getElementById('activity-viewers').value = activity.viewers || '';
    } else if (activity.type === 'konten') {
      document.getElementById('activity-video').value = activity.video || '';
      document.getElementById('activity-foto').value = activity.foto || '';
    }
    
    document.getElementById('activity-notes').value = activity.notes || '';
  }

  handleActivityTypeChange(type) {
    console.log('[FormManager] Activity type changed to:', type);
    this.hideAllActivityFields();
    
    const fieldsId = `activity-${type}-fields`;
    console.log('[FormManager] Looking for fields:', fieldsId);
    const fields = document.getElementById(fieldsId);
    console.log('[FormManager] Fields element:', fields);
    
    if (fields) {
      fields.classList.remove('hidden');
      console.log('[FormManager] Fields shown for:', type);
    } else {
      console.error('[FormManager] Fields not found for:', fieldsId);
    }
  }

  hideAllActivityFields() {
    document.querySelectorAll('.activity-fields').forEach(field => {
      field.classList.add('hidden');
    });
  }

  saveActivity() {
    const type = document.querySelector('input[name="activity-type"]:checked')?.value;
    const startTime = document.getElementById('input-start-time')?.value;
    const endTime = document.getElementById('input-end-time')?.value;
    
    if (!type) {
      this.uiManager.showToast('Pilih jenis aktivitas', 'error');
      return;
    }
    
    if (!startTime || !endTime) {
      this.uiManager.showToast('Waktu mulai dan selesai harus diisi', 'error');
      return;
    }
    
    const activityData = {
      type,
      startTime,
      endTime,
      notes: document.getElementById('activity-notes')?.value.trim() || '',
      editCount: 0,
    };
    
    // CANVASING
    if (type === 'canvasing') {
      const lokasiDropdown = document.getElementById('activity-lokasi-dropdown')?.value;
      
      if (!lokasiDropdown) {
        this.uiManager.showToast('Pilih lokasi canvasing', 'error');
        return;
      }
      
      if (lokasiDropdown === 'Lokasi Lain') {
        const lokasiCustom = document.getElementById('activity-lokasi-custom')?.value.trim();
        const fotoLokasi = document.getElementById('activity-foto-lokasi')?.files[0];
        
        if (!lokasiCustom) {
          this.uiManager.showToast('Nama lokasi harus diisi', 'error');
          return;
        }
        
        if (!fotoLokasi) {
          this.uiManager.showToast('Foto lokasi harus di-upload', 'error');
          return;
        }
        
        activityData.lokasi = lokasiCustom;
        activityData.fotoLokasi = fotoLokasi.name; // Store filename
      } else {
        activityData.lokasi = lokasiDropdown;
      }
      
      activityData.prospek = parseInt(document.getElementById('activity-prospek')?.value) || 0;
    } 
    // LIVE
    else if (type === 'live') {
      // Calculate duration
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      activityData.durasi = endMinutes - startMinutes;
      
      // Validate duration
      if (activityData.durasi <= 0) {
        this.uiManager.showToast('Waktu selesai harus lebih besar dari waktu mulai', 'error');
        return;
      }
      
      // Check total live duration today (max 8 hours = 480 minutes)
      const totalLiveDuration = this.tempActivities
        .filter(a => a.type === 'live')
        .reduce((sum, a) => sum + (a.durasi || 0), 0);
      
      if (this.editingActivityIndex !== null) {
        const existingDuration = this.tempActivities[this.editingActivityIndex].durasi || 0;
        if (totalLiveDuration - existingDuration + activityData.durasi > 480) {
          this.uiManager.showToast('Total durasi live maksimal 8 jam per hari', 'error');
          return;
        }
      } else {
        if (totalLiveDuration + activityData.durasi > 480) {
          this.uiManager.showToast('Total durasi live maksimal 8 jam per hari', 'error');
          return;
        }
      }
    } 
    // KONTEN
    else if (type === 'konten') {
      const selectedPlatforms = [];
      const platformData = {};
      
      // Check which platforms are selected
      document.querySelectorAll('input[name="platform"]:checked').forEach(checkbox => {
        const platform = checkbox.value;
        selectedPlatforms.push(platform);
        
        const platformKey = platform.toLowerCase();
        const video = parseInt(document.getElementById(`${platformKey}-video`)?.value) || 0;
        const foto = parseInt(document.getElementById(`${platformKey}-foto`)?.value) || 0;
        
        platformData[platform] = { video, foto };
      });
      
      if (selectedPlatforms.length === 0) {
        this.uiManager.showToast('Pilih minimal 1 platform', 'error');
        return;
      }
      
      // Validate at least one content uploaded
      let hasContent = false;
      for (const platform in platformData) {
        if (platformData[platform].video > 0 || platformData[platform].foto > 0) {
          hasContent = true;
          break;
        }
      }
      
      if (!hasContent) {
        this.uiManager.showToast('Minimal 1 video atau foto harus di-upload', 'error');
        return;
      }
      
      activityData.platforms = selectedPlatforms;
      activityData.platformData = platformData;
    }
    
    if (this.editingActivityIndex !== null) {
      // Update existing activity
      const existing = this.tempActivities[this.editingActivityIndex];
      activityData.editCount = existing.editCount + 1;
      
      if (activityData.editCount > 3) {
        this.uiManager.showToast('Batas edit sudah tercapai (maksimal 3x)', 'error');
        return;
      }
      
      this.tempActivities[this.editingActivityIndex] = activityData;
      this.uiManager.showToast('Aktivitas berhasil diupdate', 'success');
    } else {
      // Add new activity
      this.tempActivities.push(activityData);
      this.uiManager.showToast('Aktivitas berhasil ditambahkan', 'success');
    }
    
    this.renderActivitiesList();
    this.closeActivityModal();
  }

  deleteActivity(index) {
    if (confirm('Yakin ingin menghapus aktivitas ini?')) {
      this.tempActivities.splice(index, 1);
      this.renderActivitiesList();
      this.uiManager.showToast('Aktivitas berhasil dihapus', 'success');
    }
  }

  renderActivitiesList() {
    const container = document.getElementById('activities-list');
    if (!container) return;
    
    if (this.tempActivities.length === 0) {
      container.innerHTML = `
        <div class="empty-activities">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <p>Belum ada aktivitas</p>
          <p class="text-muted">Klik "Tambah Aktivitas" untuk mulai</p>
        </div>
      `;
      return;
    }
    
    const icons = {
      canvasing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
      live: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3" fill="currentColor"></circle></svg>',
      konten: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
    };
    
    container.innerHTML = this.tempActivities.map((activity, index) => {
      let details = '';
      if (activity.type === 'canvasing') {
        details = `${activity.prospek || 0} prospek • ${activity.lokasi || '-'}`;
      } else if (activity.type === 'live') {
        const durasi = activity.durasi || 0;
        const jam = Math.floor(durasi / 60);
        const menit = durasi % 60;
        const durasiText = jam > 0 ? `${jam}j ${menit}m` : `${menit}m`;
        details = `Durasi: ${durasiText}`;
      } else if (activity.type === 'konten') {
        const platforms = activity.platforms || [];
        const platformDetails = platforms.map(p => {
          const data = activity.platformData[p];
          return `${p}: ${data.video}v ${data.foto}f`;
        }).join(' • ');
        details = platformDetails;
      }
      
      const editInfo = activity.editCount > 0 
        ? `<div class="activity-item-edit-count ${activity.editCount >= 3 ? 'limit-reached' : ''}">
             ${activity.editCount}/3 edit
           </div>`
        : '';
      
      return `
        <div class="activity-item ${activity.type}">
          <div class="activity-item-header">
            <div class="activity-item-type">
              ${icons[activity.type]}
              ${activity.type}
            </div>
            <div class="activity-item-actions">
              <button class="btn-activity-action edit" data-index="${index}" ${activity.editCount >= 3 ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-activity-action delete" data-index="${index}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="activity-item-time">${activity.startTime} - ${activity.endTime}</div>
          <div class="activity-item-details">${details}</div>
          ${editInfo}
        </div>
      `;
    }).join('');
    
    // Add event listeners
    container.querySelectorAll('.btn-activity-action.edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        this.openActivityModal(index);
      });
    });
    
    container.querySelectorAll('.btn-activity-action.delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        this.deleteActivity(index);
      });
    });
  }

  // Clock Picker
  openClockPicker(target) {
    this.clockTarget = target;
    const modal = document.getElementById('modal-clock');
    modal?.classList.add('active');
    
    // Initialize clock picker
    if (!this.clockPicker) {
      this.clockPicker = new ClockPicker('clock-picker-canvas');
      this.clockPicker.init();
      
      this.clockPicker.onTimeChange = (time) => {
        document.getElementById('clock-time-text').textContent = time.formatted;
      };
    }
    
    // Set initial time
    const currentTime = target === 'start' 
      ? document.getElementById('input-start-time')?.value
      : document.getElementById('input-end-time')?.value;
    
    if (currentTime) {
      const [hour, minute] = currentTime.split(':').map(Number);
      this.clockPicker.setTime(hour, minute);
    } else {
      this.clockPicker.setTime(8, 0);
    }
    
    const time = this.clockPicker.getTime();
    document.getElementById('clock-time-text').textContent = time.formatted;
  }

  closeClockPicker() {
    const modal = document.getElementById('modal-clock');
    modal?.classList.remove('active');
  }

  confirmClockTime() {
    if (!this.clockPicker || !this.clockTarget) return;
    
    const time = this.clockPicker.getTime();
    
    if (this.clockTarget === 'start') {
      document.getElementById('input-start-time').value = time.formatted;
    } else {
      document.getElementById('input-end-time').value = time.formatted;
    }
    
    this.closeClockPicker();
  }

  // Form Submission
  handleSubmit(e) {
    console.log('%c🔥 HANDLESUBMIT CALLED - v2.1.0', 'color: red; font-size: 16px; font-weight: bold;');
    console.log('[FormManager] Submit event:', e);
    console.log('[FormManager] Temp activities:', this.tempActivities);
    
    e.preventDefault();
    
    if (this.tempActivities.length === 0) {
      this.uiManager.showToast('Tambahkan minimal 1 aktivitas', 'error');
      return;
    }
    
    try {
      const attendanceValue = document.querySelector('input[name="attendance"]:checked')?.value;
      
      // Prepare WhatsApp message
      let waMessage = `*LAPORAN HARIAN MARKETING*\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━\n\n`;
      waMessage += `👤 *Nama:* ${this.currentName}\n`;
      waMessage += `📅 *Tanggal:* ${new Date().toLocaleDateString('id-ID')}\n`;
      waMessage += `✅ *Status:* ${attendanceValue.toUpperCase()}\n\n`;
      
      // Add activities
      waMessage += `*AKTIVITAS HARI INI:*\n\n`;
      
      this.tempActivities.forEach((activity, index) => {
        waMessage += `${index + 1}. *${activity.type.toUpperCase()}*\n`;
        waMessage += `   ⏰ ${activity.startTime} - ${activity.endTime}\n`;
        
        if (activity.type === 'canvasing') {
          waMessage += `   📍 Lokasi: ${activity.lokasi}\n`;
          waMessage += `   👥 Prospek: ${activity.prospek}\n`;
        } else if (activity.type === 'live') {
          const durasi = activity.durasi || 0;
          const jam = Math.floor(durasi / 60);
          const menit = durasi % 60;
          const durasiText = jam > 0 ? `${jam} jam ${menit} menit` : `${menit} menit`;
          waMessage += `   ⏱️ Durasi: ${durasiText}\n`;
        } else if (activity.type === 'konten') {
          waMessage += `   📱 Platform:\n`;
          activity.platforms.forEach(platform => {
            const data = activity.platformData[platform];
            waMessage += `      • ${platform}: ${data.video} video, ${data.foto} foto\n`;
          });
        }
        
        if (activity.notes) {
          waMessage += `   📝 ${activity.notes}\n`;
        }
        waMessage += `\n`;
      });
      
      waMessage += `━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `_Dikirim via Daily Report Marketing Vertizon_`;
      
      // Save each activity as a separate report
      this.tempActivities.forEach(activity => {
        const reportData = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: this.currentName,
          date: new Date().toISOString().split('T')[0],
          category: activity.type,
          attendance: attendanceValue,
          notes: activity.notes || '',
          startTime: activity.startTime,
          endTime: activity.endTime,
        };
        
        // Add activity-specific data
        if (activity.type === 'canvasing') {
          reportData.prospek = activity.prospek;
          reportData.lokasi = activity.lokasi;
          reportData.fotoLokasi = activity.fotoLokasi;
        } else if (activity.type === 'live') {
          reportData.durasi = activity.durasi;
        } else if (activity.type === 'konten') {
          reportData.platforms = activity.platforms;
          reportData.platformData = activity.platformData;
        }
        
        console.log('[FormManager] Saving report:', reportData);
        this.reportManager.addReport(reportData);
      });
      
      console.log('[FormManager] All reports saved. Total reports:', this.reportManager.getAllReports().length);
      
      // Send to WhatsApp
      const groupLink = 'https://chat.whatsapp.com/Jsdbl4s84VCIfg2mJOT16o';
      const waUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
      
      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');
      
      this.uiManager.showToast('Laporan berhasil disimpan! Silakan kirim ke grup WhatsApp', 'success');
      this.closeModal();
      this.uiManager.refreshReportsList();
      this.uiManager.updateStatistics();
    } catch (error) {
      console.error('[FormManager] Error saving report:', error);
      this.uiManager.showToast('Gagal menyimpan laporan: ' + error.message, 'error');
    }
  }
}
