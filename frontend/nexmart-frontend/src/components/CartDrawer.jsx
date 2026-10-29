import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    totalItemCount,
    setIsCheckoutOpen
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1c2d4a]" />
              <h2 className="text-base font-bold text-slate-900">Your Wardrobe Cart</h2>
              <span className="text-xs bg-[#1c2d4a] text-white font-bold px-2 py-0.5 rounded-full">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-blue-50/70 px-5 py-2.5 border-b border-blue-100 flex items-center gap-2 text-xs text-[#1c2d4a] font-medium">
            <Truck className="w-4 h-4 text-[#1c2d4a] shrink-0" />
            <span>🎉 You qualify for <strong>FREE Express Delivery</strong> across India!</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mt-1">Select an organizer pack to get started.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#1c2d4a] hover:bg-[#15233a] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-xs"
                >
                  Browse Organizer Packs
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                      <div className="text-xs text-[#1c2d4a] font-semibold">{item.packName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Color: {item.color}</div>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(index, -1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</div>
                      {item.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          ₹{item.originalPrice * item.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Charges</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-[#1c2d4a] hover:bg-[#15233a] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#1c2d4a]/20 text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery (COD) & Instant UPI Supported</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
