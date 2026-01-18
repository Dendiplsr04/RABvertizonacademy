// Pricing Page - Export to Excel
// Version: 1.0.0

const packageData = {
  standard: { name: 'Standard Package', price: 30900000, components: { frontend: 7200000, backend: 10500000, admin: 5000000, member: 2800000, testing: 2200000, management: 3200000 } },
  premium: { name: 'Premium Package', price: 35000000, components: { frontend: 7500000, backend: 11250000, admin: 5500000, member: 3000000, testing: 2500000, management: 5250000 } }
};

let currentPackage = 'premium';

function formatRupiah(number) {
  return 'Rp ' + number.toLocaleString('id-ID');
}

function selectPackage(packageType) {
  if (!packageData[packageType]) return;
  currentPackage = packageType;
  document.querySelectorAll('.package-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.package === packageType);
  });
  document.querySelectorAll('.selector-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.package === packageType);
  });
  updateBreakdownPrices(packageType);
  updateTotalSummary(packageType);
}

function updateBreakdownPrices(packageType) {
  const data = packageData[packageType];
  const components = data.components;
  const priceElements = [
    { selector: '.breakdown-item[data-component="frontend"] .breakdown-price', value: components.frontend },
    { selector: '.breakdown-item[data-component="backend"] .breakdown-price', value: components.backend },
    { selector: '.breakdown-item[data-component="admin"] .breakdown-price', value: components.admin },
    { selector: '.breakdown-item[data-component="member"] .breakdown-price', value: components.member },
    { selector: '.breakdown-item[data-component="testing"] .breakdown-price', value: components.testing },
    { selector: '.breakdown-item[data-component="management"] .breakdown-price', value: components.management }
  ];
  priceElements.forEach(item => {
    const element = document.querySelector(item.selector);
    if (element) element.textContent = formatRupiah(item.value);
  });
}

function updateTotalSummary(packageType) {
  const data = packageData[packageType];
  const subtotal = Object.values(data.components).reduce((sum, val) => sum + val, 0) - data.components.management;
  const subtotalEl = document.querySelector('.subtotal-amount');
  const managementEl = document.querySelector('.management-amount');
  const totalEl = document.querySelector('.total-investment');
  const mainTotalEl = document.querySelector('.total-amount');
  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  if (managementEl) managementEl.textContent = formatRupiah(data.components.management);
  if (totalEl) totalEl.textContent = formatRupiah(data.price);
  if (mainTotalEl) mainTotalEl.textContent = formatRupiah(data.price);
  updatePaymentScheme(packageType);
}

function updatePaymentScheme(packageType) {
  const data = packageData[packageType];
  const totalPrice = data.price;
  const downPayment = totalPrice * 0.3;
  const progressPayment = totalPrice * 0.4;
  const finalPayment = totalPrice * 0.3;
  const downPaymentEl = document.querySelector('.payment-step[data-payment="down"] .step-amount');
  const progressPaymentEl = document.querySelector('.payment-step[data-payment="progress"] .step-amount');
  const finalPaymentEl = document.querySelector('.payment-step[data-payment="final"] .step-amount');
  if (downPaymentEl) downPaymentEl.textContent = '30% (' + formatRupiah(downPayment) + ')';
  if (progressPaymentEl) progressPaymentEl.textContent = '40% (' + formatRupiah(progressPayment) + ')';
  if (finalPaymentEl) finalPaymentEl.textContent = '30% (' + formatRupiah(finalPayment) + ')';
}

function initBreakdownToggles() {
  const breakdownHeaders = document.querySelectorAll('.breakdown-header[data-toggle]');
  breakdownHeaders.forEach(header => {
    header.addEventListener('click', (e) => {
      e.preventDefault();
      const toggleId = header.dataset.toggle;
      const content = document.getElementById(toggleId);
      const toggle = header.querySelector('.breakdown-toggle');
      if (!content) return;
      const isActive = content.classList.contains('active');
      if (isActive) {
        content.classList.remove('active');
        if (toggle) toggle.classList.remove('active');
        content.style.maxHeight = '0';
      } else {
        content.classList.add('active');
        if (toggle) toggle.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

function exportToExcel() {
  const data = packageData[currentPackage];
  const today = new Date();
  const tanggalCetak = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const dp = data.price * 0.3;
  const progress = data.price * 0.4;
  const final = data.price * 0.3;
  const subtotal = data.price - data.components.management;
  
  const htmlContent = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"><style>body{font-family:Calibri,Arial}table{border-collapse:collapse;width:100%}td,th{border:1px solid #000;padding:8px;text-align:left}.header{background-color:#8b5cf6;color:white;font-weight:bold}.section{background-color:#8b5cf6;color:white;font-weight:bold}.total{background-color:#f3e8ff;font-weight:bold}.price{text-align:right}.title{font-size:14pt;font-weight:bold;text-align:center}.subtitle{font-size:12pt;text-align:center}</style></head><body><table><tr><td colspan="4" class="title">RENCANA ANGGARAN BIAYA (RAB)</td></tr><tr><td colspan="4" class="subtitle">Website & Aplikasi Top Up Game - ' + data.name + '</td></tr><tr><td colspan="4"></td></tr><tr><td><b>Tanggal:</b></td><td>' + tanggalCetak + '</td><td><b>Paket:</b></td><td>' + data.name + '</td></tr><tr><td><b>Klien:</b></td><td>[Nama Klien]</td><td><b>Developer:</b></td><td>[Nama Developer]</td></tr><tr><td colspan="4"></td></tr></table><table><tr class="header"><td style="width:5%">NO</td><td style="width:35%">KOMPONEN</td><td style="width:40%">DESKRIPSI</td><td style="width:20%;text-align:right">HARGA</td></tr><tr class="section"><td>1</td><td colspan="2">FRONTEND DEVELOPMENT</td><td class="price">' + formatRupiah(data.components.frontend) + '</td></tr><tr><td>1.1</td><td>UI/UX Design & Mockup</td><td>Desain interface dan user experience</td><td class="price">Rp 2.000.000</td></tr><tr><td>1.2</td><td>Responsive Layout</td><td>Desktop, Tablet, Mobile optimization</td><td class="price">Rp 1.750.000</td></tr><tr><td>1.3</td><td>Game Catalog & Product Pages</td><td>Halaman katalog dan detail produk</td><td class="price">Rp 1.500.000</td></tr><tr><td>1.4</td><td>Checkout Flow & Payment Interface</td><td>Proses pembelian dan pembayaran</td><td class="price">Rp 1.250.000</td></tr><tr><td>1.5</td><td>User Dashboard & Transaction History</td><td>Panel user dan riwayat transaksi</td><td class="price">Rp 1.000.000</td></tr><tr><td>1.6</td><td>3D Animations & Interactive Elements</td><td>Animasi dan elemen interaktif</td><td class="price">Rp 750.000</td></tr><tr><td>1.7</td><td>PWA Configuration & Optimization</td><td>Progressive Web App setup</td><td class="price">Rp 250.000</td></tr><tr class="section"><td>2</td><td colspan="2">BACKEND DEVELOPMENT & API INTEGRATION</td><td class="price">' + formatRupiah(data.components.backend) + '</td></tr><tr><td>2.1</td><td>Database Design & Setup</td><td>MySQL/PostgreSQL database</td><td class="price">Rp 1.500.000</td></tr><tr><td>2.2</td><td>RESTful API Development</td><td>Backend API endpoints</td><td class="price">Rp 2.000.000</td></tr><tr><td>2.3</td><td>Supplier API Integration</td><td>Apigames/Digiflazz integration</td><td class="price">Rp 2.500.000</td></tr><tr><td>2.4</td><td>Payment Gateway Integration</td><td>Multi-provider payment system</td><td class="price">Rp 2.250.000</td></tr><tr><td>2.5</td><td>Game ID Validation System</td><td>Nickname validation</td><td class="price">Rp 1.000.000</td></tr><tr><td>2.6</td><td>Transaction Processing Engine</td><td>Automated transaction handling</td><td class="price">Rp 1.750.000</td></tr><tr><td>2.7</td><td>WhatsApp API Integration</td><td>Notification system</td><td class="price">Rp 750.000</td></tr><tr><td>2.8</td><td>Security & Authentication System</td><td>User auth and security</td><td class="price">Rp 1.000.000</td></tr><tr class="section"><td>3</td><td colspan="2">ADMIN DASHBOARD & MANAGEMENT</td><td class="price">' + formatRupiah(data.components.admin) + '</td></tr><tr><td>3.1</td><td>Dashboard Overview & Statistics</td><td>Real-time analytics dan monitoring</td><td class="price">Rp 1.500.000</td></tr><tr><td>3.2</td><td>Product Management System</td><td>CRUD untuk game dan produk</td><td class="price">Rp 1.250.000</td></tr><tr><td>3.3</td><td>Transaction Management & Monitoring</td><td>Monitoring dan management transaksi</td><td class="price">Rp 1.000.000</td></tr><tr><td>3.4</td><td>User Management & Member System</td><td>Management user dan member</td><td class="price">Rp 750.000</td></tr><tr><td>3.5</td><td>Sales Reports & Analytics</td><td>Laporan penjualan dan analytics</td><td class="price">Rp 1.000.000</td></tr><tr><td>3.6</td><td>Website Settings & Configuration</td><td>Konfigurasi website</td><td class="price">Rp 500.000</td></tr><tr><td>3.7</td><td>Voucher & Promotion Management</td><td>Management voucher dan promo</td><td class="price">Rp 250.000</td></tr><tr class="section"><td>4</td><td colspan="2">MEMBER SYSTEM & LOYALTY PROGRAM</td><td class="price">' + formatRupiah(data.components.member) + '</td></tr><tr><td>4.1</td><td>User Registration & Login System</td><td>Sistem registrasi dan login</td><td class="price">Rp 1.000.000</td></tr><tr><td>4.2</td><td>Member Dashboard & Profile</td><td>Dashboard dan profile member</td><td class="price">Rp 750.000</td></tr><tr><td>4.3</td><td>Point System & Rewards</td><td>Sistem poin dan reward</td><td class="price">Rp 1.000.000</td></tr><tr><td>4.4</td><td>Member Pricing & Discounts</td><td>Harga khusus member dan diskon</td><td class="price">Rp 500.000</td></tr><tr><td>4.5</td><td>Referral System</td><td>Sistem referral</td><td class="price">Rp 250.000</td></tr><tr class="section"><td>5</td><td colspan="2">TESTING & DEPLOYMENT</td><td class="price">' + formatRupiah(data.components.testing) + '</td></tr><tr><td>5.1</td><td>Unit Testing & Integration Testing</td><td>Testing komponen dan integrasi</td><td class="price">Rp 1.000.000</td></tr><tr><td>5.2</td><td>User Acceptance Testing (UAT)</td><td>Testing oleh user</td><td class="price">Rp 500.000</td></tr><tr><td>5.3</td><td>Performance Testing & Optimization</td><td>Testing performa dan optimasi</td><td class="price">Rp 500.000</td></tr><tr><td>5.4</td><td>Security Testing & Penetration Test</td><td>Testing keamanan</td><td class="price">Rp 250.000</td></tr><tr><td>5.5</td><td>Server Setup & Domain Configuration</td><td>Setup server dan domain</td><td class="price">Rp 300.000</td></tr><tr><td>5.6</td><td>SSL Certificate & Security Setup</td><td>Setup SSL dan keamanan</td><td class="price">Rp 200.000</td></tr><tr class="section"><td>6</td><td colspan="2">PROJECT MANAGEMENT & SUPPORT</td><td class="price">' + formatRupiah(data.components.management) + '</td></tr><tr><td>6.1</td><td>Project Planning & Coordination</td><td>Perencanaan dan koordinasi project</td><td class="price">Rp 1.000.000</td></tr><tr><td>6.2</td><td>Client Communication & Updates</td><td>Komunikasi dan update ke client</td><td class="price">Rp 500.000</td></tr><tr><td>6.3</td><td>Documentation & User Manual</td><td>Dokumentasi dan manual user</td><td class="price">Rp 750.000</td></tr><tr><td>6.4</td><td>Training & Knowledge Transfer</td><td>Training untuk client</td><td class="price">Rp 500.000</td></tr><tr><td>6.5</td><td>3 Months Bug Fixes & Updates</td><td>Bug fixes dan updates 3 bulan</td><td class="price">Rp 1.500.000</td></tr><tr><td>6.6</td><td>Priority Support & Consultation</td><td>Support prioritas dan konsultasi</td><td class="price">Rp 1.000.000</td></tr><tr class="total"><td colspan="2"><b>SUBTOTAL DEVELOPMENT</b></td><td></td><td class="price"><b>' + formatRupiah(subtotal) + '</b></td></tr><tr class="total"><td colspan="2"><b>PROJECT MANAGEMENT & SUPPORT</b></td><td></td><td class="price"><b>' + formatRupiah(data.components.management) + '</b></td></tr><tr class="total" style="background-color:#ddd6fe"><td colspan="2"><b>TOTAL INVESTMENT</b></td><td></td><td class="price"><b>' + formatRupiah(data.price) + '</b></td></tr></table><table style="margin-top:20px"><tr><td colspan="4"></td></tr><tr><td colspan="4" style="font-weight:bold;font-size:12pt">SKEMA PEMBAYARAN (30% - 40% - 30%)</td></tr><tr class="header"><td style="width:10%">NO</td><td style="width:30%">TAHAP</td><td style="width:20%">PERSENTASE</td><td style="width:40%;text-align:right">JUMLAH</td></tr><tr><td>1</td><td><b>Down Payment (DP)</b></td><td>30%</td><td class="price"><b>' + formatRupiah(dp) + '</b></td></tr><tr><td>2</td><td><b>Progress Payment</b></td><td>40%</td><td class="price"><b>' + formatRupiah(progress) + '</b></td></tr><tr><td>3</td><td><b>Final Payment</b></td><td>30%</td><td class="price"><b>' + formatRupiah(final) + '</b></td></tr><tr class="total"><td colspan="2">TOTAL</td><td>100%</td><td class="price"><b>' + formatRupiah(data.price) + '</b></td></tr></table><table style="margin-top:20px"><tr><td colspan="4"></td></tr><tr><td colspan="4" style="font-weight:bold;font-size:12pt">GARANSI & SUPPORT</td></tr><tr class="header"><td style="width:10%">NO</td><td style="width:40%">ITEM</td><td style="width:50%">DESKRIPSI</td></tr><tr><td>1</td><td><b>Bug Fixes</b></td><td>Perbaikan bug gratis selama 3 bulan</td></tr><tr><td>2</td><td><b>Priority Support</b></td><td>Support 24/7 via WhatsApp & Email</td></tr><tr><td>3</td><td><b>Free Minor Updates</b></td><td>Update kecil gratis selama 3 bulan</td></tr><tr><td>4</td><td><b>Performance Guarantee</b></td><td>Website load time < 2 detik</td></tr><tr><td>5</td><td><b>Security Updates</b></td><td>Update keamanan gratis selama 3 bulan</td></tr><tr><td>6</td><td><b>Backup & Recovery</b></td><td>Backup otomatis dan recovery selama 3 bulan</td></tr></table><table style="margin-top:20px"><tr><td colspan="4"></td></tr><tr><td colspan="4" style="background-color:#fef3c7;padding:10px;border:1px solid #f59e0b"><b>CATATAN PENTING:</b></td></tr><tr><td colspan="4" style="background-color:#fef3c7;padding:10px;border:1px solid #f59e0b">• Harga berlaku selama 30 hari dari tanggal penerbitan</td></tr><tr><td colspan="4" style="background-color:#fef3c7;padding:10px;border:1px solid #f59e0b">• Harga sudah termasuk PPN 11%</td></tr><tr><td colspan="4" style="background-color:#fef3c7;padding:10px;border:1px solid #f59e0b">• Perubahan scope akan dikenakan biaya tambahan</td></tr><tr><td colspan="4" style="background-color:#fef3c7;padding:10px;border:1px solid #f59e0b">• Timeline dapat berubah sesuai feedback dan revisi</td></tr><tr><td colspan="4" style="background-color:#fef3c7;padding:10px;border:1px solid #f59e0b">• Maintenance setelah 3 bulan: Rp 3-5 juta/bulan</td></tr></table><table style="margin-top:20px"><tr><td colspan="4" style="text-align:center;font-size:9pt;color:#666">Dicetak: ' + tanggalCetak + '</td></tr><tr><td colspan="4" style="text-align:center;font-size:9pt;color:#666">RAB Website Top Up Game - ' + data.name + '</td></tr></table></body></html>';

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const filename = 'RAB_Website_TopUp_Game_' + currentPackage + '_' + tanggalCetak.replace(/ /g, '_') + '.xls';
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log('RAB ' + data.name + ' berhasil di-download: ' + filename);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const packageCards = document.querySelectorAll('.package-card[data-package]');
  const selectorBtns = document.querySelectorAll('.selector-btn[data-package]');
  const packageSelectBtns = document.querySelectorAll('.package-select-btn[data-package]');
  
  packageCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.package-select-btn')) return;
      selectPackage(card.dataset.package);
    });
  });
  
  selectorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectPackage(btn.dataset.package);
    });
  });
  
  packageSelectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectPackage(btn.dataset.package);
    });
  });
  
  initBreakdownToggles();
  selectPackage('premium');
});

// Expose to global scope for onclick handlers
window.exportToExcel = exportToExcel;
