import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CustomerOrders = () => {
  const { user, openAuth } = useAuth();
  const { orders, totalItemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/account');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 pb-20 md:pb-0">
        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Mobile Sticky Top Header with Back Arrow */}
        <header className="md:hidden sticky top-0 z-40 bg-[#1c2d4a] text-white px-3.5 py-3 flex items-center justify-between shadow-md select-none">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleBack}
              type="button"
              className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition cursor-pointer active:scale-95 shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.3]" />
            </button>
            <h1 className="text-base font-bold text-white">My Orders</h1>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1c2d4a] flex items-center justify-center mx-auto">
              <Package className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Sign in to View Orders</h2>
              <p className="text-xs text-slate-500">Track shipments, download invoices, and manage past purchases</p>
            </div>
            <button
              onClick={() => openAuth('login', 'CUSTOMER')}
              className="w-full bg-[#1c2d4a] hover:bg-[#15233a] text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-sm active:scale-98"
            >
              Sign In to Your Account
            </button>
          </div>
        </main>
        
        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-20 md:pb-0">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Sticky Top Header with Back Arrow */}
      <header className="md:hidden sticky top-0 z-40 bg-[#1c2d4a] text-white px-3.5 py-3 flex items-center justify-between shadow-md select-none">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBack}
            type="button"
            className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition cursor-pointer active:scale-95 shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.3]" />
          </button>
          <h1 className="text-base font-bold text-white">My Orders</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1.5 rounded-full text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 w-full space-y-4 sm:space-y-6">
        <div className="hidden md:flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-slate-900">My Orders & Shipments</h1>
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-[#1c2d4a] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 border border-slate-200 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Explore our smart organisers and get 100% dust-free wardrobe storage.</p>
            <Link
              to="/"
              className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-[#1c2d4a] text-white text-xs font-bold hover:bg-[#15233a] transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Order ID</span>
                    <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{ord.id}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-blue-50 text-[#1c2d4a] border border-blue-200/60">
                    {ord.status || 'CONFIRMED'}
                  </span>
                </div>

                <div className="space-y-2 py-1 text-xs">
                  {ord.items && ord.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-800">
                      <span className="font-medium text-xs leading-snug pr-2">
                        {item.title} <span className="text-slate-500">({item.packName || item.pack} • {item.color})</span>
                      </span>
                      <span className="font-bold text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 leading-relaxed">
                  <span>Delivering to: <strong className="text-slate-700">{ord.address}</strong></span>
                  <span className="text-slate-600 font-medium">Mode: {ord.paymentMethod || 'COD'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default CustomerOrders;
