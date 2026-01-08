// Fun Games Data - Vertizon Academy Super Boot Camp
// Jadwal: Tgl 15 malam jam 21.00 + Tgl 16 pagi

export const gamesData = [
  {
    id: 1,
    name: 'Karaoke',
    emoji: '🎤',
    category: 'Hiburan',
    duration: 'Penyisihan + Grand Final 30 menit',
    timing: 'Tgl 15 malam + Grand Final Tgl 16',
    participants: 'Semua Peserta',
    difficulty: 'Mudah',
    color: '#ec4899',
    description: 'Adu suara merdu! Tunjukkan bakat menyanyi Anda dalam kompetisi karaoke seru.',
    objective: 'Tampil menyanyi dengan penuh percaya diri dan menghibur penonton.',
    materials: [
      'Sound system & microphone',
      'Laptop/HP untuk musik',
      'Daftar lagu populer',
      'Scoring sheet untuk juri'
    ],
    budget: [],
    totalBudget: 0,
    rules: [
      'Ada 2 kategori: Solo dan Duet',
      'Juri: Sie Acara',
      'Penyisihan di malam tgl 15',
      'Grand Final di tgl 16 (30 menit)',
      'Penilaian: Vokal, Ekspresi, Penampilan'
    ],
    steps: [
      { step: 1, title: 'Pendaftaran', desc: 'Peserta mendaftar kategori Solo atau Duet.', duration: '5 menit' },
      { step: 2, title: 'Penyisihan', desc: 'Semua peserta tampil, juri memilih finalis.', duration: 'Tgl 15 malam' },
      { step: 3, title: 'Grand Final', desc: 'Finalis tampil ulang, juri menentukan pemenang.', duration: '30 menit (Tgl 16)' },
      { step: 4, title: 'Pengumuman', desc: 'Pengumuman juara Solo dan Duet.', duration: '5 menit' }
    ],
    scoring: ['Vokal & Pitch = 40 poin', 'Ekspresi & Feel = 30 poin', 'Penampilan & Percaya Diri = 30 poin'],
    winner: 'Juara 1, 2, 3 kategori Solo dan Duet',
    tips: ['Siapkan playlist lagu populer', 'Buat suasana seperti konser mini', 'Ajak penonton ikut bernyanyi']
  },
  {
    id: 2,
    name: 'Billiard',
    emoji: '🎱',
    category: 'Olahraga',
    duration: 'Sistem Gugur',
    timing: 'Tgl 15 malam jam 21.00',
    participants: 'Individual',
    difficulty: 'Sedang',
    color: '#10b981',
    description: 'Turnamen billiard dengan sistem gugur. Tunjukkan skill terbaik Anda!',
    objective: 'Memenangkan pertandingan billiard dengan sistem eliminasi.',
    materials: [
      'Meja billiard (tersedia di villa)',
      'Stik billiard',
      'Bola billiard set',
      'Bracket turnamen'
    ],
    budget: [],
    totalBudget: 0,
    rules: [
      'Sistem gugur (single elimination)',
      'Game 8-ball standard',
      'Pemenang lanjut ke babak berikutnya',
      'Kalah = tersingkir',
      'Final di malam yang sama'
    ],
    steps: [
      { step: 1, title: 'Drawing', desc: 'Undian untuk menentukan bracket pertandingan.', duration: '5 menit' },
      { step: 2, title: 'Babak Penyisihan', desc: 'Pertandingan sesuai bracket, sistem gugur.', duration: 'Bervariasi' },
      { step: 3, title: 'Semifinal', desc: '4 pemain tersisa bertanding.', duration: '20 menit' },
      { step: 4, title: 'Final', desc: 'Pertandingan final menentukan juara.', duration: '15 menit' }
    ],
    scoring: ['Menang = Lanjut ke babak berikutnya', 'Kalah = Tersingkir'],
    winner: 'Juara 1, 2, 3',
    tips: ['Buat bracket di kertas besar', 'Siapkan wasit untuk setiap meja', 'Batasi waktu per game jika perlu']
  },
  {
    id: 3,
    name: 'Tennis Meja',
    emoji: '🏓',
    category: 'Olahraga',
    duration: 'Sistem Gugur',
    timing: 'Tgl 15 malam jam 21.00',
    participants: 'Individual',
    difficulty: 'Sedang',
    color: '#3b82f6',
    description: 'Turnamen tennis meja seru dengan sistem gugur. Adu ketangkasan dan refleks!',
    objective: 'Memenangkan pertandingan tennis meja dengan sistem eliminasi.',
    materials: [
      'Meja tennis meja (tersedia di villa)',
      'Bet tennis meja',
      'Bola pingpong',
      'Bracket turnamen'
    ],
    budget: [],
    totalBudget: 0,
    rules: [
      'Sistem gugur (single elimination)',
      'Game sampai 11 poin (best of 3 set)',
      'Pemenang lanjut ke babak berikutnya',
      'Kalah = tersingkir',
      'Final di malam yang sama'
    ],
    steps: [
      { step: 1, title: 'Drawing', desc: 'Undian untuk menentukan bracket pertandingan.', duration: '5 menit' },
      { step: 2, title: 'Babak Penyisihan', desc: 'Pertandingan sesuai bracket, sistem gugur.', duration: 'Bervariasi' },
      { step: 3, title: 'Semifinal', desc: '4 pemain tersisa bertanding.', duration: '15 menit' },
      { step: 4, title: 'Final', desc: 'Pertandingan final menentukan juara.', duration: '10 menit' }
    ],
    scoring: ['Menang = Lanjut ke babak berikutnya', 'Kalah = Tersingkir'],
    winner: 'Juara 1, 2, 3',
    tips: ['Siapkan bola cadangan', 'Buat suasana kompetitif tapi fun', 'Ajak penonton mendukung']
  },
  {
    id: 4,
    name: 'Ngumpulin Koin di Kolam',
    emoji: '🏊',
    category: 'Outdoor',
    duration: '15-20 menit',
    timing: 'Tgl 16 setelah Senam Pagi',
    participants: 'Semua Peserta',
    difficulty: 'Seru',
    color: '#06b6d4',
    description: 'Lomba mengumpulkan koin di dasar kolam renang. Siapa tercepat dan terbanyak?',
    objective: 'Mengumpulkan koin sebanyak-banyaknya dari dasar kolam dalam waktu terbatas.',
    materials: [
      'Koin 500/1000 rupiah (Rp 300.000)',
      'Kolam renang',
      'Stopwatch/timer',
      'Wadah untuk koin'
    ],
    budget: [
      { item: 'Koin 500/1000 rupiah', qty: 1, unit: 'paket', price: 300000, total: 300000 }
    ],
    totalBudget: 300000,
    rules: [
      'Koin ditebar di dasar kolam',
      'Peserta dibagi beberapa gelombang',
      'Waktu per gelombang: 2 menit',
      'Koin yang dikumpulkan jadi milik peserta',
      'Terbanyak = pemenang'
    ],
    steps: [
      { step: 1, title: 'Persiapan', desc: 'Tebar koin di dasar kolam. Bagi peserta jadi beberapa gelombang.', duration: '5 menit' },
      { step: 2, title: 'Lomba', desc: 'Setiap gelombang masuk kolam dan kumpulkan koin.', duration: '2 menit/gelombang' },
      { step: 3, title: 'Hitung', desc: 'Hitung jumlah koin setiap peserta.', duration: '5 menit' },
      { step: 4, title: 'Pengumuman', desc: 'Umumkan pemenang dengan koin terbanyak.', duration: '3 menit' }
    ],
    scoring: ['Jumlah koin yang dikumpulkan', 'Koin boleh dibawa pulang peserta'],
    winner: '3 peserta dengan koin terbanyak',
    tips: ['Pastikan kedalaman kolam aman', 'Siapkan handuk untuk peserta', 'Buat suasana seru dengan musik']
  },
  {
    id: 5,
    name: 'UNO',
    emoji: '🃏',
    category: 'Card Game',
    duration: '30-45 menit',
    timing: 'Tgl 16',
    participants: 'Khusus Perempuan',
    difficulty: 'Mudah',
    color: '#f59e0b',
    description: 'Turnamen kartu UNO khusus untuk peserta perempuan. Seru dan penuh strategi!',
    objective: 'Menjadi pemain pertama yang menghabiskan semua kartu.',
    materials: [
      'Kartu UNO (2-3 set)',
      'Meja dan kursi',
      'Scoring sheet'
    ],
    budget: [],
    totalBudget: 0,
    rules: [
      'Khusus peserta perempuan',
      'Aturan UNO standard',
      'Wajib bilang "UNO" saat kartu tinggal 1',
      'Lupa bilang UNO = ambil 2 kartu',
      'Sistem poin atau eliminasi'
    ],
    steps: [
      { step: 1, title: 'Pembagian Meja', desc: 'Bagi peserta ke beberapa meja (4-6 orang/meja).', duration: '3 menit' },
      { step: 2, title: 'Babak Penyisihan', desc: 'Main di masing-masing meja, pemenang lanjut.', duration: '15 menit' },
      { step: 3, title: 'Final', desc: 'Pemenang tiap meja bertanding di meja final.', duration: '15 menit' },
      { step: 4, title: 'Pengumuman', desc: 'Umumkan juara UNO.', duration: '3 menit' }
    ],
    scoring: ['Pertama habis kartu = Menang', 'Sistem eliminasi per meja'],
    winner: 'Juara 1, 2, 3',
    tips: ['Siapkan kartu UNO cadangan', 'Buat suasana santai dan fun', 'Boleh sambil ngobrol']
  }
];

export const scheduleRecommendation = [
  { time: '21.00 - selesai (Tgl 15)', game: 'Karaoke, Billiard, Tennis Meja', type: 'Fun Games Malam', duration: 'Sampai selesai' },
  { time: '05.35 - 05.40 (Tgl 16)', game: 'Senam Pagi', type: 'Pemanasan', duration: '5 menit' },
  { time: '08.30 - 09.00 (Tgl 16)', game: 'Ngumpulin Koin di Kolam', type: 'Outdoor', duration: '30 menit' },
  { time: '09.00 - 09.30 (Tgl 16)', game: 'Grand Final Karaoke', type: 'Hiburan', duration: '30 menit' },
  { time: '09.30 - 10.30 (Tgl 16)', game: 'UNO (Perempuan)', type: 'Card Game', duration: '60 menit' }
];

export const gamesNote = {
  status: 'FINAL',
  message: 'Jadwal Fun Games sudah dikonfirmasi panitia.',
  schedule: {
    day1: 'Tgl 15 jam 21.00: Karaoke (penyisihan), Billiard & Tennis Meja',
    day2: 'Tgl 16: Senam Pagi → Ngumpulin Koin → Grand Final Karaoke → UNO'
  },
  closeTime: 'Close jam 11.30 (sebelum Jumatan)',
  pic: 'Sie Acara'
};
