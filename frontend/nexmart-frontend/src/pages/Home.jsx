import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import FeatureHighlights from '../components/FeatureHighlights';
import NewsletterBanner from '../components/NewsletterBanner';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import AuthModal from '../components/AuthModal';
import SizeGuideModal from '../components/SizeGuideModal';
import MobileBottomNav from '../components/MobileBottomNav';
import { Search, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCardImage = ({ product }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg'];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple || !isHovered) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [hasMultiple, isHovered, images.length]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="relative aspect-square w-full p-3 sm:p-4.5 flex items-center justify-center select-none shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative flex items-center justify-center bg-slate-50/80 border border-slate-100">
        <img
          src={images[currentIdx]}
          alt={product.title}
          className={`w-full h-full object-contain rounded-2xl sm:rounded-3xl transition-transform duration-300 ${
            !hasMultiple ? 'group-hover:scale-105' : 'scale-100'
          }`}
          loading="lazy"
        />

        {/* Rating Badge (Top Right) */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 text-xs font-bold text-slate-800 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-2xs z-10 pointer-events-none">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{product.rating}</span>
        </div>

        {/* Multi-Image Controls */}
        {hasMultiple && (
          <>
            {/* Backward Button */}
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-slate-200/80"
              aria-label="Previous image"
              title="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-slate-800 stroke-[2.5]" />
            </button>

            {/* Forward Button */}
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-slate-200/80"
              aria-label="Next image"
              title="Next image"
            >
              <ChevronRight className="w-4 h-4 text-slate-800 stroke-[2.5]" />
            </button>

            {/* Subtle Dots Indicator */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/25 backdrop-blur-xs px-2 py-1 rounded-full pointer-events-none">
              {images.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === currentIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  // Filter products
  let filteredProducts = products.filter((p) => {
    const matchesCategory = !activeCategory || p.categorySlug === activeCategory;
    const matchesSearch = !searchQuery || 
                          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = !inStockOnly || p.inStock;
    return matchesCategory && matchesSearch && matchesStock;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.basePrice - a.basePrice);
  } else if (sortBy === 'title-az') {
    filteredProducts.sort((a, b) => a.shortTitle.localeCompare(b.shortTitle));
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden pb-16 md:pb-0">
      <AnnouncementBar />
      <Navbar />

      {/* 1. Hero Banner: Rounded Rectangle aligned with APPZYS Logo grid (equal gap on 4 sides) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-1 w-full">
        <div className="relative group overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md">
          <img
            src="/images/appzys-hero-banner.jpg"
            alt="APPZYS Smart Storage Solutions - Saree & Jewellery Organisers"
            className="w-full h-auto object-cover block select-none"
            loading="eager"
            fetchPriority="high"
          />

          {/* Interactive Clickable Hotspots mapped directly to the buttons & products in the banner */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 1. "Shop Saree Organiser" CTA Button */}
            <Link
              to="/?category=saree-organiser"
              className="pointer-events-auto absolute left-[3.5%] top-[48%] w-[14.5%] h-[8%] rounded-full cursor-pointer hover:opacity-80 transition"
              title="Shop Saree Organiser (60L)"
              aria-label="Shop Saree Organiser"
            />
            {/* 2. "Shop Jewellery Organiser" CTA Button */}
            <Link
              to="/?category=jewel-organiser"
              className="pointer-events-auto absolute left-[18.5%] top-[48%] w-[15.5%] h-[8%] rounded-full cursor-pointer hover:opacity-80 transition"
              title="Shop Jewellery Organiser (Velvet)"
              aria-label="Shop Jewellery Organiser"
            />
            {/* 3. Saree Organiser Box */}
            <Link
              to="/?category=saree-organiser"
              className="pointer-events-auto absolute left-[34%] top-[30%] w-[33%] h-[48%] cursor-pointer"
              title="Shop Saree Organiser"
              aria-label="Saree Organiser Box"
            />
            {/* 4. Jewellery Organiser Box */}
            <Link
              to="/?category=jewel-organiser"
              className="pointer-events-auto absolute left-[67%] top-[25%] w-[31%] h-[53%] cursor-pointer"
              title="Shop Jewellery Organiser"
              aria-label="Jewellery Organiser Box"
            />
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full space-y-6 sm:space-y-12">
        
        {/* Mobile Quick Category Chips (Flipkart App Style) */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-1 text-xs">
          <button
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('category');
              setSearchParams(newParams);
            }}
            className={`px-3.5 py-2 rounded-full shrink-0 font-bold text-xs transition cursor-pointer border ${
              !activeCategory
                ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            ✨ All ({products.length})
          </button>
          <button
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('category', 'saree-organiser');
              setSearchParams(newParams);
            }}
            className={`px-3.5 py-2 rounded-full shrink-0 font-bold text-xs transition cursor-pointer border ${
              activeCategory === 'saree-organiser'
                ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            🥻 Saree Boxes (60L)
          </button>
          <button
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('category', 'jewel-organiser');
              setSearchParams(newParams);
            }}
            className={`px-3.5 py-2 rounded-full shrink-0 font-bold text-xs transition cursor-pointer border ${
              activeCategory === 'jewel-organiser'
                ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            💍 Jewellery Cases
          </button>
        </div>

        {/* 2. Responsive Header & Filter / Sort Strip */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 sm:pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-slate-900">
                  {activeCategory === 'saree-organiser'
                    ? '🥻 Saree Organiser (60L)'
                    : activeCategory === 'jewel-organiser'
                    ? '💍 Jewellery Organiser'
                    : 'All Smart Storage Solutions'}
                </h1>
                <span className="text-[10px] sm:text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {filteredProducts.length} Products
                </span>
                {searchQuery && (
                  <span className="text-[10px] sm:text-xs bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    Matching "{searchQuery}"
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('search');
                        setSearchParams(newParams);
                      }}
                      className="text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {activeCategory && (
                  <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    Filtered
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('category');
                        setSearchParams(newParams);
                      }}
                      className="text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                APPZYS® Smart Storage Solutions • High Durability & Space Saving
              </p>
            </div>

            {/* In-Stock Toggle & Sort By dropdown on the Right (Flex wrap on mobile) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-amber-700 accent-amber-800"
                />
                <span>In stock</span>
              </label>

              {/* Working Sort By dropdown */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-transparent cursor-pointer focus:outline-hidden"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title-az">Alphabetical: A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Swipe Cue Banner (Flipkart App Style) */}
        <div className="flex md:hidden items-center justify-between pb-1 px-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Explore Storage Solutions
          </span>
          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>Swipe items</span>
            <span>→</span>
          </span>
        </div>

        {/* 3. Product Catalog: Left-to-Right Horizontal Swipe on Mobile (Flipkart style), Grid on Desktop */}
        <div className="flex md:grid md:grid-cols-2 max-w-4xl mx-auto overflow-x-auto md:overflow-visible gap-4 md:gap-8 pb-4 pt-1 px-4 -mx-4 md:px-0 md:mx-auto snap-x no-scrollbar overscroll-x-contain">
          {filteredProducts.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="w-[82vw] sm:w-[320px] md:w-full shrink-0 md:shrink snap-center md:snap-align-none group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              {/* Product Image Container with multi-image hover & arrow controls */}
              <ProductCardImage product={p} />

              {/* Bottom Info Section (Clean & Symmetrical: Category + Title & Rate) */}
              <div className="bg-slate-50/70 p-4 sm:p-5 border-t border-slate-100 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {p.brand}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      Save {p.discountPercent}%
                    </span>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#1c2d4a] transition line-clamp-2 min-h-[36px] sm:min-h-[40px]">
                    {p.cardTitle || p.title}
                  </h3>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      ₹ {p.basePrice}.00
                    </span>
                    <span className="text-[11px] text-slate-400 line-through ml-1.5">
                      ₹ {p.mrp}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#1c2d4a] bg-blue-50 group-hover:bg-[#1c2d4a] group-hover:text-white px-2.5 py-1 rounded-lg border border-blue-100 transition flex items-center gap-1 shadow-2xs">
                    View & Buy
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 4. Brand Feature Highlights */}
        <FeatureHighlights />

      </main>

      {/* Newsletter Lead Generation Banner */}
      <NewsletterBanner />

      <Footer />

      {/* Drawers & Modals */}
      <SizeGuideModal />

      {/* Mobile-Only Bottom Navigation Bar (Option a) */}
      <MobileBottomNav />
    </div>
  );
};

export default Home;
