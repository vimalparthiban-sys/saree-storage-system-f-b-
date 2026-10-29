import React, { useState } from 'react';
import { ShoppingBag, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PackSelector = () => {
  const { addToCart, setIsCheckoutOpen } = useCart();
  const [size, setSize] = useState('66L');
  const [selectedPackIndex, setSelectedPackIndex] = useState(2); // Pack of 4 default
  const [color, setColor] = useState('Navy Blue Polka Dot');

  const packs = [
    { qty: 1, name: 'Single Box (Trial Pack)', price: size === '66L' ? 499 : 599, mrp: size === '66L' ? 799 : 999 },
    { qty: 2, name: 'Pack of 2 (Shelf Duo)', price: size === '66L' ? 899 : 1099, mrp: size === '66L' ? 1599 : 1999 },
    { qty: 4, name: 'Pack of 4 (Master Closet)', price: size === '66L' ? 1599 : 1899, mrp: size === '66L' ? 2999 : 3499, popular: true },
    { qty: 6, name: 'Pack of 6 (Full Home)', price: size === '66L' ? 2299 : 2699, mrp: size === '66L' ? 4499 : 5499 }
  ];

  const currentPack = packs[selectedPackIndex];

  return (
    <section id="packs" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold text-slate-900 text-center mb-8">Choose Your Organizer Pack</h2>
        
        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {packs.map((p, idx) => (
            <div
              key={p.qty} onClick={() => setSelectedPackIndex(idx)}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition ${selectedPackIndex === idx ? 'border-amber-700 bg-white shadow-xl scale-102' : 'border-slate-200 bg-white/70'}`}
            >
              {p.popular && <span className="bg-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">POPULAR</span>}
              <h3 className="font-bold text-base mt-2">{p.name}</h3>
              <div className="text-2xl font-black mt-2">₹{p.price} <span className="text-xs line-through text-slate-400">₹{p.mrp}</span></div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => addToCart({ id: 1, packId: `${size}-${currentPack.qty}`, title: `Steel Frame Box (${size})`, packName: currentPack.name, price: currentPack.price, color })}
            className="px-6 py-3 rounded-xl border-2 border-slate-900 font-bold text-xs"
          >
            Add Pack to Cart
          </button>
          <button
            onClick={() => {
              addToCart({ id: 1, packId: `${size}-${currentPack.qty}`, title: `Steel Frame Box (${size})`, packName: currentPack.name, price: currentPack.price, color });
              setIsCheckoutOpen(true);
            }}
            className="px-8 py-3 rounded-xl bg-amber-800 text-white font-bold text-xs shadow-md"
          >
            Buy Now (₹{currentPack.price})
          </button>
        </div>
      </div>
    </section>
  );
};

export default PackSelector;