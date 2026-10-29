import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Heart, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#13223f] text-slate-300 pt-16 pb-12 border-t border-[#1c2d4a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 3 Pillars of Trust (Horizontal scroll on mobile, 3-col on desktop) */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-3.5 md:gap-6 pb-6 md:pb-12 border-b border-[#1c2d4a] px-4 -mx-4 md:px-0 md:mx-0 snap-x no-scrollbar overscroll-x-contain">
          <div className="w-[78vw] sm:w-[300px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none flex items-center gap-3.5 bg-[#1c2d4a]/50 p-3.5 sm:p-4 rounded-2xl border border-[#2a4066]/50">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Free Express Shipping</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Delivered safely across all Indian pin codes</p>
            </div>
          </div>

          <div className="w-[78vw] sm:w-[300px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none flex items-center gap-3.5 bg-[#1c2d4a]/50 p-3.5 sm:p-4 rounded-2xl border border-[#2a4066]/50">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">1-Year Frame Warranty</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Built with rust-proof stainless steel rods</p>
            </div>
          </div>

          <div className="w-[78vw] sm:w-[300px] md:w-auto shrink-0 md:shrink snap-center md:snap-align-none flex items-center gap-3.5 bg-[#1c2d4a]/50 p-3.5 sm:p-4 rounded-2xl border border-[#2a4066]/50">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">7 Days Replacement</h4>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">No-questions-asked doorstep exchange</p>
            </div>
          </div>
        </div>

        {/* Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1c2d4a] flex items-center justify-center text-white font-serif font-black text-lg border border-[#2a4066]">
                A
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xl text-white">
                  APPZYS<span className="text-[#60a5fa]">®</span>
                </span>
                <span className="text-[9px] bg-white/10 text-slate-200 font-bold px-1.5 py-0.5 rounded border border-white/15">
                  SMART STORAGE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              India's premier wardrobe transformation brand. We engineer heavy-duty steel frame living boxes and luxury jewellery organisers that protect your precious clothes and accessories.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#60a5fa]" /> WhatsApp Support: +91 98400 12345</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#60a5fa]" /> Support: care@appzys.com</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/?category=saree-organiser" className="hover:text-blue-400 transition">60L Saree Organiser</Link></li>
              <li><Link to="/?category=jewel-organiser" className="hover:text-blue-400 transition">Jewellery Organiser</Link></li>
              <li><Link to="/track-order" className="hover:text-blue-400 transition">Track Your Order</Link></li>
              <li><Link to="/my-orders" className="hover:text-blue-400 transition">My Orders</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quality Promise</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>✓ Heavy-Duty Steel Frame Technology</li>
              <li>✓ Luxury Dust & Moisture-Proof Fabric</li>
              <li>✓ 100% Cash on Delivery (COD) Across India</li>
              <li className="pt-2">
                <Link to="/admin" className="text-blue-400 hover:underline font-semibold flex items-center gap-1">
                  🔒 Admin Store Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1c2d4a] text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 APPZYS® Smart Storage Solutions. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Homes
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
