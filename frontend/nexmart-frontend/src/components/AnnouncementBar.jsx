import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, ShieldCheck, Award } from 'lucide-react';

const announcements = [
  {
    id: 0,
    icon: Sparkles,
    badge: 'FESTIVE SALE',
    text: 'FESTIVE CLOSET MAKEOVER SALE • Flat 40% OFF on Steel Frame Organizers',
    mobileText: 'Festive Sale: Flat 40% OFF Organizers'
  },
  {
    id: 1,
    icon: Truck,
    badge: 'FREE DELIVERY',
    text: 'Free Express Shipping Across India on All Orders',
    mobileText: 'Free Express Delivery Across India'
  },
  {
    id: 2,
    icon: ShieldCheck,
    badge: 'PAYMENT',
    text: '100% Cash on Delivery (COD) Available • Pay at Doorstep',
    mobileText: 'COD Available • Pay at Doorstep'
  },
  {
    id: 3,
    icon: Award,
    badge: 'PREMIUM QUALITY',
    text: 'Heavy Duty Steel Frame & Luxury Velvet Fabric Guaranteed',
    mobileText: 'Heavy Duty Steel Frame & Velvet Quality'
  }
];

const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const current = announcements[currentIndex];
  const Icon = current.icon;
  // Alternating direction:
  // Even index (0, 2): Right to Left
  // Odd index (1, 3): Left to Right
  const isRightToLeft = currentIndex % 2 === 0;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-[#1c2d4a] text-white text-[11px] sm:text-xs shadow-xs overflow-hidden w-full h-[36px] flex items-center justify-center relative select-none border-b border-[#142035]"
    >
      <style>{`
        @keyframes slideRightToLeft {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          12% {
            transform: translateX(0);
            opacity: 1;
          }
          88% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes slideLeftToRight {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          12% {
            transform: translateX(0);
            opacity: 1;
          }
          88% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>

      <div
        key={currentIndex}
        style={{
          animation: `${isRightToLeft ? 'slideRightToLeft' : 'slideLeftToRight'} 4000ms ease-in-out infinite`,
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
        className="flex items-center justify-center gap-2 px-4 text-center max-w-4xl mx-auto cursor-default will-change-transform"
      >
        <span className="p-1 rounded-full bg-white/15 text-white shrink-0">
          <Icon className="w-3.5 h-3.5 animate-pulse" />
        </span>

        <span className="bg-white/20 text-white border border-white/25 text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-md tracking-wider uppercase shrink-0 shadow-2xs">
          {current.badge}
        </span>

        {/* Desktop & Tablet Text */}
        <span className="hidden sm:inline font-semibold tracking-wide text-white/95">
          {current.text}
        </span>

        {/* Mobile Text (Shorter to never truncate or overflow) */}
        <span className="sm:hidden font-semibold tracking-wide text-white/95 truncate">
          {current.mobileText}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
