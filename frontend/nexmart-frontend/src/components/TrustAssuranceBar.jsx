import React from 'react';
import { Truck, Banknote, Star, RotateCcw } from 'lucide-react';

const TrustAssuranceBar = () => {
  const assurances = [
    {
      icon: <Truck className="w-5 h-5 text-amber-800" />,
      bg: 'bg-amber-50 border-amber-200/80',
      title: 'Free Express Shipping',
      subtitle: 'All-India Doorstep Delivery'
    },
    {
      icon: <Banknote className="w-5 h-5 text-emerald-800" />,
      bg: 'bg-emerald-50 border-emerald-200/80',
      title: 'Cash on Delivery (COD)',
      subtitle: 'Pay at Your Doorstep'
    },
    {
      icon: <Star className="w-5 h-5 text-amber-500 fill-amber-500" />,
      bg: 'bg-amber-50 border-amber-200/80',
      title: '4.9 / 5 Rating',
      subtitle: '20,000+ Happy Homes'
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-blue-800" />,
      bg: 'bg-blue-50 border-blue-200/80',
      title: '7-Day Free Replacement',
      subtitle: '100% Quality Assurance'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 w-full">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-2xs">
        {/* Mobile: Smooth single-row horizontal swipe with snap (like product cards) | Desktop: 4 columns grid */}
        <div className="flex md:grid md:grid-cols-4 gap-3 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-0.5 md:py-0 md:divide-x md:divide-slate-100">
          {assurances.map((item, idx) => (
            <div
              key={idx}
              className="shrink-0 snap-start flex items-center gap-3 bg-slate-50/70 md:bg-transparent p-2.5 sm:p-3 md:p-0 rounded-xl md:rounded-none border border-slate-100 md:border-0 min-w-[210px] sm:min-w-[230px] md:min-w-0 md:px-3 first:md:pl-0 last:md:pr-0"
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${item.bg} border flex items-center justify-center shrink-0 shadow-2xs`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                  {item.title}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 whitespace-nowrap">
                  {item.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustAssuranceBar;
