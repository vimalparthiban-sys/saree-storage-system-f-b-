import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Check, X, Play, Pause, Lock, ShieldCheck, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDemoSection = ({ product }) => {
  if (!product || !product.demo) return null;

  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { demo, comparison } = product;
  const isJewel = product?.id === 'jewellery-organiser' || product?.categorySlug === 'jewel-organiser';

  const getVideoSrc = (step) => {
    if (isJewel) {
      return step === 1
        ? '/videos/jewel_step1.mp4'
        : step === 2
        ? '/videos/jewel_step2.mp4'
        : '/videos/jewel_step3.mp4';
    }
    return step === 1
      ? '/videos/step1_popup.mp4'
      : step === 2
      ? '/videos/step2_pack.mp4'
      : '/videos/step3_pull.mp4';
  };

  // Auto-cycle through the 3 steps smoothly every 4 seconds (pause when modal open or user interacts)
  useEffect(() => {
    if (!isAutoPlay || isVideoModalOpen) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % 3) + 1);
    }, 4200);
    return () => clearInterval(timer);
  }, [isAutoPlay, isVideoModalOpen]);

  // Keyboard navigation & body scroll lock for Fullscreen Video Modal
  useEffect(() => {
    if (!isVideoModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsVideoModalOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveStep((prev) => (prev === 1 ? 3 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveStep((prev) => (prev === 3 ? 1 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isVideoModalOpen]);

  return (
    <div className="space-y-16">
      
      {/* 1. Dedicated 3-Step Demo for this Product */}
      <section className="py-6 sm:py-12 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-10 shadow-xs">
        <div className="text-center max-w-3xl mx-auto space-y-2.5 mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1c2d4a] text-xs font-bold border border-blue-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1c2d4a]" />
            <span>{demo.badge}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-slate-900">
            {demo.headline}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            {demo.subtitle}
          </p>
        </div>

        {/* Step Buttons (Swipe horizontally on mobile, 3-col grid on desktop) */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-3 sm:gap-4 mb-6 sm:mb-8 pb-2 px-1 snap-x no-scrollbar overscroll-x-contain">
          {demo.steps.map((s) => (
            <button
              key={s.step}
              onClick={() => {
                setActiveStep(s.step);
                setIsAutoPlay(false);
              }}
              className={`w-[74vw] sm:w-[280px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none text-left p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                activeStep === s.step
                  ? 'bg-blue-50/80 border-[#1c2d4a] shadow-md ring-2 ring-[#1c2d4a]/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                  activeStep === s.step ? 'bg-[#1c2d4a] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}>
                  0{s.step}
                </span>
                <span className="text-[10px] font-bold text-[#1c2d4a] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {s.badge}
                </span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{s.title}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-1 sm:line-clamp-none">{s.subtitle}</p>

              {/* Active Step Bottom Accent */}
              {activeStep === s.step && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1c2d4a]" />
              )}
            </button>
          ))}
        </div>

        {/* Step Content Box with Grand Animated Visualizer */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e1b2e] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Description Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#1c2d4a] text-white font-black text-xs px-2.5 py-1 rounded-lg border border-blue-400/30">
                STEP {activeStep} OF 3
              </span>
              <button
                type="button"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="text-[11px] text-blue-200 hover:text-white px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/10 flex items-center gap-1.5 transition cursor-pointer"
                title={isAutoPlay ? 'Pause auto demo' : 'Play auto demo'}
              >
                {isAutoPlay ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Auto-cycle ON</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Auto-cycle PAUSED</span>
                  </>
                )}
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
              {demo.steps[activeStep - 1].title}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {demo.steps[activeStep - 1].desc}
            </p>

            {/* Smart Advantage Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{demo.steps[activeStep - 1].badge}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-sky-200 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>{demo.steps[activeStep - 1].subtitle}</span>
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveStep((prev) => (prev % 3) + 1);
                }}
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-lg active:scale-95"
              >
                <span>{activeStep === 3 ? 'Restart Demo' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Real Cropped Video Player */}
          <div 
            onClick={() => {
              setIsVideoModalOpen(true);
              setIsAutoPlay(false);
            }}
            className="lg:col-span-6 relative bg-slate-950 rounded-2xl p-1.5 sm:p-2 border border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center aspect-[18/13] max-w-lg mx-auto w-full select-none group cursor-zoom-in transition hover:border-slate-700 hover:shadow-sky-950/30"
            title="Click to view full screen video"
          >
            
            {/* The Real Video Clip corresponding to the active step */}
            <video
              key={`${product?.id}-${activeStep}`}
              src={getVideoSrc(activeStep)}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover rounded-xl shadow-2xl transition duration-300 group-hover:scale-[1.02]"
            />

            {/* Dynamic Step Header Badge */}
            <div className="absolute top-4 left-4 bg-slate-900/85 text-white border border-sky-400/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>
                {isJewel
                  ? activeStep === 1
                    ? 'Top Lid: 5 Tangle-Free Necklace Hooks'
                    : activeStep === 2
                    ? 'Middle Flap: Stud Earrings & Ring Rolls'
                    : 'Bottom Base: Bangles & Removable Dividers'
                  : activeStep === 1
                  ? 'Pop-Up: Steel Rods Clicking'
                  : activeStep === 2
                  ? 'Top Pack: Bulk Clothes & Sarees'
                  : 'Stack & Pull: Front Window Slide-Out'}
              </span>
            </div>

            {/* Fullscreen Expand Hint Pill (Top-Right) */}
            <div className="absolute top-4 right-4 bg-slate-900/85 hover:bg-[#1c2d4a] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5 transition shadow-lg border border-white/10 group-hover:scale-105">
              <Maximize2 className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">Full screen</span>
            </div>

            {/* Bottom Bar: Action Pill & Live Tag */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none">
              <div className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-semibold text-slate-200 border border-white/10">
                {isJewel
                  ? activeStep === 1
                    ? '100% tangle-free gold chains'
                    : activeStep === 2
                    ? '10+ pairs & velvet ring grooves'
                    : 'Snap-lock compact travel case'
                  : activeStep === 1
                  ? 'Takes 3 seconds'
                  : activeStep === 2
                  ? 'Pack up to 18 sarees'
                  : 'Zero unstacking needed'}
              </div>
              <div className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>REAL DEMO</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Fullscreen Video Modal (Opens when video is clicked) */}
      {isVideoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-150 select-none"
          onClick={() => setIsVideoModalOpen(false)}
        >
          {/* Top-Left Close (✕) Button */}
          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
            aria-label="Close fullscreen video view"
            title="Close (Esc)"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
          </button>

          {/* Top Header: Step Badge */}
          <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>
              Step {activeStep} of 3: {demo.steps[activeStep - 1]?.title}
            </span>
          </div>

          {/* Backward / Previous Step Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveStep((prev) => (prev === 1 ? 3 : prev - 1));
            }}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-xl rounded-full p-2.5 sm:p-3.5 text-white transition cursor-pointer active:scale-95"
            aria-label="Previous Step"
            title="Previous step (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Center Stage: Fullscreen Clean Video Only */}
          <div
            className="w-full h-full flex items-center justify-center p-4 sm:p-12 max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              key={`fullscreen-${product?.id}-${activeStep}`}
              src={getVideoSrc(activeStep)}
              autoPlay
              loop
              controls
              playsInline
              className="max-w-[92vw] max-h-[78vh] sm:max-h-[82vh] w-auto h-auto rounded-2xl shadow-2xl border border-white/10 object-contain bg-black"
            />
          </div>

          {/* Forward / Next Step Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveStep((prev) => (prev === 3 ? 1 : prev + 1));
            }}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-xl rounded-full p-2.5 sm:p-3.5 text-white transition cursor-pointer active:scale-95"
            aria-label="Next Step"
            title="Next step (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Bottom: Step Dots Indicator ONLY */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3">
            {demo.steps.map((s) => (
              <button
                key={s.step}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStep(s.step);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  activeStep === s.step
                    ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-sky-400 shadow-md'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Jump to step ${s.step}`}
                title={`Step ${s.step}: ${s.title}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Dedicated Comparison for this Product */}
      {comparison && (
        <section className="py-6">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {comparison.headline}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              {comparison.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <div className="min-w-[550px]">
                <div className="grid grid-cols-12 bg-slate-900 text-white p-4 sm:p-5 text-xs sm:text-sm font-bold items-center">
                  <div className="col-span-4 text-slate-300 uppercase tracking-wider text-[11px]">Key Feature</div>
                  <div className="col-span-4 text-blue-300 font-extrabold">{comparison.colWinner}</div>
                  <div className="col-span-4 text-slate-400">{comparison.colLoser}</div>
                </div>

                <div className="divide-y divide-slate-200">
                  {comparison.rows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 p-3 sm:p-4 text-xs sm:text-sm items-center hover:bg-slate-50 transition">
                      <div className="col-span-4 font-bold text-slate-900 pr-2">{row.feature}</div>
                      <div className="col-span-4 text-slate-800 font-medium flex items-start gap-2 pr-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-emerald-950 font-semibold text-xs sm:text-sm">{row.winner}</span>
                      </div>
                      <div className="col-span-4 text-slate-500 flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm">{row.loser}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDemoSection;