/**
 * Dummy Data Generator
 * For testing purposes
 */

export function generateDummyReports() {
  const names = [
    'Budi Santoso',
    'Siti Nurhaliza',
    'Ahmad Fauzi',
    'Dewi Lestari',
    'Rudi Hartono'
  ];
  const categories = ['canvasing', 'live', 'konten'];
  const platforms = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'Shopee'];
  const jenisKonten = ['foto', 'video', 'reels', 'story'];

  const reports = [];
  const today = new Date();

  // Generate 15 dummy reports
  for (let index = 0; index < 15; index++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));

    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = names[Math.floor(Math.random() * names.length)];

    const report = {
      id: `report_${Date.now()}_${index}`,
      name,
      date: date.toISOString().split('T')[0],
      category,
      notes:
        Math.random() > 0.5 ? 'Hasil sangat memuaskan, target tercapai!' : '',
      createdAt: new Date().toISOString()
    };

    switch (category) {
      case 'canvasing': {
        report.prospek = Math.floor(Math.random() * 20) + 1;
        report.lokasi = [
          'Jakarta Selatan',
          'Bandung',
          'Surabaya',
          'Tangerang',
          'Bekasi'
        ][Math.floor(Math.random() * 5)];
        report.hasil = `Berhasil mendapatkan ${report.prospek} prospek baru dengan potensi closing tinggi.`;

        break;
      }
      case 'live': {
        report.durasi = Math.floor(Math.random() * 120) + 30;
        report.platform =
          platforms[Math.floor(Math.random() * platforms.length)];
        report.viewers = Math.floor(Math.random() * 5000) + 100;
        report.hasil =
          'Live streaming berjalan lancar dengan engagement rate tinggi.';

        break;
      }
      case 'konten': {
        report.jumlahKonten = Math.floor(Math.random() * 10) + 1;
        const selectedJenis = [];
        const count = Math.floor(Math.random() * 3) + 1;
        for (let index_ = 0; index_ < count; index_++) {
          const jenis =
            jenisKonten[Math.floor(Math.random() * jenisKonten.length)];
          if (!selectedJenis.includes(jenis)) {
            selectedJenis.push(jenis);
          }
        }
        report.jenisKonten = selectedJenis;
        report.hasil =
          'Konten berhasil diproduksi dengan kualitas baik dan siap dipublish.';

        break;
      }
      // No default
    }

    reports.push(report);
  }

  return reports;
}

// Function to load dummy data into localStorage
export function loadDummyData() {
  const dummyReports = generateDummyReports();
  localStorage.setItem('vertizon_daily_reports', JSON.stringify(dummyReports));
  console.log('[DummyData] Loaded', dummyReports.length, 'dummy reports');
  return dummyReports;
}
