# PRD: Redesign Landing Page Family Mart Indonesia

| | |
|---|---|
| **Versi** | 1.0 (Draft) |
| **Tanggal** | 10 Oktober 2026 |
| **Status** | Draft untuk review |
| **Tech Stack** | React JS, Tailwind CSS |
| **Platform** | Web (Responsive: mobile, tablet, desktop) |
| **Pemilik Dokumen** | _[isi nama PM / owner]_ |

---

## 1. Ringkasan

Landing page Family Mart Indonesia akan didesain ulang agar lebih modern, cepat, dan mudah dikelola. Semua konten dinamis (menu, best seller, promo, lokasi) dikelola melalui **CMS** sehingga tim non-teknis bisa memperbarui tanpa bantuan developer. Halaman dibangun dengan **React JS** dan **Tailwind CSS**, dengan **video** sebagai elemen utama di header.

### 1.1 Latar Belakang
Landing page adalah pintu masuk utama pelanggan untuk mengenal brand, melihat menu, mencari promo, menemukan gerai terdekat, dan mengunduh aplikasi **FamiGo**. Saat ini konten sulit diperbarui dan pengalaman pencarian gerai belum optimal.

### 1.2 Tujuan
1. Menampilkan identitas brand Family Mart secara kuat dan otentik.
2. Mempermudah pengunjung menemukan menu, promo, dan gerai terdekat.
3. Mendorong unduhan aplikasi FamiGo.
4. Memberi tim marketing/operasional kontrol penuh atas konten melalui CMS.
5. Performa dan aksesibilitas yang baik di perangkat mobile (mayoritas trafik).

### 1.3 Metrik Keberhasilan

| Metrik | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 85 |
| Lighthouse Accessibility | ≥ 90 |
| LCP (mobile, 4G) | ≤ 2,5 detik |
| CLS | ≤ 0,1 |
| Klik CTA unduh FamiGo | Naik dibanding baseline _(tentukan baseline)_ |
| Interaksi fitur lokasi (klik pin / buka Google Maps) | Dipantau via analytics |
| Waktu update konten promo via CMS | < 5 menit tanpa developer |

---

## 2. Target Pengguna

| Persona | Kebutuhan |
|---|---|
| **Pelanggan umum** | Melihat menu, promo, dan gerai terdekat dengan cepat |
| **Pengguna baru** | Mengenal brand dan terdorong mengunduh FamiGo |
| **Admin / Marketing** | Mengelola menu, promo, banner, dan lokasi lewat CMS |

---

## 3. Struktur Halaman

Urutan section pada landing page:

1. Header (Hero Video + Navigasi)
2. About Us
3. Menu
4. Best Seller
5. Promo
6. Lokasi
7. Banner Promo FamiGo
8. Footer

> Navigasi header memakai anchor scroll ke tiap section (sticky, dengan scroll-spy untuk menandai section aktif).

---

## 4. Kebutuhan Fungsional per Section

### 4.1 Header (Hero Video + Navbar)

**Deskripsi:** Bagian pembuka halaman dengan video sebagai latar utama, navbar, headline, dan CTA.

**Kebutuhan:**
- **Navbar:** logo Family Mart, menu anchor (About, Menu, Promo, Lokasi), tombol CTA "Unduh FamiGo".
- Navbar sticky; transparan di atas video, berubah solid saat di-scroll.
- Mobile: hamburger menu dengan drawer/overlay fullscreen yang bisa ditutup dengan tombol dan tap di luar area.
- **Video hero:**
  - Atribut: `autoplay`, `muted`, `loop`, `playsInline`.
  - Menyediakan **poster image** sebagai fallback saat video belum termuat atau gagal dimuat.
  - Format ganda: WebM (VP9/AV1) dan MP4 (H.264) untuk kompatibilitas.
  - Durasi ideal 8–15 detik, tanpa audio, ukuran target ≤ 4 MB (desktop) dan ≤ 2 MB (versi mobile).
  - Menyediakan versi video terpisah untuk mobile (rasio lebih portrait/ringan) via `<source media>`.
  - Menghormati `prefers-reduced-motion`: tampilkan poster statis, bukan video.
  - Hemat data: pada koneksi lambat (`navigator.connection.saveData`) tampilkan poster saja.
  - Overlay gelap tipis (gradient) agar teks tetap terbaca (kontras WCAG AA).
  - Tombol pause/play kecil untuk aksesibilitas.
- **Headline + sub-headline + 2 CTA** (contoh: "Lihat Menu" dan "Cari Gerai Terdekat"). Teks final dari tim brand.

**Panduan Konten Video (hindari tampilan generik / "AI slop"):**
- Gunakan **footage nyata** hasil produksi: suasana gerai Family Mart, makanan dan minuman asli, interaksi pelanggan dan staf, produk khas yang benar-benar dijual.
- Hindari visual hasil generate AI yang tidak akurat terhadap produk atau gerai (makanan tidak realistis, logo/tulisan rusak, tangan atau wajah janggal).
- Hindari stok video generik yang tidak mencerminkan Family Mart Indonesia.
- Pencahayaan, warna, dan komposisi mengikuti brand guideline resmi (palet hijau, biru, dan putih khas Family Mart).
- Hindari gaya desain template-isasi: gradient ungu-biru, kartu kaca (glassmorphism) berlebihan, ikon emoji sebagai dekorasi, headline klise. Tipografi dan layout harus punya karakter dan konsisten dengan brand.
- Semua aset (video, foto) harus punya hak pakai yang jelas.

**Acceptance Criteria:**
- [ ] Video berjalan otomatis dan senyap di Chrome, Safari (iOS), Firefox, dan Edge versi terbaru.
- [ ] Poster tampil bila video gagal dimuat atau `prefers-reduced-motion` aktif.
- [ ] Teks headline terbaca di atas video (kontras ≥ 4.5:1).
- [ ] LCP tidak terhambat video (poster dimuat dengan prioritas tinggi, video dimuat lazy setelah poster).

---

### 4.2 About Us

**Deskripsi:** Menceritakan latar belakang Family Mart.

**Kebutuhan:**
- Judul section, teks narasi (beberapa paragraf), dan 1–2 gambar/foto pendukung.
- Opsional: highlight angka (mis. jumlah gerai, tahun hadir di Indonesia) dalam bentuk counter. Angka diisi dari CMS agar tidak hardcode.
- Konten teks dan gambar dapat diedit dari CMS (singleton content).
- Layout: 2 kolom di desktop (teks + visual), 1 kolom di mobile.

> **Catatan:** Narasi sejarah dan data resmi Family Mart Indonesia perlu disediakan/divalidasi oleh tim brand sebelum rilis. Jangan memakai teks karangan atau angka yang belum terverifikasi.

**Acceptance Criteria:**
- [ ] Konten dapat diubah dari CMS tanpa deploy ulang.
- [ ] Gambar memiliki `alt` text yang diisi dari CMS.

---

### 4.3 Menu

**Deskripsi:** Menampilkan **seluruh menu** Family Mart. Data dikelola dari CMS.

**Kebutuhan:**
- Tampil dalam grid kartu: foto, nama menu, kategori, dan (opsional) harga.
- **Filter kategori** (tab/chip), contoh: Makanan, Minuman, Snack, dll. Kategori dikelola dari CMS.
- **Pencarian** menu berdasarkan nama.
- Pagination atau "Muat lebih banyak" agar halaman tetap ringan (default 8–12 item per muat).
- Klik kartu membuka **detail menu** (modal atau halaman detail): foto besar, nama, deskripsi, harga, dan info tambahan bila ada.
- Status ketersediaan (aktif/nonaktif) diatur dari CMS; menu nonaktif tidak tampil.
- Gambar lazy-load dengan placeholder (skeleton).
- Empty state jika hasil filter/pencarian kosong.

**Acceptance Criteria:**
- [ ] Menu baru yang ditambah di CMS muncul di landing page setelah dipublikasikan.
- [ ] Filter kategori dan pencarian bekerja bersamaan.
- [ ] Grid: 2 kolom (mobile), 3 kolom (tablet), 4 kolom (desktop).

---

### 4.4 Best Seller

**Deskripsi:** Menampilkan menu paling ramai dipesan sebagai highlight khusus. Dipilih dan diurutkan manual dari CMS.

**Kebutuhan:**
- Di CMS, admin dapat menandai menu sebagai **Best Seller** (toggle) dan mengatur urutan tampil (drag & drop atau field urutan).
- Batas jumlah tampil: maksimal 6 item _(dapat dikonfirmasi)_.
- Tampilan berbeda dari section Menu: kartu lebih besar, badge "Best Seller", dan/atau nomor peringkat.
- Desktop: grid/feature layout; mobile: carousel horizontal dengan swipe dan scroll-snap.
- Item Best Seller mengambil data dari data Menu yang sama (tidak ada duplikasi data).
- Jika tidak ada menu yang ditandai, section disembunyikan otomatis.

**Acceptance Criteria:**
- [ ] Mengubah status Best Seller di CMS langsung tercermin di landing page.
- [ ] Urutan tampil sesuai pengaturan di CMS.
- [ ] Carousel dapat dioperasikan dengan keyboard dan swipe.

---

### 4.5 Promo

**Deskripsi:** Menampilkan promo dalam bentuk kartu yang dikelola penuh dari CMS.

**Kebutuhan CMS (per promo):**

| Field | Tipe | Aturan |
|---|---|---|
| Thumbnail | Upload gambar | JPG/PNG/WebP, rasio tetap (mis. 16:9), maks 2 MB, wajib |
| Title | Teks | Wajib, maks ~60 karakter |
| Deskripsi | Teks panjang | Wajib |
| Periode mulai/berakhir | Tanggal | Opsional, promo otomatis tampil/hilang |
| Status | Draft / Published | |
| Urutan | Angka | Opsional |

**Kebutuhan tampilan:**
- Kartu berisi thumbnail, title, dan deskripsi.
- **Deskripsi dibatasi maksimal 2 baris** pada landing page (`line-clamp-2` di Tailwind) dengan ellipsis.
- **CTA "Lihat Selengkapnya" (See More)** pada setiap kartu mengarah ke **halaman detail promo** (halaman baru) yang menampilkan deskripsi lengkap.
- Tambahan tombol "Lihat Semua Promo" yang mengarah ke halaman daftar promo.
- Batas jumlah kartu di landing page: maksimal 6 _(dapat dikonfirmasi)_; sisanya hanya di halaman daftar promo.
- Layout: 1 kolom (mobile), 2 kolom (tablet), 3 kolom (desktop).

**Halaman baru yang dibutuhkan:**
- `/promo` : daftar semua promo.
- `/promo/:slug` : detail promo (thumbnail, title, deskripsi lengkap, periode).

**Acceptance Criteria:**
- [ ] Deskripsi terpotong rapi di 2 baris pada semua breakpoint.
- [ ] Promo yang sudah lewat periode otomatis tidak tampil.
- [ ] Tombol See More membuka halaman detail promo yang sesuai.

---

### 4.6 Lokasi

**Deskripsi:** Peta seluruh Indonesia dengan pin semua cabang Family Mart, plus tampilan daftar berdasarkan jarak terdekat dari pengguna.

**Kebutuhan peta:**
- Peta mencakup **seluruh Indonesia** (default viewport mencakup Sabang–Merauke).
- **Pin** untuk setiap cabang. Karena jumlah pin bisa banyak, gunakan **marker clustering** agar peta tetap ringan dan terbaca; cluster terurai saat zoom.
- Klik pin membuka **popup/panel detail**: nama cabang, alamat, jam operasional, nomor telepon (jika ada), dan tombol **"Buka di Google Maps"** (direct link ke Google Maps berdasarkan koordinat/place ID).
- Pencarian lokasi (nama cabang / kota / alamat) dengan autocomplete sederhana.
- Tombol "Lokasi Saya" untuk memusatkan peta ke posisi pengguna.

**Kebutuhan tampilan daftar (List View):**
- Toggle **Peta / Daftar**.
- Pada tampilan daftar, sistem **otomatis mengambil cabang terdekat** dari lokasi pengguna menggunakan Geolocation API browser.
- Urutkan berdasarkan jarak (rumus Haversine), tampilkan jarak (mis. "1,2 km").
- Tampilkan 10 terdekat pertama + "Muat lebih banyak".
- Setiap item daftar: nama, alamat, jarak, jam operasional, tombol "Buka di Google Maps".
- Klik item pada daftar akan memusatkan peta pada pin tersebut.

**Penanganan izin lokasi:**
- Izin lokasi diminta **hanya saat pengguna membuka tampilan daftar atau menekan "Lokasi Saya"**, bukan saat halaman dimuat.
- Jika izin ditolak / tidak tersedia: tampilkan pesan jelas dan fallback ke daftar berdasarkan pencarian/pilihan kota atau provinsi (filter manual).
- Data lokasi pengguna tidak disimpan di server.

**Sumber data:**
- **Fase 1:** data cabang dikelola dari CMS (CRUD manual dan import CSV untuk input massal).
- **Fase 2:** data diambil dari database cabang resmi. Frontend harus mengakses lewat satu lapisan API/service agar perpindahan sumber data tidak mengubah komponen UI.

**Field data cabang:**

| Field | Tipe | Keterangan |
|---|---|---|
| id | string | Unik |
| Nama cabang | teks | Wajib |
| Alamat | teks | Wajib |
| Kota / Provinsi | teks | Untuk filter |
| Latitude, Longitude | angka | Wajib, divalidasi |
| Jam operasional | teks / struktur | Opsional |
| Telepon | teks | Opsional |
| Link Google Maps | URL | Opsional (jika kosong, dibuat dari koordinat) |
| Status | Aktif / Nonaktif | Nonaktif tidak tampil |

**Pilihan teknologi peta (untuk diputuskan di tahap desain teknis):**

| Opsi | Kelebihan | Pertimbangan |
|---|---|---|
| Leaflet + OpenStreetMap (`react-leaflet`) | Gratis, ringan, clustering matang | Gaya peta lebih sederhana |
| Google Maps JS API (`@vis.gl/react-google-maps`) | Konsisten dengan tujuan direct ke Google Maps, kualitas peta tinggi | Berbayar berdasarkan penggunaan, butuh API key dan billing |
| Mapbox GL | Gaya peta bisa dikustom sesuai brand | Berbayar berdasarkan penggunaan |

**Acceptance Criteria:**
- [ ] Seluruh cabang aktif dari CMS tampil sebagai pin.
- [ ] Klik pin menampilkan detail dan tombol Google Maps yang membuka lokasi yang benar.
- [ ] List view otomatis terurut dari yang terdekat setelah izin lokasi diberikan.
- [ ] Fallback berfungsi jika izin lokasi ditolak.
- [ ] Peta tetap lancar dengan ≥ 1.000 pin (clustering).
- [ ] Peta dapat digunakan di mobile (gesture pinch/drag tidak bentrok dengan scroll halaman; gunakan tombol zoom dan penanganan gesture yang jelas).

---

### 4.7 Banner Promo FamiGo

**Deskripsi:** Banner untuk mempromosikan aplikasi Family Mart bernama **FamiGo**.

**Kebutuhan:**
- Banner lebar penuh dengan visual, headline, deskripsi singkat, serta tombol unduh **App Store** dan **Google Play** (badge resmi).
- Opsional: QR code untuk pengguna desktop.
- Gambar/konten banner dan link unduh dapat diatur dari CMS (gambar desktop dan mobile terpisah, teks, URL kedua store).
- Dapat diaktifkan/dinonaktifkan dari CMS.
- Tracking klik pada tombol unduh (analytics event).

**Acceptance Criteria:**
- [ ] Link App Store/Google Play dapat diubah dari CMS.
- [ ] Banner tampil proporsional di semua breakpoint.

---

### 4.8 Footer

**Kebutuhan:**
- Logo dan deskripsi singkat.
- Link navigasi cepat (anchor ke section dan halaman terkait).
- Kontak: alamat kantor, email, telepon/customer care.
- Ikon sosial media (Instagram, dsb.) dengan link dari CMS.
- Badge unduh FamiGo.
- Link kebijakan privasi dan syarat & ketentuan.
- Copyright dengan tahun otomatis.

---

## 5. Kebutuhan CMS

| Modul | Fungsi |
|---|---|
| **Menu** | CRUD menu, kategori, foto, harga, status aktif, toggle Best Seller + urutan |
| **Promo** | CRUD promo: upload thumbnail, title, deskripsi, periode, status draft/published |
| **Lokasi (sementara)** | CRUD cabang, import/export CSV, validasi koordinat, status aktif |
| **Banner FamiGo** | Edit gambar, teks, link store, aktif/nonaktif |
| **About Us** | Edit narasi, gambar, dan angka highlight |
| **Hero** | Ganti video (desktop/mobile), poster, headline, CTA |
| **Footer & Sosial Media** | Edit kontak dan link |

**Kebutuhan umum CMS:**
- Autentikasi admin dan **role** (mis. Admin, Editor).
- Status **Draft / Published** dan fitur **preview** sebelum publish.
- Upload media dengan validasi tipe dan ukuran, serta kompresi/optimasi gambar otomatis.
- Log perubahan (siapa mengubah apa dan kapan).
- API (REST atau GraphQL) yang dikonsumsi frontend.
- Rekomendasi: gunakan headless CMS (mis. Strapi, Directus, atau Sanity) atau CMS custom sesuai kesiapan tim. _Keputusan dibuat di tahap desain teknis._

---

## 6. Model Data (Ringkas)

```ts
type Menu = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  price?: number;
  image: string;
  isActive: boolean;
  isBestSeller: boolean;
  bestSellerOrder?: number;
};

type Promo = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  startDate?: string;
  endDate?: string;
  status: "draft" | "published";
  order?: number;
};

type Branch = {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  openingHours?: string;
  phone?: string;
  googleMapsUrl?: string;
  isActive: boolean;
};

type FamiGoBanner = {
  imageDesktop: string;
  imageMobile: string;
  headline: string;
  description: string;
  appStoreUrl: string;
  playStoreUrl: string;
  isActive: boolean;
};
```

---

## 7. Kebutuhan Non-Fungsional

### 7.1 Responsive
Pendekatan **mobile-first** dengan breakpoint Tailwind:

| Breakpoint | Lebar | Catatan |
|---|---|---|
| default | < 640px | Mobile: 1 kolom, hamburger menu, carousel |
| `sm` | ≥ 640px | Mobile besar |
| `md` | ≥ 768px | Tablet: 2–3 kolom |
| `lg` | ≥ 1024px | Desktop kecil |
| `xl` | ≥ 1280px | Desktop: layout penuh |

- Tidak ada horizontal scroll pada halaman di semua lebar layar.
- Target sentuh minimal 44×44 px pada mobile.

### 7.2 Performa
- Gambar: format WebP/AVIF, `srcset`/ukuran responsif, lazy-load di bawah fold.
- Code-splitting per section berat (terutama komponen peta, di-load saat mendekati viewport).
- Video hero dioptimasi (lihat 4.1).
- Cache API response (SWR / React Query) dan CDN untuk aset.
- Font: maksimal 2 keluarga font, `font-display: swap`.

### 7.3 Aksesibilitas (WCAG 2.1 AA)
- HTML semantik, urutan heading benar.
- Navigasi keyboard penuh (navbar, carousel, peta/daftar, modal).
- Alt text gambar, label ARIA untuk kontrol, fokus terlihat jelas.
- Kontras warna memenuhi standar.
- Alternatif teks/daftar untuk informasi lokasi (list view menjadi alternatif peta).

### 7.4 SEO
- Meta title/description, Open Graph, dan data terstruktur (`Organization`, `LocalBusiness` untuk cabang bila memungkinkan).
- Pertimbangkan **SSR/SSG** (mis. Next.js atau Vite SSG) untuk SEO dan performa. _Catatan: permintaan awal menyebutkan React JS; jika tetap SPA murni, siapkan prerender._
- Sitemap dan robots.txt; URL halaman promo yang ramah SEO.

### 7.5 Keamanan dan Privasi
- HTTPS, sanitasi konten dari CMS (cegah XSS pada deskripsi).
- API key peta dibatasi domain.
- Tidak menyimpan data lokasi pengguna; tampilkan persetujuan saat meminta izin lokasi.
- Mengikuti ketentuan UU PDP bila ada pengumpulan data analytics.

### 7.6 Browser Support
Dua versi terbaru Chrome, Safari (termasuk iOS), Firefox, Edge, dan Samsung Internet.

### 7.7 Analytics
Event yang dilacak: klik CTA hero, klik kartu menu, klik See More promo, klik pin lokasi, klik "Buka di Google Maps", izin lokasi (diberikan/ditolak), klik unduh FamiGo.

---

## 8. Panduan Desain dan Implementasi (React + Tailwind)

- Konfigurasikan **design tokens** (warna brand, tipografi, spacing, radius) di `tailwind.config`, bukan nilai acak per komponen.
- Komponen reusable: `Navbar`, `HeroVideo`, `SectionHeading`, `MenuCard`, `PromoCard`, `BranchCard`, `MapView`, `Carousel`, `Footer`.
- Pisahkan **data layer** (service/API hooks) dari komponen UI.
- Gunakan `line-clamp-2` untuk deskripsi promo.
- Tangani state **loading (skeleton), error, dan empty** pada setiap section dinamis.
- Hindari gaya generik/template: pakai aset asli, tipografi dengan karakter, dan komposisi yang mengikuti brand guideline Family Mart.

**Struktur folder yang disarankan:**

```
src/
├─ components/
│  ├─ layout/        (Navbar, Footer)
│  ├─ sections/      (Hero, About, Menu, BestSeller, Promo, Location, FamiGoBanner)
│  └─ ui/            (Button, Card, Badge, Skeleton, Modal)
├─ pages/            (Home, PromoList, PromoDetail)
├─ services/         (api client: menu, promo, branch)
├─ hooks/            (useGeolocation, useNearestBranches, useMenu, ...)
├─ utils/            (haversine, formatters)
└─ styles/
```

---

## 9. Dependensi dan Asumsi

- Tim brand menyediakan: video hero (footage nyata), foto menu, teks About Us, logo, dan brand guideline.
- Tim marketing menyediakan data awal promo dan daftar cabang (lengkap dengan koordinat).
- Akun dan API key layanan peta tersedia.
- Link resmi App Store dan Google Play FamiGo tersedia.
- Backend/CMS dan API tersedia atau dibangun paralel.

---

## 10. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Video hero berat | LCP lambat, boros kuota | Kompresi, versi mobile, poster, saveData fallback |
| Data koordinat cabang tidak akurat | Pin salah lokasi | Validasi di CMS, review sebelum publish |
| Jumlah pin sangat banyak | Peta lambat | Marker clustering, lazy-load komponen peta |
| Izin lokasi ditolak | Fitur terdekat tidak jalan | Fallback pencarian kota/provinsi |
| Biaya peta berbayar membengkak | Biaya operasional | Pilih Leaflet/OSM atau batasi quota dan caching |
| Footage berkualitas rendah / aset tidak siap | Tampilan terkesan generik | Jadwalkan produksi video lebih awal, gunakan aset asli |
| Perpindahan data lokasi ke database | Refactor besar | Abstraksi lewat service layer sejak awal |

---

## 11. Milestone (Estimasi Awal)

| Fase | Aktivitas | Estimasi |
|---|---|---|
| 1. Discovery | Finalisasi PRD, brand guideline, aset, keputusan teknologi peta dan CMS | 1 minggu |
| 2. Desain | Wireframe, UI desktop dan mobile, review brand | 2 minggu |
| 3. CMS & API | Model data, modul CMS, API | 2 minggu (paralel) |
| 4. Frontend | Implementasi section, integrasi API, peta | 3–4 minggu |
| 5. QA & Optimasi | Uji responsive, performa, aksesibilitas, UAT | 1–2 minggu |
| 6. Rilis | Deploy, monitoring, handover CMS | 1 minggu |

_Estimasi bersifat indikatif dan perlu divalidasi bersama tim engineering._

---

## 12. Pertanyaan Terbuka

1. Apakah menggunakan SSR/SSG (mis. Next.js) atau SPA React murni?
2. Layanan peta yang dipilih: Leaflet/OSM, Google Maps, atau Mapbox?
3. CMS: headless CMS yang sudah ada atau dibangun custom?
4. Apakah harga menu ditampilkan di landing page?
5. Berapa jumlah maksimal item Best Seller dan kartu Promo di landing page (usulan: 6)?
6. Apakah diperlukan halaman detail menu terpisah, atau cukup modal?
7. Kapan database lokasi final siap, dan format datanya seperti apa?
8. Apakah perlu dukungan dua bahasa (ID/EN)?
9. Siapa yang menyediakan video hero dan kapan aset siap?
10. Apakah ada ketentuan legal/brand tambahan dari Family Mart pusat (Jepang) untuk penggunaan aset dan konten?

---

## 13. Lampiran: Checklist Rilis

- [ ] Semua section tampil dan responsive (320px sampai 1920px)
- [ ] Konten dinamis terhubung ke CMS (menu, best seller, promo, lokasi, banner)
- [ ] Deskripsi promo maksimal 2 baris + See More berfungsi
- [ ] Peta, pin, popup, dan link Google Maps teruji
- [ ] List lokasi terdekat + fallback izin lokasi teruji
- [ ] Video hero: poster, reduced-motion, dan versi mobile teruji
- [ ] Lighthouse dan aksesibilitas memenuhi target
- [ ] Analytics event aktif
- [ ] Meta SEO dan Open Graph terpasang
- [ ] UAT disetujui stakeholder
