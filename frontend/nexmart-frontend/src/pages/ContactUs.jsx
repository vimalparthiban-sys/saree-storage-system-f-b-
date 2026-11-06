import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import { useCart } from '../context/CartContext';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowLeft, ShoppingBag, CheckCircle2 } from 'lucide-react';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const navigate = useNavigate();
  const { totalItemCount, setIsCartOpen } = useCart();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/account');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const existing = localStorage.getItem('appzys_contact_messages');
      const messages = existing ? JSON.parse(existing) : [];
      const newMsg = {
        id: 'MSG-' + Math.floor(1000 + Math.random() * 9000),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '9840012345',
        message: formData.message,
        createdAt: new Date().toISOString(),
        status: 'NEW'
      };
      localStorage.setItem('appzys_contact_messages', JSON.stringify([newMsg, ...messages]));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-0">
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
          <h1 className="text-base font-bold text-white">Contact Us</h1>
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

      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12 w-full space-y-4 sm:space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900">Get in Touch With Us</h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Have questions about your order, dimensions, or wholesale bulk inquiries? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-start">
          
          {/* Left Info (5 Cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4 sm:space-y-6">
            <h2 className="text-sm sm:text-lg font-bold text-slate-900">Customer Support Desk</h2>
            
            <div className="space-y-3 sm:space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-[#1c2d4a] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">Phone Support</span>
                  <span className="text-slate-600 font-medium text-xs">+91 9843887070 / 9711451060</span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">Mon–Sat (9 AM – 7 PM IST)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl sm:rounded-2xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">WhatsApp Instant Support</span>
                    <span className="text-[9px] sm:text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">100% Free</span>
                  </div>
                  <span className="text-slate-700 block mt-0.5 font-semibold text-xs">+91 8072784165</span>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Need instant answers about saree covers or order status? Chat directly with our team.
                  </p>
                  <a
                    href="https://wa.me/918072784165?text=Hi%20APPZYS%20Store,%20I%20have%20an%20enquiry%20regarding%20your%20products."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-[#1c2d4a] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">Email Us</span>
                  <span className="text-slate-600 text-xs">care@sareevault.com / support@appzys.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-[#1c2d4a] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs sm:text-sm">Registered Office</span>
                  <span className="text-slate-600 text-[11px] sm:text-xs leading-relaxed">APPZYS Smart Storage Solutions, Industrial Area, Chennai, Tamil Nadu - 600058</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form (7 Cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-sm sm:text-lg font-bold text-slate-900">Send Us a Message</h2>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Thank You!</h3>
                <p className="text-xs text-slate-600">Your message has been received. Our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Your Name *</label>
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#1c2d4a] focus:ring-1 focus:ring-[#1c2d4a] outline-hidden bg-slate-50/50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Email Address *</label>
                    <input
                      type="email" required value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#1c2d4a] focus:ring-1 focus:ring-[#1c2d4a] outline-hidden bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Mobile / WhatsApp</label>
                    <input
                      type="tel" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit number"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#1c2d4a] focus:ring-1 focus:ring-[#1c2d4a] outline-hidden bg-slate-50/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Your Message *</label>
                  <textarea
                    rows="4" required value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need help with..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#1c2d4a] focus:ring-1 focus:ring-[#1c2d4a] outline-hidden bg-slate-50/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#1c2d4a] hover:bg-[#15233a] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default ContactUs;
