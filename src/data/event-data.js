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
    { jam: '09.00 - 10.00', agenda: 'Registrasi', detail: 'Pendaftaran marketing baru & pembagian kit.', pic: 'Aziz & Kang Teguh (MC)', type: 'registration' },
    { jam: '10.00 - 12.00', agenda: 'Opening', detail: 'Sambutan Ketua Panitia & Perkenalan Member.', pic: 'Ferdian & Kang Teguh', type: 'ceremony' },
    { jam: '12.00 - 13.00', agenda: 'ISHOMA', detail: 'Makan siang & Shalat Dzuhur.', pic: 'Sarah & Nabila', type: 'break' },
    { jam: '13.00 - 13.45', agenda: 'Materi 1', detail: 'Visi & Strategi Property', pic: 'Bpk. Muhammad Arsyad', type: 'materi' },
    { jam: '13.50 - 14.35', agenda: 'Materi 2', detail: 'Administrasi & Service Excellence', pic: 'Ibu Nany Pujiani', type: 'materi' },
    { jam: '14.40 - 15.25', agenda: 'Materi 3', detail: 'Sales Mastery & Closing', pic: 'Bpk. Vany Firmansyah', type: 'materi' },
    { jam: '15.25 - 16.00', agenda: 'Coffee Break', detail: 'Snack sore & Shalat Ashar.', pic: 'Sarah', type: 'break' },
    { jam: '16.00 - 16.45', agenda: 'Materi 4', detail: 'Leadership & Team Management', pic: 'Bpk. Dony Firmansyah', type: 'materi' },
    { jam: '16.50 - 17.35', agenda: 'Materi 5', detail: 'Workshop Design & Konten', pic: 'Muhammad Agung', type: 'materi' },
    { jam: '17.35 - 19.30', agenda: 'Free Time', detail: 'Bersih diri & Shalat Maghrib.', pic: '-', type: 'break' },
    { jam: '19.40 - 22.00', agenda: 'RAKER INTI', detail: 'Pembentukan Leader & Target 2026', pic: 'Ferdian & Anim', type: 'meeting' },
    { jam: '22.00 - selesai', agenda: 'Dinner BBQ', detail: 'Bakar Kambing Guling & Keakraban.', pic: 'Kang Teguh & All Team', type: 'dinner' }
  ]
};

export const rundownHari2 = {
  hari: 'Jumat',
  tanggal: '16 Januari 2026',
  jadwal: [
    { jam: '04.30 - 05.30', agenda: 'Religi Pagi', detail: 'Shalat Shubuh Berjamaah & Kultum Singkat', pic: 'Ustad Satria', type: 'religious' },
    { jam: '05.30 - 07.00', agenda: 'Coffee Morning', detail: 'Teh/Kopi hangat sambil menikmati udara Puncak.', pic: 'Sarah', type: 'break' },
    { jam: '07.00 - 08.30', agenda: 'Sarapan Pagi', detail: 'Makan pagi bersama di Villa.', pic: 'Nabila', type: 'break' },
    { jam: '08.30 - 10.30', agenda: 'Team Building', detail: 'Fun Games, Ice Breaking & Berenang', pic: 'Kang Teguh & Agung', type: 'games' },
    { jam: '10.30 - 11.30', agenda: 'Closing', detail: 'Testimoni Marketing Baru & Foto Bersama.', pic: 'Kang Teguh & Nanda', type: 'ceremony' },
    { jam: '12.00', agenda: 'Check-out', detail: 'Perjalanan pulang ke titik asal.', pic: 'Faris Azam', type: 'checkout' }
  ]
};
