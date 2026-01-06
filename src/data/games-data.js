// Fun Games Data - Vertizon Academy Super Boot Camp

export const gamesData = [
  {
    id: 1,
    name: 'Speed Networking Challenge',
    emoji: '🤝',
    category: 'Ice Breaking',
    duration: '20 menit',
    timing: 'Pagi Hari',
    participants: 'Semua Peserta',
    difficulty: 'Mudah',
    color: '#3b82f6',
    description: 'Bangun koneksi secepat kilat! Latih kemampuan networking dan komunikasi dalam waktu singkat.',
    objective: 'Mengumpulkan informasi kontak dan kebutuhan properti dari peserta lain sebanyak-banyaknya dalam waktu terbatas.',
    materials: [
      'Kartu nama atau kertas kecil',
      'Pulpen untuk setiap peserta',
      'Timer/Stopwatch',
      'Lonceng atau peluit'
    ],
    budget: [
      { item: 'Kartu Networking (cetak)', qty: 50, unit: 'lembar', price: 1500, total: 75000 },
      { item: 'Lonceng/Bell', qty: 1, unit: 'pcs', price: 25000, total: 25000 },
      { item: 'Hadiah Pemenang (Voucher)', qty: 3, unit: 'pcs', price: 50000, total: 150000 }
    ],
    totalBudget: 250000,
    rules: [
      'Setiap peserta mendapat kartu networking',
      'Waktu per pasangan: 2 menit',
      'Wajib dapat: Nama, Pekerjaan, Kebutuhan Properti',
      'Saat lonceng berbunyi, pindah ke orang baru',
      'Tidak boleh kembali ke orang yang sama'
    ],
    steps: [
      {
        step: 1,
        title: 'Persiapan',
        desc: 'Bagikan kartu networking ke semua peserta. Jelaskan aturan main.',
        duration: '3 menit'
      },
      {
        step: 2,
        title: 'Sesi Networking',
        desc: 'Peserta berpasangan dan saling berkenalan. Catat info di kartu masing-masing.',
        duration: '2 menit/pasangan'
      },
      {
        step: 3,
        title: 'Rotasi',
        desc: 'Saat lonceng berbunyi, semua peserta pindah mencari pasangan baru.',
        duration: 'Ulangi 5-7x'
      },
      {
        step: 4,
        title: 'Hitung Skor',
        desc: 'Hitung jumlah kontak yang berhasil dikumpulkan setiap peserta.',
        duration: '3 menit'
      }
    ],
    scoring: [
      'Setiap kontak lengkap (nama + pekerjaan + kebutuhan) = 3 poin',
      'Kontak tidak lengkap = 1 poin',
      'Bonus: Menemukan potential client = +5 poin'
    ],
    winner: '3 peserta dengan poin tertinggi',
    tips: [
      'Putar musik upbeat untuk menambah semangat',
      'Siapkan hadiah kecil untuk pemenang',
      'Bisa jadi sesi follow-up setelah acara'
    ]
  },
  {
    id: 2,
    name: 'Tebak Harga Properti',
    emoji: '🏠',
    category: 'Quiz Game',
    duration: '15 menit',
    timing: 'Setelah Makan Siang',
    participants: 'Semua Peserta',
    difficulty: 'Sedang',
    color: '#10b981',
    description: 'Uji ketajaman market sense Anda! Tebak harga properti dari berbagai lokasi di Indonesia.',
    objective: 'Menebak harga properti yang ditampilkan dengan akurasi tertinggi.',
    materials: [
      'Laptop + Proyektor',
      'Slide foto properti (10-15 properti)',
      'Kertas jawaban',
      'Pulpen'
    ],
    budget: [
      { item: 'Kertas Jawaban (cetak)', qty: 50, unit: 'lembar', price: 500, total: 25000 },
      { item: 'Hadiah Pemenang (Voucher)', qty: 3, unit: 'pcs', price: 50000, total: 150000 }
    ],
    totalBudget: 175000,
    rules: [
      'Setiap properti ditampilkan selama 30 detik',
      'Peserta menulis tebakan harga di kertas',
      'Tidak boleh diskusi atau melihat jawaban orang lain',
      'Jawaban dalam range ±10% dianggap benar',
      'Paling mendekati harga asli = poin tertinggi'
    ],
    steps: [
      {
        step: 1,
        title: 'Briefing',
        desc: 'Jelaskan aturan dan bagikan kertas jawaban.',
        duration: '2 menit'
      },
      {
        step: 2,
        title: 'Tampilkan Properti',
        desc: 'Tampilkan foto properti dengan info: lokasi, luas tanah, luas bangunan, tipe.',
        duration: '30 detik/properti'
      },
      {
        step: 3,
        title: 'Waktu Jawab',
        desc: 'Peserta menulis tebakan harga.',
        duration: '15 detik'
      },
      {
        step: 4,
        title: 'Reveal & Scoring',
        desc: 'Tampilkan harga asli, peserta hitung selisih tebakan mereka.',
        duration: '1 menit/properti'
      }
    ],
    scoring: [
      'Tebakan tepat (±5%) = 10 poin',
      'Tebakan mendekati (±10%) = 7 poin',
      'Tebakan cukup dekat (±20%) = 5 poin',
      'Tebakan jauh (±30%) = 2 poin',
      'Tebakan sangat jauh (>30%) = 0 poin'
    ],
    winner: '3 peserta dengan total poin tertinggi',
    tips: [
      'Gunakan properti dari berbagai segmen (rumah subsidi - luxury)',
      'Sertakan properti dari lokasi yang familiar peserta',
      'Bisa tambahkan properti "jebakan" dengan harga tidak terduga'
    ]
  },
  {
    id: 3,
    name: 'Property Pitch Battle',
    emoji: '🎤',
    category: 'Competition',
    duration: '30 menit',
    timing: 'Sore Hari',
    participants: 'Tim (4-5 orang/tim)',
    difficulty: 'Menantang',
    color: '#f59e0b',
    description: 'Adu strategi penjualan! Presentasikan properti dengan cara paling meyakinkan.',
    objective: 'Menyusun dan mempresentasikan pitch penjualan properti terbaik dalam waktu terbatas.',
    materials: [
      'Kartu properti (foto + spesifikasi)',
      'Kertas flipchart',
      'Spidol warna',
      'Timer',
      'Scoring board'
    ],
    budget: [
      { item: 'Kartu Properti (cetak warna)', qty: 10, unit: 'lembar', price: 5000, total: 50000 },
      { item: 'Kertas Flipchart', qty: 10, unit: 'lembar', price: 8000, total: 80000 },
      { item: 'Spidol Warna (set)', qty: 8, unit: 'set', price: 25000, total: 200000 },
      { item: 'Hadiah Tim Pemenang', qty: 1, unit: 'paket', price: 300000, total: 300000 }
    ],
    totalBudget: 630000,
    rules: [
      'Setiap tim dapat 1 kartu properti random',
      'Waktu persiapan: 5 menit',
      'Waktu presentasi: 3 menit per tim',
      'Semua anggota tim harus bicara',
      'Tim lain berperan sebagai "calon pembeli"'
    ],
    steps: [
      {
        step: 1,
        title: 'Pembagian Tim',
        desc: 'Bagi peserta menjadi 8 tim (5 orang/tim). Setiap tim ambil kartu properti.',
        duration: '3 menit'
      },
      {
        step: 2,
        title: 'Persiapan Pitch',
        desc: 'Tim menyusun strategi: USP, target market, handling objection, closing technique.',
        duration: '5 menit'
      },
      {
        step: 3,
        title: 'Presentasi',
        desc: 'Setiap tim maju presentasi. Tim lain boleh bertanya sebagai "pembeli".',
        duration: '3 menit/tim'
      },
      {
        step: 4,
        title: 'Penilaian',
        desc: 'Juri dan peserta lain memberikan nilai.',
        duration: '1 menit/tim'
      }
    ],
    scoring: [
      'Kreativitas pitch = 25 poin',
      'Kejelasan value proposition = 25 poin',
      'Kemampuan handle pertanyaan = 25 poin',
      'Teamwork & delivery = 25 poin'
    ],
    winner: 'Tim dengan total skor tertinggi',
    tips: [
      'Siapkan properti dengan berbagai tingkat kesulitan',
      'Undang 2-3 juri dari praktisi properti',
      'Rekam presentasi untuk bahan evaluasi'
    ]
  },
  {
    id: 4,
    name: 'Handle Objection Challenge',
    emoji: '🎭',
    category: 'Role Play',
    duration: '20 menit',
    timing: 'Fleksibel',
    participants: 'Berpasangan',
    difficulty: 'Menantang',
    color: '#ec4899',
    description: 'Latihan menghadapi penolakan! Role play situasi penjualan yang menantang.',
    objective: 'Melatih kemampuan menangani keberatan calon pembeli dengan profesional.',
    materials: [
      'Kartu skenario objection',
      'Timer',
      'Scoring sheet'
    ],
    budget: [
      { item: 'Kartu Skenario (cetak)', qty: 30, unit: 'lembar', price: 2000, total: 60000 },
      { item: 'Scoring Sheet (cetak)', qty: 50, unit: 'lembar', price: 500, total: 25000 },
      { item: 'Hadiah Best Performer', qty: 2, unit: 'pcs', price: 75000, total: 150000 }
    ],
    totalBudget: 235000,
    rules: [
      'Satu orang jadi "Sales", satu jadi "Pembeli Rewel"',
      'Pembeli dapat kartu skenario objection',
      'Sales harus handle objection dalam 2 menit',
      'Setelah selesai, tukar peran',
      'Juri menilai teknik handling'
    ],
    steps: [
      {
        step: 1,
        title: 'Pairing',
        desc: 'Peserta berpasangan. Tentukan siapa Sales dan Pembeli pertama.',
        duration: '2 menit'
      },
      {
        step: 2,
        title: 'Ambil Kartu',
        desc: 'Pembeli ambil kartu skenario (contoh: "Kemahalan!", "Lokasi jauh", "Mau pikir-pikir dulu").',
        duration: '1 menit'
      },
      {
        step: 3,
        title: 'Role Play',
        desc: 'Sales mencoba closing, Pembeli memberikan objection sesuai kartu.',
        duration: '2 menit'
      },
      {
        step: 4,
        title: 'Tukar Peran',
        desc: 'Ganti posisi dan ulangi dengan kartu baru.',
        duration: '2 menit'
      }
    ],
    scenarios: [
      '"Harganya kemahalan, bisa kurang nggak?"',
      '"Saya mau pikir-pikir dulu ya..."',
      '"Lokasinya jauh dari kantor saya"',
      '"Tetangga saya jual lebih murah"',
      '"Saya belum butuh sekarang"',
      '"Istri/suami saya belum setuju"',
      '"Developer-nya kurang terkenal"',
      '"Saya takut properti tidak laku dijual lagi"'
    ],
    scoring: [
      'Tetap tenang & profesional = 25 poin',
      'Jawaban logis & meyakinkan = 25 poin',
      'Teknik closing yang digunakan = 25 poin',
      'Empati terhadap keberatan = 25 poin'
    ],
    winner: 'Pasangan dengan kombinasi skor tertinggi',
    tips: [
      'Briefing teknik handling objection sebelum game',
      'Buat suasana fun, bukan menegangkan',
      'Diskusi best practice setelah game'
    ]
  },
  {
    id: 5,
    name: 'Treasure Hunt: Sertifikat Emas',
    emoji: '🗺️',
    category: 'Outdoor Game',
    duration: '25 menit',
    timing: 'Pagi / Sore',
    participants: 'Tim (5-6 orang/tim)',
    difficulty: 'Seru',
    color: '#8b5cf6',
    description: 'Petualangan mencari "sertifikat properti" tersembunyi di area villa!',
    objective: 'Menemukan semua clue dan sertifikat tersembunyi tercepat.',
    materials: [
      'Sertifikat properti (kertas emas)',
      'Clue cards (10-15 clue)',
      'Peta area villa',
      'Hadiah untuk pemenang'
    ],
    budget: [
      { item: 'Sertifikat Emas (cetak premium)', qty: 8, unit: 'lembar', price: 15000, total: 120000 },
      { item: 'Clue Cards (cetak)', qty: 50, unit: 'lembar', price: 2000, total: 100000 },
      { item: 'Peta Villa (cetak A3)', qty: 8, unit: 'lembar', price: 10000, total: 80000 },
      { item: 'Hadiah Tim Pemenang', qty: 1, unit: 'paket', price: 250000, total: 250000 }
    ],
    totalBudget: 550000,
    rules: [
      'Setiap tim dapat peta dan clue pertama',
      'Clue mengarah ke lokasi clue berikutnya',
      'Clue terakhir mengarah ke "Sertifikat Emas"',
      'Tim pertama menemukan sertifikat = pemenang',
      'Dilarang berlari di area berbahaya'
    ],
    steps: [
      {
        step: 1,
        title: 'Briefing',
        desc: 'Jelaskan aturan, batas area, dan safety. Bagikan peta.',
        duration: '3 menit'
      },
      {
        step: 2,
        title: 'Start!',
        desc: 'Semua tim mulai bersamaan dari titik start.',
        duration: '-'
      },
      {
        step: 3,
        title: 'Cari Clue',
        desc: 'Tim mengikuti petunjuk dari clue ke clue.',
        duration: '15-20 menit'
      },
      {
        step: 4,
        title: 'Finish',
        desc: 'Tim yang menemukan Sertifikat Emas terlebih dahulu menang!',
        duration: '-'
      }
    ],
    clueExamples: [
      '"Tempat air mengalir jernih, di sana clue berikutnya menanti" (Kolam/Air Mancur)',
      '"Berdiri tegak menjulang tinggi, daun hijau melambai pagi" (Pohon besar)',
      '"Tempat berkumpul saat lapar tiba" (Area makan)',
      '"Pintu masuk pertama kali kau datang" (Gerbang/Lobby)'
    ],
    scoring: [
      'Tim pertama menemukan = Juara 1',
      'Tim kedua = Juara 2',
      'Tim ketiga = Juara 3',
      'Bonus: Tim paling kompak (vote peserta)'
    ],
    winner: 'Tim tercepat menemukan Sertifikat Emas',
    tips: [
      'Survey lokasi villa sebelumnya untuk menyusun clue',
      'Siapkan clue cadangan jika ada yang hilang',
      'Pastikan semua area aman untuk peserta'
    ]
  }
];

export const scheduleRecommendation = [
  { time: '08:30 - 08:50', game: 'Speed Networking Challenge', type: 'Ice Breaking', duration: '20 menit' },
  { time: '08:50 - 09:20', game: 'Tebak Harga Properti', type: 'Quiz Seru', duration: '30 menit' },
  { time: '09:20 - 10:00', game: 'Handle Objection Challenge', type: 'Role Play', duration: '40 menit' },
  { time: '10:00 - 10:30', game: 'Berenang & Free Time', type: 'Refreshing', duration: '30 menit' }
];

export const gamesNote = {
  status: 'DRAFT',
  message: 'Fun Games ini masih berupa usulan dan dapat direvisi sesuai keputusan panitia.',
  totalDuration: '2 jam (08:30 - 10:30)',
  day: 'Hari 2 - Jumat, 16 Januari 2026',
  pic: 'Kang Teguh & Agung'
};
