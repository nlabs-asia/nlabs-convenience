/**
 * Tipe data konten landing page Family Mart Indonesia.
 * Sumber: PRD §6 + docs/task-plan.md (Task 1.2, model data).
 *
 * Semua konten dinamis harus mengalir lewat src/services/contentApi.ts —
 * komponen UI tidak boleh import mock data / client CMS secara langsung.
 */

export interface HeroContent {
  id: string;
  headline: string;
  subHeadline: string;
  primaryCtaLabel: string;
  primaryCtaTarget: string;
  secondaryCtaLabel: string;
  secondaryCtaTarget: string;
  /** URL video hero. String kosong berarti fallback ke poster (mode dev). */
  videoDesktopWebm: string;
  videoDesktopMp4: string;
  videoMobileWebm: string;
  videoMobileMp4: string;
  posterDesktop: string;
  posterMobile: string;
  isActive: boolean;
  updatedAt: string;
}

export interface AboutHighlight {
  label: string;
  value: string;
  suffix?: string;
  order: number;
}

export interface AboutContent {
  id: string;
  title: string;
  /** Rich text dari CMS — WAJIB disanitasi sebelum render (PRD §7.5). */
  bodyRichText: string;
  imagePrimary: string;
  imagePrimaryAlt: string;
  imageSecondary?: string;
  imageSecondaryAlt?: string;
  highlights: AboutHighlight[];
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  /** Opsional (open question PRD) — tampil hanya jika ada. */
  price?: number;
  image: string;
  imageAlt: string;
  isActive: boolean;
  /** Best Seller bukan entity terpisah — flag pada MenuItem (PRD §4.4). */
  isBestSeller: boolean;
  bestSellerOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export type PromoStatus = "draft" | "published";

export interface Promo {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailAlt: string;
  /** ISO date (YYYY-MM-DD). Opsional — promo otomatis tampil/hilang. */
  startDate?: string;
  endDate?: string;
  status: PromoStatus;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  /** Koordinat wajib & divalidasi (PRD §4.6). */
  lat: number;
  lng: number;
  openingHours?: string;
  phone?: string;
  /** Jika kosong, frontend generate dari koordinat. */
  googleMapsUrl?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface FamiGoBanner {
  id: string;
  imageDesktop: string;
  imageMobile: string;
  imageAlt: string;
  headline: string;
  description: string;
  appStoreUrl: string;
  playStoreUrl: string;
  qrCodeImage?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface FooterContent {
  id: string;
  description: string;
  officeAddress: string;
  email: string;
  phone: string;
  socialLinks: SocialLink[];
  privacyPolicyUrl: string;
  termsUrl: string;
  updatedAt: string;
}
