import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';

const NewsletterBanner = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);

    setTimeout(() => {
      // Save subscriber to localStorage so Admin Dashboard can view it
      const existing = JSON.parse(localStorage.getItem('saree_newsletter_subscribers') || '[]');
      const newSubscriber = {
        id: Date.now(),
        email: email.trim().toLowerCase(),
        date: new Date().toISOString(),
        source: 'Footer Newsletter Banner'
      };

      if (!existing.some((s) => s.email === newSubscriber.email)) {
        existing.unshift(newSubscriber);
        localStorage.setItem('saree_newsletter_subscribers', JSON.stringify(existing));
      }

      setLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 600);
  };

  return (
    <section className="relative overflow-hidden py-16 px-4 border-t border-b border-slate-200">
      {/* Background Image with warm luxury interior aesthetic */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&auto=format&fit=crop&q=80')`,
        }}
      />
      {/* Dark warm translucent vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-900/80 to-amber-950/85 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 text-white">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JOIN 12,000+ WARDROBE ENTHUSIASTS</span>
        </div>

        {/* Title & Subtitle matching original aesthetic */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-amber-50">
            Keep Useful Things Coming
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed">
            New launches, wardrobe organizing ideas, and special festive offers — straight to your inbox.
          </p>
        </div>

        {/* Form or Success State */}
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-stone-950/60 backdrop-blur-md rounded-2xl border border-stone-600/60 shadow-xl">
              <div className="relative flex-1 w-full">
                <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-stone-400 text-xs sm:text-sm focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#1c2d4a] hover:bg-[#15233a] text-white font-bold text-xs sm:text-sm transition duration-200 cursor-pointer shadow-md disabled:opacity-50 shrink-0 border border-white/20"
              >
                {loading ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 backdrop-blur-md text-emerald-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Thanks for subscribing! Check your inbox for a 10% welcome coupon.</span>
          </div>
        )}

        <p className="text-[11px] text-stone-400">
          No spam, ever. Unsubscribe anytime with 1 click.
        </p>

      </div>
    </section>
  );
};

export default NewsletterBanner;
