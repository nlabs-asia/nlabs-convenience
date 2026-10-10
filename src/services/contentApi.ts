/**
 * Facade data utama landing page — Family Mart Indonesia.
 * (task-plan Task 1.2; prinsip arsitektur docs/technical-decisions.md §2)
 *
 * Komponen UI HANYA boleh mengambil data lewat file ini — jangan import
 * mockData/cmsClient secara langsung. Saat API Custom CMS siap (Task 9.2),
 * implementasi internal di bawah ditukar ke adapter CMS tanpa mengubah
 * konsumen (signature fungsi tetap).
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
import {
  aboutContent,
  branchList,
  famigoBannerContent,
  footerContent,
  heroContent,
  menuCategories,
  menuItems,
  promoList,
} from "./mockData";

/** Salinan dalam agar consumer tidak bisa memutasi sumber data. */
function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

export interface GetMenuOptions {
  categorySlug?: string;
  search?: string;
  /** Default 12 (rentang 8–12 sesuai PRD §4.3). */
  limit?: number;
  offset?: number;
}

export interface GetPromosOptions {
  limit?: number;
}

/** Promo tampil hanya jika published dan berada dalam periode (PRD §4.5). */
function isPromoVisible(promo: Promo, now: Date = new Date()): boolean {
  if (promo.status !== "published") return false;
  if (promo.startDate && new Date(promo.startDate) > now) return false;
  if (promo.endDate && new Date(promo.endDate) < now) return false;
  return true;
}

export async function getHero(): Promise<HeroContent> {
  return clone(heroContent);
}

export async function getAbout(): Promise<AboutContent> {
  return clone(aboutContent);
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  return clone(menuCategories.filter((category) => category.isActive));
}

export async function getMenuItems(
  options: GetMenuOptions = {},
): Promise<PagedResult<MenuItem>> {
  const { categorySlug, search, limit = 12, offset = 0 } = options;
  const query = search?.trim().toLowerCase();

  const filtered = menuItems.filter((item) => {
    if (!item.isActive) return false;
    if (categorySlug) {
      const category = menuCategories.find((c) => c.slug === categorySlug);
      if (!category || item.categoryId !== category.id) return false;
    }
    if (query && !item.name.toLowerCase().includes(query)) return false;
    return true;
  });

  const items = clone(filtered.slice(offset, offset + limit));
  return {
    items,
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
  };
}

export async function getBestSellers(limit = 6): Promise<MenuItem[]> {
  const best = menuItems
    .filter((item) => item.isActive && item.isBestSeller)
    .sort((a, b) => (a.bestSellerOrder ?? 99) - (b.bestSellerOrder ?? 99))
    .slice(0, limit);
  return clone(best);
}

export async function getPromos(
  options: GetPromosOptions = {},
): Promise<Promo[]> {
  const visible = promoList
    .filter((promo) => isPromoVisible(promo))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  return clone(
    options.limit !== undefined ? visible.slice(0, options.limit) : visible,
  );
}

export async function getPromoBySlug(slug: string): Promise<Promo | null> {
  const found = promoList.find((promo) => promo.slug === slug);
  return found && isPromoVisible(found) ? clone(found) : null;
}

export async function getBranches(): Promise<Branch[]> {
  return clone(branchList.filter((branch) => branch.isActive));
}

export async function getFamiGoBanner(): Promise<FamiGoBanner | null> {
  // Banner nonaktif → section disembunyikan (PRD §4.7).
  return famigoBannerContent.isActive ? clone(famigoBannerContent) : null;
}

export async function getFooter(): Promise<FooterContent> {
  return clone(footerContent);
}
