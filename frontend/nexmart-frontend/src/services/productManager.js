import { products as defaultProducts } from '../data/products';
import { api } from './api';

const STORAGE_KEY = 'appzys_live_products';
const BANNERS_STORAGE_KEY = 'appzys_live_banners';

// Default Homepage Hero Banners
export const defaultBanners = [
  {
    id: 'banner-1',
    title: 'Organise Your Sarees & Jewellery Beautifully',
    subtitle: 'Spacious, durable and stylish organisers for your sarees, clothes and jewellery.',
    imageUrl: '/images/appzys-hero-banner.jpg',
    btn1Text: 'Shop Saree Organiser',
    btn1Link: '/?category=saree-organiser',
    btn2Text: 'Shop Jewellery Organiser',
    btn2Link: '/?category=jewel-organiser',
    active: true
  }
];

/**
 * Get all live products (merges defaults with custom/edited products)
 */
export const getLiveProducts = () => {
  if (typeof window === 'undefined') return defaultProducts;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse live products, fallback to defaults:', err);
  }
  // Initialize localStorage with default products
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  } catch (_) {}
  return defaultProducts;
};

/**
 * Find single product by ID or categorySlug
 */
export const getLiveProductById = (id) => {
  const all = getLiveProducts();
  return all.find((p) => p.id === id || p.categorySlug === id) || null;
};

/**
 * Save or update a product (used by Admin Dashboard)
 */
export const saveLiveProduct = (productData) => {
  const currentList = getLiveProducts();
  const id = productData.id || productData.slug || ('prod-' + Date.now().toString(36));

  const mrp = parseInt(productData.mrp, 10) || 799;
  const basePrice = parseInt(productData.basePrice, 10) || 499;
  const discountPercent = mrp > basePrice ? Math.round(((mrp - basePrice) / mrp) * 100) : 0;

  const updatedProduct = {
    ...productData,
    id,
    categorySlug: productData.categorySlug || id,
    mrp,
    basePrice,
    discountPercent,
    rating: productData.rating || 4.9,
    reviewCount: productData.reviewCount || 100,
    inStock: productData.inStock !== false,
    updatedAt: new Date().toISOString()
  };

  const existingIdx = currentList.findIndex((p) => p.id === id);
  let newList;
  if (existingIdx > -1) {
    newList = [...currentList];
    newList[existingIdx] = updatedProduct;
  } else {
    newList = [updatedProduct, ...currentList];
  }

  // 1. Save to LocalStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    window.dispatchEvent(new Event('appzys_products_changed'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save product in localStorage:', err);
  }

  // 2. Sync to Spring Boot Backend API
  try {
    api.saveProduct({
      id: updatedProduct.id,
      brand: updatedProduct.brand || 'Wardrobe Organizers',
      title: updatedProduct.title,
      cardTitle: updatedProduct.cardTitle || updatedProduct.title,
      shortTitle: updatedProduct.shortTitle || updatedProduct.title,
      category: updatedProduct.category,
      categorySlug: updatedProduct.categorySlug,
      rating: updatedProduct.rating,
      reviewCount: updatedProduct.reviewCount,
      inStock: updatedProduct.inStock,
      basePrice: updatedProduct.basePrice,
      mrp: updatedProduct.mrp,
      discountPercent: updatedProduct.discountPercent,
      description: updatedProduct.description || updatedProduct.specs,
      dataJson: JSON.stringify(updatedProduct)
    }).catch((apiErr) => console.warn('Backend sync deferred:', apiErr.message));
  } catch (_) {}

  return updatedProduct;
};

/**
 * Delete a product
 */
export const deleteLiveProduct = (id) => {
  const currentList = getLiveProducts();
  const filtered = currentList.filter((p) => p.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('appzys_products_changed'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error(err);
  }

  try {
    api.deleteProduct(id).catch(() => {});
  } catch (_) {}

  return filtered;
};

/**
 * Reset products back to default factory baseline
 */
export const resetToDefaultProducts = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    window.dispatchEvent(new Event('appzys_products_changed'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error(err);
  }
  return defaultProducts;
};

/**
 * Homepage Banners CMS
 */
export const getLiveBanners = () => {
  if (typeof window === 'undefined') return defaultBanners;
  try {
    const saved = localStorage.getItem(BANNERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  try {
    localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(defaultBanners));
  } catch (_) {}
  return defaultBanners;
};

export const saveLiveBanners = (banners) => {
  try {
    localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));
    window.dispatchEvent(new Event('appzys_banners_changed'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error(err);
  }
  return banners;
};

/**
 * Product Transformation (Before & After) Sliders CMS
 */
const SLIDERS_STORAGE_KEY = 'appzys_live_transformation_sliders';

export const defaultSliders = [
  {
    id: 'saree',
    badge: 'WARDROBE TRANSFORMATION',
    headerTitle: 'See The Almirah Transformation',
    headerSubtitle: 'Drag the center slider left and right to compare before & after',
    shopText: 'Shop Saree Organiser',
    shopLink: '/product/saree-organiser',
    beforeImg: '/images/transformation-before-banner.png',
    afterImg: '/images/transformation-after-banner.png',
    beforeBadge: '❌ BEFORE: ORDINARY ALMIRAH',
    beforeTitle: 'Messy, Sagging & Collapsing Pile',
    beforeDesc: 'Sarees pile up and sag without support. Pulling one saree from the bottom tumbles the whole cupboard and damages precious silk zari.',
    beforePill: 'Crushed Zari • Wrinkles • Dust Exposure',
    afterBadge: '✨ AFTER: APPZYS® LIVING BOX',
    afterTitle: 'Neat, Stacked & 100% Wrinkle-Free',
    afterDesc: 'Stack up to 4 boxes rigidly with 4mm solid steel rods. Slide any saree out from the front zipper window in 2 seconds without unstacking!',
    afterPill: '15-18 Sarees Per Box • Dust-Proof'
  },
  {
    id: 'jewellery',
    badge: 'JEWELLERY TRANSFORMATION',
    headerTitle: 'See The Jewellery Vanity Transformation',
    headerSubtitle: 'Drag the center slider left and right to compare before & after',
    shopText: 'Shop Jewellery Organiser',
    shopLink: '/product/jewellery-organiser',
    beforeImg: '/images/jewellery-transformation-before.png',
    afterImg: '/images/jewellery-transformation-after.png',
    beforeBadge: '❌ BEFORE: MESSY DRESSING TABLE',
    beforeTitle: 'Tangled Chains & Lost Earrings',
    beforeDesc: 'Precious gold necklaces knot together, delicate chains tangle, and stones get scratched on open trays and loose plastic boxes.',
    beforePill: 'Tangled Knots • Scratched Stones • Lost Pairs',
    afterBadge: '✨ AFTER: APPZYS® LUXURY CASE',
    afterTitle: 'Tangle-Free Velvet Protection',
    afterDesc: 'Anti-tarnish plush velvet with dedicated necklace hanging hooks, ring slots, and travel clasp closure.',
    afterPill: 'Multi-Tier Velvet • Tangle-Free • Travel Lock'
  }
];

export const getLiveSliders = () => {
  if (typeof window === 'undefined') return defaultSliders;
  try {
    const saved = localStorage.getItem(SLIDERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  try {
    localStorage.setItem(SLIDERS_STORAGE_KEY, JSON.stringify(defaultSliders));
  } catch (_) {}
  return defaultSliders;
};

export const saveLiveSliders = (sliders) => {
  try {
    localStorage.setItem(SLIDERS_STORAGE_KEY, JSON.stringify(sliders));
    window.dispatchEvent(new Event('appzys_sliders_changed'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error(err);
  }
  return sliders;
};
