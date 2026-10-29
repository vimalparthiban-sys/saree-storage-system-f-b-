import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Home as HomeIcon, LayoutGrid, User, ShoppingBag, X, ChevronRight, Layers, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { totalItemCount, setIsCartOpen } = useCart();
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  const currentCategory = searchParams.get('category');
  const isHome = location.pathname === '/' && !currentCategory && !isCategoryDrawerOpen;
  const isAccount = (location.pathname === '/account' || location.pathname === '/profile') && !isCategoryDrawerOpen;
  const isTrack = location.pathname === '/track-order' && !isCategoryDrawerOpen;

  const handleSelectCategory = (categorySlug) => {
    setIsCategoryDrawerOpen(false);
    if (categorySlug) {
      navigate(`/?category=${categorySlug}`);
    } else {
      navigate('/');
    }
  };

  const handleSelectProduct = (productId) => {
    setIsCategoryDrawerOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar: Home | Categories | Track | Account | Cart */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-slate-200 py-1 px-1.5 flex items-center justify-around shadow-2xl select-none"
        style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
      >
        {/* 1. Home */}
        <Link
          to="/"
          onClick={() => setIsCategoryDrawerOpen(false)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            isHome ? 'text-[#1c2d4a] font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <HomeIcon className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        {/* 2. Categories (Flipkart 4-squares icon) */}
        <button
          onClick={() => setIsCategoryDrawerOpen(true)}
          type="button"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer ${
            isCategoryDrawerOpen ? 'text-[#1c2d4a] font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${isCategoryDrawerOpen ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Categories</span>
        </button>

        {/* 3. Track Order */}
        <Link
          to="/track-order"
          onClick={() => setIsCategoryDrawerOpen(false)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            isTrack ? 'text-[#1c2d4a] font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Truck className={`w-5 h-5 ${isTrack ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Track</span>
        </Link>

        {/* 4. Account (Flipkart User icon) */}
        <Link
          to="/account"
          onClick={() => setIsCategoryDrawerOpen(false)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            isAccount ? 'text-[#1c2d4a] font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <User className={`w-5 h-5 ${isAccount ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5">Account</span>
        </Link>

        {/* 5. Cart with Live Item Badge */}
        <button
          onClick={() => {
            setIsCategoryDrawerOpen(false);
            setIsCartOpen(true);
          }}
          type="button"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-700 hover:text-[#1c2d4a] transition cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Cart</span>
        </button>
      </nav>

      {/* Categories Slide-Up Bottom Drawer (Shows same as Web Flyout Menu) */}
      {isCategoryDrawerOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150"
          onClick={() => setIsCategoryDrawerOpen(false)}
        >
          <div 
            className="bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto p-5 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Shop by Category
                </h3>
                <p className="text-[11px] text-slate-500">
                  APPZYS® Heavy Duty Living & Jewellery Organisers
                </p>
              </div>
              <button
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                aria-label="Close categories"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Main Group: Wardrobe Organizers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                <span>Wardrobe Organizers</span>
                <button
                  onClick={() => handleSelectCategory('')}
                  className="text-blue-800 hover:underline font-bold text-[11px] normal-case"
                >
                  View All (2)
                </button>
              </div>

              {/* Products inside this category with direct photos & price */}
              <div className="space-y-2.5">
                {products.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p.id)}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-[#1c2d4a] bg-slate-50/70 hover:bg-blue-50/40 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white p-1 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={p.images?.[0] || '/placeholder.jpg'}
                          alt={p.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {p.brand}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#1c2d4a] line-clamp-1">
                          {p.shortTitle || p.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-slate-900">
                            From ₹ {p.basePrice}.00
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1 rounded">
                            {p.discountPercent}% OFF
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1c2d4a] group-hover:translate-x-0.5 transition" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Button: View All Storage Catalog */}
            <div className="pt-2">
              <button
                onClick={() => handleSelectCategory('')}
                className="w-full py-3 rounded-xl bg-[#1c2d4a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
              >
                <span>Explore All Storage Solutions</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomNav;
