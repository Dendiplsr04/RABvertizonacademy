# Panduan Penggunaan Daily Report Marketing Vertizon

## 🚀 Quick Start

1. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`

2. **Load Dummy Data (Untuk Testing)**
   - Buka browser console (F12)
   - Ketik: 
   ```javascript
   // Import dummy data generator
   import { loadDummyData } from './src/js/dummyData.js';
   
   // Load 15 dummy reports
   loadDummyData();
   
   // Refresh halaman
   location.reload();
   ```

## 📱 Fitur-Fitur Utama

### 1. Dashboard
- **Statistik Real-time**: Lihat jumlah laporan per kategori
- **3D Visualization**: Tiga pilar 3D yang merepresentasikan kategori
- **Filter**: Filter berdasarkan tanggal, kategori, dan marketing

### 2. Tambah Laporan
- Klik tombol **+** (FAB di kanan bawah)
- Isi form 2 langkah:
  - **Step 1**: Info dasar (nama, tanggal, kategori)
  - **Step 2**: Detail aktivitas sesuai kategori

### 3. Detail Laporan
- Klik kartu laporan untuk melihat detail lengkap
- Tombol **Kirim ke WhatsApp**: Generate message dan buka WhatsApp
- Tombol **Hapus**: Hapus laporan (dengan konfirmasi)

### 4. Export Data
- Klik tombol **📥** di header
- File JSON akan terdownload
- Simpan untuk backup

## 🎯 Kategori Aktivitas

### 🎯 Canvasing
**Field yang perlu diisi:**
- Jumlah Prospek
- Lokasi Canvasing
- Hasil/Achievement

**Contoh:**
- Prospek: 5
- Lokasi: Jakarta Selatan
- Hasil: Berhasil mendapat 5 prospek dengan potensi closing tinggi

### 📹 Live
**Field yang perlu diisi:**
- Durasi Live (menit)
- Platform (Instagram, TikTok, Facebook, dll)
- Jumlah Viewers
- Hasil/Achievement

**Contoh:**
- Durasi: 120 menit
- Platform: Instagram
- Viewers: 1500
- Hasil: Engagement rate tinggi, banyak pertanyaan produk

### ✨ Konten
**Field yang perlu diisi:**
- Jumlah Konten
- Jenis Konten (Foto, Video, Reels, Story)
- Hasil/Achievement

**Contoh:**
- Jumlah: 5
- Jenis: Foto, Video, Reels
- Hasil: Konten berkualitas tinggi siap publish

## 📊 Filter & Search

### Filter Tanggal
- **Hari Ini**: Laporan hari ini saja
- **Kemarin**: Laporan kemarin
- **Minggu Ini**: 7 hari terakhir
- **Bulan Ini**: 30 hari terakhir
- **Semua**: Semua laporan

### Filter Kategori
- Semua Kategori
- Canvasing
- Live
- Konten

### Filter Marketing
- Semua Marketing
- [Nama-nama marketing yang ada]

## 💬 WhatsApp Integration

Format pesan yang digenerate:

```
📊 *LAPORAN HARIAN MARKETING VERTIZON*

🎯 *CANVASING*
━━━━━━━━━━━━━━━━━━━━

👤 *Nama:* Budi Santoso
📅 *Tanggal:* Senin, 9 Februari 2026

🎯 *Jumlah Prospek:* 5
📍 *Lokasi:* Jakarta Selatan
✅ *Hasil:* Berhasil mendapat 5 prospek baru

📌 *Catatan:*
Target tercapai dengan baik

━━━━━━━━━━━━━━━━━━━━
_Dikirim dari Daily Report Marketing Vertizon_
```

## 🎨 Tema & Warna

### Warna Kategori
- **Canvasing**: Biru Royal (#4169E1)
- **Live**: Merah Crimson (#DC143C)
- **Konten**: Hijau Lime (#32CD32)

### Warna Utama
- **Primary**: Hijau Lumut (#556B2F)
- **Accent**: Yellow Green (#9ACD32)
- **Background**: Dark (#0F1419)

## 📱 Mobile Responsive

Aplikasi fully responsive dengan:
- Bottom navigation untuk mobile
- Touch-friendly buttons
- Optimized layout untuk layar kecil
- Smooth animations

## 🔧 Tips & Tricks

### 1. Backup Data Rutin
Export data setiap akhir minggu untuk backup

### 2. Clear Data
Untuk reset semua data (testing):
```javascript
localStorage.removeItem('vertizon_daily_reports');
location.reload();
```

### 3. Inspect Data
Lihat semua data di localStorage:
```javascript
JSON.parse(localStorage.getItem('vertizon_daily_reports'));
```

### 4. Keyboard Shortcuts
- **ESC**: Tutup modal
- **Enter**: Submit form (saat di input terakhir)

## ⚠️ Troubleshooting

### Data Hilang
- Data tersimpan di localStorage browser
- Jangan clear browser data/cache
- Selalu export untuk backup

### Laporan Tidak Muncul
- Cek filter tanggal (mungkin filter ke tanggal lain)
- Refresh halaman (F5)
- Cek console untuk error (F12)

### WhatsApp Tidak Terbuka
- Pastikan WhatsApp terinstall
- Atau gunakan WhatsApp Web
- Cek popup blocker browser

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Cek console browser (F12) untuk error
2. Screenshot error dan kirim ke developer
3. Export data sebelum troubleshooting

## 🎯 Best Practices

1. **Input Laporan Setiap Hari**: Jangan tunda input laporan
2. **Detail yang Jelas**: Isi hasil/achievement dengan detail
3. **Backup Rutin**: Export data minimal seminggu sekali
4. **Konsisten**: Gunakan format yang sama untuk lokasi, platform, dll
5. **Catatan Penting**: Gunakan field notes untuk info tambahan

---

**Selamat menggunakan Daily Report Marketing Vertizon!** 🚀
