import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerOrders = () => {
  const { user, openAuth } = useAuth();
  const { orders } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <Package className="w-12 h-12 text-amber-700 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Sign in to View Your Orders</h2>
            <button
              onClick={() => openAuth('login', 'CUSTOMER')}
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-slate-900">My Orders & Shipments</h1>
          <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>

        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
                <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  {ord.status}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                {ord.items && ord.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.title} ({item.packName} • {item.color})</span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                Delivering to: {ord.address} | Mode: {ord.paymentMethod}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerOrders;