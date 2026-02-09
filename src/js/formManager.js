/**
 * Form Manager
 * Handles form interactions and validation
 */

export class FormManager {
  constructor(reportManager, uiManager) {
    this.reportManager = reportManager;
    this.uiManager = uiManager;
    this.currentStep = 1;
    this.selectedCategory = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setDefaultDate();
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

    // Category selection
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    categoryInputs.forEach(input => {
      input.addEventListener('change', (e) => this.handleCategoryChange(e.target.value));
    });

    // Step navigation
    const btnNext = document.querySelector('.btn-next');
    const btnBack = document.querySelector('.btn-back');

    btnNext?.addEventListener('click', () => this.nextStep());
    btnBack?.addEventListener('click', () => this.previousStep());

    // Form submission
    const form = document.getElementById('form-report');
    form?.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  setDefaultDate() {
    const dateInput = document.getElementById('input-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
    }
  }

  openModal() {
    const modal = document.getElementById('modal-add-report');
    modal?.classList.add('active');
    this.resetForm();
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
    this.selectedCategory = null;
    this.updateSteps();
    this.setDefaultDate();
    this.hideAllCategoryFields();
  }

  handleCategoryChange(category) {
    this.selectedCategory = category;
    this.hideAllCategoryFields();
    
    const fieldsId = `${category}-fields`;
    const fields = document.getElementById(fieldsId);
    if (fields) {
      fields.classList.add('active');
    }
  }

  hideAllCategoryFields() {
    const allFields = document.querySelectorAll('.category-fields');
    allFields.forEach(field => field.classList.remove('active'));
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      this.currentStep++;
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
      const date = document.getElementById('input-date')?.value;
      const category = document.querySelector('input[name="category"]:checked');

      if (!name) {
        this.uiManager.showToast('Nama marketing harus diisi', 'error');
        return false;
      }

      if (!date) {
        this.uiManager.showToast('Tanggal harus diisi', 'error');
        return false;
      }

      if (!category) {
        this.uiManager.showToast('Pilih kategori aktivitas', 'error');
        return false;
      }

      return true;
    }

    return true;
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = this.collectFormData();
    
    if (!formData) {
      this.uiManager.showToast('Gagal mengumpulkan data form', 'error');
      return;
    }

    try {
      const report = this.reportManager.addReport(formData);
      this.uiManager.showToast('Laporan berhasil disimpan!', 'success');
      this.closeModal();
      this.uiManager.refreshReportsList();
      this.uiManager.updateStatistics();
    } catch (error) {
      console.error('[FormManager] Error saving report:', error);
      this.uiManager.showToast('Gagal menyimpan laporan', 'error');
    }
  }

  collectFormData() {
    const name = document.getElementById('input-name')?.value.trim();
    const date = document.getElementById('input-date')?.value;
    const category = document.querySelector('input[name="category"]:checked')?.value;
    const notes = document.getElementById('input-notes')?.value.trim();

    if (!name || !date || !category) {
      return null;
    }

    const formData = {
      name,
      date,
      category,
      notes,
    };

    // Collect category-specific data
    if (category === 'canvasing') {
      formData.prospek = parseInt(document.getElementById('input-prospek')?.value) || 0;
      formData.lokasi = document.getElementById('input-lokasi')?.value.trim() || '';
      formData.hasil = document.getElementById('input-hasil-canvasing')?.value.trim() || '';
    } else if (category === 'live') {
      formData.durasi = parseInt(document.getElementById('input-durasi')?.value) || 0;
      formData.platform = document.getElementById('input-platform')?.value || '';
      formData.viewers = parseInt(document.getElementById('input-viewers')?.value) || 0;
      formData.hasil = document.getElementById('input-hasil-live')?.value.trim() || '';
    } else if (category === 'konten') {
      formData.jumlahKonten = parseInt(document.getElementById('input-jumlah-konten')?.value) || 0;
      
      const jenisKonten = [];
      document.querySelectorAll('input[name="jenis-konten"]:checked').forEach(checkbox => {
        jenisKonten.push(checkbox.value);
      });
      formData.jenisKonten = jenisKonten;
      
      formData.hasil = document.getElementById('input-hasil-konten')?.value.trim() || '';
    }

    return formData;
  }
}
