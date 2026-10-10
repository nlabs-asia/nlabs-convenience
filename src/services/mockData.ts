/**
 * Mock data DEVELOPMENT-ONLY — Family Mart Indonesia landing page.
 *
 * ⚠️ JANGAN dipakai untuk rilis publik (docs/content-asset-checklist.md §13):
 * narasi About, angka highlight, kontak, link sosial/store, dan koordinat
 * cabang BELUM divalidasi tim brand. Thumbnail/poster memakai SVG bergaya
 * brand yang di-generate scripts/generate-placeholder-assets.mjs —
 * untuk rilis, ganti dengan foto/video produksi asli.
 * File ini hanya dikonsumsi lewat src/services/contentApi.ts (facade) dan
 * akan digantikan adapter CMS nyata pada Task 9.2.
 */
import type {
  AboutContent,
  Branch,
  FamiGoBanner,
  FooterContent,
  HeroContent,
  MenuCategory,
  MenuItem,
  Promo,
} from "../types/content";

/** Aset SVG bergaya brand (development-only) — hasil assets:generate. */
const asset = (folder: string, file: string) => `/assets/${folder}/${file}`;

const now = "2026-10-10T00:00:00.000Z";

export const heroContent: HeroContent = {
  id: "hero-main",
  headline: "Belanja Lagi di FamilyMart",
  subHeadline:
    "Dari sarapan sampai camilan tengah malam — menu segar, promo harian, dan gerai terdekat, semua ada di satu tempat.",
  primaryCtaLabel: "Lihat Menu",
  primaryCtaTarget: "#menu",
  secondaryCtaLabel: "Cari Gerai Terdekat",
  secondaryCtaTarget: "#lokasi",
  // Video final (footage nyata produksi, 8–15 dtk, ≤4MB desktop / ≤2MB mobile)
  // belum tersedia — string kosong membuat hero fallback ke poster.
  videoDesktopWebm: "",
  videoDesktopMp4: "",
  videoMobileWebm: "",
  videoMobileMp4: "",
  // Poster: foto gerai FamilyMart terbesar di dunia (Udenna Tower, BGC,
  // Manila — dibuka Nov 2019, ±390 m²). Sumber: artikel Udenna Group
  // (udenna.ph), kredit foto FamilyMart Philippines.
  // ⚠️ Lisensi belum diverifikasi — dev-only, wajib izin brand sebelum rilis.
  posterDesktop: asset("hero", "store-terbesar-bgc.jpg"),
  posterMobile: asset("hero", "store-terbesar-bgc.jpg"),
  isActive: true,
  updatedAt: now,
};

export const aboutContent: AboutContent = {
  id: "about-main",
  title: "Tentang FamilyMart",
  // Narasi konbini generik tanpa klaim sejarah/angka spesifik —
  // versi final wajib divalidasi tim brand sebelum rilis (PRD §4.2).
  bodyRichText:
    "<p><strong>FamilyMart</strong> adalah jaringan toko serba ada (konbini) yang menghadirkan kemudahan belanja kebutuhan harian — siang maupun malam. Dari makanan segar, minuman kekinian, sampai kebutuhan mendadak, semuanya tersedia dalam gerai yang bersih, rapi, dan selalu siap melayani.</p><p>Dengan konsep <strong>fresh food</strong> dan layanan cepat, FamilyMart menjadi titik berhenti favorit bagi pelanggan yang mengejar waktu — tanpa harus mengorbankan rasa dan kualitas. Cukup mampir, pilih, bayar, dan lanjut beraktivitas.</p>",
  imagePrimary: asset("about", "gerai.svg"),
  imagePrimaryAlt: "Ilustrasi gerai FamilyMart dengan pita awning hijau-biru khas brand",
  imageSecondary: asset("about", "produk.svg"),
  imageSecondaryAlt: "Ilustrasi produk segar FamilyMart: makanan, minuman, dan snack",
  // Angka highlight tidak memakai klaim brand yang belum terverifikasi.
  highlights: [
    { label: "Buka Setiap Hari", value: "24", suffix: " Jam", order: 1 },
    { label: "Kategori Menu Utama", value: "3", suffix: " Favorit", order: 2 },
  ],
  updatedAt: now,
};

export const menuCategories: MenuCategory[] = [
  { id: "cat-makanan", name: "Makanan", slug: "makanan", order: 1, isActive: true },
  { id: "cat-minuman", name: "Minuman", slug: "minuman", order: 2, isActive: true },
  { id: "cat-snack", name: "Snack", slug: "snack", order: 3, isActive: true },
  // Kategori nonaktif — tidak boleh tampil di UI (uji filtering dev).
  { id: "cat-dessert", name: "Dessert", slug: "dessert", order: 4, isActive: false },
];

export const menuItems: MenuItem[] = [
  {
    id: "menu-001",
    name: "Onigiri Tuna Mayo",
    slug: "onigiri-tuna-mayo",
    categoryId: "cat-makanan",
    description:
      "Nasi hangat khas Jepang dengan isian tuna mayo creamy — kenyang praktis di genggaman.",
    price: 15000,
    image: asset("menu", "onigiri-tuna-mayo.svg"),
    imageAlt: "Onigiri Tuna Mayo FamilyMart",
    isActive: true,
    isBestSeller: true,
    bestSellerOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-002",
    name: "Chicken Katsu Curry",
    slug: "chicken-katsu-curry",
    categoryId: "cat-makanan",
    description:
      "Ayam katsu renyah di luar, lembut di dalam, disiram kari Jepang hangat yang gurih-manis.",
    price: 32000,
    image: asset("menu", "chicken-katsu-curry.svg"),
    imageAlt: "Chicken Katsu Curry FamilyMart",
    isActive: true,
    isBestSeller: true,
    bestSellerOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-003",
    name: "Ramyeon Spicy Korea",
    slug: "ramyeon-spicy-korea",
    categoryId: "cat-makanan",
    description:
      "Kuah pedas menggigit dengan mi kenyal — teman terbaik untuk malam yang panjang.",
    price: 25000,
    image: asset("menu", "ramyeon-spicy-korea.svg"),
    imageAlt: "Ramyeon Spicy Korea FamilyMart",
    isActive: true,
    isBestSeller: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-004",
    name: "Bento Ayam Teriyaki",
    slug: "bento-ayam-teriyaki",
    categoryId: "cat-makanan",
    description:
      "Nasi hangat, ayam teriyaki glaze manis-gurih, dan lauk pendamping dalam satu kotak rapi.",
    price: 35000,
    image: asset("menu", "bento-ayam-teriyaki.svg"),
    imageAlt: "Bento Ayam Teriyaki FamilyMart",
    isActive: true,
    isBestSeller: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-005",
    name: "Ocha Matcha Latte",
    slug: "ocha-matcha-latte",
    categoryId: "cat-minuman",
    description:
      "Matcha berani dipadukan susu creamy — dingin, segar, dan pas untuk teman sore.",
    price: 22000,
    image: asset("menu", "ocha-matcha-latte.svg"),
    imageAlt: "Ocha Matcha Latte FamilyMart",
    isActive: true,
    isBestSeller: true,
    bestSellerOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-006",
    name: "Kopi Susu Gula Aren",
    slug: "kopi-susu-gula-aren",
    categoryId: "cat-minuman",
    description:
      "Kopi pilihan, susu segar, dan manis alami gula aren dalam satu tegukan yang pas.",
    price: 24000,
    image: asset("menu", "kopi-susu-gula-aren.svg"),
    imageAlt: "Kopi Susu Gula Aren FamilyMart",
    isActive: true,
    isBestSeller: true,
    bestSellerOrder: 4,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-007",
    name: "Teh Botol Dingin",
    slug: "teh-botol-dingin",
    categoryId: "cat-minuman",
    description:
      "Klasik yang tak pernah salah — manis, wangi, dan menyegarkan langsung dari kulkas.",
    price: 8000,
    image: asset("menu", "teh-botol-dingin.svg"),
    imageAlt: "Teh Botol Dingin FamilyMart",
    isActive: true,
    isBestSeller: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-008",
    name: "Air Mineral 600ml",
    slug: "air-mineral-600ml",
    categoryId: "cat-minuman",
    description:
      "Air mineral murni dalam botol 600 ml — pendamping wajib di setiap perjalanan.",
    price: 6000,
    image: asset("menu", "air-mineral-600ml.svg"),
    imageAlt: "Air Mineral 600ml FamilyMart",
    isActive: true,
    isBestSeller: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-009",
    name: "Choco Pie",
    slug: "choco-pie",
    categoryId: "cat-snack",
    description:
      "Kue lembut berlapis cokelat dengan isian marshmallow yang meleleh lembut.",
    price: 5000,
    image: asset("menu", "choco-pie.svg"),
    imageAlt: "Choco Pie FamilyMart",
    isActive: true,
    isBestSeller: true,
    bestSellerOrder: 5,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-010",
    name: "Keripik Pisang",
    slug: "keripik-pisang",
    categoryId: "cat-snack",
    description:
      "Keripik pisang tipis dan renyah dengan manis gula alami — sekali coba, susah berhenti.",
    price: 12000,
    image: asset("menu", "keripik-pisang.svg"),
    imageAlt: "Keripik Pisang FamilyMart",
    isActive: true,
    isBestSeller: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    // Item nonaktif — tidak boleh tampil di UI (uji filtering dev).
    id: "menu-011",
    name: "Menu Nonaktif (dev)",
    slug: "menu-nonaktif-dev",
    categoryId: "cat-snack",
    description: "Item internal pengujian — tidak tampil di tampilan publik.",
    price: 10000,
    image: asset("menu", "menu-nonaktif-dev.svg"),
    imageAlt: "Item menu nonaktif (dev)",
    isActive: false,
    isBestSeller: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "menu-012",
    name: "Spaghetti Carbonara",
    slug: "spaghetti-carbonara",
    categoryId: "cat-makanan",
    description:
      "Spaghetti al dente dengan saus carbonara creamy dan taburan keju melimpah.",
    price: 28000,
    image: asset("menu", "spaghetti-carbonara.svg"),
    imageAlt: "Spaghetti Carbonara FamilyMart",
    isActive: true,
    isBestSeller: false,
    createdAt: now,
    updatedAt: now,
  },
];

export const promoList: Promo[] = [
  {
    id: "promo-001",
    slug: "happy-hour-minuman",
    title: "Happy Hour: Diskon 30% Minuman",
    description:
      "Diskon 30% untuk semua minuman dingin setiap pukul 15.00–17.00 di seluruh gerai. Segarnya ganda, harganya jauh lebih ringan.",
    thumbnail: asset("promo", "happy-hour-minuman.svg"),
    thumbnailAlt: "Kartu promo Happy Hour diskon 30% minuman FamilyMart",
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    status: "published",
    order: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "promo-002",
    slug: "bundling-onigiri-ocha",
    title: "Bundling Hemat: Onigiri + Ocha",
    description:
      "Pasangan klasik Jepang dalam satu paket hemat: Onigiri Tuna Mayo dan Ocha Matcha Latte dengan harga spesial terbatas.",
    thumbnail: asset("promo", "bundling-onigiri-ocha.svg"),
    thumbnailAlt: "Kartu promo bundling Onigiri dan Ocha Matcha Latte FamilyMart",
    startDate: "2026-10-10",
    endDate: "2026-10-15",
    status: "published",
    order: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "promo-003",
    slug: "poin-double-member",
    title: "Poin Double untuk Member FamiGo",
    description:
      "Setiap transaksi lewat aplikasi FamiGo berpoin ganda selama periode promo. Kumpulkan, tukarkan, dan nikmati gratisnya.",
    thumbnail: asset("promo", "poin-double-member.svg"),
    thumbnailAlt: "Kartu promo poin double member FamiGo FamilyMart",
    startDate: "2026-10-05",
    endDate: "2026-11-05",
    status: "published",
    order: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "promo-004",
    slug: "sarapan-hemat",
    title: "Sarapan Hemat Mulai 10 Ribu",
    description:
      "Mulai hari dengan pilihan sarapan praktis mulai dari 10 ribu rupiah — hangat, mengenyangkan, dan siap menemani pagi Anda.",
    thumbnail: asset("promo", "sarapan-hemat.svg"),
    thumbnailAlt: "Kartu promo sarapan hemat mulai 10 ribu FamilyMart",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    status: "published",
    order: 4,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "promo-005",
    slug: "weekend-snack-fest",
    title: "Weekend Snack Fest",
    description:
      "Beli 2 gratis 1 untuk pilihan snack setiap Sabtu dan Minggu. Akhir pekan makin seru bareng orang terdekat.",
    thumbnail: asset("promo", "weekend-snack-fest.svg"),
    thumbnailAlt: "Kartu promo Weekend Snack Fest FamilyMart",
    // Tanpa periode — selalu tampil selama published.
    status: "published",
    order: 5,
    createdAt: now,
    updatedAt: now,
  },
  {
    // Promo draft — tidak boleh tampil di UI (uji filtering dev).
    id: "promo-006",
    slug: "promo-draft-dev",
    title: "Promo Draft (dev)",
    description: "Item internal pengujian — tidak tampil di tampilan publik.",
    thumbnail: asset("promo", "promo-draft-dev.svg"),
    thumbnailAlt: "Kartu promo draft (dev)",
    status: "draft",
    order: 6,
    createdAt: now,
    updatedAt: now,
  },
  {
    // Promo expired — tidak boleh tampil di UI (uji filtering dev).
    id: "promo-007",
    slug: "promo-expired-dev",
    title: "Promo Expired (dev)",
    description: "Item internal pengujian — periode sudah lewat, tidak boleh tampil.",
    thumbnail: asset("promo", "promo-expired-dev.svg"),
    thumbnailAlt: "Kartu promo expired (dev)",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    status: "published",
    order: 7,
    createdAt: now,
    updatedAt: now,
  },
];

export const famigoBannerContent: FamiGoBanner = {
  id: "famigo-banner",
  imageDesktop: asset("famigo", "banner-desktop.svg"),
  imageMobile: asset("famigo", "banner-mobile.svg"),
  imageAlt: "Banner unduh aplikasi FamiGo",
  headline: "Lebih Hemat Setiap Hari dengan FamiGo",
  description:
    "Kumpulkan poin di setiap transaksi, klaim promo eksklusif, dan dapatkan penawaran spesial hanya untuk member — semuanya dalam satu aplikasi.",
  // ⚠️ Link store placeholder dev-only — link resmi WAJIB sebelum rilis (PRD §13).
  appStoreUrl: "https://apps.apple.com/placeholder-famigo",
  playStoreUrl: "https://play.google.com/store/apps/details?id=placeholder.famigo",
  isActive: true,
  updatedAt: now,
};

export const footerContent: FooterContent = {
  id: "footer-main",
  description:
    "Toko serba ada yang siap melayani kebutuhan harian Anda — siang maupun malam, di gerai terdekat Anda.",
  // ⚠️ Kontak & sosial media dev-only — wajib diganti data resmi sebelum rilis.
  officeAddress: "Gedung FamilyMart Indonesia, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan",
  email: "customercare@familymart.co.id",
  phone: "(021) 5089 1234",
  socialLinks: [
    { platform: "Instagram", url: "https://www.instagram.com/familymart.indonesia" },
    { platform: "TikTok", url: "https://www.tiktok.com/@familymartindonesia" },
    { platform: "YouTube", url: "https://www.youtube.com/@FamilyMartIndonesia" },
  ],
  privacyPolicyUrl: "/kebijakan-privasi",
  termsUrl: "/syarat-ketentuan",
  updatedAt: now,
};

export const branchList: Branch[] = [
  {
    id: "br-001",
    name: "FamilyMart Sudirman",
    address: "Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan",
    city: "Jakarta",
    province: "DKI Jakarta",
    lat: -6.2249,
    lng: 106.809,
    openingHours: "24 jam",
    phone: "(021) 5089 1001",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-6.2249,106.8090",
    isActive: true,
    updatedAt: now,
  },
  {
    id: "br-002",
    name: "FamilyMart Kelapa Gading",
    address: "Jl. Boulevard Raya, Kelapa Gading, Jakarta Utara",
    city: "Jakarta",
    province: "DKI Jakarta",
    lat: -6.158,
    lng: 106.9055,
    openingHours: "24 jam",
    phone: "(021) 5089 1002",
    isActive: true,
    updatedAt: now,
  },
  {
    id: "br-003",
    name: "FamilyMart Dago",
    address: "Jl. Ir. H. Juanda (Dago) No. 100, Bandung",
    city: "Bandung",
    province: "Jawa Barat",
    lat: -6.8895,
    lng: 107.6147,
    openingHours: "07.00–23.00",
    isActive: true,
    updatedAt: now,
  },
  {
    id: "br-004",
    name: "FamilyMart Tunjungan",
    address: "Jl. Tunjungan No. 45, Surabaya",
    city: "Surabaya",
    province: "Jawa Timur",
    lat: -7.2607,
    lng: 112.7387,
    openingHours: "24 jam",
    isActive: true,
    updatedAt: now,
  },
  {
    id: "br-005",
    name: "FamilyMart Setiabudi Medan",
    address: "Jl. Setiabudi No. 78, Medan",
    city: "Medan",
    province: "Sumatera Utara",
    lat: 3.5952,
    lng: 98.671,
    openingHours: "08.00–22.00",
    isActive: true,
    updatedAt: now,
  },
  {
    id: "br-006",
    name: "FamilyMart Pettarani",
    address: "Jl. A. P. Pettarani, Makassar",
    city: "Makassar",
    province: "Sulawesi Selatan",
    lat: -5.1357,
    lng: 119.4753,
    openingHours: "08.00–22.00",
    isActive: true,
    updatedAt: now,
  },
  {
    id: "br-007",
    name: "FamilyMart Sunset Road",
    address: "Jl. Sunset Road No. 12, Kuta, Badung",
    city: "Denpasar",
    province: "Bali",
    lat: -8.7,
    lng: 115.1789,
    openingHours: "24 jam",
    isActive: true,
    updatedAt: now,
  },
  {
    id: "br-008",
    name: "FamilyMart Pandanaran",
    address: "Jl. Pandanaran No. 30, Semarang",
    city: "Semarang",
    province: "Jawa Tengah",
    lat: -6.9856,
    lng: 110.414,
    openingHours: "08.00–23.00",
    isActive: true,
    updatedAt: now,
  },
  {
    id: "br-009",
    name: "FamilyMart Malioboro",
    address: "Jl. Malioboro No. 52, Yogyakarta",
    city: "Yogyakarta",
    province: "DI Yogyakarta",
    lat: -7.797,
    lng: 110.37,
    openingHours: "08.00–22.00",
    isActive: true,
    updatedAt: now,
  },
  {
    id: "br-010",
    name: "FamilyMart Pemuda Palembang",
    address: "Jl. Pemuda No. 10, Palembang",
    city: "Palembang",
    province: "Sumatera Selatan",
    lat: -2.9761,
    lng: 104.7754,
    openingHours: "08.00–22.00",
    isActive: true,
    updatedAt: now,
  },
  {
    // Cabang nonaktif — tidak boleh tampil di UI (uji filtering dev).
    id: "br-011",
    name: "FamilyMart Balikpapan (nonaktif dev)",
    address: "Jl. Jend. Sudirman, Balikpapan",
    city: "Balikpapan",
    province: "Kalimantan Timur",
    lat: -1.2379,
    lng: 116.8529,
    isActive: false,
    updatedAt: now,
  },
];
