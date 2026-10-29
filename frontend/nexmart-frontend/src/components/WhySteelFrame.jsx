import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

const WhySteelFrame = () => {
  const comparisons = [
    {
      feature: 'Structural Support',
      steelBox: '4mm Solid Stainless Steel Wire Rods (Rigid 3D frame)',
      clothBag: 'Flimsy cloth sags, collapses, and wrinkles sarees'
    },
    {
      feature: 'Stackability in Wardrobe',
      steelBox: 'Stack 3 to 4 boxes vertically without touching inner clothes',
      clothBag: 'Cannot stack — bottom clothes get crushed and damaged'
    },
    {
      feature: 'Mid-Stack Saree Retrieval',
      steelBox: 'Front Transparent Zipper — slide any saree out in 2 seconds',
      clothBag: 'Must unstack and open entire bag from top, making a mess'
    },
    {
      feature: 'Fabric & Durability',
      steelBox: 'Heavy-Duty 600D Oxford Fabric (Moisture & Moth Resistant)',
      clothBag: 'Cheap 70 GSM non-woven paper cloth tears in 6 months'
    },
    {
      feature: 'Dust & Moisture Protection',
      steelBox: 'Complete dual-zipper seal with reinforced side carry handles',
      clothBag: 'Flimsy single zipper prone to breaking and sticking'
    }
  ];

  return (
    <section id="comparison" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE HONEST COMPARISON</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Why Ordinary Saree Bags Fail (And Why Ours Wins)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            See the difference between cheap roadside cloth covers and our engineered Steel Frame Living Box.
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-12 bg-slate-900 text-white p-4 sm:p-6 text-xs sm:text-sm font-bold items-center">
            <div className="col-span-4 text-slate-300 uppercase tracking-wider text-[11px]">Key Feature</div>
            <div className="col-span-4 text-amber-400 font-extrabold">👑 SareeStore Steel Frame Box</div>
            <div className="col-span-4 text-slate-400">Ordinary Cheap Cloth Bag</div>
          </div>

          <div className="divide-y divide-slate-200">
            {comparisons.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center hover:bg-white transition">
                <div className="col-span-4 font-bold text-slate-900 pr-2">{row.feature}</div>
                <div className="col-span-4 text-slate-800 font-medium flex items-start gap-2 pr-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-emerald-950 font-semibold">{row.steelBox}</span>
                </div>
                <div className="col-span-4 text-slate-500 flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{row.clothBag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhySteelFrame;
