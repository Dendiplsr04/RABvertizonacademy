# 🚀 Deployment Guide - Vercel

## Prerequisites

- Akun Vercel (gratis): https://vercel.com
- Git repository (GitHub, GitLab, atau Bitbucket)
- Project sudah di-push ke repository

## 📦 Persiapan Deployment

### 1. Pastikan Build Berhasil

```bash
npm run build
```

Jika berhasil, folder `dist/` akan terisi dengan file production.

### 2. Test Production Build Locally

```bash
npm run preview
```

Buka `http://localhost:4173` untuk test build production.

## 🌐 Deploy ke Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Login ke Vercel**
   - Buka https://vercel.com
   - Login dengan GitHub/GitLab/Bitbucket

2. **Import Project**
   - Klik "Add New..." → "Project"
   - Pilih repository Anda
   - Klik "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `vite-three-js` (jika project di subfolder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**
   - Klik "Deploy"
   - Tunggu 1-2 menit
   - Project akan live di `https://your-project.vercel.app`

### Method 2: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd vite-three-js
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy? **Y**
   - Which scope? (pilih account Anda)
   - Link to existing project? **N**
   - Project name? (enter atau custom name)
   - Directory? `./`
   - Override settings? **N**

5. **Production Deploy**
   ```bash
   vercel --prod
   ```

## ⚙️ Environment Variables (Optional)

Jika nanti butuh environment variables:

1. Di Vercel Dashboard → Project Settings → Environment Variables
2. Add variable:
   - Name: `VITE_API_URL`
   - Value: `https://api.example.com`
   - Environment: Production

3. Rebuild project untuk apply changes

## 🔄 Auto Deploy

Setelah setup awal, setiap push ke branch `main` akan otomatis deploy:

```bash
git add .
git commit -m "Update: fitur baru"
git push origin main
```

Vercel akan otomatis:
1. Detect push
2. Run build
3. Deploy ke production
4. Update URL

## 🌍 Custom Domain (Optional)

1. **Di Vercel Dashboard**
   - Project Settings → Domains
   - Add Domain
   - Masukkan domain Anda (contoh: `report.vertizon.com`)

2. **Update DNS**
   - Di domain provider Anda
   - Add CNAME record:
     - Name: `report` (atau `@` untuk root)
     - Value: `cname.vercel-dns.com`

3. **Verify**
   - Kembali ke Vercel
   - Klik "Verify"
   - Domain akan aktif dalam 24-48 jam

## 📊 Monitoring

### Vercel Analytics (Free)

1. Project Settings → Analytics
2. Enable Analytics
3. Lihat:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Check Deployment Status

```bash
vercel ls
```

### View Logs

```bash
vercel logs [deployment-url]
```

## 🐛 Troubleshooting

### Build Failed

**Error: "Module not found"**
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error: "Out of memory"**
- Vercel free tier: 1GB RAM
- Optimize build di `vite.config.js`

### 404 on Refresh

Vercel sudah handle SPA routing otomatis untuk Vite.
Jika masih 404, tambahkan `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Slow Loading

1. **Enable Compression**
   - Vercel otomatis enable gzip/brotli

2. **Optimize Assets**
   ```bash
   # Compress images
   npm install -D vite-plugin-imagemin
   ```

3. **Code Splitting**
   - Three.js sudah di-split otomatis
   - Check `dist/assets/` untuk chunks

## 📱 Preview Deployments

Setiap push ke branch selain `main` akan create preview:

```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
```

Vercel akan deploy ke URL preview:
`https://your-project-git-feature-new-feature.vercel.app`

## 🔒 Security Headers

Vercel otomatis add security headers:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

Untuk custom headers, edit `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Custom-Header",
          "value": "my-value"
        }
      ]
    }
  ]
}
```

## 💰 Pricing

**Free Tier** (Hobby):
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments
- ✅ Analytics

**Pro** ($20/month):
- Everything in Free
- 1TB bandwidth
- Team collaboration
- Password protection
- Advanced analytics

## 📞 Support

- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Status: https://vercel-status.com

## ✅ Post-Deployment Checklist

- [ ] Test all features di production URL
- [ ] Test di mobile devices
- [ ] Test WhatsApp integration
- [ ] Test export/import data
- [ ] Check console untuk errors
- [ ] Test form submission
- [ ] Verify 3D scene rendering
- [ ] Check loading performance
- [ ] Test filters & search
- [ ] Share URL dengan team

## 🎯 Production URL

Setelah deploy, URL Anda akan seperti:

```
https://daily-report-vertizon.vercel.app
```

atau dengan custom domain:

```
https://report.vertizon.com
```

## 📝 Update Deployment

Untuk update aplikasi:

```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Build & test
npm run build
npm run preview

# 4. Commit & push
git add .
git commit -m "Update: deskripsi perubahan"
git push origin main

# 5. Vercel auto-deploy!
```

---

**Selamat! Aplikasi Anda sudah live! 🎉**

Share URL ke team dan mulai gunakan Daily Report Marketing Vertizon!
