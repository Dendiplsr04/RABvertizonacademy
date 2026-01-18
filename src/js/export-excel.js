// Professional Excel Export Function
export function createExcelExport(packageType, packageData, formatRupiah) {
  const data = packageData[packageType];
  const today = new Date();
  const tanggalCetak = today.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const dp = data.price * 0.3;
  const progress = data.price * 0.4;
  const final = data.price * 0.3;
  const subtotal = data.price - data.components.management;
  
  const htmlContent = `
<html xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Calibri', Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #999; padding: 8px; text-align: left; }
    .header { background-color: #8b5cf6; color: white; font-weight: bold; font-size: 14pt; }
    .section-header { background-color: #8b5cf6; color: white; font-weight: bold; }
    .subheader { background-color: #e9d5ff; font-weight: bold; }
    .total-row { background-color: #f3e8ff; font-weight: bold; }
    .payment-header { background-color: #06b6d4; color: white; font-weight: bold; }
    .payment-row { background-color: #cffafe; }
    .guarantee-header { background-color: #10b981; color: white; font-weight: bold; }
    .guarantee-row { background-color: #d1fae5; }
    .price { text-align: right; }
    .indent1 { padding-left: 30px; }
    .indent2 { padding-left: 60px; background-color: #f9f5ff; }
    h1 { text-align: center; color: #8b5cf6; font-size: 16pt; margin: 10px 0; }
    h2 { text-align: center; color: #333; font-size: 12pt; margin: 5px 0; }
    .info-row { background-color: #f3f4f6; }
  </style>
</head>
<body>
  <h1>RENCANA ANGGARAN BIAYA (RAB)</h1>
  <h2>Website & Aplikasi Top Up Game - ${data.name}</h2>
  
  <table style="margin-bottom: 20px;">
    <tr class="info-row">
      <td><strong>Tanggal:</strong></td>
      <td>${tanggalCetak}</td>
      <td><strong>Paket:</strong></td>
      <td>${data.name}</td>
    </tr>
    <tr class="info-row">
      <td><strong>Client:</strong></td>
      <td>[Nama Client]</td>
      <td><strong>Developer:</strong></td>
      <td>[Nama Developer]</td>
    </tr>
  </table>

  <h2 style="margin-top: 20px; color: #8b5cf6;">RINCIAN BIAYA KOMPONEN</h2>
  <table>
    <tr class="header">
      <td style="width: 5%;">NO</td>
      <td style="width: 35%;">KOMPONEN</td>
      <td style="width: 40%;">DESKRIPSI</td>
      <td style="width: 20%; text-align: right;">HARGA</td>
    </tr>
    
    <!-- Frontend -->
    <tr class="section-header">
      <td>1</td>
      <td colspan="2">FRONTEND DEVELOPMENT</td>
      <td class="price">${formatRupiah(data.components.frontend)}</td>
    </tr>
    <tr class="indent2">
      <td>1.1</td>
      <td>UI/UX Design & Mockup</td>
      <td>Desain interface dan user experience</td>
      <td class="price">Rp 2.000.000</td>
    </tr>
    <tr class="indent2">
      <td>1.2</td>
      <td>Responsive Layout</td>
      <td>Desktop, Tablet, Mobile optimization</td>
      <td class="price">Rp 1.750.000</td>
    </tr>
    <tr class="indent2">
      <td>1.3</td>
      <td>Game Catalog & Product Pages</td>
      <td>Halaman katalog dan detail produk</td>
      <td class="price">Rp 1.500.000</td>
    </tr>
    <tr class="indent2">
      <td>1.4</td>
      <td>Checkout Flow & Payment Interface</td>
      <td>Proses pembelian dan pembayaran</td>
      <td class="price">Rp 1.250.000</td>
    </tr>
    <tr class="indent2">
      <td>1.5</td>
      <td>User Dashboard & Transaction History</td>
      <td>Panel user dan riwayat transaksi</td>
      <td class="price">Rp 1.000.000</td>
    </tr>
    ${packageType === 'premium' ? `
    <tr class="indent2">
      <td>1.6</td>
      <td>3D Animations & Interactive Elements</td>
      <td>Animasi dan elemen interaktif</td>
      <td class="price">Rp 750.000</td>
    </tr>
    <tr class="indent2">
      <td>1.7</td>
      <td>PWA Configuration & Optimization</td>
      <td>Progressive Web App setup</td>
      <td class="price">Rp 250.000</td>
    </tr>
    ` : `
    <tr class="indent2">
      <td>1.6</td>
      <td>Basic Animations & Interactive Elements</td>
      <td>Animasi dasar</td>
      <td class="price">Rp 500.000</td>
    </tr>
    `}
    
    <!-- Backend -->
    <tr class="section-header">
      <td>2</td>
      <td colspan="2">BACKEND DEVELOPMENT & API INTEGRATION</td>
      <td class="price">${formatRupiah(data.components.backend)}</td>
    </tr>
    <tr class="indent2">
      <td>2.1</td>
      <td>Database Design & Setup</td>
      <td>MySQL/PostgreSQL database</td>
      <td class="price">Rp 1.500.000</td>
    </tr>
    <tr class="indent2">
      <td>2.2</td>
      <td>RESTful API Development</td>
      <td>Backend API endpoints</td>
      <td class="price">Rp 2.000.000</td>
    </tr>
    <tr class="indent2">
      <td>2.3</td>
      <td>Supplier API Integration</td>
      <td>Apigames/Digiflazz integration</td>
      <td class="price">Rp 2.500.000</td>
    </tr>
    <tr class="indent2">
      <td>2.4</td>
      <td>Payment Gateway Integration</td>
      <td>${packageType === 'premium' ? 'Multi-provider payment system (10 metode)' : 'Multi-provider payment system (6 metode)'}</td>
      <td class="price">${packageType === 'premium' ? 'Rp 2.250.000' : 'Rp 2.000.000'}</td>
    </tr>
    <tr class="indent2">
      <td>2.5</td>
      <td>Game ID Validation System</td>
      <td>Nickname validation</td>
      <td class="price">Rp 1.000.000</td>
    </tr>
    <tr class="indent2">
      <td>2.6</td>
      <td>Transaction Processing Engine</td>
      <td>Automated transaction handling</td>
      <td class="price">Rp 1.750.000</td>
    </tr>
    <tr class="indent2">
      <td>2.7</td>
      <td>WhatsApp API Integration</td>
      <td>Notification system</td>
      <td class="price">Rp 750.000</td>
    </tr>
    <tr class="indent2">
      <td>2.8</td>
      <td>Security & Authentication System</td>
      <td>User auth and security</td>
      <td class="price">Rp 1.000.000</td>
    </tr>
    
    <!-- Admin Dashboard -->
    <tr class="section-header">
      <td>3</td>
      <td colspan="2">ADMIN DASHBOARD & MANAGEMENT</td>
      <td class="price">${formatRupiah(data.components.admin)}</td>
    </tr>
    <tr class="indent2">
      <td>3.1</td>
      <td>Dashboard Overview & Statistics</td>
      <td>Real-time analytics dan monitoring</td>
      <td class="price">Rp 1.500.000</td>
    </tr>
    <tr class="indent2">
      <td>3.2</td>
      <td>Product Management System</td>
      <td>CRUD untuk game dan produk</td>
      <td class="price">Rp 1.250.000</td>
    </tr>
    <tr class="indent2">
      <td>3.3</td>
      <td>Transaction Management & Monitoring</td>
      <td>Monitoring dan management transaksi</td>
      <td class="price">Rp 1.000.000</td>
    </tr>
    <tr class="indent2">
      <td>3.4</td>
      <td>User Management & Member System</td>
      <td>Management user dan member</td>
      <td class="price">Rp 750.000</td>
    </tr>
    <tr class="indent2">
      <td>3.5</td>
      <td>Sales Reports & Analytics</td>
      <td>${packageType === 'premium' ? 'Laporan penjualan dan analytics lengkap' : 'Laporan penjualan dan analytics'}</td>
      <td class="price">${packageType === 'premium' ? 'Rp 1.000.000' : 'Rp 750.000'}</td>
    </tr>
    <tr class="indent2">
      <td>3.6</td>
      <td>Website Settings & Configuration</td>
      <td>Konfigurasi website</td>
      <td class="price">Rp 500.000</td>
    </tr>
    <tr class="indent2">
      <td>3.7</td>
      <td>Voucher & Promotion Management</td>
      <td>Management voucher dan promo</td>
      <td class="price">Rp 250.000</td>
    </tr>
    
    <!-- Member System -->
    <tr class="section-header">
      <td>4</td>
      <td colspan="2">MEMBER SYSTEM & LOYALTY PROGRAM</td>
      <td class="price">${formatRupiah(data.components.member)}</td>
    </tr>
    <tr class="indent2">
      <td>4.1</td>
      <td>User Registration & Login System</td>
      <td>Sistem registrasi dan login</td>
      <td class="price">Rp 1.000.000</td>
    </tr>
    <tr class="indent2">
      <td>4.2</td>
      <td>Member Dashboard & Profile</td>
      <td>Dashboard dan profile member</td>
      <td class="price">Rp 750.000</td>
    </tr>
    <tr class="indent2">
      <td>4.3</td>
      <td>Point System & Rewards</td>
      <td>Sistem poin dan reward</td>
      <td class="price">Rp 1.000.000</td>
    </tr>
    <tr class="indent2">
      <td>4.4</td>
      <td>Member Pricing & Discounts</td>
      <td>Harga khusus member dan diskon</td>
      <td class="price">Rp 500.000</td>
    </tr>
    ${packageType === 'premium' ? `
    <tr class="indent2">
      <td>4.5</td>
      <td>Referral System</td>
      <td>Sistem referral</td>
      <td class="price">Rp 250.000</td>
    </tr>
    ` : ''}
    
    <!-- Testing & Deployment -->
    <tr class="section-header">
      <td>5</td>
      <td colspan="2">TESTING & DEPLOYMENT</td>
      <td class="price">${formatRupiah(data.components.testing)}</td>
    </tr>
    <tr class="indent2">
      <td>5.1</td>
      <td>Unit Testing & Integration Testing</td>
      <td>Testing komponen dan integrasi</td>
      <td class="price">Rp 1.000.000</td>
    </tr>
    <tr class="indent2">
      <td>5.2</td>
      <td>User Acceptance Testing (UAT)</td>
      <td>Testing oleh user</td>
      <td class="price">Rp 500.000</td>
    </tr>
    <tr class="indent2">
      <td>5.3</td>
      <td>Performance Testing & Optimization</td>
      <td>Testing performa dan optimasi</td>
      <td class="price">Rp 500.000</td>
    </tr>
    <tr class="indent2">
      <td>5.4</td>
      <td>Security Testing & Penetration Test</td>
      <td>Testing keamanan</td>
      <td class="price">Rp 250.000</td>
    </tr>
    <tr class="indent2">
      <td>5.5</td>
      <td>Server Setup & Domain Configuration</td>
      <td>Setup server dan domain</td>
      <td class="price">Rp 300.000</td>
    </tr>
    <tr class="indent2">
      <td>5.6</td>
      <td>SSL Certificate & Security Setup</td>
      <td>Setup SSL dan keamanan</td>
      <td class="price">Rp 200.000</td>
    </tr>
    
    <!-- Project Management -->
    <tr class="section-header">
      <td>6</td>
      <td colspan="2">PROJECT MANAGEMENT & SUPPORT</td>
      <td class="price">${formatRupiah(data.components.management)}</td>
    </tr>
    <tr class="indent2">
      <td>6.1</td>
      <td>Project Planning & Coordination</td>
      <td>Perencanaan dan koordinasi project</td>
      <td class="price">Rp 1.000.000</td>
    </tr>
    <tr class="indent2">
      <td>6.2</td>
      <td>Client Communication & Updates</td>
      <td>Komunikasi dan update ke client</td>
      <td class="price">Rp 500.000</td>
    </tr>
    <tr class="indent2">
      <td>6.3</td>
      <td>Documentation & User Manual</td>
      <td>Dokumentasi dan manual user</td>
      <td class="price">Rp 750.000</td>
    </tr>
    <tr class="indent2">
      <td>6.4</td>
      <td>Training & Knowledge Transfer</td>
      <td>Training untuk client</td>
      <td class="price">Rp 500.000</td>
    </tr>
    <tr class="indent2">
      <td>6.5</td>
      <td>${packageType === 'premium' ? '3 Months Bug Fixes & Updates' : '2 Months Bug Fixes & Updates'}</td>
      <td>${packageType === 'premium' ? 'Bug fixes dan updates 3 bulan' : 'Bug fixes dan updates 2 bulan'}</td>
      <td class="price">${packageType === 'premium' ? 'Rp 1.500.000' : 'Rp 1.000.000'}</td>
    </tr>
    <tr class="indent2">
      <td>6.6</td>
      <td>${packageType === 'premium' ? 'Priority Support & Consultation' : 'Standard Support & Consultation'}</td>
      <td>${packageType === 'premium' ? 'Support prioritas dan konsultasi' : 'Support standard dan konsultasi'}</td>
      <td class="price">${packageType === 'premium' ? 'Rp 1.000.000' : 'Rp 700.000'}</td>
    </tr>
    
    <!-- Summary -->
    <tr class="total-row">
      <td colspan="2"><strong>SUBTOTAL DEVELOPMENT</strong></td>
      <td></td>
      <td class="price"><strong>${formatRupiah(subtotal)}</strong></td>
    </tr>
    <tr class="total-row">
      <td colspan="2"><strong>PROJECT MANAGEMENT & SUPPORT</strong></td>
      <td></td>
      <td class="price"><strong>${formatRupiah(data.components.management)}</strong></td>
    </tr>
    <tr class="total-row" style="background-color: #ddd6fe; font-size: 12pt;">
      <td colspan="2"><strong>TOTAL INVESTMENT</strong></td>
      <td></td>
      <td class="price"><strong>${formatRupiah(data.price)}</strong></td>
    </tr>
  </table>

  <h2 style="margin-top: 30px; color: #06b6d4;">SKEMA PEMBAYARAN (30% - 40% - 30%)</h2>
  <table>
    <tr class="payment-header">
      <td style="width: 10%;">NO</td>
      <td style="width: 30%;">TAHAP</td>
      <td style="width: 20%;">PERSENTASE</td>
      <td style="width: 40%; text-align: right;">JUMLAH</td>
    </tr>
    <tr class="payment-row">
      <td>1</td>
      <td><strong>Down Payment (DP)</strong></td>
      <td>30%</td>
      <td class="price"><strong>${formatRupiah(dp)}</strong></td>
    </tr>
    <tr class="payment-row">
      <td>2</td>
      <td><strong>Progress Payment</strong></td>
      <td>40%</td>
      <td class="price"><strong>${formatRupiah(progress)}</strong></td>
    </tr>
    <tr class="payment-row">
      <td>3</td>
      <td><strong>Final Payment</strong></td>
      <td>30%</td>
      <td class="price"><strong>${formatRupiah(final)}</strong></td>
    </tr>
    <tr class="payment-row" style="background-color: #a5f3fc; font-weight: bold;">
      <td colspan="2">TOTAL</td>
      <td>100%</td>
      <td class="price"><strong>${formatRupiah(data.price)}</strong></td>
    </tr>
  </table>

  <h2 style="margin-top: 30px; color: #10b981;">GARANSI & SUPPORT</h2>
  <table>
    <tr class="guarantee-header">
      <td style="width: 10%;">NO</td>
      <td style="width: 40%;">ITEM</td>
      <td style="width: 50%;">DESKRIPSI</td>
    </tr>
    <tr class="guarantee-row">
      <td>1</td>
      <td><strong>Bug Fixes</strong></td>
      <td>Perbaikan bug gratis selama ${packageType === 'premium' ? '3 bulan' : '2 bulan'}</td>
    </tr>
    <tr class="guarantee-row">
      <td>2</td>
      <td><strong>${packageType === 'premium' ? 'Priority Support' : 'Standard Support'}</strong></td>
      <td>${packageType === 'premium' ? 'Support 24/7 via WhatsApp & Email' : 'Support via Email & WhatsApp'}</td>
    </tr>
    <tr class="guarantee-row">
      <td>3</td>
      <td><strong>Free Minor Updates</strong></td>
      <td>Update kecil gratis selama ${packageType === 'premium' ? '3 bulan' : '2 bulan'}</td>
    </tr>
    <tr class="guarantee-row">
      <td>4</td>
      <td><strong>Performance Guarantee</strong></td>
      <td>Website load time < ${packageType === 'premium' ? '2 detik' : '3 detik'}</td>
    </tr>
    <tr class="guarantee-row">
      <td>5</td>
      <td><strong>Security Updates</strong></td>
      <td>Update keamanan gratis selama ${packageType === 'premium' ? '3 bulan' : '2 bulan'}</td>
    </tr>
    <tr class="guarantee-row">
      <td>6</td>
      <td><strong>Backup & Recovery</strong></td>
      <td>${packageType === 'premium' ? 'Backup otomatis dan recovery' : 'Backup manual'} selama ${packageType === 'premium' ? '3 bulan' : '2 bulan'}</td>
    </tr>
  </table>

  <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border: 1px solid #f59e0b;">
    <strong>CATATAN PENTING:</strong>
    <ul>
      <li>Harga berlaku selama 30 hari dari tanggal penerbitan</li>
      <li>Harga sudah termasuk PPN 11%</li>
      <li>Perubahan scope akan dikenakan biaya tambahan</li>
      <li>Timeline dapat berubah sesuai feedback dan revisi</li>
      <li>Maintenance setelah ${packageType === 'premium' ? '3 bulan' : '2 bulan'}: Rp ${packageType === 'premium' ? '3-5' : '2-3'} juta/bulan</li>
    </ul>
  </div>

  <div style="margin-top: 30px; text-align: center; color: #666; font-size: 10pt;">
    <p>Dicetak: ${tanggalCetak}</p>
    <p>RAB Website Top Up Game - ${data.name}</p>
  </div>
</body>
</html>
  `;
  
  return htmlContent;
}
