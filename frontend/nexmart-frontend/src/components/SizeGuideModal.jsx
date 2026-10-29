import React from 'react';
import { X, Check, Ruler, Box } from 'lucide-react';
import { useCart } from '../context/CartContext';

const SizeGuideModal = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useCart();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={() => setIsSizeGuideOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
      <div className="min-h-screen px-4 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 space-y-6">
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl font-bold text-slate-900">Wardrobe Size & Capacity Guide</h2>
            </div>
            <button onClick={() => setIsSizeGuideOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 66 Liters Box */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border-2 border-amber-300 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-amber-900 text-lg">66 Liters</span>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">MOST POPULAR</span>
              </div>
              <div className="text-xs text-slate-600 font-mono">Dimensions: 50 x 40 x 33 cm (20 x 16 x 13 in)</div>
              <ul className="text-xs space-y-2 text-slate-700">
                <li className="flex items-center gap-1.5 font-semibold text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600" /> Holds 15 to 18 Folded Sarees
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Fits standard Godrej & wooden cupboards (1.5 ft depth)
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Stack 2 to 3 boxes per wardrobe shelf
                </li>
              </ul>
            </div>

            {/* 100 Liters Jumbo */}
            <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-300 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 text-lg">100 Liters Jumbo</span>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">DEEP CUPBOARDS</span>
              </div>
              <div className="text-xs text-slate-600 font-mono">Dimensions: 60 x 42 x 40 cm (24 x 17 x 16 in)</div>
              <ul className="text-xs space-y-2 text-slate-700">
                <li className="flex items-center gap-1.5 font-semibold text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600" /> Holds 25 to 30 Sarees or 2 Heavy Quilts
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Ideal for heavy bridal lehengas & winter blankets
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Deep sliding wardrobes & loft storage
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-600 text-center">
            💡 <strong>Quick Recommendation:</strong> If you have a normal Godrej almirah or 3-door wardrobe, choose the <strong>66 Liters</strong> box.
          </div>

        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
