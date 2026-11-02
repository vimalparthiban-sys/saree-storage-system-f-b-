import React from 'react';
import { Layers, ShieldCheck, Eye, Sparkles, Wind, Maximize2, Lock } from 'lucide-react';

const FeatureHighlights = ({ category }) => {
  // Hide on default home page view (All products); show only when a category is selected
  if (!category) return null;

  const isSaree = category === 'saree-organiser';
  const isJewel = category === 'jewel-organiser';

  if (!isSaree && !isJewel) return null;

  const sareeFeatures = [
    {
      icon: <Layers className="w-6 h-6 text-[#1c2d4a]" />,
      title: '4mm Stainless Steel Frame',
      desc: 'Rigid built-in internal wire support prevents sagging and allows vertical stacking up to 4 boxes.'
    },
    {
      icon: <Eye className="w-6 h-6 text-[#1c2d4a]" />,
      title: 'Double Access Zippers',
      desc: 'Load from top 180° opening or slide out sarees from the front window without unstacking.'
    },
    {
      icon: <Wind className="w-6 h-6 text-[#1c2d4a]" />,
      title: '600D Oxford Fabric',
      desc: 'Heavy-duty water-resistant and moth-proof fabric keeps precious silk zari shiny and dust-free.'
    },
    {
      icon: <Maximize2 className="w-6 h-6 text-[#1c2d4a]" />,
      title: 'Collapses Flat to 1-Inch',
      desc: 'When not in use, simply fold the steel frame down and store it in any drawer or under the bed.'
    }
  ];

  const jewelFeatures = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#1c2d4a]" />,
      title: 'Velvet Anti-Scratch Lining',
      desc: 'Ultra-soft plush velvet compartments protect gold, silver, pearls, and diamonds from tarnishing and scratches.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#1c2d4a]" />,
      title: 'Tangle-Free Necklace Hooks',
      desc: 'Dedicated hanging hooks with elastic pouch prevent delicate chains and mangalsutras from knotting.'
    },
    {
      icon: <Layers className="w-6 h-6 text-[#1c2d4a]" />,
      title: 'Multi-Grid Smart Dividers',
      desc: 'Removable partition slots customize spaces for earrings, bangles, rings, studs, brooches, and watches.'
    },
    {
      icon: <Lock className="w-6 h-6 text-[#1c2d4a]" />,
      title: 'Travel-Ready Compact Lock',
      desc: 'Lightweight travel case with secure snap-button clasp fits effortlessly inside handbags, vanity cases, and suitcases.'
    }
  ];

  const features = isSaree ? sareeFeatures : jewelFeatures;
  const headerTitle = isSaree
    ? 'Why APPZYS® Saree Organiser Lasts Longer'
    : 'Why APPZYS® Jewellery Organiser Is Superior';
  const headerSubtitle = isSaree
    ? 'Engineered with 4mm solid steel rods & heavy-duty 600D Oxford fabric'
    : 'Luxurious velvet protection, tangle-free storage & travel-friendly security';

  return (
    <section className="py-6 sm:py-10 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                {isSaree ? '✨ Steel Frame Engineering' : '💎 Luxury Travel Protection'}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-slate-900 mt-2">
                {headerTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {headerSubtitle}
              </p>
            </div>

            {/* Mobile Swipe Cue */}
            <span className="flex md:hidden text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 items-center gap-1 shrink-0">
              <span>Swipe</span>
              <span>→</span>
            </span>
          </div>
        </div>

        {/* 4 Feature Boxes: Horizontal scroll on mobile (Flipkart app style), 4-column Grid on desktop */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-visible gap-3.5 sm:gap-6 pb-2 px-1 -mx-1 md:px-0 md:mx-0 snap-x no-scrollbar overscroll-x-contain">
          {features.map((f, i) => (
            <div
              key={i}
              className="w-[76vw] sm:w-[280px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none p-4.5 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2 hover:bg-blue-50/40 hover:border-blue-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
