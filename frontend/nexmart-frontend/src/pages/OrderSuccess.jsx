import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Phone,
  Home as HomeIcon,
  Truck,
  Copy,
  Check,
  MessageCircle,
  Package,
  ShieldCheck,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { orders } = useCart();
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  const currentOrder = orders.find((o) => o.id === orderId) || orders[0];
  const orderAwb = currentOrder?.awb || 'AWB-DEL-982140';
  const courierName = currentOrder?.courier || 'Delhivery Express';

  const handleCopyAwb = () => {
    navigator.clipboard.writeText(orderAwb);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  // Determine stage progression for stepper line
  const isConfirmed = true;
  const isPacked = ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentOrder?.status);
  const isDispatched = ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(currentOrder?.status);
  const isDelivered = currentOrder?.status === 'DELIVERED';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
          
          {/* Success Checkmark Badge */}
          <div className="relative inline-block">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
              ORDER SUCCESSFULLY PLACED
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 mt-3">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Order ID: <strong className="text-slate-900 font-mono text-sm">{currentOrder ? currentOrder.id : orderId}</strong>
            </p>
          </div>

          {/* Connected Stepper Progress Line */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 text-left space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Estimated Delivery: 2–4 Business Days</span>
              </h3>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                <span>Courier:</span>
                <span className="text-amber-800">{courierName}</span>
              </div>
            </div>

            {/* Visual Connected Progress Bar */}
            <div className="relative pt-2 pb-2">
              {/* Background Gray Line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              
              {/* Active Colored Progress Line */}
              <div
                className="absolute top-5 left-8 h-1 bg-gradient-to-r from-emerald-600 to-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: isDelivered ? 'calc(100% - 4rem)' : isDispatched ? 'calc(66% - 2rem)' : isPacked ? 'calc(33% - 1rem)' : '15%'
                }}
              />

              {/* 3 Step Nodes */}
              <div className="relative z-10 grid grid-cols-3 gap-2 text-center text-xs">
                {/* Step 1: Confirmed */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-emerald-100 shadow-xs">
                    ✓
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">Confirmed</div>
                  <div className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Payment Verified
                  </div>
                </div>

                {/* Step 2: Packed & Dispatched */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition ${
                      isPacked
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 animate-pulse'
                    }`}
                  >
                    {isPacked ? '✓' : '2'}
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">Packed & Dispatched</div>
                  <div className="text-[10px] text-slate-500">
                    {isDispatched ? 'In Transit' : 'Within 24 Hrs'}
                  </div>
                </div>

                {/* Step 3: Doorstep Delivery */}
                <div className="space-y-1.5 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition ${
                      isDelivered
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'
                    }`}
                  >
                    {isDelivered ? '✓' : '3'}
                  </div>
                  <div className={`font-bold text-xs sm:text-sm ${isDelivered ? 'text-slate-900' : 'text-slate-500'}`}>
                    Doorstep Delivery
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isDelivered ? 'Delivered' : 'Express Courier'}
                  </div>
                </div>
              </div>
            </div>

            {/* AWB Tracking Barcode Card */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-700" />
                <span className="text-slate-600">AWB Tracking Code:</span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {orderAwb}
                </span>
              </div>
              <button
                onClick={handleCopyAwb}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                {copiedAwb ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAwb ? 'Copied!' : 'Copy AWB'}</span>
              </button>
            </div>
          </div>

          {/* Customer & Order Summary */}
          {currentOrder && (
            <div className="text-left border-t border-slate-100 pt-5 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-bold text-slate-900">{currentOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Contact Number:</span>
                <span className="font-bold text-slate-900">{currentOrder.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-bold text-slate-900 text-right max-w-xs">{currentOrder.address}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-bold text-amber-800">
                  {currentOrder.paymentMethod === 'COD'
                    ? 'Cash on Delivery (Pay ₹' + currentOrder.totalAmount + ')'
                    : 'Paid Online (UPI / Card)'}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-black text-slate-900 bg-slate-50 px-3 rounded-xl">
                <span>Total Amount:</span>
                <span className="text-amber-900">₹{currentOrder.totalAmount}</span>
              </div>
            </div>
          )}

          {/* WhatsApp 24/7 Automation Banner with Trigger Preview */}
          <div className="bg-emerald-50 text-emerald-950 p-4 rounded-2xl border border-emerald-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <MessageCircle className="w-4 h-4 fill-white" />
              </div>
              <div>
                <p className="font-bold text-emerald-900">24/7 Automated WhatsApp Updates Active</p>
                <p className="text-[11px] text-emerald-700">
                  Live dispatch, AWB link, and delivery OTP sent automatically to <strong>{currentOrder?.phone || 'your phone'}</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowWhatsappModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>View WhatsApp Alert</span>
            </button>
          </div>

          {/* Action Buttons: Live Track + Back to Store */}
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to={`/track-order?query=${orderAwb}`}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-rose-700 hover:from-amber-800 hover:to-rose-800 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-900/20 transition cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Package</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition cursor-pointer"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </main>

      {/* WhatsApp Simulated Phone Modal */}
      {showWhatsappModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setShowWhatsappModal(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          <div className="relative bg-[#efeae2] rounded-3xl max-w-sm w-full shadow-2xl border border-slate-300 z-10 overflow-hidden font-sans">
            {/* WhatsApp Phone Header */}
            <div className="bg-[#075e54] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white text-amber-800 flex items-center justify-center font-serif font-black text-sm">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs">APPZYS Official</span>
                    <span className="bg-emerald-400 text-slate-950 rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-black">
                      ✓
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-200 block">Verified Business Account • Online</span>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="text-white hover:text-slate-200 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WhatsApp Chat Body */}
            <div className="p-4 space-y-3 min-h-[300px] text-xs">
              <div className="text-center">
                <span className="bg-white/80 text-slate-600 text-[10px] px-2.5 py-1 rounded-lg shadow-2xs">
                  TODAY
                </span>
              </div>

              {/* Bot Message Bubble */}
              <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs text-slate-800 space-y-2 border border-slate-200">
                <p className="font-bold text-amber-900 text-xs">
                  Namaste {currentOrder?.customerName || 'Vimal P'}! 🥻
                </p>
                <p className="text-[11px] leading-relaxed">
                  Your order <strong>#{currentOrder ? currentOrder.id : orderId}</strong> has been successfully received & confirmed at APPZYS Smart Storage!
                </p>
                <div className="bg-slate-50 p-2 rounded-xl text-[10px] space-y-1 border border-slate-100">
                  <div>📦 <strong>Items:</strong> {currentOrder?.items?.[0]?.title || 'Saree Living Box 60L'}</div>
                  <div>💰 <strong>Amount:</strong> ₹{currentOrder?.totalAmount || '899'} ({currentOrder?.paymentMethod})</div>
                  <div>🚚 <strong>Courier:</strong> {courierName}</div>
                  <div>🏷️ <strong>AWB Code:</strong> {orderAwb}</div>
                </div>
                <p className="text-[10px] text-slate-600">
                  Our Chennai central fulfillment team is now packing your box with high-durability stainless steel rods.
                </p>
                <div className="pt-1">
                  <a
                    href={`/track-order?query=${orderAwb}`}
                    className="inline-block bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-2xs"
                  >
                    🔗 Click to Live Track Shipment
                  </a>
                </div>
                <div className="text-right text-[9px] text-slate-400">
                  10:30 AM <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500 pt-2">
                🔒 End-to-end encrypted official notification.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-slate-200 text-center">
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close WhatsApp Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrderSuccess;
