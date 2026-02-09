# Daily Report Marketing Vertizon

Sistem Laporan Harian Marketing dengan Visualisasi 3D Elegant

## 🎯 Fitur Utama

- **Form Input Laporan** - Interface yang mudah untuk input laporan harian
- **3 Kategori Aktivitas**:
  - 🎯 Canvasing - Kunjungan lapangan dan prospek
  - 📹 Live - Siaran langsung di berbagai platform
  - ✨ Konten - Pembuatan konten marketing
- **Visualisasi 3D** - Dashboard dengan tampilan 3D yang elegant
- **Filter & Search** - Filter berdasarkan tanggal, kategori, dan marketing
- **WhatsApp Integration** - Kirim laporan langsung ke WhatsApp
- **Export/Import** - Backup dan restore data dalam format JSON
- **LocalStorage** - Data tersimpan di browser, tidak perlu backend
- **Mobile Responsive** - Tampilan optimal di semua device

## 🎨 Tema Warna

- **Primary**: Hijau Lumut (#556B2F)
- **Accent**: Yellow Green (#9ACD32)
- **Secondary**: Dark Sea Green (#8FBC8F)

## 🚀 Cara Menjalankan

### Development

```bash
npm install
npm run dev
```

Buka browser di `http://localhost:5173`

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 Cara Penggunaan

### Untuk Marketing

1. Klik tombol **+** (Floating Action Button)
2. Isi form laporan:
   - Nama marketing
   - Tanggal
   - Pilih kategori (Canvasing/Live/Konten)
   - Isi detail sesuai kategori
   - Tambahkan catatan (opsional)
3. Klik **Simpan Laporan**
4. Klik kartu laporan untuk melihat detail
5. Klik **Kirim ke WhatsApp** untuk share ke grup

### Untuk Manager/Atasan

1. Lihat dashboard dengan statistik real-time
2. Filter laporan berdasarkan:
   - Tanggal (Hari ini, Kemarin, Minggu ini, Bulan ini)
   - Kategori aktivitas
   - Nama marketing
3. Klik kartu laporan untuk detail lengkap
4. Export data untuk analisis lebih lanjut

## 💾 Data Storage

Data disimpan di **localStorage** browser. Untuk backup:

1. Klik tombol **Export** (📥) di header
2. File JSON akan terdownload otomatis
3. Simpan file untuk backup

Untuk restore:
- Import file JSON melalui fitur import (akan ditambahkan)

## 🔧 Teknologi

- **Vite** - Build tool
- **Three.js** - 3D visualization
- **Vanilla JavaScript** - No framework overhead
- **CSS3** - Modern styling dengan custom properties
- **LocalStorage API** - Data persistence

## 📊 Struktur Data

```javascript
{
  id: "unique-id",
  name: "Nama Marketing",
  date: "2026-02-09",
  category: "canvasing|live|konten",
  
  // Canvasing specific
  prospek: 5,
  lokasi: "Jakarta Selatan",
  
  // Live specific
  durasi: 120,
  platform: "Instagram",
  viewers: 1500,
  
  // Konten specific
  jumlahKonten: 3,
  jenisKonten: ["foto", "video"],
  
  hasil: "Deskripsi hasil",
  notes: "Catatan tambahan",
  createdAt: "2026-02-09T10:00:00.000Z"
}
```

## 🎯 Roadmap

- [ ] Import JSON data
- [ ] Export to Excel
- [ ] Print report
- [ ] Advanced statistics & charts
- [ ] Google Sheets integration
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Notification system
- [ ] Team collaboration features

## 📄 License

MIT License

## 👨‍💻 Developer

Developed with ❤️ for Vertizon Marketing Team
