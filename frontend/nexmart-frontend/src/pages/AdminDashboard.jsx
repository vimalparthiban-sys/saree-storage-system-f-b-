import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
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
  Maximize2
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
    : 'https://saree-storage-system-f-b.onrender.com';
  const trackLink = `${origin}/track-order?awb=${order.awb || order.id}`;
  const firstItem = order.items?.[0];
  const itemDesc = firstItem
    ? `${firstItem.title || 'APPZYS Smart Storage'} (${firstItem.packName || 'Pack of 1'} • ${firstItem.color || 'Standard'})`
    : 'APPZYS Smart Storage Living Box';

  if (order.status === 'PACKED') {
    return `Namaste ${order.customerName || 'Customer'}! 📦\n\nYour APPZYS order #${order.id} has been PACKED & SEALED with high-grade steel frame quality verification!\n\nItem: ${itemDesc}\nCourier: ${order.courier || 'Delhivery Express'}\nAWB: ${order.awb || 'AWB-DEL-982140'}\n\n📍 Live Tracking: ${trackLink}\n\nOur dispatch team is handing over your package to the courier partner today. Helpline: +91 98400 12345.`;
  }
  if (order.status === 'SHIPPED') {
    return `Namaste ${order.customerName || 'Customer'}! 🚀\n\nYour APPZYS order #${order.id} is DISPATCHED & IN TRANSIT!\n\nItem: ${itemDesc}\nCourier: ${order.courier || 'Delhivery Express'}\nAWB Number: ${order.awb || 'AWB-DEL-982140'}\n\n📍 Live Tracking: ${trackLink}\n\nDoorstep delivery is estimated in 1-2 business days. Helpline: +91 98400 12345.`;
  }
  if (order.status === 'OUT_FOR_DELIVERY') {
    return `Namaste ${order.customerName || 'Customer'}! 🚚\n\nYour APPZYS package #${order.id} is OUT FOR DELIVERY today!\n\nCourier Rider from ${order.courier || 'Delhivery Express'} is on the route to your address.\n\n📍 Live Tracking: ${trackLink}\n\nPlease keep your phone available for delivery verification. Helpline: +91 98400 12345.`;
  }
  if (order.status === 'DELIVERED') {
    return `Namaste ${order.customerName || 'Customer'}! 🎉\n\nYour APPZYS order #${order.id} has been DELIVERED successfully to your doorstep!\n\nWe hope you love your new ${itemDesc}.\n\nNeed setup assistance or warranty claim? WhatsApp us at +91 98400 12345. Thank you for choosing APPZYS!`;
  }
  if (order.status === 'DELAYED') {
    return `Namaste ${order.customerName || 'Customer'}! ⚠️\n\nTransit Update for APPZYS order #${order.id}:\nYour package encountered a minor regional transit checkpoint delay. Our team is actively tracking it with ${order.courier || 'Delhivery'}.\n\n📍 Live Tracking: ${trackLink}\n\nReplacement warranty is active. WhatsApp Helpline: +91 98400 12345.`;
  }
  // Default / CONFIRMED
  return `Namaste ${order.customerName || 'Customer'}! 📦\n\nYour APPZYS order #${order.id} (Total: ₹${order.totalAmount}) is CONFIRMED!\n\nItem: ${itemDesc}\nPayment: ${order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Prepaid Verified'}\nCourier: ${order.courier || 'Delhivery Express'} (AWB: ${order.awb || 'AWB-DEL-982140'})\n\n📍 Live Tracking: ${trackLink}\n\nWe are packing your order for express dispatch! Helpline: +91 98400 12345.`;
};

const AdminDashboard = () => {
  const { isAdmin, openAuth } = useAuth();
  const { orders, updateOrderStatus } = useCart();

  // Primary Navigation Tab: 'orders' | 'inventory' | 'manifest' | 'newsletter'
  const [activeTab, setActiveTab] = useState('orders');

  // Orders Sub-Filter: 'ALL' | 'PENDING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'COD' | 'PREPAID'
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Modals state
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState(null);
  const [selectedOrderForWhatsapp, setSelectedOrderForWhatsapp] = useState(null);
  const [isBulkPrintOpen, setIsBulkPrintOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null); // Full-screen zoom modal

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
    const val = parseInt(newQty, 10);
    if (!isNaN(val)) {
      setInventory((prev) =>
        prev.map((item) => (item.id === id ? { ...item, stock: Math.max(0, val) } : item))
      );
    }
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
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6">
        {/* ========================================================
            TOP BAR: Brand, Navigation Tabs, Search & Status Filters
            (Directly integrated at the top in principal brand blue #1c2d4a)
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
                  Warehouse Dispatch & Logistics • Delhivery & Bluedart Integration • Stock Control
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

          {/* Row 2: Search Bar & Order Status Filter Buttons */}
          {activeTab === 'orders' && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {/* Search Input Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Customer, Phone, ORD-ID, AWB..."
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

                {/* Bulk Actions Bar if selected */}
                {selectedOrderIds.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                    <span className="text-xs font-bold text-amber-900">
                      {selectedOrderIds.length} Selected
                    </span>
                    <button
                      onClick={() => setIsBulkPrintOpen(true)}
                      className="px-2.5 py-1 bg-[#1c2d4a] hover:bg-[#152238] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Labels ({selectedOrderIds.length})</span>
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('PACKED')}
                      className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Mark Packed
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('SHIPPED')}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Mark Shipped
                    </button>
                    <button
                      onClick={() => setSelectedOrderIds([])}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer ml-1"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-[#1c2d4a]">{filteredOrders.length}</span> of {orders.length} orders
                  </div>
                )}
              </div>

              {/* Status Filter Buttons: All White Background by Default; Brand Blue when Clicked */}
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
            </div>
          )}
        </div>

        {/* ========================================================
            4 METRIC CARDS (All 4 cards unified with web color #1c2d4a logo & text)
        ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Gross Sales */}
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

          {/* Card 2: Pending Fulfillment */}
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

          {/* Card 3: In Courier Transit */}
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

          {/* Card 4: Warehouse Stock (bottom text preserved as requested) */}
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
            TAB 1: ORDERS PIPELINE TABLE WITH SEPARATE ORDER ID & PRODUCT PHOTO COLUMNS
        ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Real-time Order Action Banner */}
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

            {/* Desktop Table View (Separate Order ID Column and Product Photo Column) */}
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
                      {/* Column 1: Order ID */}
                      <th className="py-3 px-4">Order ID & Date</th>
                      {/* Column 2: Product Photo (Dedicated Column) */}
                      <th className="py-3 px-4 text-center">Product Photo</th>
                      {/* Column 3: Customer Details */}
                      <th className="py-3 px-4">Customer Details</th>
                      {/* Column 4: Items / Pack */}
                      <th className="py-3 px-4">Items / Pack</th>
                      {/* Column 5: Amount & Payment */}
                      <th className="py-3 px-4">Amount & Payment</th>
                      {/* Column 6: Courier & AWB */}
                      <th className="py-3 px-4">Courier & AWB</th>
                      {/* Column 7: Fulfillment Status */}
                      <th className="py-3 px-4">Fulfillment Status</th>
                      {/* Column 8: Fulfillment Actions */}
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
                            {/* Checkbox */}
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

                            {/* 1. SEPARATE COLUMN: Order ID & Date */}
                            <td className="py-4 px-4">
                              <div className="font-mono font-bold text-slate-900">{ord.id}</div>
                              <div className="text-[10px] font-sans text-slate-400 font-normal">
                                {new Date(ord.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            {/* 2. SEPARATE COLUMN: Product Photo (Click to Zoom) */}
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

                            {/* 3. Customer Details */}
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

                            {/* 4. Items / Pack */}
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

                            {/* 5. Amount & Payment */}
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

                            {/* 6. Courier & AWB */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900 flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-[#1c2d4a]" />
                                <span>{ord.courier || 'Delhivery Express'}</span>
                              </div>
                              <div className="font-mono text-[11px] text-slate-500 font-semibold">
                                {ord.awb || 'AWB-DEL-982140'}
                              </div>
                            </td>

                            {/* 7. Status Selector */}
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

                            {/* 8. Action Buttons */}
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                {/* Print Label Button */}
                                <button
                                  onClick={() => setSelectedOrderForLabel(ord)}
                                  title="Generate & Print AWB Barcode Shipping Label"
                                  className="px-2.5 py-1.5 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>AWB Label</span>
                                </button>

                                {/* WhatsApp Button (Dynamic Message based on current status) */}
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

            {/* Mobile Card View (Optimized for store managers on phone) */}
            <div className="lg:hidden space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center text-slate-400 text-xs border border-slate-200">
                  No orders match the selected filter criteria.
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedOrderIds.includes(ord.id);
                  const firstItem = ord.items?.[0] || {};
                  const productColorImage = getProductColorImage(firstItem);

                  return (
                    <div
                      key={ord.id}
                      className={`bg-white rounded-3xl p-4 border transition space-y-3 shadow-xs ${
                        isSelected ? 'border-[#1c2d4a] ring-2 ring-[#1c2d4a]/20 bg-amber-50/20' : 'border-slate-200'
                      }`}
                    >
                      {/* Top Row: Thumbnail + Order ID, Date & Selection */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2.5">
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

                          {/* Thumbnail with Zoom on Click */}
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
                            className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer bg-slate-50 relative group"
                          >
                            <img
                              src={productColorImage}
                              alt={firstItem.color || 'Product'}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                              <Maximize2 className="w-3 h-3 text-white drop-shadow-xs" />
                            </div>
                          </div>

                          <div>
                            <span className="font-mono font-bold text-xs text-slate-900">{ord.id}</span>
                            <div className="text-[10px] text-slate-400 font-sans">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-sm text-slate-900">₹{ord.totalAmount}</span>
                          <span
                            className={`block text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              ord.paymentMethod === 'COD'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {ord.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Customer & Address */}
                      <div className="text-xs space-y-1">
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span>{ord.customerName}</span>
                          <a
                            href={`tel:${ord.phone}`}
                            className="text-xs font-mono font-semibold text-[#1c2d4a] bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{ord.phone}</span>
                          </a>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">{ord.address}</p>
                      </div>

                      {/* Items */}
                      <div className="bg-slate-50 p-2.5 rounded-2xl text-[11px]">
                        {ord.items &&
                          ord.items.map((it, idx) => (
                            <div key={idx} className="font-medium text-slate-800">
                              {it.title || 'APPZYS 60L Saree Living Box'}
                              <div className="text-[10px] text-amber-800 font-semibold">
                                {it.packName} • {it.color}
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Courier & Status */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        <div className="text-[10px] text-slate-500 font-mono">
                          <span className="font-bold text-slate-700">{ord.courier || 'Delhivery'}:</span> {ord.awb || 'AWB-DEL-982140'}
                        </div>

                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className={`text-xs font-bold rounded-xl px-2 py-1.5 border cursor-pointer ${
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              : ord.status === 'SHIPPED'
                              ? 'bg-blue-50 text-blue-900 border-blue-300'
                              : ord.status === 'PACKED'
                              ? 'bg-purple-50 text-purple-900 border-purple-300'
                              : 'bg-amber-50 text-amber-900 border-amber-300'
                          }`}
                        >
                          <option value="CONFIRMED">1. CONFIRMED</option>
                          <option value="PACKED">2. PACKED</option>
                          <option value="SHIPPED">3. SHIPPED</option>
                          <option value="OUT_FOR_DELIVERY">4. OUT FOR DELIVERY</option>
                          <option value="DELIVERED">5. DELIVERED</option>
                          <option value="DELAYED">⚠️ DELAYED</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setSelectedOrderForLabel(ord)}
                          className="w-full py-2 bg-[#1c2d4a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>AWB Label</span>
                        </button>
                        <button
                          onClick={() => setSelectedOrderForWhatsapp(ord)}
                          className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: INVENTORY & STOCK MANAGEMENT HUB
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
                    {inventory.map((item) => {
                      const isLow = item.stock <= item.minAlert;
                      const isOutOfStock = item.stock === 0;
                      const itemImg = getProductColorImage(item);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                          {/* 1. FIRST COLUMN: Product Image (Click to Zoom) */}
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

                          {/* 2. Product & Variant */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{item.productName}</div>
                            <div className="text-[11px] text-amber-800 font-semibold">{item.variant}</div>
                          </td>

                          {/* 3. SKU */}
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                            {item.sku}
                          </td>

                          {/* 4. Category */}
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {item.category}
                          </td>

                          {/* 5. Price */}
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            ₹{item.price}
                          </td>

                          {/* 6. Current Stock */}
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

                          {/* 7. Health Status */}
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

                          {/* 8. Quick Adjust */}
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
            TAB 3: COURIER PICKUP MANIFEST (DELHIVERY / BLUEDART)
        ======================================================== */}
        {activeTab === 'manifest' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
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
                    <Printer className="w-4 h-4" />
                    <span>Print Official Manifest</span>
                  </button>
                </div>
              </div>

              {/* Printable Document Sheet */}
              <div className="border-2 border-slate-900 p-6 rounded-2xl bg-white font-sans text-xs space-y-4 shadow-xs">
                {/* Header */}
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

                {/* Handover Logistics Partner Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">COURIER PARTNER:</span>
                    <strong className="text-slate-900 text-xs">Delhivery Express Surface</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">TOTAL DISPATCH PARCELS:</span>
                    <strong className="text-slate-900 text-xs">{pendingPackingCount + packedCount} Packages</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">TOTAL COD CASH TO COLLECT:</span>
                    <strong className="text-slate-900 text-xs">₹{codPendingRevenue.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Manifest Table */}
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
                      {orders
                        .filter((o) => ['CONFIRMED', 'PROCESSING', 'PACKED'].includes(o.status))
                        .map((ord, idx) => (
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
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Signature Verification Blocks */}
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
        )}

        {/* ========================================================
            TAB 4: NEWSLETTER LEADS TABLE
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
          FULL-SCREEN IMAGE ZOOM MODAL (When clicking product photo)
      ======================================================== */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 z-10 space-y-4 p-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
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

            {/* High-Resolution Zoom Image Display */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square flex items-center justify-center relative">
              <img
                src={zoomedImage.src}
                alt={zoomedImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer Info */}
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
                  <span className="font-mono font-bold text-slate-900">{zoomedImage.sku}</span>
                  <span className="text-slate-500 ml-1">• {zoomedImage.stock} Units</span>
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

            {/* Printable Label Box */}
            <div className="border-2 border-slate-900 p-4 rounded-xl font-mono text-[11px] text-slate-900 space-y-3 bg-white">
              {/* Header */}
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

              {/* Barcode Graphic */}
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

              {/* Addresses */}
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

              {/* Order Items & Weight */}
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

            {/* Action Buttons */}
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
      {selectedOrderForWhatsapp && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrderForWhatsapp(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300 z-10 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">WhatsApp Automated Notification Log</h3>
                  <p className="text-[10px] text-slate-500">Recipient: {selectedOrderForWhatsapp.phone} ({selectedOrderForWhatsapp.customerName})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForWhatsapp(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Stage Preview Message */}
            <div className="space-y-3 max-h-80 overflow-y-auto p-1 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800">
                  <span>CURRENT STAGE: {selectedOrderForWhatsapp.status}</span>
                  <span>Ready to Dispatch</span>
                </div>
                <p className="text-slate-800 text-[11px] leading-relaxed whitespace-pre-line font-sans">
                  {getDynamicWhatsAppMessage(selectedOrderForWhatsapp)}
                </p>
                <div className="text-right text-[10px] text-emerald-600 font-semibold">
                  ✓ Verified Tracking Link: {typeof window !== 'undefined' ? window.location.origin : 'https://saree-storage-system-f-b.onrender.com'}/track-order
                </div>
              </div>

              {selectedOrderForWhatsapp.whatsappLogs && selectedOrderForWhatsapp.whatsappLogs.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Previous Notification History:</div>
                  {selectedOrderForWhatsapp.whatsappLogs.map((log, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[10px] space-y-1">
                      <div className="flex justify-between font-bold text-slate-600">
                        <span>STAGE: {log.stage}</span>
                        <span>{log.time}</span>
                      </div>
                      <p className="text-slate-600 truncate">{log.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 text-center space-y-2">
              <a
                href={`https://api.whatsapp.com/send?phone=91${(selectedOrderForWhatsapp?.phone || '8072784165').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(getDynamicWhatsAppMessage(selectedOrderForWhatsapp))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5c] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> Send Real WhatsApp Message to Customer
              </a>
              <button
                onClick={() => setSelectedOrderForWhatsapp(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close WhatsApp Log
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="px-5 py-2.5 rounded-xl bg-[#1c2d4a] hover:bg-[#152238] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
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
