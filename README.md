# FamilyMart Indonesia — Landing Page Redesign

Redesign landing page FamilyMart Indonesia: modern, cepat, responsive
(mobile-first), SEO-ready, dan seluruh konten dinamisnya siap dikelola
melalui **Custom CMS**.

> Status: **SIT build** (branch `sit`) — seluruh milestone frontend M0–M8
> selesai. Data masih memakai mock development; integrasi API CMS (M9)
> dan QA/performa/SEO (M10) menyusul.

## Tech Stack

- **Vite + React 19 + TypeScript** (strict)
- **Tailwind CSS v4** dengan design tokens brand (primary `#0ea5e9`)
- **React Router** — `/`, `/promo`, `/promo/:slug`
- **Leaflet + OpenStreetMap** + marker clustering (lazy-loaded)
- **DOMPurify** untuk sanitasi rich text dari CMS

## Struktur

```
src/
├─ components/   (layout / sections / ui)
├─ pages/        (Home, PromoList, PromoDetail, NotFound)
├─ services/     (contentApi facade, mockData dev-only, analytics)
├─ hooks/        (scroll-spy, geolocation, nearest-branches, dll.)
├─ types/        (model data PRD §6)
├─ utils/       (haversine, google-maps url, formatters, sanitize)
└─ styles/       (design tokens + utilities)
```

**Arsitektur data:** komponen UI hanya mengakses data lewat
`src/services/contentApi.ts` (facade) — mock data bisa ditukar ke API
Custom CMS tanpa mengubah komponen.

## Dokumentasi

- `PRD-Landing-Page-FamilyMart-Indonesia.md` — kebutuhan produk
- `docs/task-plan.md` — rencana kerja & status milestone
- `docs/technical-decisions.md` — keputusan teknis (Locked/Baseline)
- `docs/content-asset-checklist.md` — status aset & konten

## Menjalankan

```bash
npm install
npm run dev              # dev server
npm run build            # typecheck + production build
npm run preview          # preview hasil build
npm run assets:generate  # regenerasi aset placeholder dev (SVG)
```

## Catatan Aset

Seluruh gambar/copy masih **development placeholder** — untuk rilis
publik wajib diganti aset asli (foto/video produksi, copy ter-validasi
brand, link store resmi). Lihat
`docs/content-asset-checklist.md` §13.
