import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { getProductReviews } from '../data/reviewsData';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import AuthModal from '../components/AuthModal';
import SizeGuideModal from '../components/SizeGuideModal';
import ProductDemoSection from '../components/ProductDemoSection';
import NewsletterBanner from '../components/NewsletterBanner';
import { Star, ShieldCheck, Truck, RotateCcw, CheckCircle2, ChevronRight, ChevronLeft, Minus, Plus, X, Maximize2, ShoppingBag, ArrowRight, ArrowLeft, Search, PlayCircle, FileText, Sparkles } from 'lucide-react';

const getRelativeDateString = (timestampOrDateStr) => {
  if (!timestampOrDateStr) return 'Just now';
  if (typeof timestampOrDateStr === 'string' && (timestampOrDateStr.includes('ago') || timestampOrDateStr.includes('now'))) {
    return timestampOrDateStr;
  }
  const timestamp = typeof timestampOrDateStr === 'number' 
    ? timestampOrDateStr 
    : new Date(timestampOrDateStr).getTime();
  
  if (isNaN(timestamp)) return String(timestampOrDateStr);

  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  return `${diffMonths} months ago`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, removeProductFromCart, setIsCheckoutOpen, setIsSizeGuideOpen, totalItemCount, setIsCartOpen } = useCart();
  const [mobileSearch, setMobileSearch] = useState('');

  const product = products.find((p) => p.id === id) || products[0];
  const isProductInCart = Boolean(cart && cart.some((item) => item.id === product.id));

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedPackIndex, setSelectedPackIndex] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);

  // Active color images (switches gallery dynamically when a color is clicked!)
  const activeColorObj = product.colors?.find((c) => c.name === selectedColor);
  const currentImages = (activeColorObj && activeColorObj.images && activeColorObj.images.length > 0)
    ? activeColorObj.images
    : product.images;

  // 5 reviews per page pagination state (Google style)
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Reviews State & LocalStorage Persistence (Loads full 99 authentic reviews)
  const [reviewsList, setReviewsList] = useState(() => {
    const baseReviews = getProductReviews(product.id);
    try {
      const saved = localStorage.getItem(`reviews_${product.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...baseReviews];
        }
      }
    } catch (err) {
      console.error('Error loading reviews from localStorage:', err);
    }
    return baseReviews;
  });

  useEffect(() => {
    let isMounted = true;
    setCurrentPage(1);

    // Fetch live verified reviews from Spring Boot + MySQL
    api.getReviews(product.id, 1, 100)
      .then((res) => {
        if (isMounted && res.success && res.data && res.data.reviews && res.data.reviews.length > 0) {
          setReviewsList(res.data.reviews);
        }
      })
      .catch(() => {
        // Fallback to local reviews if backend is not reachable
        const baseReviews = getProductReviews(product.id);
        try {
          const saved = localStorage.getItem(`reviews_${product.id}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              if (isMounted) setReviewsList([...parsed, ...baseReviews]);
              return;
            }
          }
        } catch (err) {
          console.error('Error loading reviews from localStorage:', err);
        }
        if (isMounted) setReviewsList(baseReviews);
      });

    return () => { isMounted = false; };
  }, [product.id]);

  const totalReviewCount = reviewsList.length;
  const totalPages = Math.ceil(reviewsList.length / reviewsPerPage);
  const currentReviews = reviewsList.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const getPaginationNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  // In-Page Jump Tabs State & Scroll Spy (Option 3: Specs, Demo, Reviews)
  const [activeSection, setActiveSection] = useState('specs');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;
      const offset = isMobile ? 120 : 200;
      
      const specsEl = document.getElementById('specs-section');
      const demoEl = document.getElementById('demo-section');
      const reviewsEl = document.getElementById('reviews-section');

      if (reviewsEl && scrollY + offset >= reviewsEl.offsetTop) {
        setActiveSection('reviews');
      } else if (demoEl && scrollY + offset >= demoEl.offsetTop) {
        setActiveSection('demo');
      } else if (specsEl && scrollY + offset >= specsEl.offsetTop) {
        setActiveSection('specs');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJumpToSection = (sectionId, key) => {
    setActiveSection(key);
    const el = document.getElementById(sectionId);
    if (el) {
      const isMobile = window.innerWidth < 768;
      const yOffset = isMobile ? -65 : -130;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Review Modal Form State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewStep, setReviewStep] = useState(1); // 1 = Rating Selection, 2 = Content & Title
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [reviewToast, setReviewToast] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      name: reviewerName.trim() || 'Verified Customer',
      city: reviewerCity.trim() || 'Tamil Nadu',
      rating: reviewRating || 5,
      timestamp: Date.now(),
      date: 'Just now',
      title: reviewTitle.trim() || 'Superb quality and highly recommended!',
      comment: reviewComment.trim(),
      verified: true
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    setCurrentPage(1);

    // Persist to MySQL via Spring Boot REST API
    api.createReview({
      productId: product.id,
      name: newRev.name,
      city: newRev.city,
      rating: newRev.rating,
      title: newRev.title,
      comment: newRev.comment
    }).then((res) => {
      console.log('✅ Review saved to MySQL via Spring Boot:', res);
    }).catch((err) => {
      console.warn('Backend offline, review saved to localStorage fallback:', err);
    });

    try {
      const existingSaved = JSON.parse(localStorage.getItem(`reviews_${product.id}`) || '[]');
      localStorage.setItem(`reviews_${product.id}`, JSON.stringify([newRev, ...existingSaved]));
    } catch (err) {
      console.error('Error saving review to localStorage:', err);
    }

    setIsReviewModalOpen(false);
    setReviewStep(1);
    setReviewRating(0);
    setReviewHoverRating(0);
    setReviewComment('');
    setReviewTitle('');
    setReviewerName('');
    setReviewerCity('');

    setReviewToast('✓ Review submitted successfully! Thank you for sharing your experience.');
    setTimeout(() => setReviewToast(''), 4500);

    const reviewsEl = document.getElementById('reviews-section');
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const currentPack = product.packs[selectedPackIndex];
  const totalPrice = currentPack.price * quantity;
  const totalMrp = currentPack.mrp * quantity;
  const discountPercent = Math.round(((totalMrp - totalPrice) / totalMrp) * 100);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < currentImages.length - 1 ? prev + 1 : prev));
  };

  // Track recently viewed products in localStorage for Flipkart-style Account page
  useEffect(() => {
    if (!product) return;
    try {
      const stored = JSON.parse(localStorage.getItem('appzys_recently_viewed') || '[]');
      const filtered = stored.filter((p) => p.id !== product.id);
      const updated = [
        {
          id: product.id,
          title: product.cardTitle || product.title,
          shortTitle: product.shortTitle || product.title,
          image: product.images?.[0] || '/placeholder.jpg',
          price: product.basePrice,
          mrp: product.mrp,
          brand: product.brand,
          category: product.category,
        },
        ...filtered,
      ].slice(0, 10);
      localStorage.setItem('appzys_recently_viewed', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save recently viewed:', e);
    }
  }, [product]);

  // Keyboard navigation & body scroll lock for Lightbox Modal
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen, currentImages.length]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      packId: `${product.id}-${currentPack.qty}-${selectedSize}`,
      title: product.shortTitle || product.title,
      image: currentImages[0] || product.images?.[0],
      packName: `Pack of ${currentPack.qty}`,
      packQuantity: currentPack.qty,
      size: selectedSize,
      color: selectedColor,
      price: currentPack.price,
      originalPrice: currentPack.mrp,
      quantity: quantity
    });
  };

  const handleToggleCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isProductInCart) {
      removeProductFromCart(product.id);
      setReviewToast('Removed from cart');
      setTimeout(() => setReviewToast(''), 2500);
    } else {
      addToCart({
        id: product.id,
        packId: `${product.id}-${currentPack.qty}-${selectedSize}`,
        title: product.shortTitle || product.title,
        image: currentImages[0] || product.images?.[0],
        packName: `Pack of ${currentPack.qty}`,
        packQuantity: currentPack.qty,
        size: selectedSize,
        color: selectedColor,
        price: currentPack.price,
        originalPrice: currentPack.mrp,
        quantity: quantity
      }, false);
      setReviewToast('✓ Added to cart');
      setTimeout(() => setReviewToast(''), 2500);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden pb-20 md:pb-0">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Top Navigation (Flipkart Style: Back Arrow + Search + Cart) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-2 flex items-center gap-2 shadow-2xs">
        {/* Simple Click Back Button */}
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="p-1.5 -ml-1 text-slate-800 hover:bg-slate-100 rounded-full transition cursor-pointer active:scale-95 shrink-0"
          aria-label="Back"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.3]" />
        </button>

        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (mobileSearch.trim()) {
              navigate(`/?search=${encodeURIComponent(mobileSearch.trim())}`);
            }
          }}
          className="flex-1 relative flex items-center min-w-0"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={mobileSearch}
            onChange={(e) => setMobileSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1.5 focus:ring-[#1c2d4a]"
          />
          {mobileSearch && (
            <button
              type="button"
              onClick={() => setMobileSearch('')}
              className="absolute right-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </form>

        {/* Cart Button with Count Badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          type="button"
          className="p-2 text-slate-800 hover:bg-slate-100 rounded-full transition relative cursor-pointer active:scale-95 shrink-0"
          aria-label="Cart"
          title="Cart"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2]" />
          {totalItemCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-amber-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {totalItemCount}
            </span>
          )}
        </button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full space-y-8 sm:space-y-12">
        
        {/* Breadcrumb (horizontally scrollable on small phones) */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap pb-1 scrollbar-none">
          <Link to="/" className="hover:text-slate-900 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to="/" className="hover:text-slate-900 transition">Wardrobe Organizers</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.shortTitle}</span>
        </nav>

        {/* Product Hero Grid (Left Gallery, Right Options) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          
          {/* Left Column: Image Gallery (6 Cols) */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200 aspect-square shadow-2xs flex items-center justify-center p-2 sm:p-4 cursor-zoom-in group select-none"
              title="Click to view full screen"
            >
              <img
                src={currentImages[selectedImageIndex] || currentImages[0]}
                alt={product.title}
                className="w-full h-full object-contain rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-102"
              />
              <span className="absolute top-3 left-3 bg-[#1c2d4a] text-white font-bold text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                -{discountPercent}% OFF
              </span>
              
              {/* Expand Hint Pill */}
              <div className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-[#1c2d4a] text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1.5 transition shadow-sm opacity-90 group-hover:opacity-100">
                <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Full screen</span>
              </div>
            </div>

            {/* Thumbnail Switcher (Selected Blue Border) */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition shrink-0 bg-white p-1 cursor-pointer ${
                    selectedImageIndex === idx ? 'border-[#1c2d4a] ring-2 ring-[#1c2d4a]/20 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  aria-label={`Select product image ${idx + 1}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded-lg sm:rounded-xl" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Title, Pack Selector, Price, CTAs (6 Cols) */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            
            {/* Title & Reviews */}
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c2d4a] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60 inline-block">
                {product.brand}
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
                {product.title}
              </h1>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-800 ml-1">({totalReviewCount} Reviews)</span>
                </div>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  In stock & ready to ship
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5 sm:gap-3 pt-1 border-t border-slate-100 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">Rs. {totalPrice.toLocaleString()}.00</span>
              <span className="text-sm sm:text-base text-slate-400 line-through">Rs. {totalMrp.toLocaleString()}.00</span>
              <span className="text-xs font-extrabold bg-blue-100 text-[#1c2d4a] px-2 py-0.5 rounded-md">
                -{discountPercent}% OFF
              </span>
            </div>

            {/* Pack Selector (Buttons: 1, 2, 4, 6) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">
                  Pack of: <strong className="text-[#1c2d4a]">{currentPack.qty} Pieces</strong>
                </span>
                <span className="text-emerald-700 font-semibold">{currentPack.savings}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.packs.map((p, idx) => (
                  <button
                    key={p.qty}
                    onClick={() => setSelectedPackIndex(idx)}
                    className={`py-2 sm:py-2.5 rounded-xl text-xs font-extrabold border-2 transition cursor-pointer text-center ${
                      selectedPackIndex === idx
                        ? 'border-[#1c2d4a] bg-blue-50/50 text-[#1c2d4a] shadow-xs ring-1 ring-[#1c2d4a]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{p.label}</span>
                    {p.isBestSeller && (
                      <span className="block text-[8px] sm:text-[9px] text-[#1c2d4a] font-bold -mt-0.5">BEST</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size / Capacity Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Capacity / Size:</span>
                {product.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[#1c2d4a] hover:underline font-semibold cursor-pointer"
                  >
                    📏 Size Guide
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                      selectedSize === s
                        ? 'border-[#1c2d4a] bg-blue-50/50 text-[#1c2d4a] font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern / Color Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Colour: <strong className="text-slate-900">{selectedColor}</strong>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c.name);
                      setSelectedImageIndex(0);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-[#1c2d4a] bg-blue-50/60 text-[#1c2d4a] font-bold shadow-xs ring-1 ring-[#1c2d4a]/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300 shadow-2xs" 
                      style={{ 
                        background: c.name.includes('Houndstooth') 
                          ? 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 6px 6px' 
                          : c.hex 
                      }}
                    ></span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800 block">Quantity:</span>
              <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-l-xl transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-r-xl transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Delivery Estimation Strip */}
            <div className="bg-blue-50/70 text-[#1c2d4a] p-3 rounded-xl border border-blue-100 text-xs flex items-center gap-2 font-medium">
              <Truck className="w-4 h-4 text-[#1c2d4a] shrink-0" />
              <span>Estimated delivery between <strong>October 26 and October 28</strong></span>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleToggleCart}
                className={`w-full py-3 sm:py-3.5 rounded-xl border-2 font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs active:scale-98 flex items-center justify-center gap-2 ${
                  isProductInCart
                    ? 'bg-[#1c2d4a] text-white border-[#1c2d4a] hover:bg-[#15233f]'
                    : 'border-[#1c2d4a] hover:bg-[#1c2d4a] hover:text-white text-[#1c2d4a]'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 ${isProductInCart ? 'fill-white' : ''}`} />
                <span>{isProductInCart ? 'In Cart • Click to remove' : 'Add to cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3 sm:py-3.5 rounded-xl bg-[#1c2d4a] hover:bg-[#15233a] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md shadow-[#1c2d4a]/20 active:scale-98"
              >
                Buy it now
              </button>
            </div>

            {/* Trust Points (2-col grid on mobile) */}
            <div className="grid grid-cols-2 gap-2.5 text-[11px] sm:text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1-Year Quality Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>7 Days Easy Return</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Cash on Delivery</span>
              </div>
            </div>

          </div>

        </div>

        {/* Sticky In-Page Jump Tabs (Option 3: Demo, Reviews, Specs) */}
        <div className="sticky top-[48px] md:top-[108px] z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xs py-1.5 px-2 sm:px-4">
          <nav aria-label="In-page jump navigation" className="flex items-center justify-between sm:justify-start sm:gap-6 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleJumpToSection('specs-section', 'specs')}
              className={`py-2 px-3 rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition cursor-pointer active:scale-95 whitespace-nowrap ${
                activeSection === 'specs'
                  ? 'bg-[#1c2d4a] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 font-medium'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeSection === 'specs' ? 'text-white' : 'text-slate-500'}`} />
              <span>Specs</span>
            </button>

            <button
              type="button"
              onClick={() => handleJumpToSection('demo-section', 'demo')}
              className={`py-2 px-3 rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition cursor-pointer active:scale-95 whitespace-nowrap ${
                activeSection === 'demo'
                  ? 'bg-[#1c2d4a] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 font-medium'
              }`}
            >
              <PlayCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeSection === 'demo' ? 'text-white' : 'text-rose-500'}`} />
              <span>3-Sec Demo</span>
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                activeSection === 'demo' ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}>
                Video
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleJumpToSection('reviews-section', 'reviews')}
              className={`py-2 px-3 rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm transition cursor-pointer active:scale-95 whitespace-nowrap ${
                activeSection === 'reviews'
                  ? 'bg-[#1c2d4a] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 font-medium'
              }`}
            >
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
              <span>Reviews</span>
              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                activeSection === 'reviews' ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#1c2d4a]'
              }`}>
                {totalReviewCount}
              </span>
            </button>
          </nav>
        </div>

        {/* Product Description & Key Features */}
        <div id="specs-section" className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-200 shadow-xs space-y-4 sm:space-y-6 scroll-mt-24 sm:scroll-mt-36">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">Product Description & Features</h2>
          </div>

          <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <p>{product.description}</p>
            
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm pt-2">Key Highlights:</h3>
            <ul className="space-y-2">
              {product.keyFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic 3-Step Demo & Comparison for this specific product */}
        <div id="demo-section" className="scroll-mt-24 sm:scroll-mt-36">
          <ProductDemoSection product={product} />
        </div>

        {/* Customer Reviews Section */}
        <div id="reviews-section" className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-200 shadow-xs space-y-6 scroll-mt-24 sm:scroll-mt-36">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                  Customer Reviews ({totalReviewCount})
                </h2>
                <div className="flex items-center gap-2 text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-slate-800 text-xs ml-1">{product.rating} Out of 5 Stars</span>
                </div>
              </div>

              {/* Verified Buyer Reviews Badge placed right next to Customer Reviews & Rating */}
              <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 self-center">
                ✓ Verified Buyer Reviews
              </span>
            </div>

            {/* "Write a review" Button centered vertically on the right */}
            <div className="self-center w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setReviewStep(1);
                  setReviewRating(0);
                  setReviewHoverRating(0);
                  setReviewComment('');
                  setReviewTitle('');
                  setReviewerName('');
                  setReviewerCity('');
                  setIsReviewModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#1c2d4a] hover:bg-[#15233b] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Write a review</span>
              </button>
            </div>
          </div>

          {/* Reviews Grid (5 per page) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentReviews.map((r, i) => (
              <div key={i} className="p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex text-amber-500">
                    {[...Array(r.rating || 5)].map((_, s) => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-400 text-[10px] sm:text-[11px] font-medium">
                    {getRelativeDateString(r.timestamp || r.date)}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{r.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{r.comment}"</p>
                <div className="pt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 border-t border-slate-200/60">
                  <span className="font-bold text-slate-800">{r.name} • {r.city}</span>
                  <span className="text-emerald-700 font-semibold">✓ Verified Buyer</span>
                </div>
              </div>
            ))}
          </div>

          {/* Google Style Reviews Pagination (Matching User Screenshot: < 1 2 3 4 ... 20 >) */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 flex flex-col items-center gap-2.5">
              <nav aria-label="Reviews pagination" className="flex items-center justify-center gap-1 sm:gap-2 select-none">
                {/* Previous Page Button (<) */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage((p) => p - 1);
                      document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full transition flex items-center justify-center ${
                    currentPage === 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-100 cursor-pointer active:scale-95'
                  }`}
                  aria-label="Previous Page"
                  title="Previous page"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2]" />
                </button>

                {/* Page Number Circles & Ellipsis */}
                {getPaginationNumbers().map((item, idx) => {
                  if (item === '...') {
                    return (
                      <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm font-semibold select-none">
                        ...
                      </span>
                    );
                  }

                  const isActive = currentPage === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCurrentPage(item);
                        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }}
                      className={`w-9 h-9 rounded-full text-xs sm:text-sm font-bold transition flex items-center justify-center cursor-pointer active:scale-95 ${
                        isActive
                          ? 'bg-[#1c2d4a] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item}
                    </button>
                  );
                })}

                {/* Next Page Button (>) */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage((p) => p + 1);
                      document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full transition flex items-center justify-center ${
                    currentPage === totalPages
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-100 cursor-pointer active:scale-95'
                  }`}
                  aria-label="Next Page"
                  title="Next page"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2]" />
                </button>
              </nav>

              {/* Subtitle / Counter info */}
              <span className="text-[11px] font-medium text-slate-400">
                Showing {((currentPage - 1) * reviewsPerPage) + 1}–{Math.min(currentPage * reviewsPerPage, totalReviewCount)} of {totalReviewCount} verified customer reviews
              </span>
            </div>
          )}
        </div>

      </main>

      {/* Newsletter Lead Generation Banner */}
      <NewsletterBanner />

      <Footer />
      
      {/* Drawers & Modals */}
      <SizeGuideModal />

      {/* Fullscreen Product Image Modal (Flipkart Style) */}
      {isLightboxOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center animate-in fade-in duration-150 select-none"
        >
          {/* Top-Left Close (✕) Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition cursor-pointer"
            aria-label="Close full image view"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
          </button>

          {/* Backward / Previous Arrow Button */}
          {selectedImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-md hover:shadow-lg rounded-md p-2.5 sm:p-3 text-slate-700 hover:text-slate-950 transition cursor-pointer"
              aria-label="Previous Image"
              title="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Center Stage: Fullscreen Clean Image */}
          <div className="w-full h-full flex items-center justify-center p-4 sm:p-10">
            <img
              src={currentImages[selectedImageIndex] || currentImages[0]}
              alt={`${product.title} - view ${selectedImageIndex + 1}`}
              className="max-w-[88vw] max-h-[82vh] sm:max-h-[86vh] w-auto h-auto object-contain select-none"
            />
          </div>

          {/* Forward / Next Arrow Button */}
          {selectedImageIndex < currentImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-md hover:shadow-lg rounded-md p-2.5 sm:p-3 text-slate-700 hover:text-slate-950 transition cursor-pointer"
              aria-label="Next Image"
              title="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Bottom: Dots Indicator ONLY (No thumbnails) */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
            {currentImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  selectedImageIndex === idx 
                    ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-slate-700' 
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Jump to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Write a Review Interactive Modal */}
      {isReviewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
        >
          {/* Modal Card - overflow-hidden protects rounded corners from scrollbar clipping */}
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl relative border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Close Button pinned inside bubble */}
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition cursor-pointer z-30"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Inner Scrollable Container - scroll slider is neatly indented inside the bubble */}
            <div className="overflow-y-auto p-5 sm:p-7 pr-4 sm:pr-6 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Step 1: Rating Selection */}
              {reviewStep === 1 && (
                <div className="flex flex-col items-center text-center pt-1 pb-2">
                  <h2 className="text-lg sm:text-2xl font-serif font-bold text-slate-900">
                    How would you rate this product?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    We would love it if you would share a bit about your experience.
                  </p>

                  {/* Product Image */}
                  <div className="my-4 w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-slate-50 border border-slate-200/80 p-2.5 flex items-center justify-center shadow-2xs">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>

                  {/* Product Title */}
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 max-w-md leading-snug px-2">
                    {product.title}
                  </h3>

                  {/* 5 Interactive Yellow Stars */}
                  <div className="mt-5 flex flex-col items-center gap-1.5 w-full">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((starNum) => {
                        const isFilled = (reviewHoverRating || reviewRating) >= starNum;
                        return (
                          <button
                            key={starNum}
                            type="button"
                            onMouseEnter={() => setReviewHoverRating(starNum)}
                            onMouseLeave={() => setReviewHoverRating(0)}
                            onClick={() => {
                              setReviewRating(starNum);
                              setTimeout(() => setReviewStep(2), 220);
                            }}
                            className="p-1 sm:p-2 cursor-pointer transition-transform hover:scale-120 active:scale-95"
                            aria-label={`${starNum} stars`}
                          >
                            <Star
                              className={`w-9 h-9 sm:w-11 sm:h-11 transition-all ${
                                isFilled
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-transparent text-amber-400 stroke-amber-400 stroke-[1.5]'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between w-56 sm:w-64 text-[11px] sm:text-xs font-semibold text-slate-500 px-2 pt-1">
                      <span>Poor</span>
                      <span>Great</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Review Content & Title Form */}
              {reviewStep === 2 && (
                <form onSubmit={handleSubmitReview} className="space-y-3.5 pt-0.5">
                  {/* Product Title & Selected Stars */}
                  <div className="text-center space-y-1.5 pb-2 border-b border-slate-100">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-800 max-w-md mx-auto leading-snug">
                      {product.title}
                    </h3>

                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <button
                            key={starNum}
                            type="button"
                            onClick={() => setReviewRating(starNum)}
                            className="p-0.5 cursor-pointer hover:scale-110 transition"
                          >
                            <Star
                              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                                reviewRating >= starNum
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-transparent text-amber-400 stroke-amber-400 stroke-[1.5]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between w-40 text-[10px] font-semibold text-slate-400">
                        <span>Poor</span>
                        <span>Great</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                      Review content (Required)
                    </label>
                    <textarea
                      rows={2.5}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Start writing here..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#1c2d4a] focus:ring-1 focus:ring-[#1c2d4a] text-xs sm:text-sm bg-slate-50/50 resize-none"
                      required
                    />
                  </div>

                  {/* Review Title */}
                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Give your review a title"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#1c2d4a] focus:ring-1 focus:ring-[#1c2d4a] text-xs sm:text-sm bg-slate-50/50"
                    />
                  </div>

                  {/* Name & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#1c2d4a] focus:ring-1 focus:ring-[#1c2d4a] text-xs sm:text-sm bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                        City / State
                      </label>
                      <input
                        type="text"
                        value={reviewerCity}
                        onChange={(e) => setReviewerCity(e.target.value)}
                        placeholder="e.g. Chennai, Tamil Nadu"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#1c2d4a] focus:ring-1 focus:ring-[#1c2d4a] text-xs sm:text-sm bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Privacy and Policy note */}
                  <p className="text-[10px] sm:text-[11px] text-slate-400 text-center leading-relaxed pt-0.5">
                    We'll only contact you about your review if necessary. By submitting your review, you agree to our{' '}
                    <span className="underline cursor-pointer">terms and conditions</span> and{' '}
                    <span className="underline cursor-pointer">privacy policy</span>.
                  </p>

                  {/* Action Navigation: Back on Left, Send on Right */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setReviewStep(1)}
                      className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
                    >
                      <span>← Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!reviewComment.trim()}
                      className="px-8 py-2.5 bg-[#1c2d4a] hover:bg-[#15233b] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition cursor-pointer active:scale-95"
                    >
                      Send
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for Review Submission */}
      {reviewToast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#1c2d4a] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{reviewToast}</span>
        </div>
      )}

      {/* Mobile-Only Sticky Bottom Buy Bar (Flipkart / Amazon App Style) */}
      <div 
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 flex items-center justify-between gap-3 shadow-2xl select-none"
        style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-900">
              ₹ {currentPack?.price || product.basePrice}.00
            </span>
            <span className="text-[11px] text-slate-400 line-through">
              ₹ {currentPack?.mrp || product.mrp}
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded w-fit truncate">
            {currentPack?.qty || 1} Pack • Free Express Delivery
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleCart}
            type="button"
            className={`p-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer active:scale-95 relative flex items-center justify-center ${
              isProductInCart
                ? 'bg-[#1c2d4a] border-[#1c2d4a] text-white shadow-md'
                : 'bg-white border-slate-300 text-slate-700 hover:text-[#1c2d4a] hover:border-[#1c2d4a] shadow-xs'
            }`}
            aria-label={isProductInCart ? "Remove from cart" : "Add to cart"}
            title={isProductInCart ? "In cart (click to remove)" : "Add to cart"}
          >
            <ShoppingBag className={`w-5 h-5 stroke-[2] transition-transform ${isProductInCart ? 'fill-white text-white scale-105' : 'fill-transparent'}`} />
            {isProductInCart && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-black shadow-xs">
                ✓
              </span>
            )}
          </button>
          
          <button
            onClick={handleBuyNow}
            type="button"
            className="bg-[#1c2d4a] hover:bg-[#13223f] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;