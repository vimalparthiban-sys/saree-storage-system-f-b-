import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import {
  CheckCircle2,
  Headphones,
  ArrowLeft,
  RotateCcw,
  Truck,
  Sparkles,
  PackageCheck,
  AlertTriangle,
  Clock,
  ShieldCheck,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [orderQuery, setOrderQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState(false);
  const { orders } = useCart();
  const navigate = useNavigate();

  // Auto-track on URL param query
  useEffect(() => {
    const queryParam = searchParams.get('query') || searchParams.get('awb') || searchParams.get('orderId');
    if (queryParam) {
      setOrderQuery(queryParam);
      doTrack(queryParam);
    }
  }, [searchParams, orders]);

  const doTrack = (rawQuery) => {
    if (!rawQuery.trim()) return;
    setSearched(true);
    const clean = rawQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        (o.awb && o.awb.toLowerCase() === clean) ||
        (o.phone && o.phone.includes(clean))
    );
    if (found) {
      setTrackedOrder(found);
    } else {
      setTrackedOrder(null);
    }

    // Query live tracking from Spring Boot Backend
    api.getOrderByAwb(clean.toUpperCase())
      .then((res) => {
        if (res.success && res.data) {
          setTrackedOrder(res.data);
        }
      })
      .catch(() => {});
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    doTrack(orderQuery);
  };

  const handleReset = () => {
    setOrderQuery('');
    setTrackedOrder(null);
    setSearched(false);
  };

  const handleCopyAwb = (awb) => {
    navigator.clipboard.writeText(awb);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  // Helper stages
  const status = trackedOrder?.status || 'CONFIRMED';
  const isDelayed = status === 'DELAYED';
  const isPacked = ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status);
  const isShipped = ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status);
  const isOut = ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(status);
  const isDelivered = status === 'DELIVERED';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
        {/* Top Tracking Card (Web Brand Navy & Blue Theme) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[#1c2d4a] text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            <span>EXPRESS LOGISTICS • DELHIVERY & BLUEDART API</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
            Live Package & AWB Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Enter your AWB barcode code, Order ID, or mobile number to track real-time courier checkpoints.
          </p>

          <form onSubmit={handleTrackSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter AWB Code (e.g. AWB-DEL-982140) or Order ID"
                className="w-full px-5 py-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#1c2d4a] focus:outline-hidden bg-slate-50 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#1c2d4a] hover:bg-[#15233b] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-900/15 transition cursor-pointer shrink-0"
            >
              Track Now
            </button>
          </form>

          {/* Quick Demo Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
            <span>Quick test orders:</span>
            {orders.slice(0, 2).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setOrderQuery(o.awb || o.id);
                  doTrack(o.awb || o.id);
                }}
                className="font-mono font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer"
              >
                {o.awb || o.id} ({o.customerName})
              </button>
            ))}
          </div>

          {/* Search Result */}
          {searched && (
            <div className="pt-4 border-t border-slate-100 text-left">
              {trackedOrder ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  {/* Top Order Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-base sm:text-lg">
                          {trackedOrder.id}
                        </span>
                        <span className="text-xs text-slate-400 font-sans">
                          • Placed on {new Date(trackedOrder.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-600 font-medium">Courier Partner:</span>
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-blue-700" />
                          {trackedOrder.courier || 'Delhivery Express'}
                        </span>
                        <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {trackedOrder.awb || 'AWB-DEL-982140'}
                        </span>
                        <button
                          onClick={() => handleCopyAwb(trackedOrder.awb || trackedOrder.id)}
                          className="text-blue-700 hover:text-blue-900 text-[10px] font-bold cursor-pointer"
                        >
                          {copiedAwb ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1.5 font-bold text-xs rounded-xl border ${
                          isDelayed
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : isDelivered
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : isShipped
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        {isDelayed
                          ? '⚠️ Route Delay Encountered'
                          : isDelivered
                          ? '✓ Delivered Successfully'
                          : isOut
                          ? '🚚 Out for Delivery'
                          : isShipped
                          ? '🚀 In Transit (Delhivery)'
                          : isPacked
                          ? '📦 Sealed & Ready'
                          : '⏳ Order Confirmed'}
                      </span>
                    </div>
                  </div>

                  {/* Connected Stepper Progress Line */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Live Delivery Progress Stepper
                    </h4>
                    
                    <div className="relative pt-4 pb-4">
                      {/* Gray Line */}
                      <div className="absolute top-8 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                      
                      {/* Active Colored Line */}
                      <div
                        className={`absolute top-8 left-6 h-1 -translate-y-1/2 z-0 transition-all duration-500 ${
                          isDelayed ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600'
                        }`}
                        style={{
                          width: isDelivered
                            ? 'calc(100% - 3rem)'
                            : isOut
                            ? 'calc(75% - 2rem)'
                            : isShipped
                            ? 'calc(50% - 1.5rem)'
                            : isPacked
                            ? 'calc(25% - 1rem)'
                            : '10%'
                        }}
                      />

                      {/* 4 Nodes */}
                      <div className="relative z-10 grid grid-cols-4 gap-1 text-center text-xs">
                        {/* Node 1: Confirmed */}
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-emerald-100 shadow-xs">
                            ✓
                          </div>
                          <div className="font-bold text-slate-900 text-[11px] sm:text-xs">Confirmed</div>
                          <div className="text-[10px] text-slate-400 hidden sm:block">Payment Done</div>
                        </div>

                        {/* Node 2: Packed */}
                        <div className="flex flex-col items-center space-y-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition ${
                              isPacked
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'
                            }`}
                          >
                            {isPacked ? '✓' : '2'}
                          </div>
                          <div className="font-bold text-slate-900 text-[11px] sm:text-xs">Packed</div>
                          <div className="text-[10px] text-slate-400 hidden sm:block">Quality Sealed</div>
                        </div>

                        {/* Node 3: In Transit */}
                        <div className="flex flex-col items-center space-y-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition ${
                              isDelayed
                                ? 'bg-rose-600 text-white ring-4 ring-rose-100 animate-pulse'
                                : isShipped
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'
                            }`}
                          >
                            {isDelayed ? '!' : isShipped ? '✓' : '3'}
                          </div>
                          <div className="font-bold text-slate-900 text-[11px] sm:text-xs">
                            {isDelayed ? 'Delayed' : 'In Transit'}
                          </div>
                          <div className="text-[10px] text-slate-400 hidden sm:block">Courier Hub</div>
                        </div>

                        {/* Node 4: Delivered */}
                        <div className="flex flex-col items-center space-y-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition ${
                              isDelivered
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'
                            }`}
                          >
                            {isDelivered ? '✓' : '4'}
                          </div>
                          <div className="font-bold text-slate-900 text-[11px] sm:text-xs">Delivered</div>
                          <div className="text-[10px] text-slate-400 hidden sm:block">At Doorstep</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TRANSIT EXCEPTION / DELAY ALERT CARD (What happens if lost/delayed?) */}
                  {isDelayed && (
                    <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-2xl space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-rose-950 text-sm">
                            Regional Route Transit Delay Detected
                          </h4>
                          <p className="text-xs text-rose-800 leading-relaxed">
                            Your package encountered a delay at the national highway transit checkpoint.
                            <strong> APPZYS Zero-Loss Guarantee & Transit Insurance</strong> is automatically active.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/80 p-3.5 rounded-xl border border-rose-200 text-xs text-slate-800 space-y-1.5">
                        <div className="font-bold text-rose-900">🛡️ What APPZYS is doing for you:</div>
                        <div>1. Our Chennai logistics team has escalated this with the senior {trackedOrder.courier || 'Delhivery'} manager.</div>
                        <div>2. If the package does not clear transit within 24 hours, a <strong>Fresh Replacement Saree/Jewel Organiser</strong> will be air-shipped at zero cost.</div>
                        <div>3. Your payment is 100% safe & protected.</div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <a
                          href={`https://wa.me/919840012345?text=${encodeURIComponent(
                            `Hi APPZYS, I need an immediate update on delayed shipment: ${trackedOrder.awb} (Order: ${trackedOrder.id})`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs shadow-xs transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat with Priority Support on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Live Checkpoint Milestones Table */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Checkpoint Scan History
                    </h4>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                      {trackedOrder.trackingEvents && trackedOrder.trackingEvents.length > 0 ? (
                        trackedOrder.trackingEvents.map((ev, i) => (
                          <div key={i} className="p-3.5 flex items-start gap-3 hover:bg-slate-50 transition">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white ${
                                ev.isAlert ? 'bg-rose-600' : 'bg-emerald-600'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{ev.title}</div>
                              <div className="text-[11px] text-slate-500">{ev.location}</div>
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 font-semibold">{ev.time}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-400 text-xs">
                          Package registered with Delhivery. Scan events will populate shortly.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipient Details Card */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold text-slate-900 block">Deliver To:</span>
                      <div>{trackedOrder.customerName} ({trackedOrder.phone})</div>
                      <div className="text-slate-500 text-[11px]">{trackedOrder.address}</div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Package Details:</span>
                      <div>{trackedOrder.items?.[0]?.title || 'APPZYS 60L Saree Organiser'}</div>
                      <div className="text-slate-500 text-[11px]">Amount: ₹{trackedOrder.totalAmount} ({trackedOrder.paymentMethod})</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 text-center space-y-2">
                  <p className="font-bold text-sm">
                    ⚠️ No package found matching <span className="font-mono">{orderQuery}</span>
                  </p>
                  <p className="text-slate-600">
                    Please make sure you have entered the exact AWB number (e.g. AWB-DEL-982140) or Order ID (e.g. ORD-2026-9686).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2 Information Cards (Web Brand Navy & Blue Theme) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Verify Your AWB */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1c2d4a] to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-900/15">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">How Tracking Works</h3>
              <p className="text-xs text-slate-500 mt-1">
                Every APPZYS order is assigned a unique Air Waybill (AWB) Barcode synced with Delhivery & Bluedart.
              </p>
            </div>

            <ul className="text-xs space-y-2.5 text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">✓</span>
                <span>Automated scan updates from central warehouse to local doorstep hub</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">✓</span>
                <span>Automated WhatsApp notifications delivered for every checkpoint</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">✓</span>
                <span>Transit Insurance protection: replacement dispatch for any lost parcel</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Need Help? */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1c2d4a] to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-900/15">
              <Headphones className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">24/7 Logistics Desk Support</h3>
              <p className="text-xs text-slate-500 mt-1">
                Our support team is available round-the-clock for delivery coordination.
              </p>
            </div>

            <ul className="text-xs space-y-2.5 text-slate-700 pt-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">✓</span>
                <span>Direct WhatsApp: <strong>+91 98400 12345</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">✓</span>
                <span>Email Support: <strong>support@appzys.com</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-700 font-bold">✓</span>
                <span>Fulfillment Hub: Guindy Industrial Estate, Chennai - 600032</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-1 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#1c2d4a]">100%</div>
            <div className="text-xs font-semibold text-slate-600">Transit Insured</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-1 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#1c2d4a]">19,000+</div>
            <div className="text-xs font-semibold text-slate-600">Pincodes Covered</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-1 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#1c2d4a]">24/7</div>
            <div className="text-xs font-semibold text-slate-600">WhatsApp Alert Bot</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-1 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-serif font-black text-[#1c2d4a]">24 Hrs</div>
            <div className="text-xs font-semibold text-slate-600">Dispatch Guarantee</div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center items-center gap-4 pt-2">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-2xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl bg-[#1c2d4a] hover:bg-[#15233b] text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-blue-900/15"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear / Track Another</span>
          </button>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default TrackOrder;
