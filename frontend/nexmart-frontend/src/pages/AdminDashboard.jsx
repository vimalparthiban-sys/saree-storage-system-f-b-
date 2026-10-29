import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  Mail,
  Copy,
  Check,
  Printer,
  Truck,
  MessageCircle,
  Package,
  AlertTriangle,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin, openAuth } = useAuth();
  const { orders, updateOrderStatus } = useCart();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'inventory', or 'newsletter'
  const [copied, setCopied] = useState(false);

  // Modals state
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState(null);
  const [selectedOrderForWhatsapp, setSelectedOrderForWhatsapp] = useState(null);

  // Read subscribers
  const [subscribers, setSubscribers] = useState(() => {
    const saved = localStorage.getItem('saree_newsletter_subscribers');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, email: 'anithasundar@gmail.com', date: '2026-10-22T09:15:00', source: 'Home Footer Banner' },
          { id: 2, email: 'priya.k@outlook.com', date: '2026-10-21T18:40:00', source: 'Product Detail Page' },
          { id: 3, email: 'lavanya.chennai@yahoo.com', date: '2026-10-20T14:22:00', source: 'Festive Popup' }
        ];
  });

  useEffect(() => {
    const checkSubscribers = () => {
      const saved = localStorage.getItem('saree_newsletter_subscribers');
      if (saved) setSubscribers(JSON.parse(saved));
    };
    checkSubscribers();
    window.addEventListener('storage', checkSubscribers);
    return () => window.removeEventListener('storage', checkSubscribers);
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-rose-100 selection:text-rose-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Authentication Required</h2>
            <p className="text-xs text-slate-600">
              Only authorized store managers can view orders, generate shipping labels & dispatch packages.
            </p>
            <button
              onClick={() => openAuth('login', 'ADMIN')}
              className="w-full bg-rose-700 hover:bg-rose-800 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              Log In as Store Admin (Quick Test)
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => ['CONFIRMED', 'PROCESSING', 'PACKED'].includes(o.status)).length;
  const shippedOrders = orders.filter((o) => ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status)).length;

  const handleCopyEmails = () => {
    const emailList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Admin Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700 to-rose-700 text-white flex items-center justify-center shadow-md shadow-amber-900/15">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">APPZYS® Store Admin Portal</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                  LIVE FULFILLMENT
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Managing Saree Organisers & Jewellery Organisers • Courier Dispatches • WhatsApp Automation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Customer Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'newsletter'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Newsletter Leads ({subscribers.length})</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Gross Sales</span>
              <div className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Pending Packing / Pickup</span>
              <div className="text-2xl font-black text-slate-900">{pendingOrders} Orders</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">In Transit / Delivered</span>
              <div className="text-2xl font-black text-slate-900">{shippedOrders} Orders</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Subscribed Customer Leads</span>
              <div className="text-2xl font-black text-slate-900">{subscribers.length} Leads</div>
            </div>
          </div>
        </div>

        {/* Tab 1: Orders Table */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Real-time Order Action Banner */}
            <div className="bg-gradient-to-r from-amber-900 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {pendingOrders} Order(s) Waiting For Quality Packing & Doorstep Courier Pickup
                  </h3>
                  <p className="text-xs text-amber-200">
                    Print the AWB Shipping Label, seal in box with stainless steel rods, and hand over to Delhivery / Bluedart.
                  </p>
                </div>
              </div>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl font-bold">
                Doorstep Pickup: Active Today
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Items / Pack</th>
                      <th className="py-3 px-4">Amount & Payment</th>
                      <th className="py-3 px-4">Courier & AWB</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                      <th className="py-3 px-4 text-center">Fulfillment Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                        {/* 1. Order ID */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          {ord.id}
                          <div className="text-[10px] font-sans text-slate-400 font-normal">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        {/* 2. Customer */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">{ord.customerName}</div>
                          <div className="text-slate-600 text-[11px] font-mono">{ord.phone}</div>
                          <div className="text-slate-400 text-[10px] max-w-xs truncate">{ord.address}</div>
                        </td>

                        {/* 3. Items */}
                        <td className="py-4 px-4">
                          {ord.items &&
                            ord.items.map((it, idx) => (
                              <div key={idx} className="font-medium text-slate-800">
                                {it.title || 'APPZYS Saree Living Box 60L'}
                                <div className="text-[10px] text-amber-800 font-semibold">
                                  {it.packName} • {it.color}
                                </div>
                              </div>
                            ))}
                        </td>

                        {/* 4. Amount */}
                        <td className="py-4 px-4">
                          <div className="font-black text-slate-900 text-sm">₹{ord.totalAmount}</div>
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                              ord.paymentMethod === 'COD'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {ord.paymentMethod} • {ord.paymentStatus}
                          </span>
                        </td>

                        {/* 5. Courier & AWB */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-amber-700" />
                            <span>{ord.courier || 'Delhivery Express'}</span>
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 font-semibold">
                            {ord.awb || 'AWB-DEL-982140'}
                          </div>
                        </td>

                        {/* 6. Status Selector */}
                        <td className="py-4 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                            className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border cursor-pointer focus:outline-hidden ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                : ord.status === 'SHIPPED'
                                ? 'bg-blue-50 text-blue-900 border-blue-300'
                                : ord.status === 'DELAYED'
                                ? 'bg-rose-50 text-rose-900 border-rose-300'
                                : 'bg-amber-50 text-amber-900 border-amber-300'
                            }`}
                          >
                            <option value="CONFIRMED">1. CONFIRMED (New Order)</option>
                            <option value="PACKED">2. PACKED (Sealed Box)</option>
                            <option value="SHIPPED">3. SHIPPED (Handed to Courier)</option>
                            <option value="OUT_FOR_DELIVERY">4. OUT FOR DELIVERY (Rider)</option>
                            <option value="DELIVERED">5. DELIVERED (Success)</option>
                            <option value="DELAYED">⚠️ DELAYED (Test Transit Delay)</option>
                          </select>
                        </td>

                        {/* 7. Action Buttons */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Print Label Button */}
                            <button
                              onClick={() => setSelectedOrderForLabel(ord)}
                              title="Generate & Print AWB Barcode Shipping Label"
                              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>AWB Label</span>
                            </button>

                            {/* WhatsApp Log Button */}
                            <button
                              onClick={() => setSelectedOrderForWhatsapp(ord)}
                              title="View Automated WhatsApp Notification Sent"
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer shadow-2xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Newsletter Leads Table */}
        {activeTab === 'newsletter' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-700" />
                  <span>Customer Newsletter Subscribers ({subscribers.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customers who subscribed from the banner to receive new product launches, organizing tips & festive coupons.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyEmails}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy All Emails'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Customer Email</th>
                    <th className="py-3 px-4">Subscribed Date</th>
                    <th className="py-3 px-4">Form Source</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscribers.map((sub, index) => (
                    <tr key={sub.id || index} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono text-slate-400">{index + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{sub.email}</td>
                      <td className="py-3.5 px-4 text-slate-500">{new Date(sub.date).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-slate-600">{sub.source || 'Footer Banner'}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                          ACTIVE SUBSCRIBER
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: AWB Shipping Barcode Label (Printable)
      ======================================================== */}
      {selectedOrderForLabel && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrderForLabel(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-300 z-10 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Official Courier Shipping Label (Delhivery / Bluedart)
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForLabel(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Label Box */}
            <div className="border-2 border-slate-900 p-4 rounded-xl font-mono text-[11px] text-slate-900 space-y-3 bg-white">
              {/* Header */}
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
                <div>
                  <div className="font-black text-sm tracking-wider font-sans">APPZYS® SMART STORAGE</div>
                  <div className="text-[9px] text-slate-600">Doorstep Express Delivery Partner: {selectedOrderForLabel.courier || 'Delhivery'}</div>
                </div>
                <div className="text-right">
                  <span className="border-2 border-slate-900 px-2 py-0.5 font-black text-xs uppercase">
                    {selectedOrderForLabel.paymentMethod === 'COD' ? 'C.O.D.' : 'PREPAID'}
                  </span>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="text-center py-2 border-b-2 border-slate-900 space-y-1">
                <div className="h-12 w-full flex items-center justify-center gap-0.5 px-4">
                  {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 6, 3, 5, 1, 3, 4, 2, 6, 1, 4, 2, 5, 3, 2, 4, 6].map(
                    (w, i) => (
                      <div
                        key={i}
                        className="bg-black h-full"
                        style={{ width: `${w * 1.5}px`, marginRight: `${(i % 3) + 1}px` }}
                      />
                    )
                  )}
                </div>
                <div className="font-bold tracking-widest text-xs">{selectedOrderForLabel.awb || 'AWB-DEL-982140'}</div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-3 border-b-2 border-slate-900 pb-2 text-[10px]">
                <div>
                  <div className="font-bold uppercase text-[9px] text-slate-500">SHIP TO (CUSTOMER):</div>
                  <div className="font-bold text-xs">{selectedOrderForLabel.customerName}</div>
                  <div className="leading-tight text-slate-700">{selectedOrderForLabel.address}</div>
                  <div className="font-bold mt-1">Phone: {selectedOrderForLabel.phone}</div>
                </div>
                <div className="border-l-2 border-slate-900 pl-3">
                  <div className="font-bold uppercase text-[9px] text-slate-500">RETURN / DISPATCHED FROM:</div>
                  <div className="font-bold">APPZYS Fulfillment Hub</div>
                  <div className="leading-tight text-slate-700">Plot 12, Industrial Estate, Guindy, Chennai - 600032</div>
                  <div className="mt-1">Support: +91 98400 12345</div>
                </div>
              </div>

              {/* Order Items & Weight */}
              <div className="flex justify-between items-center text-[10px] pt-1">
                <div>
                  <span className="font-bold">Item: </span>
                  {selectedOrderForLabel.items?.[0]?.title || 'APPZYS 60L Saree Organiser'}
                </div>
                <div>
                  <span className="font-bold">Gross Wt: </span>1.40 Kg
                </div>
                <div>
                  <span className="font-bold">Amount: </span>₹{selectedOrderForLabel.totalAmount}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrderForLabel(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Physical Shipping Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: WhatsApp Automated Notification Log
      ======================================================== */}
      {selectedOrderForWhatsapp && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrderForWhatsapp(null)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300 z-10 space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">WhatsApp Automated Notification Log</h3>
                  <p className="text-[10px] text-slate-500">Recipient: {selectedOrderForWhatsapp.phone} ({selectedOrderForWhatsapp.customerName})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForWhatsapp(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto p-1 text-xs">
              {selectedOrderForWhatsapp.whatsappLogs && selectedOrderForWhatsapp.whatsappLogs.length > 0 ? (
                selectedOrderForWhatsapp.whatsappLogs.map((log, idx) => (
                  <div key={idx} className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800">
                      <span>TRIGGER: {log.stage}</span>
                      <span>{log.time}</span>
                    </div>
                    <p className="text-slate-800 text-[11px] leading-relaxed whitespace-pre-line">
                      {log.message}
                    </p>
                    <div className="text-right text-[10px] text-emerald-600 font-semibold">
                      ✓ Delivered via WhatsApp Official API
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No automated alerts recorded yet for this order.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                onClick={() => setSelectedOrderForWhatsapp(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close WhatsApp Log
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
