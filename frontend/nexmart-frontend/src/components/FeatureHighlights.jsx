import React from 'react';
import { Layers, ShieldCheck, Eye, Sparkles, Wind, Maximize2 } from 'lucide-react';

const FeatureHighlights = () => {
  const features = [
    {
      icon: <Layers className="w-6 h-6 text-[#1c2d4a]" />,
      title: '4mm Stainless Steel Frame',
      desc: 'Rigid built-in internal wire support prevents sagging and allows stacking up to 4 boxes.'
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

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header & Swipe Indicator */}
        <div className="flex md:hidden items-center justify-between mb-3 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Why APPZYS® Lasts Longer
          </span>
          <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
            <span>Swipe features</span>
            <span>→</span>
          </span>
        </div>

        {/* Horizontal scroll on mobile (Flipkart app style), Grid on desktop */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-visible gap-3.5 sm:gap-6 pb-2 px-4 -mx-4 md:px-0 md:mx-0 snap-x no-scrollbar overscroll-x-contain">
          {features.map((f, i) => (
            <div
              key={i}
              className="w-[76vw] sm:w-[280px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none p-4.5 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-blue-50/30 transition flex flex-col justify-between"
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
