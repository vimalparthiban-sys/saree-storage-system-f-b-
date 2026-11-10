import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import {
  getLiveProducts,
  getLiveProductById,
  saveLiveProduct,
  deleteLiveProduct,
  resetToDefaultProducts,
  getLiveBanners,
  saveLiveBanners,
  getLiveSliders,
  saveLiveSliders
} from '../services/productManager';
import {
  ArrowLeft,
  Upload,
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  Mail,
  Copy,
  Check,
  Printer,
  Truck,
  MessageCircle,
  Package,
  AlertTriangle,
  X,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Phone,
  ArrowUpDown,
  Layers,
  FileText,
  CheckSquare,
  Square,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Boxes,
  ClipboardList,
  Calendar,
  ChevronRight,
  TrendingUp,
  MapPin,
  UserCheck,
  Maximize2,
  Edit3,
  Trash2,
  Eye,
  Sliders,
  Image as ImageIcon,
  Tag,
  CheckCircle2
} from 'lucide-react';

// Helper function to get exact product image for ordered color
const getProductColorImage = (item) => {
  if (!item) return '/images/saree-organiser-navy-1.jpg';
  const color = (item.color || item.variant || '').toLowerCase();
  const title = (item.title || item.productName || item.cardTitle || '').toLowerCase();

  // 1. Saree Organiser
  if (title.includes('saree') || item.productId === 'saree-organiser' || item.category === 'Saree Organiser') {
    if (color.includes('navy') || color.includes('polka') || color.includes('blue')) {
      return '/images/saree-organiser-navy-1.jpg';
    }
    if (color.includes('houndstooth') || color.includes('black') || color.includes('white')) {
      return '/images/saree-organiser-houndstooth-1.jpg';
    }
    if (color.includes('brown') || color.includes('coffee') || color.includes('floral')) {
      return '/images/saree-organiser-brown-1.jpg';
    }
    if (color.includes('maroon') || color.includes('geometric')) {
      return '/images/saree-organiser-maroon-1.jpg';
    }
    return '/images/saree-organiser-navy-1.jpg';
  }

  // 2. Jewellery Organiser
  if (title.includes('jewel') || item.productId === 'jewellery-organiser' || item.category === 'Jewellery Organiser') {
    if (color.includes('champagne') || color.includes('nude') || color.includes('beige')) {
      return '/images/jewel-organiser-1.jpg';
    }
    if (color.includes('ivory') || color.includes('cream')) {
      return '/images/jewel-organiser-white-1.jpg';
    }
    if (color.includes('pure white') || color.includes('snow') || color.includes('classic')) {
      return '/images/jewel-organiser-pure-white-1.jpg';
    }
    return '/images/jewel-organiser-1.jpg';
  }

  // 3. Fallbacks
  if (item.image) return item.image;
  if (item.imageUrl) return item.imageUrl;
  if (item.images && item.images.length > 0) return item.images[0];
  return '/images/saree-organiser-navy-1.jpg';
};

// Generate dynamic WhatsApp message reflecting the order's current stage with actual website track link
const getDynamicWhatsAppMessage = (order) => {
  if (!order) return '';
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://appzys.com';
  const trackLink = `${origin}/track-order?awb=${order.awb || order.id}`;
  const firstItem = order.items?.[0];
  const itemDesc = firstItem
    ? `${firstItem.title || 'APPZYS Smart Storage'} (${firstItem.packName || 'Pack of 1'} • ${firstItem.color || 'Standard'})`
    : 'APPZYS Smart Storage Living Box';

  if (order.status === 'PACKED') {
    return `Namaste ${order.customerName || 'Customer'}! 📦\n\nYour APPZYS order #${order.id} has been PACKED & SEALED with high-grade steel frame quality verification!\n\nItem: ${itemDesc}\nCourier: ${order.courier || 'Delhivery Express'} (AWB: ${order.awb || 'AWB-DEL-982140'})\n\nLive tracking: ${trackLink}\n\nOur dispatch team is handing over your package to the courier partner today. Support: +91 98400 12345.`;
  }
  if (order.status === 'SHIPPED') {
    return `Namaste ${order.customerName || 'Customer'}! 🚚\n\nYour APPZYS order #${order.id} is DISPATCHED & IN TRANSIT!\n\nItem: ${itemDesc}\nCourier: ${order.courier || 'Delhivery Express'} (AWB: ${order.awb || 'AWB-DEL-982140'})\n\nLive tracking: ${trackLink}\n\nDoorstep delivery is estimated in 1-2 business days. Support: +91 98400 12345.`;
  }
  if (order.status === 'OUT_FOR_DELIVERY') {
    return `Namaste ${order.customerName || 'Customer'}! 🛵\n\nYour APPZYS package #${order.id} is OUT FOR DELIVERY today!\n\nCourier Rider from ${order.courier || 'Delhivery Express'} is on the route to your address.\n\nLive tracking: ${trackLink}\n\nPlease keep your phone available for delivery verification. Support: +91 98400 12345.`;
  }
  if (order.status === 'DELIVERED') {
    return `Namaste ${order.customerName || 'Customer'}! ✅\n\nYour APPZYS order #${order.id} has been DELIVERED successfully to your doorstep!\n\nWe hope you love your new ${itemDesc}.\n\nNeed setup assistance or warranty claim? WhatsApp us at +91 98400 12345. Thank you for choosing APPZYS!`;
  }
  if (order.status === 'DELAYED') {
    return `Namaste ${order.customerName || 'Customer'}! ⚠️\n\nTransit Update for APPZYS order #${order.id}:\nYour package encountered a minor regional transit checkpoint delay. Our team is actively tracking it with ${order.courier || 'Delhivery'}.\n\nLive tracking: ${trackLink}\n\nReplacement warranty is active. WhatsApp Helpline: +91 98400 12345.`;
  }
  // Default / CONFIRMED
  return `Namaste ${order.customerName || 'Customer'}! 📦 Your APPZYS order #${order.id} (Total: ₹${order.totalAmount || 649}) is confirmed! We are preparing your order for express dispatch. Courier: ${order.courier || 'Delhivery Express'} (AWB: ${order.awb || 'AWB-DEL-713545'}). Live tracking: ${trackLink}. Support: +91 98400 12345.`;
};

const defaultEmptyProduct = {
  id: '',
  title: '',
  shortTitle: '',
  brand: 'Wardrobe Organizers',
  category: 'Wardrobe Organizers',
  categorySlug: '',
  basePrice: 499,
  mrp: 799,
  rating: 4.9,
  reviewCount: 100,
  inStock: true,
  specs: 'High Durability Living Box • 60L Storage Capacity',
  perfectFor: ['Sarees & Traditional Wear', 'Clothes & Accessories', 'Wardrobe Organizing'],
  images: ['/images/saree-organiser-navy-1.jpg'],
  colors: [
    {
      name: 'Navy Blue Polka Dot',
      hex: '#1e3a8a',
      images: [
        '/images/saree-organiser-navy-1.jpg',
        '/images/saree-organiser-navy-2.jpg',
        '/images/saree-organiser-navy-3.jpg',
        '/images/saree-organiser-navy-4.jpg'
      ]
    }
  ],
  packs: [
    { id: '1-pack', name: 'Pack of 1', price: 499, mrp: 799, discount: '38% OFF', popular: false },
    { id: '2-pack', name: 'Pack of 2', price: 899, mrp: 1598, discount: '44% OFF', popular: true },
    { id: '4-pack', name: 'Pack of 4 (Best Value)', price: 1699, mrp: 3196, discount: '47% OFF', popular: false }
  ],
  setupGuide: {
    enabled: true,
    title: 'How to Assemble in 3 Simple Steps',
    subtitle: 'Takes less than 30 seconds to set up without any tools',
    steps: [
      { step: 1, title: 'Unfold & Pull Wire Frame', subtitle: 'Push metal frame to corners', desc: 'Pull up the internal 4mm stainless steel rods until they lock into the 4 corners.', badge: 'Instant Setup', icon: '⚡' },
      { step: 2, title: 'Fill with Sarees & Zip', subtitle: 'Load up to 15 to 18 sarees', desc: 'The box stands completely rigid. Neatly stack heavy Kanjivaram or daily clothes inside.', badge: 'Rigid Free-Standing', icon: '⬆️' },
      { step: 3, title: 'Stack & Pull from Front Window', subtitle: 'Slide any saree out', desc: 'Stack up to 4 boxes. Unzip the front transparent flap and pull out without unstacking.', badge: 'Stackable Up To 4 Boxes', icon: '🪟' }
    ]
  },
  comparison: {
    enabled: true,
    headline: 'Why Steel Frame Wins vs Flimsy Cloth Bags',
    subtitle: 'See the difference between cheap roadside cloth covers and our engineered Steel Living Box.',
    colWinner: '👑 APPZYS® Steel Frame Saree Organiser',
    colLoser: 'Ordinary Cloth / Non-Woven Bag',
    rows: [
      { feature: 'Structural Support', winner: '4mm Solid Stainless Steel Wire Rods (Rigid 3D frame)', loser: 'Flimsy cloth sags, collapses, and wrinkles sarees' },
      { feature: 'Wardrobe Stackability', winner: 'Stack 3 to 4 boxes vertically without touching inner sarees', loser: 'Cannot stack — bottom sarees get crushed and damaged' },
      { feature: 'Mid-Stack Retrieval', winner: 'Front Transparent Zipper — slide any saree out in 2 seconds', loser: 'Must unstack and open entire bag from top, making a mess' },
      { feature: 'Fabric & Durability', winner: 'Heavy-Duty 600D Oxford Fabric (Moisture & Moth Resistant)', loser: 'Cheap 70 GSM paper cloth tears in 3-6 months' }
    ]
  }
};

const blankProductTemplate = {
  id: '',
  title: '',
  shortTitle: '',
  brand: 'Wardrobe Organizers',
  category: 'Wardrobe Organizers',
  categorySlug: '',
  basePrice: '',
  mrp: '',
  rating: 5.0,
  reviewCount: 0,
  inStock: true,
  description: '',
  specs: '',
  perfectFor: [''],
  images: [],
  colors: [
    {
      name: '',
      hex: '#ffffff',
      images: []
    }
  ],
  packs: [
    { id: 'pack-1', name: 'Pack of 1', price: '', mrp: '', discount: '0% OFF', popular: false }
  ],
  setupGuide: {
    enabled: true,
    title: 'How to Assemble in 3 Simple Steps',
    subtitle: 'Takes less than 30 seconds to set up without any tools',
    steps: [
      { step: 1, title: '', subtitle: '', desc: '', video: '', badge: 'Step 1', icon: '⚡' },
      { step: 2, title: '', subtitle: '', desc: '', video: '', badge: 'Step 2', icon: '⬆️' },
      { step: 3, title: '', subtitle: '', desc: '', video: '', badge: 'Step 3', icon: '🪟' }
    ]
  },
  comparison: {
    enabled: true,
    headline: 'Why Our Product Wins vs Ordinary Alternatives',
    subtitle: 'See the key differences in quality, durability, and daily performance.',
    colWinner: 'Our Product',
    colLoser: 'Ordinary Alternative',
    rows: [
      { feature: 'Structural Quality', winner: '', loser: '' },
      { feature: 'Durability & Materials', winner: '', loser: '' },
      { feature: 'Storage Usability', winner: '', loser: '' }
    ]
  }
};

const AdminDashboard = () => {
  const { isAdmin, openAuth } = useAuth();
  const { orders, updateOrderStatus } = useCart();

  // Primary Navigation Tab: 'orders' | 'catalog' | 'inventory' | 'manifest' | 'banners' | 'newsletter'
  const [activeTab, setActiveTab] = useState('orders');

  // Helper map for auto-detecting color hex code from color name
const COLOR_NAME_MAP = {
  navy: '#1e3a8a',
  'navy blue': '#1e3a8a',
  blue: '#2563eb',
  sky: '#0ea5e9',
  'sky blue': '#38bdf8',
  black: '#0f172a',
  white: '#ffffff',
  purewhite: '#ffffff',
  'snow white': '#f8fafc',
  ivory: '#fefce8',
  cream: '#fef9c3',
  beige: '#f5f5dc',
  champagne: '#f7e7ce',
  nude: '#e8c5a0',
  maroon: '#800000',
  red: '#dc2626',
  wine: '#722f37',
  burgundy: '#800020',
  brown: '#78350f',
  coffee: '#451a03',
  pink: '#ec4899',
  rose: '#f43f5e',
  gold: '#eab308',
  yellow: '#facc15',
  green: '#16a34a',
  emerald: '#059669',
  olive: '#65a30d',
  grey: '#64748b',
  gray: '#64748b',
  silver: '#cbd5e1',
  purple: '#9333ea',
  lavender: '#c084fc',
  violet: '#7c3aed',
  orange: '#f97316',
  peach: '#ffdab9',
  teal: '#0d9488',
  cyan: '#06b6d4',
  houndstooth: '#1e293b',
  floral: '#854d0e',
  geometric: '#831843'
};

const detectColorHex = (text) => {
  if (!text) return null;
  const lower = text.toLowerCase().trim();
  for (const [key, hex] of Object.entries(COLOR_NAME_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return null;
};

  // Live Products State (from productManager)
  const [liveProducts, setLiveProducts] = useState(getLiveProducts());

  // Live Banners State
  const [liveBanners, setLiveBanners] = useState(getLiveBanners());

  // Live Transformation Sliders State
  const [liveSliders, setLiveSliders] = useState(getLiveSliders());

  useEffect(() => {
    const handleProductChange = () => setLiveProducts(getLiveProducts());
    const handleBannerChange = () => setLiveBanners(getLiveBanners());
    const handleSliderChange = () => setLiveSliders(getLiveSliders());

    window.addEventListener('appzys_products_changed', handleProductChange);
    window.addEventListener('appzys_banners_changed', handleBannerChange);
    window.addEventListener('appzys_sliders_changed', handleSliderChange);
    window.addEventListener('storage', handleProductChange);

    return () => {
      window.removeEventListener('appzys_products_changed', handleProductChange);
      window.removeEventListener('appzys_banners_changed', handleBannerChange);
      window.removeEventListener('appzys_sliders_changed', handleSliderChange);
      window.removeEventListener('storage', handleProductChange);
    };
  }, []);

  // Product Modal State (Create & Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productFormTab, setProductFormTab] = useState('basic'); // 'basic' | 'variants' | 'packs' | 'rich'
  const [productForm, setProductForm] = useState(defaultEmptyProduct);

  const openAddProductModal = () => {
    setProductForm({
      ...blankProductTemplate,
      id: 'prod-' + Date.now().toString(36),
      categorySlug: 'prod-' + Date.now().toString(36)
    });
    setProductFormTab('basic');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    const isJewel = prod.id?.includes('jewel') || prod.categorySlug?.includes('jewel') || prod.title?.toLowerCase().includes('jewel');

    const defaultStep1Video = isJewel ? '/videos/jewel_step1.mp4' : '/videos/step1_popup.mp4';
    const defaultStep2Video = isJewel ? '/videos/jewel_step2.mp4' : '/videos/step2_pack.mp4';
    const defaultStep3Video = isJewel ? '/videos/jewel_step3.mp4' : '/videos/step3_pull.mp4';

    const defaultStep1Title = isJewel ? 'Top Lid: 5 Tangle-Free Necklace Hooks' : 'Unfold & Pull Wire Frame';
    const defaultStep1Sub = isJewel ? 'With elasticated drop pouch to prevent tangling' : 'Push metal frame to corners';

    const defaultStep2Title = isJewel ? 'Middle Flap: Stud Earrings & Ring Rolls' : 'Fill with Sarees & Zip';
    const defaultStep2Sub = isJewel ? 'Holds 10 pairs of earrings and 6+ rings' : 'Load up to 15 to 18 sarees';

    const defaultStep3Title = isJewel ? 'Bottom Base: Bangles & Removable Dividers' : 'Stack & Pull from Front Window';
    const defaultStep3Sub = isJewel ? 'Customizable compartments for watches & bracelets' : 'Slide any saree out';

    const demoSteps = prod.demo?.steps || [];
    const guideSteps = (prod.setupGuide?.steps || [
      { step: 1, title: defaultStep1Title, subtitle: defaultStep1Sub, video: defaultStep1Video },
      { step: 2, title: defaultStep2Title, subtitle: defaultStep2Sub, video: defaultStep2Video },
      { step: 3, title: defaultStep3Title, subtitle: defaultStep3Sub, video: defaultStep3Video }
    ]).map((st, i) => {
      let vid = st.video || demoSteps[i]?.video;
      if (isJewel && (!vid || vid.includes('step1_popup') || vid.includes('step2_pack') || vid.includes('step3_pull'))) {
        vid = i === 0 ? '/videos/jewel_step1.mp4' : i === 1 ? '/videos/jewel_step2.mp4' : '/videos/jewel_step3.mp4';
      } else if (!vid) {
        vid = i === 0 ? defaultStep1Video : i === 1 ? defaultStep2Video : defaultStep3Video;
      }

      let title = st.title;
      if (isJewel && (!title || title.includes('Saree') || title.includes('Wire Frame'))) {
        title = i === 0 ? defaultStep1Title : i === 1 ? defaultStep2Title : defaultStep3Title;
      }
      let subtitle = st.subtitle;
      if (isJewel && (!subtitle || subtitle.includes('saree') || subtitle.includes('frame'))) {
        subtitle = i === 0 ? defaultStep1Sub : i === 1 ? defaultStep2Sub : defaultStep3Sub;
      }

      return {
        ...st,
        step: i + 1,
        title: title || ('Step ' + (i + 1)),
        subtitle: subtitle || '',
        video: vid
      };
    });

    const cleanedPacks = (prod.packs && prod.packs.length > 0 ? prod.packs : defaultEmptyProduct.packs).map((pk, idx) => {
      const qty = pk.qty || (idx === 0 ? 1 : idx === 1 ? 2 : idx === 2 ? 4 : (idx + 1));
      const defaultName = pk.name || (pk.label && pk.label !== '1' && pk.label !== '2' && pk.label !== '4' && pk.label !== '6' ? pk.label : `Pack of ${qty}`);
      const priceVal = pk.price ?? 499;
      const mrpVal = pk.mrp ?? 799;
      const discountVal = pk.discount || (mrpVal > priceVal ? `${Math.round(((mrpVal - priceVal) / mrpVal) * 100)}% OFF` : '0% OFF');
      return {
        id: pk.id || `pack-${idx + 1}`,
        name: defaultName || `Pack of ${qty}`,
        price: priceVal,
        mrp: mrpVal,
        discount: discountVal,
        popular: Boolean(pk.popular || pk.isBestSeller)
      };
    });

    setProductForm({
      ...defaultEmptyProduct,
      ...prod,
      packs: cleanedPacks,
      description: prod.description || (isJewel ? 'Luxury travel jewellery organiser with dust and scratch proof compartments. Ideal for rings, earrings, necklaces, and bracelets.' : 'High durability 60L saree organiser living box with solid stainless steel frame. Keep sarees and clothes dust-free and neatly stacked.'),
      perfectFor: prod.perfectFor || prod.keyFeatures || (isJewel ? ['Necklaces, Rings & Earrings', 'Bangles, Watches & Hairpins', 'Travel & Dressing Table Organizing'] : ['Sarees & Traditional Wear', 'Clothes & Accessories', 'Wardrobe Organizing']),
      setupGuide: {
        ...defaultEmptyProduct.setupGuide,
        ...(prod.setupGuide || {}),
        steps: guideSteps,
        enabled: prod.setupGuide ? prod.setupGuide.enabled !== false : (prod.demo ? prod.demo.enabled !== false : true)
      },
      comparison: {
        ...defaultEmptyProduct.comparison,
        ...(prod.comparison || {}),
        rows: prod.comparison?.rows || defaultEmptyProduct.comparison.rows,
        enabled: prod.comparison ? prod.comparison.enabled !== false : true
      }
    });
    setProductFormTab('basic');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!productForm.title?.trim()) {
      alert('Please enter a product title');
      return;
    }

    // Clean and validate packs
    const cleanedPacks = (productForm.packs || []).map((pk, idx) => {
      const p = pk.price === '' ? 0 : (parseInt(pk.price, 10) || 0);
      const m = pk.mrp === '' ? 0 : (parseInt(pk.mrp, 10) || 0);
      return {
        ...pk,
        id: pk.id || `pack-${idx + 1}`,
        name: pk.name?.trim() || `Pack of ${idx + 1}`,
        price: p,
        mrp: m,
        discount: m > p ? `${Math.round(((m - p) / m) * 100)}% OFF` : '0% OFF',
        popular: Boolean(pk.popular)
      };
    });

    // Primary price taken directly from the 1st Pack Tier configured in Tab 3!
    const firstPack = cleanedPacks[0] || {};
    const cleanBasePrice = firstPack.price || 499;
    const cleanMrp = firstPack.mrp || 799;
    const discountPercent = cleanMrp > cleanBasePrice ? Math.round(((cleanMrp - cleanBasePrice) / cleanMrp) * 100) : 0;

    const isGuideEnabled = productForm.setupGuide?.enabled !== false;
    const isCompEnabled = productForm.comparison?.enabled !== false;

    const preparedProduct = {
      ...productForm,
      packs: cleanedPacks,
      basePrice: cleanBasePrice,
      mrp: cleanMrp,
      discountPercent,
      setupGuide: {
        ...productForm.setupGuide,
        enabled: isGuideEnabled
      },
      demo: {
        enabled: isGuideEnabled,
        badge: '3-SECOND EASY POP-UP SETUP',
        headline: 'How The ' + (productForm.shortTitle || productForm.title || 'Product') + ' Works',
        subtitle: 'Push built-in steel rods and your rigid wardrobe shelf is ready in 3 seconds!',
        steps: (productForm.setupGuide?.steps || []).map((st, idx) => ({
          step: st.step || idx + 1,
          title: st.title || ('Step ' + (idx + 1)),
          subtitle: st.subtitle || '',
          desc: st.desc || st.subtitle || '',
          video: st.video || (idx === 0 ? '/videos/step1_popup.mp4' : idx === 1 ? '/videos/step2_pack.mp4' : '/videos/step3_pull.mp4'),
          badge: st.badge || (idx === 0 ? 'Zero Assembly Tools' : idx === 1 ? 'Rigid Free-Standing' : 'Stackable Up To 4 Boxes'),
          icon: idx === 0 ? '✨' : idx === 1 ? '📦' : '🗄️'
        }))
      },
      comparison: {
        enabled: isCompEnabled,
        headline: productForm.comparison?.headline || 'Why Steel Frame Wins vs Flimsy Cloth Bags',
        subtitle: productForm.comparison?.subtitle || 'See the difference between cheap roadside cloth covers and our engineered Steel Living Box.',
        colWinner: productForm.comparison?.colWinner || ('APPZYS® Steel Frame ' + (productForm.shortTitle || 'Organiser')),
        colLoser: productForm.comparison?.colLoser || 'Ordinary Cloth / Non-Woven Bag',
        rows: productForm.comparison?.rows || [
          { feature: 'Structural Support', winner: '4mm Solid Stainless Steel Wire Rods (Rigid 3D frame)', loser: 'Flimsy cloth sags, collapses, and wrinkles sarees' },
          { feature: 'Wardrobe Stackability', winner: 'Stack 3 to 4 boxes vertically without touching inner sarees', loser: 'Cannot stack — bottom sarees get crushed and damaged' },
          { feature: 'Mid-Stack Retrieval', winner: 'Front Transparent Zipper — slide any saree out in 2 seconds', loser: 'Must unstack and open entire bag from top, making a mess' },
          { feature: 'Fabric & Durability', winner: 'Heavy-Duty 600D Oxford Fabric (Moisture & Moth Resistant)', loser: 'Cheap 70 GSM paper cloth tears in 3-6 months' }
        ]
      }
    };

    saveLiveProduct(preparedProduct);
    setIsProductModalOpen(false);
    alert('✅ Product successfully saved and published! Real-time changes are now live on the storefront.');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product from your store?')) {
      deleteLiveProduct(id);
    }
  };

  // Orders Sub-Filter: 'ALL' | 'PENDING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'COD' | 'PREPAID'
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Modals state
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState(null);
  const [selectedOrderForWhatsapp, setSelectedOrderForWhatsapp] = useState(null);
  const [isBulkPrintOpen, setIsBulkPrintOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [zoomedStepMedia, setZoomedStepMedia] = useState(null);

  const isImageMedia = (url) => {
    if (!url) return false;
    return (
      url.startsWith('data:image/') ||
      /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url)
    );
  }; // Full-screen zoom modal

  // Copy status
  const [copied, setCopied] = useState(false);

  // Live Inventory State (persisted to LocalStorage)
  const defaultInventory = [
    {
      id: 'saree-navy',
      productName: '60L Saree Living Box (Steel Frame)',
      variant: 'Navy Blue Polka Dot',
      sku: 'APP-SR-60L-NVY',
      stock: 42,
      minAlert: 15,
      price: 499,
      category: 'Saree Organiser',
      image: '/images/saree-organiser-navy-1.jpg'
    },
    {
      id: 'saree-houndstooth',
      productName: '60L Saree Living Box (Steel Frame)',
      variant: 'Black & White Houndstooth',
      sku: 'APP-SR-60L-HND',
      stock: 28,
      minAlert: 15,
      price: 499,
      category: 'Saree Organiser',
      image: '/images/saree-organiser-houndstooth-1.jpg'
    },
    {
      id: 'saree-brown',
      productName: '60L Saree Living Box (Steel Frame)',
      variant: 'Coffee Brown Floral',
      sku: 'APP-SR-60L-BRN',
      stock: 8,
      minAlert: 15,
      price: 499,
      category: 'Saree Organiser',
      image: '/images/saree-organiser-brown-1.jpg'
    },
    {
      id: 'saree-maroon',
      productName: '60L Saree Living Box (Steel Frame)',
      variant: 'Maroon Geometric',
      sku: 'APP-SR-60L-MRN',
      stock: 19,
      minAlert: 15,
      price: 499,
      category: 'Saree Organiser',
      image: '/images/saree-organiser-maroon-1.jpg'
    },
    {
      id: 'jewel-champagne',
      productName: 'Luxury Travel Jewellery Organiser',
      variant: 'Champagne Nude Beige',
      sku: 'APP-JW-TRV-CHP',
      stock: 35,
      minAlert: 12,
      price: 349,
      category: 'Jewellery Organiser',
      image: '/images/jewel-organiser-1.jpg'
    },
    {
      id: 'jewel-ivory',
      productName: 'Luxury Travel Jewellery Organiser',
      variant: 'Ivory Cream PU Leather',
      sku: 'APP-JW-TRV-IVR',
      stock: 14,
      minAlert: 12,
      price: 349,
      category: 'Jewellery Organiser',
      image: '/images/jewel-organiser-white-1.jpg'
    },
    {
      id: 'jewel-white',
      productName: 'Luxury Travel Jewellery Organiser',
      variant: 'Classic Snow White',
      sku: 'APP-JW-TRV-WHT',
      stock: 6,
      minAlert: 12,
      price: 349,
      category: 'Jewellery Organiser',
      image: '/images/jewel-organiser-pure-white-1.jpg'
    }
  ];

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('appzys_admin_inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultInventory;
  });

  useEffect(() => {
    localStorage.setItem('appzys_admin_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const updateStock = (id, delta) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item))
    );
  };

  const setExactStock = (id, newQty) => {
    let raw = String(newQty).replace(/[^\d]/g, '');
    if (raw.length > 1 && raw.startsWith('0')) {
      raw = raw.replace(/^0+/, '');
    }
    const val = raw === '' ? 0 : parseInt(raw, 10);
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: val } : item))
    );
  };

  // Subscribers state
  const [subscribers, setSubscribers] = useState(() => {
    const saved = localStorage.getItem('saree_newsletter_subscribers');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, email: 'anithasundar@gmail.com', date: '2026-10-22T09:15:00', source: 'Home Footer Banner' },
          { id: 2, email: 'priya.k@outlook.com', date: '2026-10-21T18:40:00', source: 'Product Detail Page' },
          { id: 3, email: 'lavanya.chennai@yahoo.com', date: '2026-10-20T14:22:00', source: 'Festive Popup' }
        ];
  });

  useEffect(() => {
    const checkSubscribers = () => {
      const saved = localStorage.getItem('saree_newsletter_subscribers');
      if (saved) setSubscribers(JSON.parse(saved));
    };
    checkSubscribers();
    window.addEventListener('storage', checkSubscribers);
    return () => window.removeEventListener('storage', checkSubscribers);
  }, []);

  // Filtered Orders Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // 1. Status Filter
      if (orderStatusFilter === 'PENDING' && !['CONFIRMED', 'PROCESSING'].includes(ord.status)) return false;
      if (orderStatusFilter === 'PACKED' && ord.status !== 'PACKED') return false;
      if (orderStatusFilter === 'SHIPPED' && !['SHIPPED', 'OUT_FOR_DELIVERY'].includes(ord.status)) return false;
      if (orderStatusFilter === 'DELIVERED' && ord.status !== 'DELIVERED') return false;
      if (orderStatusFilter === 'COD' && ord.paymentMethod !== 'COD') return false;
      if (orderStatusFilter === 'PREPAID' && ord.paymentMethod === 'COD') return false;

      // 2. Search Query (Matches Order ID, Customer Name, Phone, AWB, Address)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = ord.id?.toLowerCase().includes(q);
        const matchName = ord.customerName?.toLowerCase().includes(q);
        const matchPhone = ord.phone?.toLowerCase().includes(q);
        const matchAwb = ord.awb?.toLowerCase().includes(q);
        const matchAddress = ord.address?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchAwb && !matchAddress) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, searchQuery]);

  // Filtered Catalog Logic for Products & A+ Content Tab
  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return liveProducts;
    const q = searchQuery.toLowerCase().trim();
    return liveProducts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.shortTitle?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q)
    );
  }, [liveProducts, searchQuery]);

  // Filtered Inventory Logic for Stock Tab
  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return inventory;
    const q = searchQuery.toLowerCase().trim();
    return inventory.filter(
      (item) =>
        item.productName?.toLowerCase().includes(q) ||
        item.variant?.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
    );
  }, [inventory, searchQuery]);

  // Key Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const codPendingRevenue = orders
    .filter((o) => o.paymentMethod === 'COD' && o.status !== 'DELIVERED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const prepaidRevenue = orders
    .filter((o) => o.paymentMethod !== 'COD' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingPackingCount = orders.filter((o) => ['CONFIRMED', 'PROCESSING'].includes(o.status)).length;
  const packedCount = orders.filter((o) => o.status === 'PACKED').length;
  const inTransitCount = orders.filter((o) => ['SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const codCount = orders.filter((o) => o.paymentMethod === 'COD').length;

  // Inventory Metrics
  const totalStockUnits = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = inventory.filter((item) => item.stock <= item.minAlert).length;

  // Bulk Selection Handlers
  const toggleSelectOrder = (id) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleBulkStatusUpdate = (newStatus) => {
    selectedOrderIds.forEach((id) => {
      updateOrderStatus(id, newStatus);
    });
    setSelectedOrderIds([]);
  };

  const handleCopyEmails = () => {
    const emailList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = 'Order ID,Date,Customer Name,Phone,Address,Items,Amount,Payment Method,Status,Courier,AWB\n';
    const rows = orders.map((o) => {
      const itemsStr = o.items ? o.items.map((it) => `${it.title} (${it.packName || ''} ${it.color || ''})`).join('; ') : '';
      return `"${o.id}","${new Date(o.createdAt).toLocaleDateString()}","${o.customerName}","${o.phone}","${(o.address || '').replace(/"/g, '""')}","${itemsStr}","${o.totalAmount}","${o.paymentMethod}","${o.status}","${o.courier || ''}","${o.awb || ''}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `APPZYS_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-rose-100 selection:text-rose-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-[#1c2d4a]/10 text-[#1c2d4a] rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Authentication Required</h2>
            <p className="text-xs text-slate-600">
              Only authorized store managers can view orders, generate shipping labels & dispatch packages.
            </p>
            <button
              onClick={() => openAuth('login', 'ADMIN')}
              className="w-full bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              Log In as Store Admin (Quick Test)
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/80 selection:bg-amber-100 selection:text-amber-900">
      {/* Manifest-Only Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-manifest, #printable-manifest * {
            visibility: visible !important;
          }
          #printable-manifest {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: white !important;
            border: 2px solid #0f172a !important;
            box-shadow: none !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6">
        {/* ========================================================
            TOP BAR: Brand, Navigation Tabs, Search & Status Filters
        ======================================================== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
          {/* Row 1: Header Brand & Primary Management Tabs */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-[#1c2d4a] text-amber-400 flex items-center justify-center shadow-md shadow-[#1c2d4a]/20 shrink-0">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#1c2d4a] tracking-tight">
                    APPZYS® Seller Hub
                  </h1>
                  <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE FULFILLMENT
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Warehouse Dispatch & Logistics • Delhivery & Bluedart Integration • Dynamic Catalog Management
                </p>
              </div>
            </div>

            {/* Primary View Switcher Tabs in Principal Blue */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-auto">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#1c2d4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1c2d4a] hover:bg-white/80'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-[#1c2d4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1c2d4a] hover:bg-white/80'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Products & A+ Content ({liveProducts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-[#1c2d4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1c2d4a] hover:bg-white/80'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>Inventory & Stock</span>
                {lowStockCount > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                    {lowStockCount} low
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('manifest')}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'manifest'
                    ? 'bg-[#1c2d4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1c2d4a] hover:bg-white/80'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Courier Manifest</span>
              </button>

              <button
                onClick={() => setActiveTab('banners')}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'banners'
                    ? 'bg-[#1c2d4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1c2d4a] hover:bg-white/80'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Store Banners & Sliders</span>
              </button>

              <button
                onClick={() => setActiveTab('newsletter')}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'newsletter'
                    ? 'bg-[#1c2d4a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1c2d4a] hover:bg-white/80'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Leads ({subscribers.length})</span>
              </button>
            </div>
          </div>

          {/* Row 2: Search Bar & Filters (Search works on Orders, Catalog, and Inventory) */}
          {['orders', 'catalog', 'inventory'].includes(activeTab) && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {/* Search Input Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeTab === 'orders'
                        ? 'Search by Customer, Phone, ORD-ID, AWB...'
                        : activeTab === 'catalog'
                        ? 'Search products by title, category, SKU...'
                        : 'Search inventory by product, variant, SKU...'
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]/20 focus:border-[#1c2d4a]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Counter */}
                {activeTab === 'orders' ? (
                  <div className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-[#1c2d4a]">{filteredOrders.length}</span> of {orders.length} orders
                  </div>
                ) : activeTab === 'catalog' ? (
                  <div className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-[#1c2d4a]">{filteredCatalog.length}</span> of {liveProducts.length} products
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-[#1c2d4a]">{filteredInventory.length}</span> of {inventory.length} SKUs
                  </div>
                )}
              </div>

              {/* Status Filter Buttons: Only shown on Orders tab */}
              {activeTab === 'orders' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                  <button
                    onClick={() => setOrderStatusFilter('ALL')}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                      orderStatusFilter === 'ALL'
                        ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#1c2d4a]'
                    }`}
                  >
                    All Orders ({orders.length})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('PENDING')}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                      orderStatusFilter === 'PENDING'
                        ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#1c2d4a]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>To Pack ({pendingPackingCount})</span>
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('PACKED')}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                      orderStatusFilter === 'PACKED'
                        ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#1c2d4a]'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Packed / Ready ({packedCount})</span>
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('SHIPPED')}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                      orderStatusFilter === 'SHIPPED'
                        ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#1c2d4a]'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>In Transit ({inTransitCount})</span>
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('DELIVERED')}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                      orderStatusFilter === 'DELIVERED'
                        ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#1c2d4a]'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Delivered ({deliveredCount})</span>
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('COD')}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                      orderStatusFilter === 'COD'
                        ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#1c2d4a]'
                    }`}
                  >
                    COD Orders ({codCount})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('PREPAID')}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                      orderStatusFilter === 'PREPAID'
                        ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-[#1c2d4a]'
                    }`}
                  >
                    Prepaid Orders ({orders.length - codCount})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================
            4 METRIC CARDS
        ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1c2d4a] flex items-center justify-center shrink-0 border border-blue-200/50">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Gross Sales</span>
              <div className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-[11px] text-slate-500 font-medium">
                Prepaid: <span className="font-bold text-[#1c2d4a]">₹{prepaidRevenue.toLocaleString()}</span> • COD: <span className="font-bold text-[#1c2d4a]">₹{codPendingRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1c2d4a] flex items-center justify-center shrink-0 border border-blue-200/50">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pending Fulfillment</span>
              <div className="text-2xl font-black text-slate-900">{pendingPackingCount + packedCount} Orders</div>
              <div className="text-[11px] text-[#1c2d4a] font-semibold flex items-center gap-1">
                <span>{pendingPackingCount} to pack</span> • <span>{packedCount} ready for pickup</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1c2d4a] flex items-center justify-center shrink-0 border border-blue-200/50">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">In Courier Transit</span>
              <div className="text-2xl font-black text-slate-900">{inTransitCount} Parcels</div>
              <div className="text-[11px] text-[#1c2d4a] font-medium">
                Live with Delhivery & Bluedart
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1c2d4a] flex items-center justify-center shrink-0 border border-blue-200/50">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Warehouse Stock</span>
              <div className="text-2xl font-black text-slate-900">{totalStockUnits} Units</div>
              <div className="text-[11px] text-slate-500 font-medium">
                {lowStockCount > 0 ? (
                  <span className="text-rose-600 font-bold">⚠️ {lowStockCount} SKUs Low Stock</span>
                ) : (
                  <span className="text-emerald-600 font-bold">✓ All SKUs Healthy</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            TAB 1: ORDERS PIPELINE TABLE
        ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-[#1c2d4a] text-white p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {pendingPackingCount} Order(s) Awaiting Quality Packaging & Courier Handover
                  </h3>
                  <p className="text-xs text-slate-300">
                    Verify stainless steel rods, seal in high-durability box, print AWB label & hand over to Delhivery / Bluedart rider.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setActiveTab('manifest')}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Pickup Manifest</span>
                </button>
              </div>
            </div>

            {/* Dynamic Bulk Status Action Bar: Positioned in the corner right between Blue Banner and Orders Table */}
            {selectedOrderIds.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200/90 p-3.5 sm:px-5 sm:py-3 rounded-2xl shadow-xs animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-bold text-amber-950">
                    {selectedOrderIds.length} Order(s) Selected
                  </span>
                  <span className="text-[11px] text-amber-800 font-medium">
                    ({orderStatusFilter === 'PENDING' ? 'Stage: To Pack' : orderStatusFilter === 'PACKED' ? 'Stage: Packed / Ready' : orderStatusFilter === 'SHIPPED' ? 'Stage: In Transit' : orderStatusFilter === 'DELIVERED' ? 'Stage: Delivered' : 'Orders Hub'})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Common Print Labels Button */}
                  <button
                    onClick={() => setIsBulkPrintOpen(true)}
                    className="px-3 py-1.5 bg-[#1c2d4a] hover:bg-[#152238] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print Labels ({selectedOrderIds.length})</span>
                  </button>

                  {/* Dynamic Transition Action Buttons based on current view/tab! */}
                  {/* 1. When on "To Pack" (PENDING) -> Only show "Mark Packed / Ready" */}
                  {orderStatusFilter === 'PENDING' && (
                    <button
                      onClick={() => handleBulkStatusUpdate('PACKED')}
                      className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Mark Packed / Ready →</span>
                    </button>
                  )}

                  {/* 2. When on "Packed / Ready" (PACKED) -> Left: "Move Back to Pack", Right: "Mark In Transit" */}
                  {orderStatusFilter === 'PACKED' && (
                    <>
                      <button
                        onClick={() => handleBulkStatusUpdate('CONFIRMED')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>← Move Back to Pack</span>
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate('SHIPPED')}
                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Mark In Transit →</span>
                      </button>
                    </>
                  )}

                  {/* 3. When on "In Transit" (SHIPPED) -> Left: "Move Back to Packed", Right: "Mark Delivered" */}
                  {orderStatusFilter === 'SHIPPED' && (
                    <>
                      <button
                        onClick={() => handleBulkStatusUpdate('PACKED')}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>← Move Back to Packed</span>
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate('DELIVERED')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Delivered</span>
                      </button>
                    </>
                  )}

                  {/* 4. When on "Delivered" -> "Move Back to In Transit" */}
                  {orderStatusFilter === 'DELIVERED' && (
                    <button
                      onClick={() => handleBulkStatusUpdate('SHIPPED')}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>← Move Back to In Transit</span>
                    </button>
                  )}

                  {/* 5. When on "All Orders" or COD/Prepaid */}
                  {['ALL', 'COD', 'PREPAID'].includes(orderStatusFilter) && (
                    <>
                      <button
                        onClick={() => handleBulkStatusUpdate('PACKED')}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Mark Packed</span>
                      </button>
                      <button
                        onClick={() => handleBulkStatusUpdate('SHIPPED')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Mark Shipped</span>
                      </button>
                    </>
                  )}

                  {/* Common Clear Selection Button */}
                  <button
                    onClick={() => setSelectedOrderIds([])}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 underline cursor-pointer ml-1.5 px-1 py-1"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 w-10">
                        <button
                          onClick={toggleSelectAll}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          title="Select / Deselect All"
                        >
                          {selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-[#1c2d4a]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4 text-center">Product Photo</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Items / Pack</th>
                      <th className="py-3 px-4">Amount & Payment</th>
                      <th className="py-3 px-4">Courier & AWB</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                      <th className="py-3 px-4 text-center">Fulfillment Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-12 text-center text-slate-400 text-xs">
                          No orders match the selected filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const isSelected = selectedOrderIds.includes(ord.id);
                        const firstItem = ord.items?.[0] || {};
                        const productColorImage = getProductColorImage(firstItem);

                        return (
                          <tr
                            key={ord.id}
                            className={`hover:bg-slate-50/80 transition ${
                              isSelected ? 'bg-amber-50/50' : ''
                            }`}
                          >
                            <td className="py-4 px-4">
                              <button
                                onClick={() => toggleSelectOrder(ord.id)}
                                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-[#1c2d4a]" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-mono font-bold text-slate-900">{ord.id}</div>
                              <div className="text-[10px] font-sans text-slate-400 font-normal">
                                {new Date(ord.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            <td className="py-4 px-4 text-center">
                              <div
                                onClick={() =>
                                  setZoomedImage({
                                    src: productColorImage,
                                    title: firstItem.title || 'APPZYS Smart Storage Living Box',
                                    variant: `${firstItem.packName || 'Pack of 1'} • ${firstItem.color || 'Standard'}`,
                                    orderId: ord.id,
                                    customer: ord.customerName
                                  })
                                }
                                className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer shadow-xs group bg-slate-50 mx-auto"
                                title="Click to zoom image full screen"
                              >
                                <img
                                  src={productColorImage}
                                  alt={firstItem.color || 'Product'}
                                  className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                  <Maximize2 className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition drop-shadow-sm" />
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900">{ord.customerName}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <a
                                  href={`tel:${ord.phone}`}
                                  className="text-slate-600 hover:text-[#1c2d4a] text-[11px] font-mono flex items-center gap-1 font-semibold"
                                  title="Click to call customer"
                                >
                                  <Phone className="w-3 h-3 text-[#1c2d4a]" />
                                  <span>{ord.phone}</span>
                                </a>
                              </div>
                              <div className="text-slate-400 text-[10px] max-w-xs truncate mt-0.5" title={ord.address}>
                                {ord.address}
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              {ord.items &&
                                ord.items.map((it, idx) => (
                                  <div key={idx} className="font-medium text-slate-800">
                                    {it.title || 'APPZYS Saree Living Box 60L'}
                                    <div className="text-[10px] text-amber-800 font-semibold">
                                      {it.packName} • {it.color}
                                    </div>
                                  </div>
                                ))}
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-black text-slate-900 text-sm">₹{ord.totalAmount}</div>
                              <span
                                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                                  ord.paymentMethod === 'COD'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {ord.paymentMethod === 'COD' ? 'C.O.D. • Pending' : 'PREPAID • Verified'}
                              </span>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900 flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-[#1c2d4a]" />
                                <span>{ord.courier || 'Delhivery Express'}</span>
                              </div>
                              <div className="font-mono text-[11px] text-slate-500 font-semibold">
                                {ord.awb || 'AWB-DEL-982140'}
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                                className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border cursor-pointer focus:outline-hidden transition shadow-2xs ${
                                  ord.status === 'DELIVERED'
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                    : ord.status === 'SHIPPED' || ord.status === 'OUT_FOR_DELIVERY'
                                    ? 'bg-blue-50 text-blue-900 border-blue-300'
                                    : ord.status === 'PACKED'
                                    ? 'bg-purple-50 text-purple-900 border-purple-300'
                                    : ord.status === 'DELAYED'
                                    ? 'bg-rose-50 text-rose-900 border-rose-300'
                                    : 'bg-amber-50 text-amber-900 border-amber-300'
                                }`}
                              >
                                <option value="CONFIRMED">1. CONFIRMED (New Order)</option>
                                <option value="PACKED">2. PACKED (Box Sealed)</option>
                                <option value="SHIPPED">3. SHIPPED (Handed to Courier)</option>
                                <option value="OUT_FOR_DELIVERY">4. OUT FOR DELIVERY (Rider)</option>
                                <option value="DELIVERED">5. DELIVERED (Success)</option>
                                <option value="DELAYED">⚠️ DELAYED (Transit Alert)</option>
                              </select>
                            </td>

                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setSelectedOrderForLabel(ord)}
                                  title="Generate & Print AWB Barcode Shipping Label"
                                  className="px-2.5 py-1.5 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>AWB Label</span>
                                </button>

                                <button
                                  onClick={() => setSelectedOrderForWhatsapp(ord)}
                                  title="View WhatsApp Tracking Alert & Message Customer"
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-xs"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: DYNAMIC PRODUCTS CATALOG & A+ CONTENT MANAGER
        ======================================================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#1c2d4a] flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#1c2d4a]" />
                      <span>Product Catalog & Rich A+ Content Management</span>
                    </h3>
                    <span className="bg-blue-100 text-[#1c2d4a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {liveProducts.length} Active Items
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Add new products, configure color variants & photos, pack offers, 3-step setup guides, and comparison tables without touching code.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset catalog back to initial factory products?')) {
                        resetToDefaultProducts();
                      }
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    title="Restore default product catalog"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={openAddProductModal}
                    className="px-4 py-2.5 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>+ Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Products Catalog Cards / Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCatalog.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                  No products match your search query. Try another keyword.
                </div>
              ) : filteredCatalog.map((p) => {
                  const mainImg = p.images?.[0] || p.colors?.[0]?.images?.[0] || '/images/saree-organiser-navy-1.jpg';
                  const totalPhotos = p.colors ? p.colors.reduce((sum, c) => sum + (c.images?.length || 0), 0) : p.images?.length || 1;

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-3.5">
                          {/* Product Thumbnail */}
                          <div
                            onClick={() =>
                              setZoomedImage({
                                src: mainImg,
                                title: p.title,
                                variant: `${p.colors?.length || 0} Color Options Available`
                              })
                            }
                            className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer bg-slate-50 relative group"
                            title="Click to zoom image"
                          >
                            <img
                              src={mainImg}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                              <Maximize2 className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              {p.category}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-1 truncate" title={p.title}>
                              {p.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs">
                              <span className="font-black text-[#1c2d4a]">₹{p.basePrice}</span>
                              <span className="text-slate-400 line-through text-[11px]">₹{p.mrp}</span>
                              <span className="text-emerald-700 font-bold text-[10px]">
                                {p.discountPercent}% OFF
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Badges for Color variants & Packs */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-slate-500 block text-[9px] font-bold uppercase">Color Variants:</span>
                            <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                              <div className="flex -space-x-1">
                                {p.colors?.slice(0, 4).map((c, i) => (
                                  <div
                                    key={i}
                                    className="w-3.5 h-3.5 rounded-full border border-white"
                                    style={{ backgroundColor: c.hex || '#1c2d4a' }}
                                    title={c.name}
                                  />
                                ))}
                              </div>
                              <span>{p.colors?.length || 1} Colors ({totalPhotos} Photos)</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-slate-500 block text-[9px] font-bold uppercase">Pack Offers:</span>
                            <span className="font-bold text-slate-800 block mt-0.5">
                              {p.packs?.length || 1} Pack Sizes Configured
                            </span>
                          </div>
                        </div>

                        {/* A+ Content Indicators */}
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${p.setupGuide ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                            <Check className="w-3 h-3" /> 3-Step Setup Pop-up
                          </span>
                          <span className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${p.comparison ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                            <Check className="w-3 h-3" /> Comparison Table
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <Link
                          to={`/product/${p.id}`}
                          target="_blank"
                          className="text-[#1c2d4a] hover:underline font-bold flex items-center gap-1 text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View on Store</span>
                        </Link>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="px-3 py-1.5 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Product</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: INVENTORY & STOCK MANAGEMENT HUB
        ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1c2d4a] flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-[#1c2d4a]" />
                    <span>Real-Time Warehouse Stock & Low-Stock Alerts</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any product photo to zoom in full screen. Automatically alerts warehouse team when stock drops below minimum threshold.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset inventory stock counts to warehouse default baseline?')) {
                        setInventory(defaultInventory);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>

              {/* Inventory Table with First Column as Product Image */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-center w-16">Product Photo</th>
                      <th className="py-3 px-4">Product & Variant</th>
                      <th className="py-3 px-4">SKU Code</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4">Health Status</th>
                      <th className="py-3 px-4 text-center">Quick Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-slate-400">
                        No inventory items match your search query.
                      </td>
                    </tr>
                  ) : filteredInventory.map((item) => {
                      const isLow = item.stock <= item.minAlert;
                      const isOutOfStock = item.stock === 0;
                      const itemImg = getProductColorImage(item);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 text-center">
                            <div
                              onClick={() =>
                                setZoomedImage({
                                  src: itemImg,
                                  title: item.productName,
                                  variant: item.variant,
                                  sku: item.sku,
                                  stock: item.stock
                                })
                              }
                              className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer shadow-xs group bg-slate-50 mx-auto relative"
                              title="Click to view full screen zoom"
                            >
                              <img
                                src={itemImg}
                                alt={item.variant}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                <Maximize2 className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition drop-shadow-sm" />
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{item.productName}</div>
                            <div className="text-[11px] text-amber-800 font-semibold">{item.variant}</div>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                            {item.sku}
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {item.category}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            ₹{item.price}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="0"
                                value={item.stock}
                                onChange={(e) => setExactStock(item.id, e.target.value)}
                                className="w-16 font-mono font-black text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-center focus:outline-hidden focus:ring-2 focus:ring-[#1c2d4a]"
                              />
                              <span className="text-[11px] text-slate-500 font-medium">Units</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isOutOfStock ? (
                              <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-rose-300 flex items-center gap-1 w-max">
                                <AlertTriangle className="w-3 h-3" />
                                OUT OF STOCK
                              </span>
                            ) : isLow ? (
                              <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 w-max">
                                <AlertTriangle className="w-3 h-3 text-amber-700" />
                                LOW STOCK ({item.stock} left)
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 w-max">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                IN STOCK ({item.stock})
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => updateStock(item.id, -1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition cursor-pointer"
                                title="Decrease Stock by 1"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => updateStock(item.id, +1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition cursor-pointer"
                                title="Increase Stock by 1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => updateStock(item.id, +10)}
                                className="px-2 py-1 rounded-lg bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-[10px] transition cursor-pointer ml-1"
                                title="Restock +10 units"
                              >
                                +10 Restock
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: COURIER PICKUP MANIFEST (DELHIVERY / BLUEDART)
        ======================================================== */}
        {activeTab === 'manifest' && (() => {
          const packedOrdersForManifest = orders.filter((o) => o.status === 'PACKED');
          const packedCodTotal = packedOrdersForManifest
            .filter((o) => o.paymentMethod === 'COD')
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

          return (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4 no-print">
                  <div>
                    <h3 className="text-base font-bold text-[#1c2d4a] flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-[#1c2d4a]" />
                      <span>Official Logistics Pickup Manifest Slip</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Generate & print handover proof before transferring boxed packages to Delhivery / Bluedart courier rider.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2.5 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>Print Official Manifest</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Sheet - targeted by @media print */}
                <div id="printable-manifest" className="border-2 border-slate-900 p-6 rounded-2xl bg-white font-sans text-xs space-y-4 shadow-xs">
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-900">APPZYS® SMART STORAGE</h2>
                      <p className="text-[10px] text-slate-600">Fulfillment Hub: Plot 12, Industrial Estate, Guindy, Chennai - 600032</p>
                      <p className="text-[10px] text-slate-600">Support Helpline: +91 98400 12345 • care@appzys.com</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block border-2 border-slate-900 px-3 py-1 font-mono font-black text-xs uppercase bg-amber-50">
                        DISPATCH MANIFEST
                      </span>
                      <div className="text-[10px] font-mono mt-1 text-slate-700">
                        Manifest #: <strong>MNF-APPZYS-{new Date().getFullYear()}-{new Date().getMonth() + 1}82</strong>
                      </div>
                      <div className="text-[10px] text-slate-600">
                        Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px]">COURIER PARTNER:</span>
                      <strong className="text-slate-900 text-xs">Delhivery Express Surface</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px]">TOTAL DISPATCH PARCELS:</span>
                      <strong className="text-slate-900 text-xs">{packedOrdersForManifest.length} Packages</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px]">TOTAL COD CASH TO COLLECT:</span>
                      <strong className="text-slate-900 text-xs">₹{packedCodTotal.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] border border-slate-300">
                      <thead className="bg-slate-100 font-bold text-slate-700 uppercase text-[9px] border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300">#</th>
                          <th className="p-2 border-r border-slate-300">Order ID</th>
                          <th className="p-2 border-r border-slate-300">Customer Name & Phone</th>
                          <th className="p-2 border-r border-slate-300">Destination City / Pincode</th>
                          <th className="p-2 border-r border-slate-300">AWB Tracking Number</th>
                          <th className="p-2 border-r border-slate-300">Payment</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {packedOrdersForManifest.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-slate-500 font-sans text-xs bg-slate-50/50">
                              <Package className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                              <p className="font-bold text-slate-800 text-sm">No packages marked as "Packed / Ready" yet</p>
                              <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                                In the <strong>Orders Hub</strong>, select orders in "To Pack" and click <strong>"Mark Packed / Ready →"</strong>. Those verified parcels will automatically generate and appear on this pickup manifest slip for courier handover!
                              </p>
                            </td>
                          </tr>
                        ) : (
                          packedOrdersForManifest.map((ord, idx) => (
                            <tr key={ord.id} className="font-mono">
                              <td className="p-2 border-r border-slate-200">{idx + 1}</td>
                              <td className="p-2 font-bold text-slate-900 border-r border-slate-200">{ord.id}</td>
                              <td className="p-2 font-sans border-r border-slate-200">
                                <span className="font-bold">{ord.customerName}</span> ({ord.phone})
                              </td>
                              <td className="p-2 font-sans border-r border-slate-200 truncate max-w-xs">
                                {ord.address}
                              </td>
                              <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                                {ord.awb || 'AWB-DEL-982140'}
                              </td>
                              <td className="p-2 font-sans font-bold border-r border-slate-200">
                                {ord.paymentMethod === 'COD' ? 'C.O.D.' : 'PREPAID'}
                              </td>
                              <td className="p-2 text-right font-bold text-slate-900">₹{ord.totalAmount}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-900 text-xs">
                    <div className="border border-slate-300 p-3 rounded-xl space-y-8 bg-slate-50/50">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">
                          COURIER RIDER ACCEPTANCE:
                        </span>
                        <p className="text-[10px] text-slate-500">
                          I hereby confirm receiving the above packages in sound sealed condition.
                        </p>
                      </div>
                      <div className="border-t border-slate-400 pt-1 flex justify-between text-[10px]">
                        <span>Rider Name & Vehicle No: ____________</span>
                        <span>Signature: ____________</span>
                      </div>
                    </div>

                    <div className="border border-slate-300 p-3 rounded-xl space-y-8 bg-slate-50/50">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">
                          APPZYS WAREHOUSE DISPATCHER:
                        </span>
                        <p className="text-[10px] text-slate-500">
                          Dispatched with authentic invoice and stainless steel warranty card inside.
                        </p>
                      </div>
                      <div className="border-t border-slate-400 pt-1 flex justify-between text-[10px]">
                        <span>Manager: Store Warehouse Lead</span>
                        <span>Authorized Seal: ____________</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================================
            TAB 5: HOMEPAGE BANNERS & TRANSFORMATION SLIDERS CMS
        ======================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Section 1: Hero Banner Management */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1c2d4a] flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#1c2d4a]" />
                    <span>Homepage Hero Banners CMS</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update the main top banner image, headlines, sub-headlines, and destination category buttons on the customer homepage.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {liveBanners.map((b, idx) => (
                  <div key={b.id || idx} className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                    <div className="aspect-21/9 w-full max-h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                      <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Banner Image URL / Upload */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-slate-700">Banner Image URL or File:</label>
                          <label className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#1c2d4a] border border-slate-300 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-2xs">
                            <Upload className="w-3 h-3" />
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                  const updated = [...liveBanners];
                                  updated[idx].imageUrl = reader.result;
                                  setLiveBanners(updated);
                                  saveLiveBanners(updated);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          value={b.imageUrl}
                          onChange={(e) => {
                            const updated = [...liveBanners];
                            updated[idx].imageUrl = e.target.value;
                            setLiveBanners(updated);
                            saveLiveBanners(updated);
                          }}
                          placeholder="/images/appzys-hero-banner.jpg"
                          className="w-full p-2 rounded-lg border border-slate-300 font-mono text-[11px] bg-white"
                        />
                      </div>

                      {/* Banner Headline Title */}
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Banner Headline Title:</label>
                        <input
                          type="text"
                          value={b.title || ''}
                          onChange={(e) => {
                            const updated = [...liveBanners];
                            updated[idx].title = e.target.value;
                            setLiveBanners(updated);
                            saveLiveBanners(updated);
                          }}
                          placeholder="e.g. Organise Your Sarees & Jewellery Beautifully"
                          className="w-full p-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                        />
                      </div>

                      {/* Banner Subtitle / Description */}
                      <div className="sm:col-span-2">
                        <label className="font-bold text-slate-700 block mb-1">Banner Subheading / Description:</label>
                        <input
                          type="text"
                          value={b.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...liveBanners];
                            updated[idx].subtitle = e.target.value;
                            setLiveBanners(updated);
                            saveLiveBanners(updated);
                          }}
                          placeholder="e.g. Spacious, durable and stylish organisers for your sarees, clothes and jewellery."
                          className="w-full p-2 rounded-lg border border-slate-300 text-xs font-medium bg-white"
                        />
                      </div>

                      {/* Button 1 Configuration */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 text-[11px] block">Button 1 (Left Hotspot):</span>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block">Button 1 Label:</label>
                          <input
                            type="text"
                            value={b.btn1Text || 'Shop Saree Organiser'}
                            onChange={(e) => {
                              const updated = [...liveBanners];
                              updated[idx].btn1Text = e.target.value;
                              setLiveBanners(updated);
                              saveLiveBanners(updated);
                            }}
                            className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block">Button 1 Link URL:</label>
                          <input
                            type="text"
                            value={b.btn1Link || '/?category=saree-organiser'}
                            onChange={(e) => {
                              const updated = [...liveBanners];
                              updated[idx].btn1Link = e.target.value;
                              setLiveBanners(updated);
                              saveLiveBanners(updated);
                            }}
                            className="w-full p-1.5 rounded border border-slate-300 font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      {/* Button 2 Configuration */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 text-[11px] block">Button 2 (Right Hotspot):</span>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block">Button 2 Label:</label>
                          <input
                            type="text"
                            value={b.btn2Text || 'Shop Jewellery Organiser'}
                            onChange={(e) => {
                              const updated = [...liveBanners];
                              updated[idx].btn2Text = e.target.value;
                              setLiveBanners(updated);
                              saveLiveBanners(updated);
                            }}
                            className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block">Button 2 Link URL:</label>
                          <input
                            type="text"
                            value={b.btn2Link || '/?category=jewel-organiser'}
                            onChange={(e) => {
                              const updated = [...liveBanners];
                              updated[idx].btn2Link = e.target.value;
                              setLiveBanners(updated);
                              saveLiveBanners(updated);
                            }}
                            className="w-full p-1.5 rounded border border-slate-300 font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Product Transformation (Before & After) Sliders CMS */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#1c2d4a] flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#1c2d4a]" />
                    <span>Product Transformation (Before & After) Sliders</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize the interactive Before vs After comparison sliders on the homepage. Upload photos, change headings, and add new product transformation stories.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newSlider = {
                      id: 'slider-' + Date.now().toString(36),
                      badge: 'NEW PRODUCT TRANSFORMATION',
                      headerTitle: 'See The Magic Transformation',
                      headerSubtitle: 'Drag the center slider left and right to compare before & after',
                      shopText: 'Shop Now',
                      shopLink: '/',
                      beforeImg: '/images/transformation-before-banner.png',
                      afterImg: '/images/transformation-after-banner.png',
                      beforeBadge: '❌ BEFORE: ORDINARY STORAGE',
                      beforeTitle: 'Messy & Cluttered Space',
                      beforeDesc: 'Clothes and items remain unorganized and exposed to dust.',
                      beforePill: 'Disorganized • Cluttered',
                      afterBadge: '✨ AFTER: APPZYS® STORAGE',
                      afterTitle: 'Neat & Space-Saving',
                      afterDesc: 'Organize and stack with rigid protection and effortless accessibility.',
                      afterPill: 'High Durability • Dust-Proof'
                    };
                    const updated = [...liveSliders, newSlider];
                    setLiveSliders(updated);
                    saveLiveSliders(updated);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Add Transformation Slider</span>
                </button>
              </div>

              <div className="space-y-6">
                {liveSliders.map((slider, sIdx) => (
                  <div key={slider.id || sIdx} className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/70 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs bg-[#1c2d4a] text-white px-2.5 py-0.5 rounded-full">
                          Slider #{sIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={slider.badge || ''}
                          onChange={(e) => {
                            const updated = [...liveSliders];
                            updated[sIdx].badge = e.target.value;
                            setLiveSliders(updated);
                            saveLiveSliders(updated);
                          }}
                          placeholder="e.g. WARDROBE TRANSFORMATION"
                          className="font-bold text-xs px-2 py-1 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      {liveSliders.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = liveSliders.filter((_, i) => i !== sIdx);
                            setLiveSliders(updated);
                            saveLiveSliders(updated);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition flex items-center gap-1 text-xs font-bold"
                          title="Delete slider"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>

                    {/* Header Title & Subtitle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Header Title:</label>
                        <input
                          type="text"
                          value={slider.headerTitle || ''}
                          onChange={(e) => {
                            const updated = [...liveSliders];
                            updated[sIdx].headerTitle = e.target.value;
                            setLiveSliders(updated);
                            saveLiveSliders(updated);
                          }}
                          className="w-full p-2 rounded-lg border border-slate-300 font-semibold bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Header Subtitle:</label>
                        <input
                          type="text"
                          value={slider.headerSubtitle || ''}
                          onChange={(e) => {
                            const updated = [...liveSliders];
                            updated[sIdx].headerSubtitle = e.target.value;
                            setLiveSliders(updated);
                            saveLiveSliders(updated);
                          }}
                          className="w-full p-2 rounded-lg border border-slate-300 text-slate-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Shop CTA Button Text:</label>
                        <input
                          type="text"
                          value={slider.shopText || ''}
                          onChange={(e) => {
                            const updated = [...liveSliders];
                            updated[sIdx].shopText = e.target.value;
                            setLiveSliders(updated);
                            saveLiveSliders(updated);
                          }}
                          className="w-full p-2 rounded-lg border border-slate-300 font-bold bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Shop CTA Button Link:</label>
                        <input
                          type="text"
                          value={slider.shopLink || ''}
                          onChange={(e) => {
                            const updated = [...liveSliders];
                            updated[sIdx].shopLink = e.target.value;
                            setLiveSliders(updated);
                            saveLiveSliders(updated);
                          }}
                          className="w-full p-2 rounded-lg border border-slate-300 font-mono text-[11px] bg-white"
                        />
                      </div>
                    </div>

                    {/* Dual Box: BEFORE (Left) vs AFTER (Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* BEFORE Box */}
                      <div className="p-4 rounded-xl border-2 border-rose-200 bg-rose-50/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900 text-xs flex items-center gap-1">
                            ❌ BEFORE Comparison Box
                          </span>
                          <label className="px-2 py-1 bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>Upload Before Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                  const updated = [...liveSliders];
                                  updated[sIdx].beforeImg = reader.result;
                                  setLiveSliders(updated);
                                  saveLiveSliders(updated);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                        </div>

                        {slider.beforeImg && (
                          <div className="w-full h-32 rounded-lg overflow-hidden border border-rose-200 bg-white">
                            <img src={slider.beforeImg} alt="Before" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Before Image URL:</label>
                            <input
                              type="text"
                              value={slider.beforeImg || ''}
                              onChange={(e) => {
                                const updated = [...liveSliders];
                                updated[sIdx].beforeImg = e.target.value;
                                setLiveSliders(updated);
                                saveLiveSliders(updated);
                              }}
                              className="w-full p-1.5 rounded border border-slate-300 font-mono text-[10px] bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Before Title:</label>
                            <input
                              type="text"
                              value={slider.beforeTitle || ''}
                              onChange={(e) => {
                                const updated = [...liveSliders];
                                updated[sIdx].beforeTitle = e.target.value;
                                setLiveSliders(updated);
                                saveLiveSliders(updated);
                              }}
                              className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Before Description:</label>
                            <textarea
                              rows={2}
                              value={slider.beforeDesc || ''}
                              onChange={(e) => {
                                const updated = [...liveSliders];
                                updated[sIdx].beforeDesc = e.target.value;
                                setLiveSliders(updated);
                                saveLiveSliders(updated);
                              }}
                              className="w-full p-1.5 rounded border border-slate-300 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Before Feature Pill:</label>
                            <input
                              type="text"
                              value={slider.beforePill || ''}
                              onChange={(e) => {
                                const updated = [...liveSliders];
                                updated[sIdx].beforePill = e.target.value;
                                setLiveSliders(updated);
                                saveLiveSliders(updated);
                              }}
                              placeholder="e.g. Crushed Zari • Wrinkles • Dust Exposure"
                              className="w-full p-1.5 rounded border border-slate-300 text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* AFTER Box */}
                      <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/40 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 text-xs flex items-center gap-1">
                            ✨ AFTER Comparison Box
                          </span>
                          <label className="px-2 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>Upload After Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                  const updated = [...liveSliders];
                                  updated[sIdx].afterImg = reader.result;
                                  setLiveSliders(updated);
                                  saveLiveSliders(updated);
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                        </div>

                        {slider.afterImg && (
                          <div className="w-full h-32 rounded-lg overflow-hidden border border-emerald-200 bg-white">
                            <img src={slider.afterImg} alt="After" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">After Image URL:</label>
                            <input
                              type="text"
                              value={slider.afterImg || ''}
                              onChange={(e) => {
                                const updated = [...liveSliders];
                                updated[sIdx].afterImg = e.target.value;
                                setLiveSliders(updated);
                                saveLiveSliders(updated);
                              }}
                              className="w-full p-1.5 rounded border border-slate-300 font-mono text-[10px] bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">After Title:</label>
                            <input
                              type="text"
                              value={slider.afterTitle || ''}
                              onChange={(e) => {
                                const updated = [...liveSliders];
                                updated[sIdx].afterTitle = e.target.value;
                                setLiveSliders(updated);
                                saveLiveSliders(updated);
                              }}
                              className="w-full p-1.5 rounded border border-slate-300 text-xs font-bold bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">After Description:</label>
                            <textarea
                              rows={2}
                              value={slider.afterDesc || ''}
                              onChange={(e) => {
                                const updated = [...liveSliders];
                                updated[sIdx].afterDesc = e.target.value;
                                setLiveSliders(updated);
                                saveLiveSliders(updated);
                              }}
                              className="w-full p-1.5 rounded border border-slate-300 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-500 font-bold block mb-0.5">After Feature Pill:</label>
                            <input
                              type="text"
                              value={slider.afterPill || ''}
                              onChange={(e) => {
                                const updated = [...liveSliders];
                                updated[sIdx].afterPill = e.target.value;
                                setLiveSliders(updated);
                                saveLiveSliders(updated);
                              }}
                              placeholder="e.g. 15-18 Sarees Per Box • Dust-Proof"
                              className="w-full p-1.5 rounded border border-slate-300 text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: NEWSLETTER LEADS TABLE
        ======================================================== */}
        {activeTab === 'newsletter' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1c2d4a] flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#1c2d4a]" />
                  <span>Customer Newsletter Subscribers ({subscribers.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customers who subscribed from the banner to receive new product launches, organizing tips & festive coupons.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyEmails}
                  className="px-4 py-2 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy All Emails'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Customer Email</th>
                    <th className="py-3 px-4">Subscribed Date</th>
                    <th className="py-3 px-4">Form Source</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscribers.map((sub, index) => (
                    <tr key={sub.id || index} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-400">{index + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{sub.email}</td>
                      <td className="py-3.5 px-4 text-slate-500">{new Date(sub.date).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-slate-600">{sub.source || 'Footer Banner'}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-300">
                          ACTIVE SUBSCRIBER
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          PRODUCT CREATION & EDIT MODAL (World-Class Dynamic Builder)
      ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 flex flex-col font-sans animate-in fade-in duration-150">
          {/* Top Sticky Header Bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs px-4 sm:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Left: < Arrow button + Clean Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
                title="Back to Catalog"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-[#1c2d4a] truncate max-w-xs sm:max-w-md">
                  {productForm.id && liveProducts.some((p) => p.id === productForm.id)
                    ? `Edit: ${productForm.shortTitle || productForm.title || 'Product'}`
                    : '+ Add New Product to Store'}
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">
                  Catalog & A+ Studio
                </p>
              </div>
            </div>

            {/* Middle: 4 Tabs - Clean Grid without scrolling/slide */}
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setProductFormTab('basic')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-center whitespace-nowrap text-[11px] ${
                  productFormTab === 'basic' ? 'bg-[#1c2d4a] text-white shadow-xs' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                1. Basic Info
              </button>
              <button
                type="button"
                onClick={() => setProductFormTab('variants')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-center whitespace-nowrap text-[11px] ${
                  productFormTab === 'variants' ? 'bg-[#1c2d4a] text-white shadow-xs' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                2. Colors & Photos ({productForm.colors?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setProductFormTab('packs')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-center whitespace-nowrap text-[11px] ${
                  productFormTab === 'packs' ? 'bg-[#1c2d4a] text-white shadow-xs' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                3. Pack Offers ({productForm.packs?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setProductFormTab('rich')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-center whitespace-nowrap text-[11px] ${
                  productFormTab === 'rich' ? 'bg-[#1c2d4a] text-white shadow-xs' : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                4. Rich A+ Content
              </button>
            </div>

            {/* Right: Save & Publish Button only (No Cancel, No Check icon) */}
            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={handleSaveProduct}
                className="px-5 py-2 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                Save & Publish
              </button>
            </div>
          </header>

          {/* Full Page Main Form Body */}
          <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
                {/* SECTION 1: BASIC INFO, DESCRIPTION & BULLET POINTS */}
                {productFormTab === 'basic' && (
                  <div className="space-y-5">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Product Title (Full Display Name) *</label>
                      <input
                        type="text"
                        required
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        placeholder="e.g. 60L Saree Organiser | Stainless Steel Frame Foldable Living Box"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 font-semibold text-sm focus:ring-2 focus:ring-[#1c2d4a]/20 focus:border-[#1c2d4a] outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Short Title (Card Header)</label>
                        <input
                          type="text"
                          value={productForm.shortTitle}
                          onChange={(e) => setProductForm({ ...productForm, shortTitle: e.target.value })}
                          placeholder="e.g. 60L Saree Organiser Living Box"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold bg-white"
                        >
                          <option value="Wardrobe Organizers">Wardrobe Organizers</option>
                          <option value="Jewellery Organisers">Jewellery Organisers</option>
                          <option value="Living Box">Living Box</option>
                          <option value="Smart Storage">Smart Storage</option>
                        </select>
                      </div>
                    </div>

                    {/* Product Description Textarea */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Product Description / Story</label>
                      <textarea
                        rows={4}
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Enter full overview description about the product features, premium fabric, durability, and daily utility..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-xs leading-relaxed text-slate-800 focus:ring-2 focus:ring-[#1c2d4a]/20 focus:border-[#1c2d4a]"
                      />
                    </div>

                    {/* Key Highlights Bullet Points */}
                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="font-bold text-slate-800 block text-xs">Key Feature Bullet Points</label>
                          <p className="text-[10px] text-slate-500">Displayed as checkmarked bullet points on the product page.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setProductForm({
                              ...productForm,
                              perfectFor: [...(productForm.perfectFor || []), '']
                            });
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#1c2d4a] font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Bullet Point</span>
                        </button>
                      </div>

                      <div className="space-y-2 pt-1">
                        {(productForm.perfectFor || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2">
                            <span className="text-emerald-600 font-bold text-base">✓</span>
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => {
                                const updated = [...(productForm.perfectFor || [])];
                                updated[bIdx] = e.target.value;
                                setProductForm({ ...productForm, perfectFor: updated });
                              }}
                              placeholder="e.g. Sarees & Traditional Wear Organizing"
                              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (productForm.perfectFor || []).filter((_, i) => i !== bIdx);
                                setProductForm({ ...productForm, perfectFor: updated });
                              }}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition"
                              title="Delete bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Key Specifications / Dimensions</label>
                      <input
                        type="text"
                        value={productForm.specs || ''}
                        onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                        placeholder="e.g. 50 x 40 x 30 cm • 60 Liters Capacity"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* SECTION 2: COLORS & 4-5 PHOTOS */}
                {productFormTab === 'variants' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">Product Color Variants & Visual Photo Galleries</h4>
                        <p className="text-[11px] text-slate-500">
                          Type any color name (e.g. Maroon, Beige, Pink, Navy) and the swatch auto-matches! Each color has its own visual gallery.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newColor = {
                            name: '',
                            hex: '#ffffff',
                            images: []
                          };
                          const newColors = [...(productForm.colors || []), newColor];
                          setProductForm({
                            ...productForm,
                            colors: newColors
                          });
                          // Smooth scroll to the newly created color box
                          setTimeout(() => {
                            const newCard = document.getElementById(`color-card-${newColors.length - 1}`);
                            if (newCard) {
                              newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              const nameInput = newCard.querySelector('input[type="text"]');
                              if (nameInput) nameInput.focus();
                            }
                          }, 100);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Color</span>
                      </button>
                    </div>

                    <div className="space-y-5">
                      {productForm.colors?.map((col, cIdx) => (
                        <div
                          key={cIdx}
                          id={`color-card-${cIdx}`}
                          className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 shadow-2xs scroll-mt-20 transition"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                            <div className="flex items-center gap-3">
                              {/* Color Swatch: Auto-detected or click to pick custom */}
                              <div className="relative">
                                <input
                                  type="color"
                                  value={col.hex || '#ffffff'}
                                  onChange={(e) => {
                                    const updated = [...productForm.colors];
                                    updated[cIdx].hex = e.target.value;
                                    setProductForm({ ...productForm, colors: updated });
                                  }}
                                  className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5 bg-white shadow-2xs"
                                  title="Click to pick custom color"
                                />
                              </div>
                              <input
                                type="text"
                                value={col.name}
                                onChange={(e) => {
                                  const newName = e.target.value;
                                  const updated = [...productForm.colors];
                                  updated[cIdx].name = newName;
                                  // Auto-detect color from typed name
                                  const matched = detectColorHex(newName);
                                  if (matched) {
                                    updated[cIdx].hex = matched;
                                  }
                                  setProductForm({ ...productForm, colors: updated });
                                }}
                                placeholder="Color Name (e.g. Navy Blue, Maroon, Beige, Pink)"
                                className="px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-xs bg-white w-72 focus:ring-2 focus:ring-[#1c2d4a]/20"
                              />
                            </div>

                            {productForm.colors.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = productForm.colors.filter((_, i) => i !== cIdx);
                                  setProductForm({ ...productForm, colors: updated });
                                }}
                                className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Color</span>
                              </button>
                            )}
                          </div>

                          {/* Photos Grid for this color */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-700 text-[11px]">
                                Photo Gallery for "{col.name || 'Color'}" ({col.images?.length || 0} photos)
                              </span>
                              <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 font-bold text-xs text-[#1c2d4a] flex items-center gap-1.5 transition cursor-pointer shadow-2xs">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Photo File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      const updated = [...productForm.colors];
                                      updated[cIdx].images = [...(updated[cIdx].images || []), reader.result];
                                      setProductForm({ ...productForm, colors: updated });
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
                              {col.images?.map((imgUrl, iIdx) => (
                                <div key={iIdx} className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-white aspect-square shadow-2xs">
                                  <img
                                    src={imgUrl}
                                    alt="Product Preview"
                                    className="w-full h-full object-cover group-hover:scale-105 transition"
                                  />
                                  <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...productForm.colors];
                                        updated[cIdx].images = updated[cIdx].images.filter((_, idx) => idx !== iIdx);
                                        setProductForm({ ...productForm, colors: updated });
                                      }}
                                      className="p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 cursor-pointer"
                                      title="Delete photo"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                    Slot {iIdx + 1}
                                  </span>
                                </div>
                              ))}

                              {/* Slot for manual URL input */}
                              <div className="border border-dashed border-slate-300 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center gap-1 bg-white/70 min-h-[100px]">
                                <Plus className="w-4 h-4 text-slate-400" />
                                <input
                                  type="text"
                                  placeholder="Paste image path"
                                  className="w-full text-[10px] p-1 border rounded font-mono"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                      e.preventDefault();
                                      const updated = [...productForm.colors];
                                      updated[cIdx].images = [...(updated[cIdx].images || []), e.target.value.trim()];
                                      setProductForm({ ...productForm, colors: updated });
                                      e.target.value = '';
                                    }
                                  }}
                                />
                                <span className="text-[9px] text-slate-400">Press Enter</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 3: PACK OFFERS WITH AUTO-CALCULATED DISCOUNT */}
                {productFormTab === 'packs' && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">Pack Bundles & Multi-Pack Pricing</h4>
                        <p className="text-[11px] text-slate-500">
                          Configure single box, pack of 2, and pack of 4 offers. Discount % is automatically calculated from Selling Price & MRP!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newPack = {
                            id: 'pack-' + Date.now().toString(36),
                            name: 'Pack of 3 (Custom)',
                            price: 1299,
                            mrp: 2397,
                            discount: '45% OFF',
                            popular: false
                          };
                          setProductForm({
                            ...productForm,
                            packs: [...(productForm.packs || []), newPack]
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#1c2d4a] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Pack Tier</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {productForm.packs?.map((pk, pIdx) => {
                        const packPrice = Number(pk.price) || 0;
                        const packMrp = Number(pk.mrp) || 0;
                        const packDiscount = packMrp > packPrice ? `${Math.round(((packMrp - packPrice) / packMrp) * 100)}% OFF` : '0% OFF';

                        return (
                          <div key={pIdx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 shadow-2xs">
                            <div className="flex justify-between items-center">
                              <input
                                type="text"
                                value={pk.name ?? ''}
                                placeholder={`Pack of ${pIdx + 1}`}
                                onChange={(e) => {
                                  const updated = [...productForm.packs];
                                  updated[pIdx].name = e.target.value;
                                  setProductForm({ ...productForm, packs: updated });
                                }}
                                className="font-bold text-xs p-1.5 rounded-lg border border-slate-300 bg-white w-full"
                              />
                              {productForm.packs.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = productForm.packs.filter((_, i) => i !== pIdx);
                                    setProductForm({ ...productForm, packs: updated });
                                  }}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded ml-2 cursor-pointer"
                                  title="Delete pack tier"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-500 block font-bold mb-0.5">Selling Price (₹)</label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={pk.price ?? ''}
                                  placeholder="0"
                                  onChange={(e) => {
                                    let raw = e.target.value.replace(/[^\d]/g, '');
                                    if (raw.length > 1 && raw.startsWith('0')) {
                                      raw = raw.replace(/^0+/, '');
                                    }
                                    const updated = [...productForm.packs];
                                    updated[pIdx].price = raw;
                                    const numPrice = Number(raw) || 0;
                                    const numMrp = Number(updated[pIdx].mrp) || 0;
                                    updated[pIdx].discount = numMrp > numPrice ? `${Math.round(((numMrp - numPrice) / numMrp) * 100)}% OFF` : '0% OFF';
                                    setProductForm({ ...productForm, packs: updated });
                                  }}
                                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono font-bold text-xs focus:ring-2 focus:ring-[#1c2d4a]/20 outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-500 block font-bold mb-0.5">MRP (₹)</label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={pk.mrp ?? ''}
                                  placeholder="0"
                                  onChange={(e) => {
                                    let raw = e.target.value.replace(/[^\d]/g, '');
                                    if (raw.length > 1 && raw.startsWith('0')) {
                                      raw = raw.replace(/^0+/, '');
                                    }
                                    const updated = [...productForm.packs];
                                    updated[pIdx].mrp = raw;
                                    const numMrp = Number(raw) || 0;
                                    const numPrice = Number(updated[pIdx].price) || 0;
                                    updated[pIdx].discount = numMrp > numPrice ? `${Math.round(((numMrp - numPrice) / numMrp) * 100)}% OFF` : '0% OFF';
                                    setProductForm({ ...productForm, packs: updated });
                                  }}
                                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono font-bold text-xs focus:ring-2 focus:ring-[#1c2d4a]/20 outline-hidden"
                                />
                              </div>
                            </div>

                            {/* Auto-Calculated Discount Badge & Best Value Toggle */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(pk.popular)}
                                  onChange={(e) => {
                                    const updated = [...productForm.packs];
                                    updated[pIdx].popular = e.target.checked;
                                    setProductForm({ ...productForm, packs: updated });
                                  }}
                                  className="w-3.5 h-3.5 rounded text-[#1c2d4a]"
                                />
                                <span title="Highlights this pack on the store as 'Best Value - Most Popular' badge">Best Value Badge</span>
                              </label>

                              {/* Prominent Discount % Badge */}
                              <span className="font-black text-emerald-700 text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                {packDiscount}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION 4: RICH A+ CONTENT STUDIO WITH 3-STEP VIDEO & COMPARISON TABLE */}
                {productFormTab === 'rich' && (
                  <div className="space-y-6">
                    {/* 3-Step Setup Guide Box */}
                    <div className="border border-slate-200 rounded-3xl p-5 sm:p-6 bg-slate-50/70 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">3-Step Easy Assembly Pop-up & Video Demo</span>
                            <p className="text-[11px] text-slate-500">
                              Upload short clip or photo. Automatically loops the first 5 seconds just like the live website. Click any media to preview full screen!
                            </p>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 font-bold cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                          <input
                            type="checkbox"
                            checked={productForm.setupGuide?.enabled !== false}
                            onChange={(e) => {
                              setProductForm({
                                ...productForm,
                                setupGuide: {
                                  ...productForm.setupGuide,
                                  enabled: e.target.checked
                                }
                              });
                            }}
                            className="w-4 h-4 rounded text-[#1c2d4a]"
                          />
                          <span>Enable on Page</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                        {productForm.setupGuide?.steps?.map((st, sIdx) => {
                          const isJewel = productForm.id?.includes('jewel') || productForm.categorySlug?.includes('jewel') || productForm.title?.toLowerCase().includes('jewel');
                          const defaultFallbackVid = isJewel
                            ? (sIdx === 0 ? '/videos/jewel_step1.mp4' : sIdx === 1 ? '/videos/jewel_step2.mp4' : '/videos/jewel_step3.mp4')
                            : (sIdx === 0 ? '/videos/step1_popup.mp4' : sIdx === 1 ? '/videos/step2_pack.mp4' : '/videos/step3_pull.mp4');

                          const stepVideo = st.video || defaultFallbackVid;
                          const isImg = isImageMedia(stepVideo);

                          return (
                            <div key={sIdx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-black text-[#1c2d4a] text-xs bg-slate-100 px-2.5 py-0.5 rounded-lg">
                                    STEP {st.step || sIdx + 1}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                    {isImg ? 'Photo Preview' : '5-Sec Video Loop'}
                                  </span>
                                </div>

                                {/* Step Media Preview with Full Page Zoom on click */}
                                <div
                                  onClick={() => setZoomedStepMedia({
                                    src: stepVideo,
                                    isImage: isImg,
                                    title: st.title || `Step ${sIdx + 1}`,
                                    subtitle: st.subtitle,
                                    stepNumber: sIdx + 1
                                  })}
                                  className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 cursor-zoom-in group shadow-xs select-none"
                                  title="Click to preview full screen"
                                >
                                  {isImg ? (
                                    <img
                                      src={stepVideo}
                                      alt={st.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                  ) : (
                                    <video
                                      src={stepVideo}
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      onTimeUpdate={(e) => {
                                        if (e.target.currentTime >= 5) {
                                          e.target.currentTime = 0;
                                          e.target.play();
                                        }
                                      }}
                                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white font-bold text-xs">
                                    <Maximize2 className="w-4 h-4" />
                                    <span>Full Screen Preview</span>
                                  </div>
                                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    🔍 Click to zoom
                                  </div>
                                </div>

                                {/* Media Upload / URL Input */}
                                <div className="space-y-1.5 pt-1">
                                  <label className="w-full px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Upload Video or Photo</span>
                                    <input
                                      type="file"
                                      accept="video/*,image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                          const updated = { ...productForm.setupGuide };
                                          updated.steps[sIdx].video = reader.result;
                                          setProductForm({ ...productForm, setupGuide: updated });
                                        };
                                        reader.readAsDataURL(file);
                                      }}
                                    />
                                  </label>

                                  <input
                                    type="text"
                                    value={st.video || ''}
                                    onChange={(e) => {
                                      const updated = { ...productForm.setupGuide };
                                      updated.steps[sIdx].video = e.target.value;
                                      setProductForm({ ...productForm, setupGuide: updated });
                                    }}
                                    placeholder="Or paste video/image URL"
                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-700 bg-slate-50 placeholder:text-slate-400"
                                  />
                                </div>

                                {/* Title & Subtitle inputs */}
                                <div className="space-y-1 pt-1">
                                  <label className="text-[10px] font-bold text-slate-600 block">Step Title</label>
                                  <input
                                    type="text"
                                    value={st.title || ''}
                                    onChange={(e) => {
                                      const updated = { ...productForm.setupGuide };
                                      updated.steps[sIdx].title = e.target.value;
                                      setProductForm({ ...productForm, setupGuide: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold text-xs text-slate-900"
                                    placeholder="Step Title"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-600 block">Step Subtitle</label>
                                  <input
                                    type="text"
                                    value={st.subtitle || ''}
                                    onChange={(e) => {
                                      const updated = { ...productForm.setupGuide };
                                      updated.steps[sIdx].subtitle = e.target.value;
                                      setProductForm({ ...productForm, setupGuide: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
                                    placeholder="Step Subtitle"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Steel vs Cloth Comparison Table */}
                    <div className="border border-slate-200 rounded-3xl p-5 sm:p-6 bg-slate-50/70 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            <Layers className="w-5 h-5 text-[#1c2d4a]" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">Steel Frame vs Ordinary Cloth Comparison Table</span>
                            <p className="text-[11px] text-slate-500">Highlights why our product beats cheaper competitors.</p>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 font-bold cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                          <input
                            type="checkbox"
                            checked={productForm.comparison?.enabled !== false}
                            onChange={(e) => {
                              setProductForm({
                                ...productForm,
                                comparison: {
                                  ...productForm.comparison,
                                  enabled: e.target.checked
                                }
                              });
                            }}
                            className="w-4 h-4 rounded text-[#1c2d4a]"
                          />
                          <span>Enable on Page</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Winner Column Header</label>
                          <input
                            type="text"
                            value={productForm.comparison?.colWinner || ''}
                            onChange={(e) => {
                              const updated = { ...productForm.comparison };
                              updated.colWinner = e.target.value;
                              setProductForm({ ...productForm, comparison: updated });
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Competitor Column Header</label>
                          <input
                            type="text"
                            value={productForm.comparison?.colLoser || ''}
                            onChange={(e) => {
                              const updated = { ...productForm.comparison };
                              updated.colLoser = e.target.value;
                              setProductForm({ ...productForm, comparison: updated });
                            }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        {productForm.comparison?.rows?.map((row, rIdx) => (
                          <div key={rIdx} className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white p-3.5 rounded-xl border border-slate-200">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Feature Name</label>
                              <input
                                type="text"
                                value={row.feature}
                                onChange={(e) => {
                                  const updated = { ...productForm.comparison };
                                  updated.rows[rIdx].feature = e.target.value;
                                  setProductForm({ ...productForm, comparison: updated });
                                }}
                                className="w-full p-1.5 border rounded-lg font-bold text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-emerald-700 uppercase block mb-0.5">Our Advantage (Winner)</label>
                              <input
                                type="text"
                                value={row.winner}
                                onChange={(e) => {
                                  const updated = { ...productForm.comparison };
                                  updated.rows[rIdx].winner = e.target.value;
                                  setProductForm({ ...productForm, comparison: updated });
                                }}
                                className="w-full p-1.5 border border-emerald-300 rounded-lg text-xs bg-emerald-50/40 text-emerald-950 font-medium"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-rose-600 uppercase block mb-0.5">Ordinary Alternative (Loser)</label>
                              <input
                                type="text"
                                value={row.loser}
                                onChange={(e) => {
                                  const updated = { ...productForm.comparison };
                                  updated.rows[rIdx].loser = e.target.value;
                                  setProductForm({ ...productForm, comparison: updated });
                                }}
                                className="w-full p-1.5 border border-rose-300 rounded-lg text-xs bg-rose-50/40 text-rose-950 font-medium"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Bar: Save & Publish only (No Cancel) */}
                <div className="flex justify-end items-center pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold shadow-md cursor-pointer transition"
                  >
                    Save & Publish Product
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================
          FULL-SCREEN STEP VIDEO / PHOTO PREVIEW MODAL
      ======================================================== */}
      {zoomedStepMedia && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setZoomedStepMedia(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl z-10 space-y-4 text-white font-sans animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2.5 py-1 rounded-lg">
                  STEP {zoomedStepMedia.stepNumber}
                </span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">{zoomedStepMedia.title}</h4>
                  <p className="text-xs text-slate-400">{zoomedStepMedia.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setZoomedStepMedia(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-slate-800">
              {zoomedStepMedia.isImage ? (
                <img
                  src={zoomedStepMedia.src}
                  alt={zoomedStepMedia.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={zoomedStepMedia.src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>⏱️ Loops 5 seconds during auto-play demo on website</span>
              <button
                onClick={() => setZoomedStepMedia(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FULL-SCREEN IMAGE ZOOM MODAL (When clicking product photo)
      ======================================================== */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 z-10 space-y-4 p-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {zoomedImage.title || 'Product Visual Zoom'}
                </h4>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                  {zoomedImage.variant}
                </p>
              </div>
              <button
                onClick={() => setZoomedImage(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square flex items-center justify-center relative">
              <img
                src={zoomedImage.src}
                alt={zoomedImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-xs">
              {zoomedImage.orderId ? (
                <div>
                  <span className="text-slate-400 block text-[10px]">ORDER REF:</span>
                  <span className="font-mono font-bold text-slate-900">{zoomedImage.orderId}</span>
                  <span className="text-slate-500 ml-1">({zoomedImage.customer})</span>
                </div>
              ) : (
                <div>
                  <span className="text-slate-400 block text-[10px]">SKU CODE:</span>
                  <span className="font-mono font-bold text-slate-900">{zoomedImage.sku || 'APPZYS'}</span>
                </div>
              )}

              <button
                onClick={() => setZoomedImage(null)}
                className="px-4 py-2 bg-[#1c2d4a] hover:bg-[#152238] text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: AWB Shipping Barcode Label (Printable)
      ======================================================== */}
      {selectedOrderForLabel && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrderForLabel(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-300 z-10 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Official Courier Shipping Label (Delhivery / Bluedart)
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForLabel(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-slate-900 p-4 rounded-xl font-mono text-[11px] text-slate-900 space-y-3 bg-white">
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
                <div>
                  <div className="font-black text-sm tracking-wider font-sans">APPZYS® SMART STORAGE</div>
                  <div className="text-[9px] text-slate-600">Doorstep Express Partner: {selectedOrderForLabel.courier || 'Delhivery'}</div>
                </div>
                <div className="text-right">
                  <span className="border-2 border-slate-900 px-2 py-0.5 font-black text-xs uppercase bg-amber-50">
                    {selectedOrderForLabel.paymentMethod === 'COD' ? 'C.O.D. TO COLLECT' : 'PREPAID'}
                  </span>
                </div>
              </div>

              <div className="text-center py-2 border-b-2 border-slate-900 space-y-1">
                <div className="h-12 w-full flex items-center justify-center gap-0.5 px-4">
                  {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 6, 3, 5, 1, 3, 4, 2, 6, 1, 4, 2, 5, 3, 2, 4, 6].map(
                    (w, i) => (
                      <div
                        key={i}
                        className="bg-black h-full"
                        style={{ width: `${w * 1.5}px`, marginRight: `${(i % 3) + 1}px` }}
                      />
                    )
                  )}
                </div>
                <div className="font-bold tracking-widest text-xs">{selectedOrderForLabel.awb || 'AWB-DEL-982140'}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b-2 border-slate-900 pb-2 text-[10px]">
                <div>
                  <div className="font-bold uppercase text-[9px] text-slate-500">SHIP TO (CUSTOMER):</div>
                  <div className="font-bold text-xs">{selectedOrderForLabel.customerName}</div>
                  <div className="leading-tight text-slate-700">{selectedOrderForLabel.address}</div>
                  <div className="font-bold mt-1">Phone: {selectedOrderForLabel.phone}</div>
                </div>
                <div className="border-l-2 border-slate-900 pl-3">
                  <div className="font-bold uppercase text-[9px] text-slate-500">RETURN / DISPATCHED FROM:</div>
                  <div className="font-bold">APPZYS Fulfillment Hub</div>
                  <div className="leading-tight text-slate-700">Plot 12, Industrial Estate, Guindy, Chennai - 600032</div>
                  <div className="mt-1">Support: +91 98400 12345</div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] pt-1">
                <div>
                  <span className="font-bold">Item: </span>
                  {selectedOrderForLabel.items?.[0]?.title || 'APPZYS 60L Saree Organiser'}
                </div>
                <div>
                  <span className="font-bold">Gross Wt: </span>1.40 Kg
                </div>
                <div>
                  <span className="font-bold">Amount: </span>₹{selectedOrderForLabel.totalAmount}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrderForLabel(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Physical Shipping Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: WhatsApp Automated Notification Log
      ======================================================== */}
      {selectedOrderForWhatsapp && (() => {
        let cleanPhone = (selectedOrderForWhatsapp.phone || '8072784165').replace(/[^0-9]/g, '');
        if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
        const triggerLabel = selectedOrderForWhatsapp.status === 'PACKED'
          ? 'TRIGGER: ORDER_PACKED'
          : selectedOrderForWhatsapp.status === 'SHIPPED'
          ? 'TRIGGER: IN_TRANSIT'
          : selectedOrderForWhatsapp.status === 'DELIVERED'
          ? 'TRIGGER: ORDER_DELIVERED'
          : 'TRIGGER: ORDER_PLACED';
        const formattedTime = new Date(selectedOrderForWhatsapp.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const waMessage = getDynamicWhatsAppMessage(selectedOrderForWhatsapp);

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div
              onClick={() => setSelectedOrderForWhatsapp(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 space-y-4 font-sans animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">WhatsApp Automated Notification Log</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Recipient: {selectedOrderForWhatsapp.phone || '8072784165'} ({selectedOrderForWhatsapp.customerName || 'Customer'})</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrderForWhatsapp(null)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message Box Styled identical to Official WhatsApp Log UI */}
              <div className="space-y-3">
                <div className="bg-emerald-50/60 border border-emerald-200/90 p-4 rounded-2xl space-y-3 shadow-2xs">
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wider text-emerald-900">
                    <span>{triggerLabel}</span>
                    <span className="text-emerald-700 font-mono font-bold">{formattedTime}</span>
                  </div>
                  <p className="text-slate-800 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-sans font-medium">
                    {waMessage}
                  </p>
                  <div className="pt-1 border-t border-emerald-100 flex items-center justify-end gap-1.5 text-[11px] font-bold text-emerald-700">
                    <span>✓ Delivered via WhatsApp Official API</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5c] text-white py-3 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm hover:shadow-md cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Real WhatsApp Message to Customer</span>
                </a>
                <button
                  onClick={() => setSelectedOrderForWhatsapp(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close WhatsApp Log
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          MODAL 3: Bulk AWB Printing Modal (Multiple Labels)
      ======================================================== */}
      {isBulkPrintOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsBulkPrintOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Bulk Print AWB Labels ({selectedOrderIds.length} Packages)
                </h3>
              </div>
              <button
                onClick={() => setIsBulkPrintOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {orders
                .filter((o) => selectedOrderIds.includes(o.id))
                .map((ord) => (
                  <div key={ord.id} className="border-2 border-slate-900 p-4 rounded-xl font-mono text-[11px] text-slate-900 space-y-2 bg-white">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1">
                      <span className="font-black text-xs font-sans">APPZYS® SMART STORAGE</span>
                      <span className="border border-slate-900 px-1.5 py-0.2 font-bold text-[10px] uppercase">
                        {ord.paymentMethod === 'COD' ? 'C.O.D.' : 'PREPAID'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <div>
                        <strong>To: {ord.customerName}</strong> ({ord.phone})
                        <div className="text-slate-600 truncate max-w-sm">{ord.address}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{ord.awb || 'AWB-DEL-982140'}</div>
                        <div>Amount: ₹{ord.totalAmount}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsBulkPrintOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print All {selectedOrderIds.length} Shipping Labels</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
