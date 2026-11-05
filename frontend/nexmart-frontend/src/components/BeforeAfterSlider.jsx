import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const transformationProducts = [
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

const BeforeAfterSlider = () => {
  const [productIdx, setProductIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [isVisible, setIsVisible] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const resumeTimerRef = useRef(null);

  const current = transformationProducts[productIdx];

  // Pause automatic movement when user actively touches, drags, or clicks
  const pauseAutoPlay = useCallback(() => {
    setIsUserInteracting(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    // Resume automatic movement only after 12 seconds of idle time
    resumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 12000);
  }, []);

  // 1. Scroll-Triggered Observer: Triggers only when user scrolls to this section
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Starts when at least 20% of section is visible in viewport
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Automatic Movement Action: Cycles products (image + text) automatically when viewing
  useEffect(() => {
    // If not visible on screen, or if user is touching/sliding, pause automatic action
    if (!isVisible || isUserInteracting || isDragging) return;

    const interval = setInterval(() => {
      setProductIdx((prev) => (prev + 1) % transformationProducts.length);
      setSliderPos(50); // Reset slider to center for fresh comparison
    }, 4500); // 4.5 seconds cycle

    return () => clearInterval(interval);
  }, [isVisible, isUserInteracting, isDragging]);

  const updateContainerWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, [updateContainerWidth]);

  const handlePrevProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    pauseAutoPlay();
    setProductIdx((prev) => (prev === 0 ? transformationProducts.length - 1 : prev - 1));
    setSliderPos(50);
  };

  const handleNextProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    pauseAutoPlay();
    setProductIdx((prev) => (prev === transformationProducts.length - 1 ? 0 : prev + 1));
    setSliderPos(50);
  };

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    if (percent < 5) percent = 5;
    if (percent > 95) percent = 95;
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => {
    pauseAutoPlay();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchStart = () => {
    pauseAutoPlay();
  };

  const handleTouchMove = (e) => {
    pauseAutoPlay();
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section ref={sectionRef} className="w-full py-2">
      {/* Outer White Card Box wrapping everything (Matches User Drawn Outer Frame) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-4 sm:space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            {/* Top Badge: Brand Web Blue color (#1c2d4a) */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c2d4a]/10 border border-[#1c2d4a]/25 text-[#1c2d4a] text-xs font-bold mb-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#1c2d4a]" />
              <span>{current.badge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-slate-900 transition-all duration-300">
              {current.headerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {current.headerSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Shop Link */}
            <Link
              to={current.shopLink}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1c2d4a] hover:text-amber-800 transition shrink-0"
            >
              <span>{current.shopText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Relative Container with Navigation Arrows in the Gutter between Image & Outer Box */}
        <div className="relative">
          
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrevProduct}
            aria-label="Previous product transformation"
            title="View previous product"
            className="absolute -left-2.5 sm:-left-4 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#1c2d4a] shadow-xl border border-slate-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#1c2d4a] stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNextProduct}
            aria-label="Next product transformation"
            title="View next product"
            className="absolute -right-2.5 sm:-right-4 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#1c2d4a] shadow-xl border border-slate-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#1c2d4a] stroke-[2.5]" />
          </button>

          {/* Interactive Transformation Banner Box */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="relative w-full aspect-[16/10] sm:aspect-[1024/462] min-h-[220px] sm:min-h-0 rounded-2xl sm:rounded-3xl overflow-hidden select-none border border-slate-200/90 shadow-md bg-slate-950 cursor-ew-resize"
          >
            {/* ================= AFTER LAYER (Bottom Layer / Full Container) ================= */}
            <div className="absolute inset-0 select-none">
              <img
                key={`after-${current.id}`}
                src={current.afterImg}
                alt={`${current.name} After Transformation`}
                className="w-full h-full object-contain sm:object-cover block select-none pointer-events-none transition-opacity duration-500"
                loading="lazy"
              />

              {/* Dark scrim overlay centered vertically to align with slider line */}
              <div className="absolute inset-y-0 right-0 w-full sm:w-3/5 bg-gradient-to-l from-black/90 via-black/60 to-transparent flex items-center justify-center sm:justify-end p-3 sm:p-6 md:p-8 pointer-events-none">
                <div key={`after-text-${current.id}`} className="w-full sm:max-w-md flex flex-col items-center sm:items-end text-center sm:text-right space-y-1 sm:space-y-2.5 transition-all duration-300">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                    {current.afterBadge}
                  </span>
                  <h3 className="text-base sm:text-2xl md:text-3xl font-serif font-bold text-white leading-snug sm:leading-tight drop-shadow-md">
                    {current.afterTitle}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-slate-200 leading-snug sm:leading-relaxed drop-shadow-sm max-w-xs sm:max-w-none line-clamp-2 sm:line-clamp-none">
                    {current.afterDesc}
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-block text-[10px] sm:text-[11px] font-bold text-amber-300 bg-black/40 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-amber-300/40 shadow-sm">
                      {current.afterPill}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= BEFORE LAYER (Top Layer / Clipped by sliderPos %) ================= */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden select-none border-r-2 border-white shadow-2xl pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              {/* Inner fixed-width container anchored to containerWidth so image & text do not squash */}
              <div
                className="relative h-full"
                style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
              >
                <img
                  key={`before-${current.id}`}
                  src={current.beforeImg}
                  alt={`${current.name} Before Transformation`}
                  className="w-full h-full object-contain sm:object-cover block select-none pointer-events-none transition-opacity duration-500"
                  loading="lazy"
                />

                {/* Dark scrim overlay centered vertically to align with slider line */}
                <div className="absolute inset-y-0 left-0 w-full sm:w-3/5 bg-gradient-to-r from-black/90 via-black/60 to-transparent flex items-center justify-center sm:justify-start p-3 sm:p-6 md:p-8 pointer-events-none">
                  <div key={`before-text-${current.id}`} className="w-full sm:max-w-md flex flex-col items-center sm:items-start text-center sm:text-left space-y-1 sm:space-y-2.5 transition-all duration-300">
                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-rose-500/30 text-rose-300 border border-rose-400/50 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
                      {current.beforeBadge}
                    </span>
                    <h3 className="text-base sm:text-2xl md:text-3xl font-serif font-bold text-white leading-snug sm:leading-tight drop-shadow-md">
                      {current.beforeTitle}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-slate-200 leading-snug sm:leading-relaxed drop-shadow-sm max-w-xs sm:max-w-none line-clamp-2 sm:line-clamp-none">
                      {current.beforeDesc}
                    </p>
                    <div className="pt-0.5">
                      <span className="inline-block text-[10px] sm:text-[11px] font-bold text-amber-300 bg-black/45 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-amber-300/40 shadow-sm">
                        {current.beforePill}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= DRAGGABLE DIVIDER LINE & HANDLE ================= */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs sm:text-sm font-black shadow-2xl border-2 border-[#1c2d4a] pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                ◀ ▶
              </div>
            </div>

            {/* Product Dots / Carousel Indicator */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full pointer-events-none">
              {transformationProducts.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === productIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Range Slider for Mobile Fine-Tuning */}
        <div className="pt-1 px-1">
          <input
            type="range"
            min="5"
            max="95"
            value={sliderPos}
            onMouseDown={pauseAutoPlay}
            onTouchStart={pauseAutoPlay}
            onChange={(e) => {
              pauseAutoPlay();
              setSliderPos(Number(e.target.value));
            }}
            className="w-full accent-[#1c2d4a] cursor-pointer"
            aria-label="Drag to compare before and after almirah"
          />
        </div>

      </div>
    </section>
  );
};

export default BeforeAfterSlider;
