// Mini Game: Tebak Harga Properti
// Data properti untuk quiz game

export const quizData = [
  {
    id: 1,
    image: '🏠',
    type: 'Rumah 2 Lantai',
    location: 'BSD City, Tangerang Selatan',
    specs: 'LT: 120m² | LB: 180m²',
    features: '4 Kamar Tidur, 3 Kamar Mandi, Carport 2 Mobil',
    actualPrice: 2500000000,
    options: [1800000000, 2500000000, 3200000000, 2100000000],
    hint: 'Kawasan premium dengan akses tol'
  },
  {
    id: 2,
    image: '🏢',
    type: 'Apartemen Studio',
    location: 'Menteng, Jakarta Pusat',
    specs: 'LB: 35m² | Lantai 15',
    features: 'Full Furnished, City View, Gym & Pool',
    actualPrice: 850000000,
    options: [650000000, 850000000, 1100000000, 750000000],
    hint: 'Lokasi strategis pusat kota'
  },
  {
    id: 3,
    image: '🏡',
    type: 'Rumah Subsidi',
    location: 'Cileungsi, Bogor',
    specs: 'LT: 60m² | LB: 36m²',
    features: '2 Kamar Tidur, 1 Kamar Mandi, Carport',
    actualPrice: 168000000,
    options: [150000000, 168000000, 200000000, 185000000],
    hint: 'Program pemerintah untuk MBR'
  },
  {
    id: 4,
    image: '🏘️',
    type: 'Townhouse Modern',
    location: 'Kemang, Jakarta Selatan',
    specs: 'LT: 100m² | LB: 200m²', 
    features: '3 Lantai, Private Pool, Smart Home',
    actualPrice: 5500000000,
    options: [4200000000, 5500000000, 6800000000, 4800000000],
    hint: 'Area expatriate favorit'
  },
  {
    id: 5,
    image: '🏬',
    type: 'Ruko 3 Lantai',
    location: 'PIK 2, Jakarta Utara',
    specs: 'LT: 75m² | LB: 225m²',
    features: 'Hadap Jalan Utama, Parkir Luas',
    actualPrice: 3800000000,
    options: [2900000000, 3800000000, 4500000000, 3200000000],
    hint: 'Kawasan bisnis berkembang pesat'
  },
  {
    id: 6,
    image: '🏠',
    type: 'Rumah Cluster',
    location: 'Summarecon Bekasi',
    specs: 'LT: 90m² | LB: 120m²',
    features: '3 Kamar Tidur, 2 Kamar Mandi, Taman',
    actualPrice: 1650000000,
    options: [1200000000, 1650000000, 2100000000, 1400000000],
    hint: 'Dekat stasiun LRT'
  },
  {
    id: 7,
    image: '🏢',
    type: 'Apartemen 2BR',
    location: 'Alam Sutera, Tangerang',
    specs: 'LB: 65m² | Lantai 20',
    features: 'Semi Furnished, Mall Connected',
    actualPrice: 1200000000,
    options: [900000000, 1200000000, 1500000000, 1050000000],
    hint: 'Integrated development'
  },
  {
    id: 8,
    image: '🏡',
    type: 'Villa Puncak',
    location: 'Cisarua, Bogor',
    specs: 'LT: 500m² | LB: 300m²',
    features: '5 Kamar, View Gunung, Kolam Renang',
    actualPrice: 4200000000,
    options: [3000000000, 4200000000, 5500000000, 3600000000],
    hint: 'Cocok untuk investasi villa rental'
  }
];

export const quizConfig = {
  questionsPerGame: 5,
  timePerQuestion: 15, // seconds
  pointsCorrect: 100,
  bonusPerSecond: 10,
  maxBonus: 50
};

export const resultMessages = {
  perfect: {
    title: '🏆 PROPERTY MASTER!',
    message: 'Luar biasa! Kamu sudah siap jadi top marketing!',
    minScore: 450
  },
  great: {
    title: '⭐ EXCELLENT!',
    message: 'Bagus sekali! Market sense kamu tajam!',
    minScore: 350
  },
  good: {
    title: '👍 GOOD JOB!',
    message: 'Lumayan! Terus asah kemampuanmu!',
    minScore: 250
  },
  learning: {
    title: '📚 KEEP LEARNING!',
    message: 'Jangan menyerah! Ikuti bootcamp untuk upgrade skill!',
    minScore: 0
  }
};
