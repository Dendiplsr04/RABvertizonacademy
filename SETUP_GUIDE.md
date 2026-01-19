# 🏢 Villa Gesture Control - Setup & Troubleshooting Guide

## ✅ Checklist Sebelum Mulai

- [ ] Browser modern (Chrome 90+, Firefox 88+, Safari 14+)
- [ ] Webcam/Camera yang berfungsi
- [ ] Koneksi internet stabil (untuk load MediaPipe dari CDN)
- [ ] Izin camera di browser sudah diberikan
- [ ] Pencahayaan yang cukup di ruangan

## 🚀 Cara Menjalankan

### Development Mode
```bash
npm run dev
```
Akses di `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 🎮 Cara Menggunakan

1. **Buka aplikasi** - Tunggu sampai loading selesai
2. **Izinkan camera** - Klik "Allow" saat browser minta izin
3. **Posisikan tangan** - Letakkan tangan di depan kamera
4. **Tunggu deteksi** - Status akan berubah dari "Waiting for hand..." menjadi "Hand detected"
5. **Gunakan gesture:**
   - **Buka tangan (jari terbuka)** → Villa pecah jadi particle
   - **Kepal tangan (jari tertutup)** → Villa kembali terbentuk
   - **Gerakkan tangan** → Putar villa
   - **Pinch (jari rapat)** → Zoom in/out

## 🔧 Troubleshooting

### ❌ "Waiting for hand..." tidak berubah

**Penyebab:** Camera tidak terdeteksi atau MediaPipe belum load

**Solusi:**
1. Buka browser console (F12)
2. Lihat error message di console
3. Cek apakah ada pesan "Camera access denied"
4. Pastikan camera sudah diizinkan di browser settings

### ❌ "Camera permission denied"

**Penyebab:** Browser belum diberi izin akses camera

**Solusi Chrome/Edge:**
1. Klik icon lock di address bar
2. Cari "Camera" 
3. Ubah dari "Block" menjadi "Allow"
4. Refresh halaman

**Solusi Firefox:**
1. Klik icon lock di address bar
2. Klik "Permissions"
3. Izinkan "Use the Camera"
4. Refresh halaman

**Solusi Safari:**
1. Preferences → Security
2. Cari "Camera"
3. Ubah menjadi "Allow"

### ❌ "No camera found"

**Penyebab:** Device tidak memiliki camera atau camera tidak terdeteksi

**Solusi:**
1. Pastikan camera terhubung dengan baik
2. Cek di device settings apakah camera terdeteksi
3. Restart browser
4. Coba browser lain

### ❌ "Camera is already in use"

**Penyebab:** Camera sedang digunakan aplikasi lain

**Solusi:**
1. Tutup aplikasi lain yang menggunakan camera (Zoom, Teams, OBS, dll)
2. Refresh halaman
3. Restart browser

### ❌ Villa tidak terlihat / hanya background gelap

**Penyebab:** 3D rendering issue atau villa di luar view

**Solusi:**
1. Klik tombol "Reset View"
2. Tunggu beberapa detik
3. Jika masih tidak muncul, buka console dan lihat error
4. Coba browser lain

### ❌ Hand detection lambat atau tidak responsif

**Penyebab:** 
- Pencahayaan kurang
- Tangan terlalu jauh dari camera
- Browser performance rendah

**Solusi:**
1. Tingkatkan pencahayaan di ruangan
2. Posisikan tangan lebih dekat ke camera (30-60cm)
3. Pastikan tangan terlihat jelas di camera
4. Tutup tab/aplikasi lain untuk hemat resource
5. Coba browser lain

### ❌ MediaPipe tidak load dari CDN

**Penyebab:** Koneksi internet lambat atau CDN down

**Solusi:**
1. Cek koneksi internet
2. Tunggu lebih lama (bisa sampai 10 detik)
3. Refresh halaman
4. Coba di waktu lain jika CDN sedang down

### ❌ Gesture tidak terdeteksi dengan baik

**Penyebab:** 
- Gesture tidak cukup jelas
- Pencahayaan kurang
- Tangan di luar frame

**Solusi:**
1. Buat gesture lebih jelas dan lambat
2. Pastikan seluruh tangan terlihat di camera
3. Tingkatkan pencahayaan
4. Jangan terlalu cepat mengubah gesture

## 📱 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ | Recommended |
| Edge | ✅ | Recommended |
| Firefox | ✅ | Good |
| Safari | ✅ | Good |
| Opera | ✅ | Good |
| Mobile Chrome | ⚠️ | Limited (camera access varies) |
| Mobile Safari | ⚠️ | Limited (iOS restrictions) |

## 🌐 HTTPS Requirement

Untuk production/deployment, **HTTPS wajib** karena:
- Browser memerlukan HTTPS untuk akses camera
- MediaPipe memerlukan secure context

Localhost (http://localhost:5173) adalah exception dan bisa tanpa HTTPS.

## 🔍 Debug Mode

Buka browser console (F12) untuk melihat:
- Loading status MediaPipe
- Camera initialization
- Hand detection results
- Error messages

Contoh output yang baik:
```
✓ Three.js setup complete
✓ Villa model created
✓ Particle system created
✓ UI Manager initialized
Loading MediaPipe from CDN...
MediaPipe script loaded, initializing...
Initializing HandLandmarker...
HandLandmarker initialized successfully
Requesting camera access...
Camera stream obtained
Video metadata loaded, starting playback
Video playback started
```

## 💡 Tips untuk Hasil Terbaik

1. **Pencahayaan:** Gunakan pencahayaan depan yang cukup
2. **Background:** Gunakan background yang kontras dengan tangan
3. **Jarak:** Posisikan tangan 30-60cm dari camera
4. **Gesture:** Buat gesture yang jelas dan tidak terlalu cepat
5. **Stabilitas:** Gunakan tripod atau stabilizer untuk camera
6. **Performance:** Tutup aplikasi berat lainnya

## 🆘 Masih Tidak Bisa?

1. Buka console (F12) dan copy semua error message
2. Cek di browser console apakah ada error
3. Coba di browser lain
4. Coba di device lain
5. Pastikan semua requirement sudah terpenuhi

## 📞 Support

Jika masih ada masalah:
1. Check console untuk error message
2. Lihat troubleshooting guide di atas
3. Coba solusi yang sesuai dengan error Anda
4. Jika masih tidak bisa, dokumentasikan error dan coba lagi nanti

---

**Happy Hand Gesture Controlling! 🎉**
