#!/usr/bin/env node
/**
 * Generator aset placeholder BERGAYA BRAND — FamilyMart Indonesia.
 *
 * ⚠️ DEVELOPMENT ONLY (docs/content-asset-checklist.md §13):
 * SVG ini pengganti sementara placehold.co agar halaman development
 * terlihat utuh dan on-brand. Untuk RILIS, semua visual HARUS diganti
 * aset asli (foto produk/gerai nyata, video produksi) yang sudah
 * divalidasi tim brand.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "assets");

const GREEN = "#16a34a";
const BLUE = "#0ea5e9";
const DEEP = "#0369a1";
const DARK = "#0c4a6e";
const LIGHT = "#f0f9ff";
const WHITE = "#ffffff";
const FAMILY = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

for (const dir of ["hero", "about", "menu", "promo", "famigo"]) {
  mkdirSync(join(OUT, dir), { recursive: true });
}

const write = (rel, content) => {
  writeFileSync(join(OUT, rel), content);
  console.log(`✓ public/assets/${rel}`);
};

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const text = (
  x,
  y,
  s,
  { size = 40, fill = DARK, weight = 800, anchor = "middle", spacing = 0 } = {},
) =>
  `<text x="${x}" y="${y}" font-family="${FAMILY}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}">${esc(s)}</text>`;

const wrap = (s, max, maxLines = 3) => {
  const words = String(s).split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line.trim());
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
};

/** Pita awning hijau-putih-biru — signature brand. */
const AWNING_DEFS = `<defs><pattern id="awning" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="${WHITE}"/><rect width="24" height="8" fill="${GREEN}"/><rect y="12" width="24" height="8" fill="${BLUE}"/></pattern></defs>`;
const awningRect = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#awning)"/>`;

const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">${AWNING_DEFS}${body}</svg>`;

/** Ikon sederhana per kategori (dipakai di thumbnail menu & About). */
const ICONS = {
  makanan: `<path d="M -72 8 A 72 72 0 0 1 72 8 Z" fill="${DEEP}"/><circle cx="0" cy="-72" r="10" fill="${GREEN}"/><rect x="-94" y="8" width="188" height="16" rx="8" fill="${GREEN}"/>`,
  minuman: `<path d="M -46 -56 H 46 L 30 70 H -30 Z" fill="${BLUE}"/><rect x="-56" y="-68" width="112" height="16" rx="8" fill="${DEEP}"/><rect x="14" y="-104" width="14" height="50" rx="7" fill="${GREEN}" transform="rotate(18 21 -79)"/><rect x="-26" y="-6" width="52" height="18" rx="6" fill="${WHITE}" opacity="0.9"/>`,
  snack: `<circle cx="0" cy="0" r="78" fill="${GREEN}"/><circle cx="-26" cy="-18" r="10" fill="${WHITE}" opacity="0.85"/><circle cx="22" cy="14" r="12" fill="${WHITE}" opacity="0.85"/><circle cx="-6" cy="38" r="9" fill="${WHITE}" opacity="0.85"/><circle cx="30" cy="-34" r="8" fill="${WHITE}" opacity="0.85"/>`,
};

/** Thumbnail menu 640x640: awning atas + ikon kategori + nama menu. */
function menuThumb({ slug, name, category, kind }) {
  const lines = wrap(name, 18, 2);
  const startY = 548 - (lines.length - 1) * 28;
  const body = `
<rect width="640" height="640" fill="${LIGHT}"/>
${awningRect(0, 0, 640, 32)}
${text(320, 96, category.toUpperCase(), { size: 26, fill: BLUE, weight: 700, spacing: 6 })}
<circle cx="320" cy="300" r="150" fill="${WHITE}"/>
<circle cx="320" cy="300" r="150" fill="none" stroke="${BLUE}" stroke-opacity="0.15" stroke-width="4"/>
<g transform="translate(320 300) scale(1.3)">${ICONS[kind]}</g>
${lines.map((l, i) => text(320, startY + i * 56, l, { size: 44, fill: DARK })).join("")}
${lines.length <= 2 ? `<rect x="240" y="606" width="160" height="6" rx="3" fill="${GREEN}"/>` : ""}`;
  write(join("menu", `${slug}.svg`), svgDoc(640, 640, body));
}

/** Thumbnail promo 800x450: latar gradien brand + tag + judul. */
function promoThumb({ slug, title }) {
  const lines = wrap(title, 26, 2);
  const startY = 300 - (lines.length - 1) * 34;
  const body = `
<defs><linearGradient id="promoBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${DARK}"/><stop offset="1" stop-color="${BLUE}"/></linearGradient></defs>
<rect width="800" height="450" fill="url(#promoBg)"/>
<circle cx="710" cy="60" r="130" fill="${WHITE}" opacity="0.06"/>
<circle cx="70" cy="400" r="100" fill="${WHITE}" opacity="0.05"/>
<circle cx="740" cy="380" r="56" fill="${GREEN}" opacity="0.12"/>
<rect x="330" y="76" width="140" height="44" rx="22" fill="${GREEN}"/>
${text(400, 107, "PROMO", { size: 24, fill: WHITE, spacing: 6 })}
${lines.map((l, i) => text(400, startY + i * 62, l, { size: 48, fill: WHITE })).join("")}
<rect x="350" y="394" width="100" height="8" rx="4" fill="${GREEN}"/>
${awningRect(0, 424, 800, 26)}`;
  write(join("promo", `${slug}.svg`), svgDoc(800, 450, body));
}

/** Poster hero 1600x900. */
function heroPosterDesktop() {
  const body = `
<defs><linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${DARK}"/><stop offset="1" stop-color="${DEEP}"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#heroBg)"/>
<circle cx="1400" cy="140" r="300" fill="${WHITE}" opacity="0.05"/>
<circle cx="140" cy="820" r="360" fill="${BLUE}" opacity="0.12"/>
<circle cx="1240" cy="740" r="180" fill="${GREEN}" opacity="0.10"/>
<rect x="670" y="200" width="260" height="56" rx="28" fill="${WHITE}" opacity="0.14"/>
<circle cx="716" cy="228" r="8" fill="${GREEN}"/>
${text(810, 236, "OPEN 24 JAM", { size: 24, fill: WHITE, spacing: 6 })}
${text(800, 430, "Belanja Lagi di", { size: 92, fill: WHITE })}
${text(800, 580, "FamilyMart", { size: 128, fill: WHITE })}
<rect x="590" y="622" width="420" height="10" rx="5" fill="${GREEN}"/>
${text(800, 700, "Menu segar, promo harian, dan gerai terdekat — semua ada di satu tempat.", { size: 34, fill: WHITE, weight: 500 })}
${awningRect(0, 876, 1600, 24)}`;
  write("hero/poster-desktop.svg", svgDoc(1600, 900, body));
}

/** Poster hero mobile 800x1000. */
function heroPosterMobile() {
  const body = `
<defs><linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${DARK}"/><stop offset="1" stop-color="${DEEP}"/></linearGradient></defs>
<rect width="800" height="1000" fill="url(#heroBg)"/>
<circle cx="700" cy="140" r="240" fill="${WHITE}" opacity="0.05"/>
<circle cx="80" cy="900" r="280" fill="${BLUE}" opacity="0.12"/>
<rect x="270" y="280" width="260" height="56" rx="28" fill="${WHITE}" opacity="0.14"/>
<circle cx="316" cy="308" r="8" fill="${GREEN}"/>
${text(400, 316, "OPEN 24 JAM", { size: 24, fill: WHITE, spacing: 6 })}
${text(400, 500, "Belanja Lagi", { size: 76, fill: WHITE })}
${text(400, 600, "di FamilyMart", { size: 76, fill: WHITE })}
<rect x="290" y="640" width="220" height="10" rx="5" fill="${GREEN}"/>
${text(400, 740, "Menu segar, promo harian,", { size: 32, fill: WHITE, weight: 500 })}
${text(400, 784, "dan gerai terdekat — semua di satu tempat.", { size: 32, fill: WHITE, weight: 500 })}
${awningRect(0, 976, 800, 24)}`;
  write("hero/poster-mobile.svg", svgDoc(800, 1000, body));
}

/** Ilustrasi About: storefront bergaya brand 640x480. */
function aboutStorefront() {
  const body = `
<rect width="640" height="480" fill="${LIGHT}"/>
<circle cx="590" cy="70" r="46" fill="${GREEN}" opacity="0.18"/>
<circle cx="52" cy="60" r="28" fill="${BLUE}" opacity="0.15"/>
<circle cx="60" cy="404" r="38" fill="${GREEN}"/><rect x="54" y="410" width="12" height="34" rx="6" fill="${GREEN}"/>
<circle cx="584" cy="404" r="38" fill="${GREEN}"/><rect x="578" y="410" width="12" height="34" rx="6" fill="${GREEN}"/>
<rect x="120" y="140" width="400" height="270" rx="16" fill="${WHITE}"/>
<rect x="180" y="104" width="280" height="52" rx="12" fill="${DEEP}"/>
${text(320, 139, "FamilyMart", { size: 30, fill: WHITE })}
${awningRect(120, 168, 400, 28)}
<rect x="148" y="238" width="72" height="72" rx="10" fill="${BLUE}" opacity="0.85"/>
<rect x="420" y="238" width="72" height="72" rx="10" fill="${BLUE}" opacity="0.85"/>
<rect x="272" y="238" width="96" height="140" rx="10" fill="${DARK}"/>
<rect x="284" y="250" width="72" height="60" rx="6" fill="${BLUE}" opacity="0.5"/>
<rect x="100" y="404" width="440" height="18" rx="9" fill="${GREEN}" opacity="0.25"/>`;
  write("about/gerai.svg", svgDoc(640, 480, body));
}

/** Ilustrasi About: produk segar 480x480. */
function aboutProducts() {
  const body = `
<rect width="480" height="480" fill="${LIGHT}"/>
${awningRect(0, 0, 480, 24)}
<circle cx="240" cy="250" r="150" fill="${WHITE}"/>
<circle cx="240" cy="250" r="150" fill="none" stroke="${BLUE}" stroke-opacity="0.15" stroke-width="4"/>
<g transform="translate(240 250) scale(1.35)">${ICONS.minuman}</g>
<g transform="translate(96 148) scale(0.5)">${ICONS.makanan}</g>
<g transform="translate(392 356) scale(0.5)">${ICONS.snack}</g>
${text(240, 442, "Segar Setiap Hari", { size: 30, fill: DARK })}`;
  write("about/produk.svg", svgDoc(480, 480, body));
}

/** Banner FamiGo desktop 1200x400. */
function famigoDesktop() {
  const body = `
<defs><linearGradient id="famigoBg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${DEEP}"/><stop offset="1" stop-color="${BLUE}"/></linearGradient></defs>
<rect width="1200" height="400" fill="url(#famigoBg)"/>
${awningRect(0, 0, 18, 400)}
<circle cx="240" cy="40" r="140" fill="${WHITE}" opacity="0.06"/>
${text(96, 170, "Unduh Aplikasi", { size: 34, fill: WHITE, weight: 500, anchor: "start" })}
${text(96, 240, "FamiGo", { size: 84, fill: WHITE, anchor: "start" })}
<rect x="96" y="272" width="220" height="10" rx="5" fill="${GREEN}"/>
${text(96, 330, "App Store  •  Google Play  •  Gratis", { size: 28, fill: WHITE, weight: 500, anchor: "start" })}
<rect x="900" y="70" width="170" height="270" rx="26" fill="${WHITE}"/>
<rect x="912" y="86" width="146" height="238" rx="16" fill="${LIGHT}"/>
<circle cx="985" cy="180" r="42" fill="${GREEN}"/>
<rect x="969" y="164" width="32" height="32" rx="8" fill="${WHITE}"/>
${text(985, 278, "FamiGo", { size: 26, fill: DARK })}`;
  write("famigo/banner-desktop.svg", svgDoc(1200, 400, body));
}

/** Banner FamiGo mobile 800x600. */
function famigoMobile() {
  const body = `
<defs><linearGradient id="famigoBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${DEEP}"/><stop offset="1" stop-color="${BLUE}"/></linearGradient></defs>
<rect width="800" height="600" fill="url(#famigoBg)"/>
${awningRect(0, 0, 800, 24)}
<circle cx="700" cy="520" r="130" fill="${WHITE}" opacity="0.06"/>
${text(400, 100, "Unduh Aplikasi FamiGo", { size: 40, fill: WHITE, weight: 500 })}
<rect x="310" y="150" width="180" height="290" rx="26" fill="${WHITE}"/>
<rect x="322" y="166" width="156" height="258" rx="16" fill="${LIGHT}"/>
<circle cx="400" cy="270" r="44" fill="${GREEN}"/>
<rect x="384" y="254" width="32" height="32" rx="8" fill="${WHITE}"/>
${text(400, 370, "FamiGo", { size: 26, fill: DARK })}
${text(400, 520, "App Store  •  Google Play  •  Gratis", { size: 30, fill: WHITE, weight: 500 })}`;
  write("famigo/banner-mobile.svg", svgDoc(800, 600, body));
}

/** Data menu (sinkron dengan src/services/mockData.ts). */
const MENUS = [
  { slug: "onigiri-tuna-mayo", name: "Onigiri Tuna Mayo", category: "Makanan", kind: "makanan" },
  { slug: "chicken-katsu-curry", name: "Chicken Katsu Curry", category: "Makanan", kind: "makanan" },
  { slug: "ramyeon-spicy-korea", name: "Ramyeon Spicy Korea", category: "Makanan", kind: "makanan" },
  { slug: "bento-ayam-teriyaki", name: "Bento Ayam Teriyaki", category: "Makanan", kind: "makanan" },
  { slug: "spaghetti-carbonara", name: "Spaghetti Carbonara", category: "Makanan", kind: "makanan" },
  { slug: "ocha-matcha-latte", name: "Ocha Matcha Latte", category: "Minuman", kind: "minuman" },
  { slug: "kopi-susu-gula-aren", name: "Kopi Susu Gula Aren", category: "Minuman", kind: "minuman" },
  { slug: "teh-botol-dingin", name: "Teh Botol Dingin", category: "Minuman", kind: "minuman" },
  { slug: "air-mineral-600ml", name: "Air Mineral 600ml", category: "Minuman", kind: "minuman" },
  { slug: "choco-pie", name: "Choco Pie", category: "Snack", kind: "snack" },
  { slug: "keripik-pisang", name: "Keripik Pisang", category: "Snack", kind: "snack" },
  { slug: "menu-nonaktif-dev", name: "Menu Nonaktif (dev)", category: "Snack", kind: "snack" },
];

/** Data promo (sinkron dengan src/services/mockData.ts). */
const PROMOS = [
  { slug: "happy-hour-minuman", title: "Happy Hour: Diskon 30% Minuman" },
  { slug: "bundling-onigiri-ocha", title: "Bundling Hemat: Onigiri + Ocha" },
  { slug: "poin-double-member", title: "Poin Double untuk Member FamiGo" },
  { slug: "sarapan-hemat", title: "Sarapan Hemat Mulai 10 Ribu" },
  { slug: "weekend-snack-fest", title: "Weekend Snack Fest" },
  { slug: "promo-draft-dev", title: "Promo Draft (dev)" },
  { slug: "promo-expired-dev", title: "Promo Expired (dev)" },
];

console.log("Membuat aset placeholder bergaya brand (development-only)…\n");
MENUS.forEach(menuThumb);
PROMOS.forEach(promoThumb);
heroPosterDesktop();
heroPosterMobile();
aboutStorefront();
aboutProducts();
famigoDesktop();
famigoMobile();
console.log(`\nSelesai: ${MENUS.length + PROMOS.length + 6} aset dibuat di public/assets/.`);
