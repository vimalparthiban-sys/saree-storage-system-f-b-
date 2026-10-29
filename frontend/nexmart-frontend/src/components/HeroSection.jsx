import React, { useState } from 'react';
import { Star, ShieldCheck, Box, Layers, Eye, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const HeroSection = () => {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const [selectedColor, setSelectedColor] = useState('Navy Blue Polka Dot');
  const [selectedCapacity, setSelectedCapacity] = useState('66L');

  const colorVariants = [
    { name: 'Navy Blue Polka Dot', class: 'bg-blue-900' },
    { name: 'Royal Maroon Polka', class: 'bg-rose-900' },
    { name: 'Coffee Brown', class: 'bg-amber-950' },
    { name: 'Charcoal Grey', class: 'bg-slate-700' },
  ];

  const handleInstantBuy = () => {
    const item = {
      id: 1,
      packId: `${selectedCapacity}-4`,
      title: `Steel Frame Foldable Living Box (${selectedCapacity})`,
      packName: 'Pack of 4 (Best Value)',
      packQuantity: 4,
      size: selectedCapacity,
      color: selectedColor,
      price: selectedCapacity === '66L' ? 1599 : 1899,
      originalPrice: selectedCapacity === '66L' ? 2999 : 3499
    };
    addToCart(item);
    setIsCheckoutOpen(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-slate-50 py-8 lg:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold">
              <span className="flex h-2 w-2 rounded-full bg-amber-600 animate-ping"></span>
              <span>⭐ Rated #1 Saree Storage Solution in India</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900 tracking-tight leading-tight">
                Never Mess Up Your Saree Stack Again.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
                Ordinary cloth bags sag and wrinkle your pattu sarees. Our <strong className="text-slate-900 font-semibold">Stainless Steel Frame Saree Living Box</strong> creates rigid, stackable wardrobe shelves with instant <strong className="text-amber-800 font-semibold">dual top & front zipper access</strong>.
              </p>
            </div>

            {/* Quick Value Props */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-start gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <Layers className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Stackable Steel Frame</h4>
                  <p className="text-[11px] text-slate-500">Won't sag or collapse</p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <Eye className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Clear Front Window</h4>
                  <p className="text-[11px] text-slate-500">Find sarees in 2 seconds</p>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-start gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <Box className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">66L & 100L Sizes</h4>
                  <p className="text-[11px] text-slate-500">Holds 15 to 25 sarees</p>
                </div>
              </div>
            </div>

            {/* Capacity & Color Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Select Size / Capacity:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCapacity('66L')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedCapacity === '66L' ? 'bg-amber-800 text-white border-amber-900 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      66 Liters (15–18 Sarees)
                    </button>
                    <button
                      onClick={() => setSelectedCapacity('100L')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedCapacity === '100L' ? 'bg-amber-800 text-white border-amber-900 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      100L Jumbo (25+ Sarees / Quilts)
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Color: {selectedColor}</span>
                  <div className="flex items-center gap-2">
                    {colorVariants.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full ${c.class} border-2 transition cursor-pointer ${
                          selectedColor === c.name ? 'ring-2 ring-amber-600 scale-110 border-white' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleInstantBuy}
                  className="flex-1 bg-gradient-to-r from-amber-700 to-rose-700 hover:from-amber-800 hover:to-rose-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-900/20 text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
                >
                  <span>Order Pack of 4 (Save ₹1,400)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#packs"
                  className="px-6 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm text-center transition"
                >
                  View All Packs (From ₹499)
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1 text-xs text-slate-600">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-800">4.9 / 5</span>
              <span>Based on 3,420+ Indian Wardrobe reviews</span>
            </div>
          </div>

          {/* Right Visual Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/90 space-y-5">
              <div className="flex justify-between items-center text-xs">
                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold rounded-lg uppercase tracking-wide text-[10px]">
                  FESTIVE SPECIAL OFFER
                </span>
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 1-Year Frame Warranty
                </span>
              </div>

              {/* Box Graphic Visualizer */}
              <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-950 p-6 text-white overflow-hidden shadow-inner border border-slate-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                    INTERNAL 4MM STEEL ROD FRAME
                  </div>
                  <span className="text-[11px] text-slate-300 font-mono">{selectedCapacity}</span>
                </div>

                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-3">
                  <div className="border border-dashed border-amber-400/60 rounded-lg p-2 text-center text-xs text-amber-300 bg-amber-950/40">
                    ⬆️ Top Zipper: Quick Bulk Packing (15–20 Sarees)
                  </div>

                  <div className="border-2 border-amber-500 rounded-xl p-3 bg-white/10 backdrop-blur-md space-y-1.5">
                    <div className="text-[11px] text-amber-200 font-bold mb-1">TRANSPARENT PEEK WINDOW</div>
                    <div className="h-5 rounded bg-gradient-to-r from-red-800 to-red-600 px-2 flex items-center justify-between text-[9px]">
                      <span>Banarasi Pure Silk</span>
                      <span className="text-amber-200">Zari Border</span>
                    </div>
                    <div className="h-5 rounded bg-gradient-to-r from-emerald-800 to-emerald-600 px-2 flex items-center justify-between text-[9px]">
                      <span>Kanjivaram Bridal Green</span>
                      <span className="text-amber-200">Gold Pallu</span>
                    </div>
                  </div>

                  <div className="text-center text-[11px] text-cyan-300 font-medium">
                    ⬇️ Front Zipper: Pull out any saree without disturbing stack!
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-300 pt-1">
                  <span>🧵 Reinforced Side Handles</span>
                  <span>🛡️ 600D Oxford Waterproof</span>
                </div>
              </div>

              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 line-through">MRP ₹2,999</span>
                  <div className="text-xl font-black text-amber-950">
                    ₹1,599 <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">(Pack of 4)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 block">⚡ Ready in Stock</span>
                  <span className="text-[11px] text-slate-500">Dispatches in 24 Hrs</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
