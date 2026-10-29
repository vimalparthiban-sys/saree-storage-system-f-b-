import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">Get in Touch With Us</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about your order, dimensions, or wholesale bulk inquiries? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Info (5 Cols) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Customer Support Desk</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Phone Support</span>
                  <span className="text-slate-500">+91 9843887070 / 9711451060</span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">Mon–Sat (9 AM – 7 PM IST)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 block">WhatsApp Instant Support</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">100% Free</span>
                  </div>
                  <span className="text-slate-700 block mt-0.5 font-medium">+91 8072784165</span>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Need instant answers about saree covers or order status? Click below to chat directly with us on WhatsApp.
                  </p>
                  <a
                    href="https://wa.me/918072784165?text=Hi%20APPZYS%20Store,%20I%20have%20an%20enquiry%20regarding%20your%20products."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat With Us on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Email Us</span>
                  <span className="text-slate-500">care@sareevault.com / support@appzys.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Registered Office</span>
                  <span className="text-slate-500">APPZYS Smart Storage Solutions, Industrial Area, Chennai, Tamil Nadu - 600058</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form (7 Cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Send Us a Message</h2>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-900">Thank You!</h3>
                <p className="text-xs text-slate-600">Your message has been received. Our team will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Your Name *</label>
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Email Address *</label>
                    <input
                      type="email" required value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Mobile / WhatsApp</label>
                    <input
                      type="tel" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit number"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Your Message *</label>
                  <textarea
                    rows="4" required value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you need help with..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
