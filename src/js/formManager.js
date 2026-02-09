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
    const buttonAdd = document.querySelector('#btn-add-report');
    const buttonClose = document.querySelector('#btn-close-modal');
    const modal = document.querySelector('#modal-add-report');
    const overlay = modal?.querySelector('.modal-overlay');

    buttonAdd?.addEventListener('click', () => this.openModal());
    buttonClose?.addEventListener('click', () => this.closeModal());
    overlay?.addEventListener('click', () => this.closeModal());

    // Category selection
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    for (const input of categoryInputs) {
      input.addEventListener('change', (e) =>
        this.handleCategoryChange(e.target.value)
      );
    }

    // Step navigation
    const buttonNext = document.querySelector('.btn-next');
    const buttonBack = document.querySelector('.btn-back');

    buttonNext?.addEventListener('click', () => this.nextStep());
    buttonBack?.addEventListener('click', () => this.previousStep());

    // Form submission
    const form = document.querySelector('#form-report');
    form?.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  setDefaultDate() {
    const dateInput = document.querySelector('#input-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
    }
  }

  openModal() {
    const modal = document.querySelector('#modal-add-report');
    modal?.classList.add('active');
    this.resetForm();
  }

  closeModal() {
    const modal = document.querySelector('#modal-add-report');
    modal?.classList.remove('active');
    this.resetForm();
  }

  resetForm() {
    const form = document.querySelector('#form-report');
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
    for (const field of allFields) field.classList.remove('active');
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
    for (const [index, step] of steps.entries()) {
      if (index + 1 === this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    }
  }

  validateStep(step) {
    if (step === 1) {
      const name = document.querySelector('#input-name')?.value.trim();
      const date = document.querySelector('#input-date')?.value;
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
      this.uiManager.updateTargetProgress();
    } catch (error) {
      console.error('[FormManager] Error saving report:', error);
      this.uiManager.showToast('Gagal menyimpan laporan', 'error');
    }
  }

  collectFormData() {
    const name = document.querySelector('#input-name')?.value.trim();
    const date = document.querySelector('#input-date')?.value;
    const category = document.querySelector(
      'input[name="category"]:checked'
    )?.value;
    const notes = document.querySelector('#input-notes')?.value.trim();

    if (!name || !date || !category) {
      return null;
    }

    const formData = {
      name,
      date,
      category,
      notes
    };

    // Collect category-specific data
    switch (category) {
      case 'canvasing': {
        formData.prospek =
          Number.parseInt(document.querySelector('#input-prospek')?.value) || 0;
        formData.lokasi =
          document.querySelector('#input-lokasi')?.value.trim() || '';
        formData.hasil =
          document.querySelector('#input-hasil-canvasing')?.value.trim() || '';

        break;
      }
      case 'live': {
        formData.durasi =
          Number.parseInt(document.querySelector('#input-durasi')?.value) || 0;
        formData.platform =
          document.querySelector('#input-platform')?.value || '';
        formData.viewers =
          Number.parseInt(document.querySelector('#input-viewers')?.value) || 0;
        formData.hasil =
          document.querySelector('#input-hasil-live')?.value.trim() || '';

        break;
      }
      case 'konten': {
        formData.jumlahKonten =
          Number.parseInt(
            document.querySelector('#input-jumlah-konten')?.value
          ) || 0;

        const jenisKonten = [];
        for (const checkbox of document.querySelectorAll(
          'input[name="jenis-konten"]:checked'
        )) {
          jenisKonten.push(checkbox.value);
        }
        formData.jenisKonten = jenisKonten;

        formData.hasil =
          document.querySelector('#input-hasil-konten')?.value.trim() || '';

        break;
      }
      // No default
    }

    return formData;
  }
}
