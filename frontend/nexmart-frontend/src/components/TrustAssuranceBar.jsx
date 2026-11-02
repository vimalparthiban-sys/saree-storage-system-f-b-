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
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 w-full">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {assurances.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 ${idx >= 2 ? 'pt-3 sm:pt-0' : ''} sm:px-3 first:pl-0 last:pr-0`}
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${item.bg} border flex items-center justify-center shrink-0 shadow-2xs`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  {item.title}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 truncate">
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
