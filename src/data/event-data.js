// Data Struktur Kepanitiaan
export const strukturKepanitiaan = {
  ketua: {
    posisi: 'Ketua',
    nama: 'Ferdian',
    color: '#10b981', // Emerald
    icon: 'crown'
  },
  wakilKetua: {
    posisi: 'Wakil Ketua',
    nama: 'Anim',
    color: '#059669', // Emerald Dark
    icon: 'star'
  },
  sekretaris: {
    posisi: 'Sekretaris',
    nama: 'Aziz Jaelani',
    color: '#3b82f6', // Blue
    icon: 'clipboard'
  },
  bendahara: {
    posisi: 'Bendahara',
    nama: 'Atikah',
    color: '#f59e0b', // Amber
    icon: 'wallet'
  },
  sie: [
    {
      posisi: 'Sie Acara',
      nama: ['Nanda', 'Ustad Satria', 'Doyok'],
      catatan: 'Memimpin doa: Ustad Satria',
      color: '#8b5cf6', // Purple
      icon: 'calendar'
    },
    {
      posisi: 'Sie Konsumsi',
      nama: ['Sarah', 'Nabila'],
      color: '#ec4899', // Pink
      icon: 'utensils'
    },
    {
      posisi: 'Sie Dokumentasi',
      nama: ['Umam', 'Bagas'],
      color: '#06b6d4', // Cyan
      icon: 'camera'
    },
    {
      posisi: 'Sie Peralatan',
      nama: ['Faris Azam', 'Agung'],
      color: '#f97316', // Orange
      icon: 'tools'
    }
  ]
};

// Data Rundown Acara
export const rundownHari1 = {
  hari: 'Kamis',
  tanggal: '15 Januari 2026',
  jadwal: [
    { jam: '10.00 - 10.15', agenda: 'Opening', detail: 'Sambutan Ketua Panitia', pic: 'Ferdian & MC', type: 'ceremony' },
    { jam: '10.15 - 10.50', agenda: 'Materi Tamu 1', detail: 'Presentasi ALESTA', pic: 'ALESTA', type: 'materi' },
    { jam: '10.50 - 11.25', agenda: 'Materi Tamu 2', detail: 'Presentasi Rumah123', pic: 'Rumah123', type: 'materi' },
    { jam: '11.25 - 12.00', agenda: 'Materi Tamu 3', detail: 'Presentasi LAMUDI', pic: 'LAMUDI', type: 'materi' },
    { jam: '12.00 - 13.00', agenda: 'ISHOMA', detail: 'Makan siang & Shalat Dzuhur', pic: 'Sie Konsumsi', type: 'break' },
    { jam: '13.00 - 13.30', agenda: 'Materi 1', detail: 'Fundamental & Mindset Marketing Properti', pic: 'Bpk. Muhammad Arsyad', type: 'materi' },
    { jam: '13.30 - 14.00', agenda: 'Materi 2', detail: 'Cara Membangun Personal Branding Marketing Properti', pic: 'Bpk. Dony Firmansyah', type: 'materi' },
    { jam: '14.00 - 14.30', agenda: 'Materi 3', detail: 'Teknik Handling Objection Calon Buyer', pic: 'Bpk. Vany Firmansyah', type: 'materi' },
    { jam: '14.30 - 15.00', agenda: 'Materi 4', detail: 'Strategi Follow Up yang Efektif', pic: 'Ibu Nany Pujiani', type: 'materi' },
    { jam: '15.00 - 15.30', agenda: 'Materi 5', detail: 'Teknik Membuat Konten Pemasaran (Reels, Story & Feed)', pic: 'Muhammad Agung', type: 'materi' },
    { jam: '15.30 - 15.50', agenda: 'Shalat Ashar', detail: 'Istirahat & Shalat Ashar', pic: '-', type: 'break' },
    { jam: '15.50 - 17.40', agenda: 'Raker', detail: 'Rapat Kerja Vertizon Academy', pic: 'Bpk. Vany Firmansyah', type: 'meeting' },
    { jam: '17.40 - 19.30', agenda: 'Free Time', detail: 'Bersih diri & Shalat Maghrib', pic: '-', type: 'break' },
    { jam: '19.30 - 21.00', agenda: 'Dinner BBQ', detail: 'Bakar Kambing Guling & Keakraban', pic: 'All Team', type: 'dinner' }
  ]
};

export const rundownHari2 = {
  hari: 'Jumat',
  tanggal: '16 Januari 2026',
  jadwal: [
    { jam: '04.30 - 05.30', agenda: 'Religi Pagi', detail: 'Shalat Shubuh Berjamaah & Kultum Singkat', pic: 'Ustad Satria', type: 'religious' },
    { jam: '05.30 - 07.00', agenda: 'Coffee Morning', detail: 'Teh/Kopi hangat sambil menikmati udara Puncak', pic: 'Sarah', type: 'break' },
    { jam: '07.00 - 08.30', agenda: 'Sarapan Pagi', detail: 'Makan pagi bersama di Villa', pic: 'Nabila', type: 'break' },
    { jam: '08.30 - 08.45', agenda: 'Senam', detail: 'Pemanasan sebelum Fun Games', pic: 'Sie Acara', type: 'games' },
    { jam: '08.45 - 09.00', agenda: 'Gelombang Bahagia', detail: 'Ice Breaking', pic: 'Sie Acara', type: 'games' },
    { jam: '09.00 - 09.15', agenda: 'Lampu Merah', detail: 'Fun Games', pic: 'Sie Acara', type: 'games' },
    { jam: '09.15 - 09.30', agenda: 'Joget Balon', detail: 'Fun Games', pic: 'Sie Acara', type: 'games' },
    { jam: '09.30 - 09.50', agenda: 'Estafet Karet', detail: 'Fun Games', pic: 'Sie Acara', type: 'games' },
    { jam: '09.50 - 10.10', agenda: 'Estafet Air', detail: 'Fun Games', pic: 'Sie Acara', type: 'games' },
    { jam: '10.10 - 10.40', agenda: 'Voly Sarung', detail: 'Fun Games di Kolam Renang', pic: 'Sie Acara', type: 'games' },
    { jam: '10.40 - 10.45', agenda: 'Pengumuman Pemenang', detail: 'Pengumuman Juara Fun Games & Pembagian Hadiah', pic: 'Sie Acara', type: 'ceremony' },
    { jam: '11.00 - 11.30', agenda: 'Closing', detail: 'Testimoni Marketing Baru & Foto Bersama', pic: 'MC & Nanda', type: 'ceremony' },
    { jam: '11.30', agenda: 'Check-out', detail: 'Perjalanan pulang (sebelum Jumatan)', pic: 'Faris Azam', type: 'checkout' }
  ]
};
