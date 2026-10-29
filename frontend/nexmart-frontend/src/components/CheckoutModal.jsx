import React, { useState } from 'react';
import { X, QrCode, CreditCard, Banknote, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cartTotal, placeOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD', 'UPI', 'CARD'
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    upiId: ''
  });

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderResult = placeOrder({
      customerName: formData.customerName,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING_ON_DELIVERY' : 'PAID',
      totalAmount: cartTotal
    });
    navigate(`/order-success/${orderResult.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={() => setIsCheckoutOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
      <div className="min-h-screen px-4 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Complete Your Organizer Order</h2>
            <button onClick={() => setIsCheckoutOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Full Name *</label>
                <input
                  type="text" required value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">WhatsApp / Mobile *</label>
                <input
                  type="tel" required value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Full Delivery Address *</label>
                <textarea
                  required value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300" rows="2"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button" onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border-2 text-left cursor-pointer ${paymentMethod === 'COD' ? 'border-amber-700 bg-amber-50' : 'border-slate-200'}`}
              >
                <Banknote className="w-5 h-5 text-amber-800" />
                <div className="font-bold text-xs mt-1">Cash on Delivery</div>
              </button>
              <button
                type="button" onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border-2 text-left cursor-pointer ${paymentMethod === 'UPI' ? 'border-amber-700 bg-amber-50' : 'border-slate-200'}`}
              >
                <QrCode className="w-5 h-5 text-indigo-700" />
                <div className="font-bold text-xs mt-1">Instant UPI / QR</div>
              </button>
              <button
                type="button" onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border-2 text-left cursor-pointer ${paymentMethod === 'CARD' ? 'border-amber-700 bg-amber-50' : 'border-slate-200'}`}
              >
                <CreditCard className="w-5 h-5 text-slate-700" />
                <div className="font-bold text-xs mt-1">Debit / Credit Card</div>
              </button>
            </div>

            {/* Submit */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-500">Total:</span>
                <div className="text-2xl font-black">₹{cartTotal}</div>
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm cursor-pointer shadow-md"
              >
                Place Order ({paymentMethod})
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;