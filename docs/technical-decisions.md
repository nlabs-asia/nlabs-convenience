# Technical Decisions — Family Mart Indonesia Landing Page Redesign

Tanggal: 10 Oktober 2026
Status: Baseline keputusan awal untuk mulai build
Sumber: PRD-Landing-Page-FamilyMart-Indonesia.md + arahan user

---

## 1. Frontend Framework

### Keputusan
Menggunakan Vite React.

### Rationale
- Sesuai arahan user dan PRD awal: React JS + Tailwind CSS.
- Setup ringan, cepat, cocok untuk landing page modern.
- Build output mudah dideploy ke static hosting/CDN.
- Bisa ditambah prerender/SSG untuk kebutuhan SEO tanpa langsung pindah ke Next.js.

### Implementasi awal
- Vite + React + TypeScript.
- React Router untuk route:
  - `/`
  - `/promo`
  - `/promo/:slug`
- Tailwind CSS untuk styling.
- Service layer agar UI tidak terikat langsung ke sumber data.

### Catatan SEO
Karena Vite React default adalah SPA, kebutuhan SEO PRD harus ditangani dengan salah satu opsi berikut:
1. Vite SSG/prerender untuk landing dan promo pages; atau
2. static prerender saat build; atau
3. jika SEO dinamis menjadi sangat penting, evaluasi migrasi ke Next.js.

Default kerja saat ini: tetap Vite React, siapkan struktur agar kompatibel dengan prerender/SSG.

---

## 2. CMS

### Keputusan
Menggunakan Custom CMS.

### Rationale
- Sesuai arahan user.
- Requirement PRD membutuhkan kontrol spesifik: Hero video, menu, best seller, promo, lokasi, FamiGo banner, footer/social, role admin/editor, draft/published, preview, upload media, import/export CSV lokasi, dan audit log.
- Custom CMS memberi fleksibilitas penuh untuk workflow marketing/operasional Family Mart.

### Prinsip arsitektur
Frontend tidak boleh mengakses struktur database/CMS secara langsung. Semua akses data harus lewat API/service layer.

Frontend contract:
- `src/services/contentApi.ts` menjadi facade utama untuk data landing page.
- Komponen UI hanya memanggil hook/service, tidak import mock data atau client CMS secara langsung.
- Adapter awal boleh memakai mock/local JSON sampai API CMS tersedia.

### Modul CMS yang wajib didukung
1. Hero
   - video desktop/mobile WebM + MP4
   - poster desktop/mobile
   - headline, subheadline, CTA labels/targets
   - active status

2. About Us
   - title
   - body rich text
   - images + alt text
   - highlight numbers dari CMS

3. Menu
   - category CRUD
   - menu CRUD
   - image + alt text
   - optional price
   - active/nonactive
   - best seller toggle + display order

4. Promo
   - thumbnail + alt text
   - title
   - slug
   - description
   - start/end date
   - draft/published
   - order

5. Lokasi
   - branch CRUD
   - CSV import/export
   - coordinate validation
   - city/province filter fields
   - active/nonactive

6. FamiGo Banner
   - desktop/mobile image
   - headline
   - description
   - App Store URL
   - Google Play URL
   - optional QR image
   - active/nonactive

7. Footer & Social Media
   - contact info
   - quick links
   - social links
   - legal links

8. Admin Platform
   - authentication
   - roles: Admin, Editor
   - draft/publish
   - preview
   - media validation/compression
   - audit log: who changed what and when

### API style
Default rekomendasi: REST API.

Reason:
- Lebih sederhana untuk custom CMS MVP.
- Mudah dipakai frontend dan diuji.
- Cocok untuk landing page dengan query relatif sederhana.

Endpoint draft awal:
- `GET /api/public/landing`
- `GET /api/public/menu`
- `GET /api/public/promos`
- `GET /api/public/promos/:slug`
- `GET /api/public/branches`
- `GET /api/public/footer`

Admin endpoints disiapkan terpisah di fase CMS build.

---

## 3. Map Provider

### Keputusan
Mulai dengan pendekatan free-first.

Arahan user: gunakan Google Maps, tetapi jika berbayar cari yang free.

### Evaluasi
Google Maps JavaScript API biasanya membutuhkan API key dan billing. Walaupun ada free monthly credit/kuota tertentu, tetap mengharuskan billing setup dan berisiko biaya jika traffic naik.

Karena requirement user mengutamakan opsi free jika Google Maps berbayar, default implementasi frontend akan menggunakan:

- Leaflet + OpenStreetMap tiles untuk peta interaktif.
- Marker clustering untuk performa 1.000+ pin.
- Link tombol “Buka di Google Maps” tetap menggunakan Google Maps URL dari koordinat/place URL.

### Rationale
- Tidak membutuhkan billing Google Maps untuk render peta.
- Cocok untuk landing page publik dengan potensi traffic tinggi.
- Marker clustering matang dan ringan.
- Tetap memenuhi kebutuhan user membuka lokasi di Google Maps.

### Implementasi awal
Dependencies yang direncanakan:
- `leaflet`
- `react-leaflet`
- library clustering yang kompatibel, misalnya `react-leaflet-cluster` atau alternatif yang stabil saat implementasi.

Komponen:
- `src/components/sections/MapView.tsx`
- lazy-loaded agar bundle peta tidak masuk initial load.

### Catatan risiko OSM tile usage
OpenStreetMap public tile server punya kebijakan pemakaian. Untuk production traffic tinggi, perlu pertimbangkan tile provider gratis/low-cost yang sesuai terms, atau self-host/cache tile jika traffic besar.

Default fase awal: Leaflet + OSM untuk development/MVP, lalu validasi traffic dan terms sebelum rilis production.

---

## 4. Keputusan Detail Menu

### Keputusan awal
Detail menu menggunakan modal di landing page.

### Rationale
- Lebih cepat untuk MVP.
- Tidak menambah kompleksitas route SEO untuk menu.
- PRD memperbolehkan modal atau halaman detail.

Jika stakeholder kemudian membutuhkan SEO untuk setiap menu item, bisa ditambahkan route `/menu/:slug`.

---

## 5. Batas Landing Page

### Best Seller
Default maksimal 6 item di landing page.

### Promo
Default maksimal 6 kartu di landing page, sisanya di `/promo`.

### Menu page landing
Default load awal 8–12 item, lalu “Muat Lebih Banyak”.

---

## 6. Keamanan dan Privasi

- Konten rich text dari CMS wajib disanitasi sebelum render.
- API public hanya mengembalikan konten published/active.
- Data lokasi pengguna hanya dipakai di browser untuk menghitung jarak, tidak dikirim/disimpan ke server.
- Analytics tidak boleh mengirim koordinat mentah pengguna.
- API/admin CMS wajib pakai HTTPS di production.

---

## 7. Status Keputusan

| Area | Keputusan | Status |
|---|---|---|
| Frontend | Vite React + TypeScript + Tailwind CSS | Locked |
| Routing | React Router | Baseline |
| CMS | Custom CMS | Locked |
| Public API | REST API | Baseline |
| Map render | Leaflet + OpenStreetMap | Baseline karena Google Maps berbayar/billing |
| Google Maps | Hanya untuk outbound “Buka di Google Maps” link | Baseline |
| Detail menu | Modal | Baseline |
| Best Seller limit | 6 | Baseline |
| Promo landing limit | 6 | Baseline |
| SEO strategy | Vite + prerender/SSG-ready | Baseline |

---

## 8. Dampak ke task berikutnya

Task berikutnya harus mengikuti keputusan ini:

1. Scaffold project sebagai Vite React TypeScript.
2. Tailwind config harus memuat design token Family Mart.
3. Data layer wajib dibuat sejak awal agar siap custom CMS.
4. Map component dibuat lazy-loaded dan menggunakan Leaflet/OSM, bukan Google Maps JS API.
5. Tombol lokasi tetap membuat URL Google Maps dari koordinat atau memakai URL yang disediakan CMS.
6. CMS schema/API contract disusun untuk custom CMS, bukan Strapi/Directus/Sanity.
