# Content & Asset Checklist — Family Mart Indonesia Landing Page Redesign

Tanggal: 10 Oktober 2026
Status: Working checklist sebelum build visual dan integrasi CMS
Sumber: PRD-Landing-Page-FamilyMart-Indonesia.md

---

## Status Legend

| Status | Arti |
|---|---|
| Missing | Belum tersedia / belum diberikan |
| Placeholder OK | Boleh pakai sementara untuk development, tidak untuk rilis |
| Ready | Sudah tersedia dan boleh dipakai |
| Needs Validation | Ada data/aset, tapi perlu validasi brand/legal/stakeholder |

---

## 1. Brand Foundation

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Logo Family Mart Indonesia | SVG/PNG transparan, versi light/dark bila ada | Needs Validation | Sudah ada `logo family mart.png` di root proyek (10 Okt 2026). Perlu diverifikasi: transparansi, resolusi, versi light/dark untuk Navbar & Footer |
| Brand guideline | Warna resmi, typography, spacing, penggunaan logo | Missing | Wajib agar desain tidak generik/template |
| Color palette resmi | Hijau, biru, putih, neutral, accent | Needs Validation | Bisa mulai dengan approximation, final harus validasi brand |
| Font brand | Font utama dan fallback web-safe | Missing | Jika tidak ada, pilih font modern dengan lisensi aman |
| Ikon sosial media | Instagram/dll sesuai footer | Placeholder OK | Bisa pakai icon library, link final dari CMS |
| Legal/brand usage guideline | Aturan penggunaan asset Family Mart pusat/Jepang jika ada | Missing | Perlu sebelum rilis publik |

---

## 2. Hero Header / Video

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Hero video desktop WebM | 8–15 detik, tanpa audio, target <= 4 MB | Missing | Harus footage nyata, bukan AI/generic stock |
| Hero video desktop MP4 | H.264 fallback, target <= 4 MB | Missing | Untuk kompatibilitas Safari/browser umum |
| Hero video mobile WebM | Rasio lebih portrait/ringan, target <= 2 MB | Missing | Digunakan via source media |
| Hero video mobile MP4 | Mobile fallback, target <= 2 MB | Missing | Penting untuk iOS Safari |
| Poster desktop | Image fallback prioritas tinggi | Needs Validation | Kini foto asli gerai **FamilyMart terbesar di dunia** (Udenna Tower, BGC, Manila; sumber udenna.ph, kredit FamilyMart PH) — `public/assets/hero/store-terbesar-bgc.jpg` (1600×1200, ±283KB). Lisensi belum diverifikasi — wajib izin brand sebelum rilis |
| Poster mobile | Image fallback mobile | Needs Validation | Memakai foto yang sama (crop otomatis via object-cover); versi crop portrait khusus disarankan saat aset final |
| Headline final | Copy brand final | Missing | Placeholder boleh untuk dev |
| Subheadline final | Copy brand final | Missing | Jangan mengarang untuk rilis |
| CTA primary label/target | Contoh: “Lihat Menu” -> `#menu` | Placeholder OK | Bisa dipakai default sesuai PRD |
| CTA secondary label/target | Contoh: “Cari Gerai Terdekat” -> `#lokasi` | Placeholder OK | Bisa dipakai default sesuai PRD |

### Notes
- Wajib menghormati `prefers-reduced-motion` dan `saveData`.
- Video tidak boleh menghambat LCP; poster harus dimuat lebih dulu.

---

## 3. About Us

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Judul section final | Copy brand | Missing | Misalnya “Tentang FamilyMart” perlu validasi |
| Narasi brand/sejarah | Beberapa paragraf resmi | Missing | PRD menegaskan jangan memakai teks karangan |
| Foto pendukung 1 | Foto gerai/produk/staff asli | Missing | Harus punya hak pakai |
| Alt text foto 1 | Deskripsi aksesibilitas | Missing | Dikelola dari CMS |
| Foto pendukung 2 | Opsional | Missing | Untuk layout desktop lebih kaya |
| Alt text foto 2 | Opsional | Missing | Dikelola dari CMS |
| Highlight angka | Jumlah gerai/tahun hadir/dll | Missing | Perlu data resmi dan validasi brand |

---

## 4. Menu

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Daftar kategori menu | Makanan, Minuman, Snack, dll | Missing | Dikelola dari CMS custom |
| Data menu awal | Nama, slug, kategori, deskripsi, harga opsional, status aktif | Missing | Diperlukan untuk grid dan detail modal |
| Foto menu | WebP/AVIF/JPG optimized | Missing | Harus foto produk nyata |
| Alt text menu | Per item | Missing | Wajib untuk aksesibilitas |
| Harga menu | Opsional, perlu keputusan stakeholder | Missing | Open decision: harga tampil atau tidak |
| Status availability | active/nonactive | Missing | Nonaktif tidak tampil |
| Data best seller | Toggle + order | Missing | Menggunakan item menu yang sama |

### Development fallback
- Bisa mulai dengan mock menu lokal untuk membangun UI/filter/search.
- Mock harus jelas berstatus development only.

---

## 5. Best Seller

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| List item best seller | Maksimal default 6 | Missing | Diambil dari MenuItem, bukan data duplikat |
| Best seller order | Angka urutan manual | Missing | Untuk sorting tampilan |
| Badge/copy label | “Best Seller” | Placeholder OK | Bisa langsung digunakan |

---

## 6. Promo

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Data promo awal | slug, title, description, period, status, order | Missing | Dibutuhkan untuk landing, `/promo`, `/promo/:slug` |
| Thumbnail promo | Rasio 16:9, JPG/PNG/WebP, max 2 MB | Missing | Perlu upload CMS |
| Alt text thumbnail | Per promo | Missing | Wajib aksesibilitas |
| Periode promo | Start/end date opsional | Missing | Expired otomatis tidak tampil |
| Status promo | draft/published | Missing | Public hanya published |
| Copy CTA | “Lihat Selengkapnya”, “Lihat Semua Promo” | Placeholder OK | Bisa dipakai sesuai PRD |

---

## 7. Lokasi / Branch Finder

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Data cabang awal | id, name, address, city, province, lat, lng, status | Missing | Wajib untuk peta dan list |
| Koordinat cabang | latitude/longitude valid | Missing | Perlu validasi akurasi |
| Jam operasional | Opsional per cabang | Missing | Ditampilkan di popup/list jika ada |
| Nomor telepon cabang | Opsional | Missing | Ditampilkan jika ada |
| Google Maps URL | Opsional | Missing | Jika kosong, dibuat dari koordinat |
| CSV import format | Template CSV untuk CMS custom | Missing | Perlu dibuat saat desain CMS/API |
| Fallback kota/provinsi | Data city/province clean | Missing | Dibutuhkan jika geolocation ditolak |

### Map decision
- Render peta: Leaflet + OpenStreetMap karena Google Maps JS API cenderung membutuhkan billing.
- Tombol external: tetap buka Google Maps URL.

---

## 8. Banner Promo FamiGo

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Image desktop | Banner lebar penuh | Missing | Dikelola CMS |
| Image mobile | Crop mobile khusus | Missing | Jangan hanya scale desktop jika teks jadi kecil |
| Image alt text | Deskripsi aksesibilitas | Missing | Dikelola CMS |
| Headline final | Copy brand/FamiGo | Missing | Placeholder boleh untuk dev |
| Description final | Copy singkat | Missing | Placeholder boleh untuk dev |
| App Store URL | Link resmi | Missing | Wajib sebelum rilis |
| Google Play URL | Link resmi | Missing | Wajib sebelum rilis |
| Official App Store badge | Badge resmi Apple | Missing | Harus mengikuti guideline Apple |
| Official Google Play badge | Badge resmi Google | Missing | Harus mengikuti guideline Google |
| QR code | Opsional desktop | Missing | Jika disediakan dari CMS |
| Active flag | true/false | Missing | Untuk hide/show banner |

---

## 9. Footer

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Logo footer | Bisa sama dengan logo utama | Missing | Perlu versi yang cocok dengan background footer |
| Deskripsi singkat | Copy brand | Missing | Dikelola CMS |
| Quick links | Anchor dan page links | Placeholder OK | About, Menu, Promo, Lokasi, FamiGo |
| Alamat kantor | Kontak resmi | Missing | Perlu validasi stakeholder |
| Email/customer care | Kontak resmi | Missing | Perlu validasi stakeholder |
| Telepon/customer care | Kontak resmi | Missing | Perlu validasi stakeholder |
| Social media links | Instagram/dll | Missing | Dikelola CMS |
| Privacy policy URL | Link legal | Missing | Wajib sebelum rilis |
| Terms URL | Link legal | Missing | Wajib sebelum rilis |
| Copyright text | Tahun otomatis | Placeholder OK | Bisa generate otomatis |

---

## 10. CMS Custom Requirements

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Admin authentication | Login admin/editor | Missing | Bagian CMS build |
| Roles | Admin, Editor | Missing | Admin full, Editor content |
| Draft/published workflow | Promo/menu/hero/etc | Missing | Dibutuhkan sebelum public API final |
| Preview mode | Preview sebelum publish | Missing | Bisa fase 2 jika MVP sempit |
| Media upload | Image/video upload | Missing | Validasi type/size wajib |
| Image optimization | Compress/resize otomatis | Missing | Bisa backend job/service |
| CSV import/export branch | Lokasi massal | Missing | Penting untuk data cabang banyak |
| Coordinate validation | Branch lat/lng | Missing | Prevent pin salah lokasi |
| Audit log | who/what/when | Missing | PRD meminta log perubahan |
| Public REST API | Landing/menu/promo/branches/footer | Missing | Frontend integration target |

---

## 11. Analytics Events

| Event | Trigger | Status | Catatan |
|---|---|---|---|
| `hero_cta_click` | CTA hero | Missing | Track label/target |
| `menu_card_click` | Klik menu card | Missing | Track menu slug/category |
| `promo_see_more_click` | Klik promo detail | Missing | Track promo slug |
| `promo_list_click` | Klik lihat semua promo | Missing | Track source section |
| `location_pin_click` | Klik pin peta | Missing | Track branch id/city, bukan user coordinate |
| `open_google_maps_click` | Klik Google Maps | Missing | Track branch id/city |
| `geolocation_permission_result` | Granted/denied/error | Missing | Jangan kirim koordinat mentah |
| `famigo_download_click` | App Store/Google Play | Missing | Track store type |

---

## 12. SEO & Legal Content

| Item | Kebutuhan | Status | Catatan |
|---|---|---|---|
| Meta title landing | SEO title | Missing | Perlu copy final |
| Meta description landing | SEO description | Missing | Perlu copy final |
| Open Graph image | Share preview image | Missing | Perlu asset brand |
| Promo page metadata | Per promo | Missing | Bisa generate dari title/thumbnail |
| Organization structured data | Brand data resmi | Missing | Perlu alamat/logo/legal name |
| LocalBusiness structured data | Cabang jika memungkinkan | Missing | Perlu data cabang stabil |
| Sitemap | URLs landing dan promo | Missing | Dibuat saat route final |
| robots.txt | Crawling policy | Missing | Dibuat sebelum deploy |
| Privacy policy | Link/halaman legal | Missing | Wajib jika analytics/geolocation disclosure |
| Terms & conditions | Link/halaman legal | Missing | Wajib footer |

---

## 13. Development Placeholder Policy

> **Update 10 Okt 2026:** aset development sekarang memakai **SVG bergaya brand** (awning stripe, palet hijau-biru, ikon per kategori) yang di-generate `scripts/generate-placeholder-assets.mjs` (`npm run assets:generate`, 25 file di `public/assets/`). Copywriting development juga sudah terisi penuh di `src/services/mockData.ts`. Semua tetap berstatus **Placeholder OK (dev)** — bukan pengganti aset rilis di bawah.

Boleh memakai placeholder untuk development:
- Mock menu/promo/branch JSON.
- Placeholder logo sementara yang jelas bukan final.
- Placeholder copy untuk layout.
- Placeholder image bebas lisensi untuk development internal.

Tidak boleh untuk rilis:
- Gambar/video AI generik yang merepresentasikan produk/gerai Family Mart.
- Angka klaim brand yang belum divalidasi.
- Kontak/legal link dummy.
- Data cabang tanpa validasi koordinat.
- App Store/Google Play link dummy.

---

## 14. Immediate Next Inputs Needed

Prioritas data/aset yang paling cepat membuka jalur build:

1. Logo Family Mart Indonesia.
2. Brand colors atau brand guideline.
3. Minimal 6–12 sample menu items + kategori + foto/placeholder legal.
4. Minimal 3–6 sample promo items + thumbnail.
5. Minimal 10 sample branch records dengan koordinat valid.
6. Copy sementara/final hero dan about.
7. Link App Store/Google Play FamiGo jika sudah ada.

Jika data final belum tersedia, frontend tetap bisa mulai dengan mock adapter, tetapi semua mock harus diberi label development-only.
