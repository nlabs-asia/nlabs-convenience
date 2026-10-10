# Task Plan — Redesign Landing Page Family Mart Indonesia

| | |
|---|---|
| **Versi** | 1.0 |
| **Tanggal** | 10 Oktober 2026 |
| **Sumber** | `PRD-Landing-Page-FamilyMart-Indonesia.md` (v1.0) + `docs/technical-decisions.md` |
| **Lokasi proyek** | `/Users/david/Hermes/projects/Family Mart Redesign` |
| **Status** | Siap dieksekusi |

> Dokumen ini adalah acuan kerja utama. Plan lama di `.hermes/plans/2026-10-10_000000-familymart-landing-redesign-task-plan.md` digantikan oleh dokumen ini. Perbedaan penting: rekomendasi CMS pada plan lama (Strapi/Directus/Sanity) **sudah tidak berlaku** — keputusan final adalah **Custom CMS** (lihat `docs/technical-decisions.md`, status Locked).

---

## 1. Ringkasan Proyek

**Goal:** Membangun ulang landing page Family Mart Indonesia yang modern, responsive (mobile-first), cepat (Lighthouse mobile Performance ≥ 85, Accessibility ≥ 90, LCP ≤ 2,5s, CLS ≤ 0,1), SEO-friendly, dan seluruh konten dinamisnya (Hero, About, Menu, Best Seller, Promo, Lokasi, Banner FamiGo, Footer) dikelola lewat **Custom CMS** tanpa bantuan developer.

**Deliverable utama:**

1. Landing page `/` dengan 8 section sesuai urutan PRD: Header (Hero Video + Navbar) → About Us → Menu → Best Seller → Promo → Lokasi → Banner FamiGo → Footer.
2. Halaman `/promo` (daftar semua promo) dan `/promo/:slug` (detail promo).
3. Data layer (service + adapter) yang terisolasi dari UI, siap ditukar dari mock → API Custom CMS.
4. Analytics events untuk seluruh CTA/interaksi kunci.
5. QA checklist rilis sesuai lampiran PRD.

## 2. Keputusan Teknis Terkunci (dari `docs/technical-decisions.md`)

| Area | Keputusan | Status | Dampak ke Task |
|---|---|---|---|
| Frontend | Vite + React + TypeScript + Tailwind CSS | **Locked** | Task 1.x |
| Routing | React Router (`/`, `/promo`, `/promo/:slug`) | Baseline | Task 1.3, 6.x |
| CMS | **Custom CMS**, REST API | **Locked** | Task 9.x: kontrak API untuk custom CMS, bukan headless |
| Peta render | Leaflet + OpenStreetMap + marker clustering, lazy-load | Baseline | Task 7.x, bukan Google Maps JS API |
| Google Maps | Hanya outbound link "Buka di Google Maps" dari koordinat/URL CMS | Baseline | Task 7.4 |
| Detail menu | Modal (bukan halaman route) | Baseline | Task 5.3 |
| Limit Best Seller | 6 item di landing | Baseline | Task 5.4 |
| Limit Promo landing | 6 kartu, sisanya `/promo` | Baseline | Task 6.1 |
| Load awal Menu | 8–12 item + "Muat Lebih Banyak" | Baseline | Task 5.1 |
| SEO | Vite + prerender/SSG-ready | Baseline | Task 10.4 |
| Keamanan | Sanitasi rich text, HTTPS, tanpa penyimpanan data lokasi user | Baseline | Task 8.x, 9.x, 10.x |

**Status aset saat ini** (detail di `docs/content-asset-checklist.md`):

- ✅ Logo Family Mart sudah tersedia: `logo family mart.png` (verifikasi versi terbaik — transparan/SVG bila ada, untuk Navbar & Footer).
- ❌ Hero video (desktop/mobile, WebM+MP4), poster, foto menu, foto About, copy final, data cabang, link FamiGo: masih **Missing** → strategi mock/placeholder berlaku untuk development, **tidak boleh dipakai untuk rilis**.

**Kebijakan placeholder (dari PRD §4.1 & checklist):**

- Boleh (development): mock JSON menu/promo/branch, placeholder copy/layout, logo sementara berlabel non-final.
- Tidak boleh (rilis): visual AI generik yang merepresentasikan produk/gerai, angka brand belum tervalidasi, link store dummy, data cabang tanpa validasi koordinat.


## 3. Analisa PRD — Inti Prioritas

### MVP core (harus jalan agar rilis bermakna)

1. Foundation Vite React TS + Tailwind design tokens brand + routing + service layer.
2. Urutan 8 section landing page lengkap sesuai PRD.
3. Menu: grid + filter kategori + search + load more + detail modal.
4. Best Seller: dari data Menu yang sama, urutan dari CMS, carousel mobile.
5. Promo: kartu landing (max 6, line-clamp-2) + `/promo` + `/promo/:slug`.
6. Lokasi: peta Leaflet seluruh Indonesia + clustering + list view terdekat (Haversine + Geolocation on-demand) + fallback izin ditolak.
7. Banner FamiGo + tracking klik.
8. Baseline performa & aksesibilitas sesuai target PRD.

### Implikasi teknis tersembunyi (wajib diantisipasi)

- **Video hero ≠ LCP element**: poster dimuat prioritas tinggi, video lazy setelah poster tampil.
- `prefers-reduced-motion` & `navigator.connection.saveData` → tampilkan poster saja.
- Peta 1.000+ pin → clustering + lazy-load bundle peta saat mendekati viewport.
- Geolocation **hanya** diminta saat user membuka list view / tekan "Lokasi Saya" — bukan saat load halaman.
- Semua konten rich text dari CMS → sanitasi (cegah XSS).
- Best Seller bukan entity terpisah — flag `isBestSeller` + `bestSellerOrder` pada MenuItem.
- Promo auto-hide: filter `status=published` + rentang tanggal valid.
- Section Best Seller auto-hide jika tidak ada item yang ditandai.
- Analytics tidak boleh mengirim koordinat mentah user.

### Open questions PRD: terjawab vs terbuka

| Pertanyaan PRD | Status |
|---|---|
| SSR/SSG vs SPA? | ✅ Vite React + prerender/SSG-ready (Baseline) |
| Peta: Leaflet/Google/Mapbox? | ✅ Leaflet + OSM (Baseline) |
| CMS: headless/custom? | ✅ Custom CMS + REST (Locked) |
| Detail menu: modal/halaman? | ✅ Modal (Baseline) |
| Limit Best Seller & Promo landing? | ✅ 6 & 6 (Baseline) |
| Harga menu ditampilkan? | ⚠️ Terbuka — field `price` opsional di schema, tampil jika ada |
| Dukungan ID/EN? | ⚠️ Terbuka — copy terpusat/i18n-ready, hindari hardcode string |
| Database lokasi final & format? | ⚠️ Terbuka — service layer abstraksi dari awal (Fase 1 CMS, Fase 2 DB resmi) |
| Video hero dari siapa & kapan? | ⚠️ Terbuka — blocking untuk rilis, bukan untuk development (mock poster) |
| Ketentuan legal brand pusat? | ⚠️ Terbuka — wajib sebelum rilis publik |

---

## 4. Milestone Task Board

> Status: ⬜ belum mulai · 🔶 sebagian · ✅ selesai

### Milestone 0 — Discovery & Keputusan Teknis ✅ (dengan sisa tindak lanjut)

| Task | Status | Catatan |
|---|---|---|
| 0.1 Finalisasi keputusan teknis utama | ✅ | `docs/technical-decisions.md` — semua area utama terkunci |
| 0.2 Checklist aset & konten | ✅ | `docs/content-asset-checklist.md` |
| 0.3 Update status logo di checklist | ✅ | Checklist aset di-update (logo: Needs Validation) & logo tersalin ke `src/assets/logo.png` + `public/logo.png` (favicon) saat scaffold M1 |

**Sisa tindak lanjut M0 (paralel dengan development, blocking untuk rilis):**
- [ ] Brand guideline / palet warna resmi (hijau-biru-putih Family Mart) untuk design tokens final.
- [ ] Video hero final: footage nyata, 8–15 dtk, tanpa audio, ≤4MB desktop / ≤2MB mobile, WebM+MP4, versi mobile portrait.
- [ ] Copy final Hero & About (jangan teks karangan).
- [ ] Data sample: 6–12 menu + foto, 3–6 promo + thumbnail, ≥10 cabang dengan koordinat valid.
- [ ] Link App Store / Google Play FamiGo.


### Milestone 1 — Project Foundation & Data Layer ✅ (selesai 10 Okt 2026)

> **Verifikasi M1:** `tsc --noEmit` bersih · `vite build` sukses (49 modul; chunk terpisah untuk PromoList/PromoDetail/NotFound — code-split aktif) · token primary `#0ea5e9` terbukti ter-compile di CSS hasil build · dev server HTTP 200 · mock data lengkap (12 menu + 1 nonaktif, 7 promo termasuk 1 draft & 1 expired untuk uji filtering, 11 cabang termasuk 1 nonaktif, koordinat valid Indonesia) · `grep MOCKDATA` = 0 marker tersisa.

#### Task 1.1: Scaffold project Vite React TS + Tailwind
**Objective:** Fondasi teknis sesuai keputusan Locked.
**Files:** `package.json`, `vite.config.ts`, `tailwind.config.js/ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/styles/index.css`
**Steps:**
1. Scaffold Vite template react-ts; install `tailwindcss` + `react-router-dom`.
2. Konfigurasi Tailwind dengan **design tokens** brand Family Mart (warna hijau/biru/putih, tipografi, spacing, radius, shadow) — bukan nilai acak per komponen. Gunakan approximate dulu, ganti saat brand guideline final.
3. Maksimal 2 keluarga font, `font-display: swap`.
4. Buat struktur folder sesuai PRD §8: `components/{layout,sections,ui}`, `pages/`, `services/`, `hooks/`, `types/`, `utils/`, `styles/`.
5. Pastikan struktur kompatibel prerender/SSG (Baseline SEO).
**Verification:** `npm run dev` jalan, `npm run build` tanpa error, design tokens terpakai.

#### Task 1.2: Types + mock data + service layer
**Objective:** Data layer terisolasi dari UI, siap swap mock → Custom CMS API.
**Files:** Create `src/types/content.ts`, `src/services/contentApi.ts`, `src/services/mockData.ts`, `src/services/analytics.ts`
**Steps:**
1. Definisikan types sesuai PRD §6: `HeroContent`, `AboutContent`, `MenuCategory`, `MenuItem`, `Promo`, `Branch`, `FamiGoBanner`, `FooterContent` (lengkap: alt text, order, status/draft-published).
2. Mock data berlabel **development-only** (menu ≥12, promo ≥6, branch ≥10 dengan koordinat valid di Indonesia).
3. `contentApi.ts` sebagai facade: `getHero()`, `getAbout()`, `getMenuCategories()`, `getMenuItems()`, `getBestSellers()`, `getPromos()`, `getPromoBySlug()`, `getBranches()`, `getFamiGoBanner()`, `getFooter()`.
4. Komponen UI hanya boleh import dari `contentApi`/hooks — **tidak boleh** import mock data langsung.
**Verification:** Semua section bisa dibangun hanya lewat facade; mock bisa ditukar tanpa mengubah UI.

#### Task 1.3: Routing + pages skeleton
**Files:** Create `src/pages/Home.tsx`, `PromoList.tsx`, `PromoDetail.tsx`, `NotFound.tsx`; Modify `src/main.tsx`
**Steps:** Routes `/`, `/promo`, `/promo/:slug`, `*`. Route-level code-splitting (`React.lazy`) untuk halaman promo.
**Verification:** Navigasi antar route jalan tanpa reload penuh.

---

### Milestone 2 — Layout Shell & Navigation ✅ (selesai 10 Okt 2026)

> **Verifikasi M2:** Navbar transparan→solid saat scroll, scroll-spy dengan underline sliding aktif, drawer mobile (close/Escape/backdrop/klik link, lock scroll), Footer dinamis dari facade dengan tahun otomatis. Signature brand "awning stripe" dipasang di atas navbar + atas footer.

#### Task 2.1: Navbar sticky + scroll state + scroll-spy
**Files:** Create `src/components/layout/Navbar.tsx`, `src/hooks/useScrollSpy.ts`
**Steps:**
1. Navbar desktop: logo, anchor About/Menu/Promo/Lokasi, CTA "Unduh FamiGo".
2. Transparan di atas hero → solid saat scroll (`isScrolled`).
3. Scroll-spy menandai section aktif.
4. Anchor smooth scroll + offset agar section tidak tertutup navbar.
**Verification:** Navbar solid saat scroll; section aktif ter-update sesuai viewport.

#### Task 2.2: Mobile hamburger drawer
**Files:** Modify `Navbar.tsx`; Create `src/components/ui/MobileDrawer.tsx`
**Steps:**
1. Hamburger button dengan aria-label; drawer fullscreen/overlay berisi nav + CTA.
2. Tutup via: tombol close, tap backdrop, Escape, klik nav link.
3. Lock body scroll saat drawer terbuka; focus management.
**Verification:** Dapat dikendalikan penuh dengan keyboard; tidak ada horizontal scroll di mobile.

#### Task 2.3: Footer dinamis
**Files:** Create `src/components/layout/Footer.tsx`
**Steps:** Render logo, deskripsi, quick links anchor, kontak, social links (URL dari CMS), badge FamiGo, legal links, copyright tahun otomatis. Link eksternal `rel="noopener noreferrer"`.
**Verification:** Responsive; semua data dari service layer.


### Milestone 3 — Hero Video ✅ (selesai 10 Okt 2026)

> **Verifikasi M3:** VideoBackground dengan poster prioritas (fetchPriority high), fallback poster saat reduced-motion/saveData/video gagal/URL kosong, kontrol pause/play aria-label dinamis. Plus: parallax latar 0.35x + foreground fade via rAF, stagger entrance, marquee signage, scroll cue. Video final masih menunggu aset (M0 tindak lanjut).

#### Task 3.1: Build HeroVideo component
**Objective:** Hero video memenuhi requirement performa & aksesibilitas PRD §4.1.
**Files:** Create `src/components/sections/Hero.tsx`, `src/components/ui/VideoBackground.tsx`, `src/hooks/useReducedMotion.ts`, `src/hooks/useSaveData.ts`
**Steps:**
1. Render poster sebagai visual awal (LCP candidate, prioritas tinggi; `fetchpriority="high"`).
2. Render `<video autoplay muted loop playsInline>` **hanya jika** bukan reduced-motion dan bukan saveData; video dimuat lazy setelah poster.
3. Source ganda: desktop/mobile via `<source media>`, WebM (VP9) + MP4 (H.264).
4. Overlay gradient gelap tipis agar teks kontras ≥ 4.5:1 (WCAG AA).
5. Headline, subheadline, 2 CTA ("Lihat Menu" → `#menu`, "Cari Gerai Terdekat" → `#lokasi`); copy dari CMS.
**Verification:** Reduced-motion → poster statis; saveData → poster saja; teks terbaca di atas video.

#### Task 3.2: Pause/play control video
**Files:** Modify `VideoBackground.tsx`
**Steps:** Tombol pause/play kecil, aria-label dinamis, sinkron state dengan video element.
**Verification:** Bisa dipakai keyboard; label jelas untuk screen reader.

---

### Milestone 4 — About Section ✅ (selesai 10 Okt 2026)

> **Verifikasi M4:** Rich text disanitasi via DOMPurify, gambar parallax ringan + bingkai awning, highlight angka dengan counter ease-out-expo (fallback teks bila non-numerik/placeholder). Copy final menunggu tim brand.

#### Task 4.1: Build About section
**Objective:** Narasi brand + highlight dari CMS (PRD §4.2).
**Files:** Create `src/components/sections/About.tsx`, `src/components/ui/SectionHeading.tsx`
**Steps:**
1. Layout 1 kolom mobile, 2 kolom desktop (teks + visual).
2. Render rich text yang sudah **disanitasi** (buat `src/utils/sanitize.ts` bila perlu).
3. 1–2 gambar dengan `alt` dari CMS.
4. Highlight angka opsional dari CMS (bukan hardcode) — tanpa data final, validasi brand dulu (jangan angka karangan di rilis).
**Verification:** About tetap bagus tanpa highlight opsional; semua gambar punya alt; konten bisa diubah tanpa deploy ulang.

---

### Milestone 5 — Menu & Best Seller ✅ (selesai 10 Okt 2026)

> **Verifikasi M5:** Filter kategori + search (debounce) + load more 12/muat bekerja bersama; grid 2/3/4 kolom; modal detail dengan focus trap + return focus; Best Seller dari MenuItem yang sama, ghost rank number, carousel scroll-snap + tombol panah, auto-hide bila kosong.

#### Task 5.1: Menu service filtering
**Objective:** Filter kategori + search bekerja bersamaan.
**Files:** Create `src/hooks/useMenuFilters.ts`; Modify `src/services/contentApi.ts`
**Steps:**
1. Ambil hanya menu `isActive` (nonaktif tidak tampil).
2. Filter kategori (slug) + search nama secara bersamaan.
3. Pagination "Muat Lebih Banyak" default 8–12 item.
**Verification:** Kategori + search + load more tidak saling merusak.

#### Task 5.2: Menu section UI
**Objective:** Grid seluruh menu responsive.
**Files:** Create `src/components/sections/Menu.tsx`, `src/components/ui/MenuCard.tsx`, `src/components/ui/Skeleton.tsx`, `src/components/ui/EmptyState.tsx`
**Steps:**
1. Tabs/chips kategori + search input (aria-label, focus visible).
2. Grid: 2 kolom mobile, 3 tablet, 4 desktop.
3. Lazy-load gambar + skeleton; width/height eksplisit (cegah CLS).
4. Empty state saat filter/search kosong.
**Verification:** Empty state muncul saat tidak ada hasil; grid sesuai breakpoint.

#### Task 5.3: Menu detail modal
**Objective:** Klik kartu membuka detail (keputusan: modal, bukan route).
**Files:** Create `src/components/ui/Modal.tsx`, `src/components/sections/MenuDetailModal.tsx`
**Steps:**
1. Modal accessible: focus trap sederhana, tutup via Escape/backdrop/close.
2. Render foto besar, nama, deskripsi, kategori, harga (jika ada).
3. Return focus ke kartu asal saat ditutup.
**Verification:** Keyboard focus tidak bocor keluar modal.

#### Task 5.4: Best Seller section
**Objective:** Highlight menu terlaris tanpa duplikasi data (PRD §4.4).
**Files:** Create `src/components/sections/BestSeller.tsx`, `src/components/ui/Carousel.tsx`
**Steps:**
1. Ambil `MenuItem` yang `isBestSeller && isActive`, sort `bestSellerOrder`, limit **6**.
2. Tampilan berbeda dari section Menu: kartu lebih besar, badge "Best Seller", nomor peringkat.
3. Desktop: grid/feature layout; Mobile: carousel horizontal scroll-snap + swipe.
4. **Hide section otomatis** jika tidak ada item yang ditandai.
**Verification:** Urutan sesuai data; carousel bisa dioperasikan keyboard & swipe; perubahan status Best Seller di CMS tercermin di landing.


### Milestone 6 — Promo Pages ✅ (selesai 10 Okt 2026)

> **Verifikasi M6:** Section landing max 6 kartu line-clamp-2 (draft/expired terfilter facade), CTA See More → `/promo/:slug`, Lihat Semua → `/promo`; halaman list & detail sudah aktif dengan state loading/error/empty.

#### Task 6.1: Promo landing section
**Objective:** Kartu promo landing max 6, deskripsi 2 baris (PRD §4.5).
**Files:** Create `src/components/sections/Promo.tsx`, `src/components/ui/PromoCard.tsx`; Modify `src/services/contentApi.ts`
**Steps:**
1. Filter `status=published` + periode valid (belum lewat `endDate`, sudah mulai `startDate`).
2. Sort by `order`/date, limit **6**.
3. `line-clamp-2` + ellipsis untuk deskripsi di semua breakpoint.
4. CTA "Lihat Selengkapnya" → `/promo/:slug`; "Lihat Semua Promo" → `/promo`.
5. Layout 1 kolom mobile, 2 tablet, 3 desktop.
**Verification:** Promo expired/belum mulai tidak tampil; deskripsi selalu maks 2 baris; See More membuka detail yang sesuai.

#### Task 6.2: `/promo` list page
**Files:** Modify `src/pages/PromoList.tsx`
**Steps:** Heading + back/breadcrumb; grid 1/2/3 kolom semua promo valid (bukan hanya 6); empty state; metadata SEO halaman.
**Verification:** Semua promo valid tampil; state loading/empty ditangani.

#### Task 6.3: `/promo/:slug` detail page
**Files:** Modify `src/pages/PromoDetail.tsx`
**Steps:**
1. Cari promo berdasarkan slug; jika tidak ada / draft / expired → tampil "tidak ditemukan"/redirect ke `/promo`.
2. Render thumbnail, title, deskripsi lengkap (disanitasi), periode.
3. Metadata SEO per promo (dari title/thumbnail).
**Verification:** URL slug ramah SEO; konten draft/expired tidak bisa diakses.

---

### Milestone 7 — Lokasi: Peta + List View ✅ (selesai 10 Okt 2026)

> **Verifikasi M7:** MapView Leaflet+OSM lazy (chunk 190kB terpisah, mount saat mendekati viewport), clustering chunkedLoading, pin custom brand, popup + Google Maps link (CMS/fallback koordinat), list terdekat Haversine + 10/"Muat Lebih Banyak", izin lokasi on-demand + fallback filter provinsi, search cabang, toggle Peta/Daftar.

#### Task 7.1: Leaflet map lazy-loaded + clustering
**Objective:** Peta seluruh Indonesia dengan pin semua cabang aktif (PRD §4.6).
**Files:** Create `src/components/sections/MapView.tsx`, `src/components/sections/Location.tsx`; deps `leaflet`, `react-leaflet`, clustering lib
**Steps:**
1. **Lazy-load** komponen peta (bundle terpisah, load saat mendekati viewport).
2. Default viewport mencakup Sabang–Merauke.
3. Pin semua cabang `isActive` + **marker clustering** (target lancar ≥ 1.000 pin).
4. Pin custom sesuai brand (bukan default biru generik bila memungkinkan).
**Verification:** Semua cabang aktif tampil; peta lancar dengan banyak pin.

#### Task 7.2: Pin popup detail + Google Maps link
**Files:** Modify `MapView.tsx`; Create `src/utils/googleMaps.ts`
**Steps:**
1. Popup: nama, alamat, jam operasional, telepon (jika ada), tombol "Buka di Google Maps".
2. URL Google Maps dari `googleMapsUrl` CMS; jika kosong, generate dari koordinat.
**Verification:** Klik pin → detail benar; link membuka lokasi yang benar.

#### Task 7.3: Geolocation + list view terdekat
**Objective:** List cabang terdekat dengan izin lokasi on-demand.
**Files:** Create `src/hooks/useGeolocation.ts`, `src/hooks/useNearestBranches.ts`, `src/utils/haversine.ts`, `src/components/ui/BranchCard.tsx`
**Steps:**
1. Toggle **Peta / Daftar**.
2. Izin lokasi **hanya** diminta saat membuka tampilan daftar / tekan "Lokasi Saya".
3. Urutkan Haversine, tampilkan jarak ("1,2 km" — format lokal), 10 terdekat + "Muat Lebih Banyak".
4. Item: nama, alamat, jarak, jam, tombol "Buka di Google Maps"; klik item → fokus peta ke pin.
5. Fallback izin ditolak: pesan jelas + filter manual kota/provinsi.
6. Koordinat user hanya di browser — tidak dikirim ke server/analytics.
**Verification:** List terurut terdekat setelah izin diberikan; fallback berfungsi saat ditolak.

#### Task 7.4: Pencarian lokasi + gesture mobile
**Files:** Modify `Location.tsx`
**Steps:**
1. Pencarian nama cabang/kota/alamat dengan autocomplete sederhana.
2. Tombol "Lokasi Saya" → fokus peta ke posisi user.
3. Gesture mobile: pinch/drag peta tidak bentrok dengan scroll halaman (tombol zoom jelas; `scrollWheelZoom` nonaktif kecuali fokus).
**Verification:** Pencarian bekerja; peta usable di mobile tanpa scroll trap.

---

### Milestone 8 — FamiGo Banner & Analytics ✅ (selesai 10 Okt 2026)

> **Verifikasi M8:** Banner full-width dengan gambar desktop/mobile dari facade, tombol store + tracking per store, auto-hide bila nonaktif. Semua 8 event analytics terpasang (stub provider — integrasi final di M9/M10), payload lokasi user otomatis di-strip.

#### Task 8.1: FamiGo banner section
**Objective:** Banner unduh aplikasi dari CMS (PRD §4.7).
**Files:** Create `src/components/sections/FamiGoBanner.tsx`
**Steps:**
1. Banner full-width: gambar desktop/mobile terpisah, headline, deskripsi, badge resmi App Store/Google Play.
2. Opsional QR code untuk desktop.
3. Aktif/nonaktif dari CMS (`isActive=false` → section hilang).
4. Tracking klik tombol unduh per store.
**Verification:** Link store bisa diubah dari CMS; proporsional di semua breakpoint.

#### Task 8.2: Analytics events
**Objective:** Seluruh event PRD §7.7 terpasang.
**Files:** Modify `src/services/analytics.ts` + semua section
**Steps:** Pasang event: `hero_cta_click`, `menu_card_click`, `promo_see_more_click`, `promo_list_click`, `location_pin_click`, `open_google_maps_click`, `geolocation_permission_result` (granted/denied, **tanpa koordinat mentah**), `famigo_download_click` (per store).
**Verification:** Semua event terkirim di tools dev analytics; tidak ada data lokasi user yang bocor.


### Milestone 9 — Custom CMS Integration ⬜

#### Task 9.1: Kontrak API Custom CMS
**Objective:** Kontrak REST API final untuk custom CMS (bukan headless — sesuai keputusan Locked).
**Files:** Create `docs/cms-api-contract.md`
**Steps:**
1. Definisikan endpoint REST untuk: Hero, About, MenuCategory, MenuItem (incl. best seller toggle/order), Promo (draft/published + date validity), Branch (incl. import/export CSV + validasi koordinat), FamiGoBanner, Footer.
2. Public API hanya mengembalikan konten **published/active**.
3. Endpoint admin: auth, roles Admin/Editor, draft→publish, preview, media upload (validasi type/size + kompresi), audit log.
4. Mapping 1:1 dengan facade `contentApi.ts`.
**Verification:** Setiap fungsi facade terpetakan ke endpoint; constraint media terdokumentasi.

#### Task 9.2: Swap mock adapter → real CMS adapter
**Objective:** Frontend mengambil data nyata dari API CMS.
**Files:** Modify `src/services/contentApi.ts`; Create `src/services/cmsClient.ts`, `.env.example`
**Steps:**
1. Env base URL + token publik bila perlu; fetch client dengan timeout + error handling.
2. Mapping response API → internal types; caching respons (SWR/React Query/cache sederhana).
3. Mock adapter tetap sebagai dev fallback.
**Verification:** Landing page tetap jalan dengan error state jelas saat CMS error/down.

---

### Milestone 10 — Performa, Aksesibilitas, SEO, QA ⬜

#### Task 10.1: Audit loading/error/empty state
**Steps:** Audit semua section (Hero–Footer); skeleton/fallback, error tanpa crash, empty state menu/promo/lokasi.
**Verification:** Simulasi data kosong/gagal tidak membuat section broken.

#### Task 10.2: Accessibility pass (WCAG 2.1 AA)
**Steps:** Audit heading order; keyboard navbar/drawer/modal/carousel/peta-list; alt & aria-label; focus visible; kontras warna.
**Verification:** Lighthouse Accessibility ≥ 90; tidak ada blocker axe utama.

#### Task 10.3: Performance pass
**Steps:** Poster hero prioritas; lazy-load gambar bawah fold + bundle peta; width/height gambar (CLS); code-split route promo & peta; `font-display: swap`.
**Verification:** Lighthouse mobile Performance ≥ 85; CLS ≤ 0,1; LCP ≤ 2,5s (aset final).

#### Task 10.4: SEO metadata
**Files:** Create `public/robots.txt`, `public/sitemap.xml` (atau generator)
**Steps:** Meta title/description + Open Graph; structured data `Organization` + `LocalBusiness` (bila data cabang stabil); canonical URL; verifikasi output prerender/SSG.
**Verification:** Meta muncul di HTML hasil build/prerender.

#### Task 10.5: Cross-browser & responsive QA
**Files:** Create `docs/qa-checklist.md`
**Steps:** Viewport 320–1920; Chrome/Safari-iOS/Firefox/Edge/Samsung Internet; no horizontal scroll; tap target ≥ 44×44px; gesture peta mobile; fallback video/reduced-motion.
**Verification:** `qa-checklist.md` berisi status pass/fail + catatan bug.

#### Task 10.6: Validasi checklist rilis PRD
**Steps:** Verifikasi seluruh checklist Lampiran PRD §13 sebelum UAT/handover.
**Verification:** Semua item tercentang; aset final (video, foto, copy, data) sudah bukan placeholder.


## 5. Urutan Eksekusi & Dependensi

```
M0 (selesai) → M1 Foundation → M2 Shell → M3 Hero → M4 About → M5 Menu/BestSeller
   → M6 Promo → M7 Lokasi → M8 FamiGo/Analytics → M9 CMS → M10 QA/Rilis
```

- **Paralel-able:** Task 9.1 (dokumen kontrak API — murni dokumen, bisa mulai kapan saja), sisa tindak lanjut M0 (pengumpulan aset), stub analytics (sejak M1).
- **Tergantung M1:** semua task section UI (butuh facade + types dari Task 1.2).
- **Tergantung aset final:** Task 10.6 dan rilis — placeholder development-only tidak boleh lolos ke produksi.
- **Urutan risiko rendah → tinggi:** Hero & About dikerjakan sebelum Menu/Lokasi agar visual utama cepat terlihat; Lokasi (paling kompleks) dikerjakan setelah pola section terbentuk.

## 6. Struktur File Target (PRD §8)

```txt
src/
├─ components/
│  ├─ layout/    (Navbar, MobileDrawer, Footer)
│  ├─ sections/  (Hero, About, Menu, MenuDetailModal, BestSeller, Promo, Location, MapView, FamiGoBanner)
│  └─ ui/        (Button, Card, Badge, Skeleton, Modal, Carousel, EmptyState, SectionHeading,
│                MenuCard, PromoCard, BranchCard, VideoBackground)
├─ pages/        (Home, PromoList, PromoDetail, NotFound)
├─ services/     (contentApi, cmsClient, mockData, analytics)
├─ hooks/        (useScrollSpy, useReducedMotion, useSaveData, useMenuFilters,
│                useGeolocation, useNearestBranches)
├─ types/        (content.ts)
├─ utils/        (haversine, googleMaps, formatters, sanitize)
└─ styles/       (index.css)
```

## 7. Definition of Done

**Per task:**
- Implementasi sesuai PRD + plan ini; tidak ada TypeScript/build error.
- UI responsive mobile & desktop; state loading/error/empty ditangani.
- Aksesibilitas dasar: keyboard, focus, aria-label, alt text, kontras.
- Data dinamis **selalu** lewat service layer (tidak bypass ke mock/client CMS langsung).
- Verifikasi task dicatat (commit message/catatan kerja).

**Milestone final (rilis):**
- Semua section PRD tampil; konten tersambung ke API Custom CMS final.
- `/promo` dan `/promo/:slug` berjalan; peta/list lokasi berjalan + fallback izin ditolak.
- CTA FamiGo + semua analytics event aktif.
- Lighthouse mobile Performance ≥ 85, Accessibility ≥ 90, CLS ≤ 0,1.
- Seluruh checklist rilis PRD §13 terverifikasi; **tidak ada aset placeholder/AI generik** di produksi.

## 8. Risiko Utama & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Video hero berat → LCP lambat | Poster prioritas, versi mobile ≤2MB, saveData/reduced-motion fallback, video lazy (M3) |
| Aset brand belum siap (mayoritas checklist Missing) | Mock/placeholder berlabel dev-only; kejar produksi aset sejak sekarang; rilis diblokir sampai aset final |
| Data cabang tidak akurat / belum ada | Validasi koordinat di CMS + CSV import; QA sample cabang; mock pakai koordinat valid Indonesia |
| 1.000+ pin → peta lambat | Marker clustering + lazy-load bundle peta (M7) |
| OSM tile usage policy di production | Validasi traffic & terms sebelum rilis; siapkan tile provider alternatif bila perlu |
| Izin lokasi ditolak | Fallback pencarian kota/provinsi (M7) |
| CMS custom belum dibangun | Kontrak API (9.1) paralel; mock adapter menutupi dev hingga API siap (9.2) |
| SPA murni → SEO buruk | Prerender/SSG-ready sejak M1; verifikasi HTML build di Task 10.4 |
| XSS dari konten CMS | Sanitasi rich text sebelum render (M4/M6/9.2) |
