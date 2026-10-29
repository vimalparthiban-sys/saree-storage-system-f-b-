import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const CustomerReviews = () => {
  const reviews = [
    {
      name: 'Dr. Meenakshi Sundaram',
      city: 'Chennai, Tamil Nadu',
      rating: 5,
      date: '2 days ago',
      title: 'Best wardrobe purchase this year! Front zip is genius.',
      review: 'I have around 40 silk sarees and my cupboard was always overflowing. In normal bags, whenever I pulled one saree, the whole stack would collapse. With this steel frame box, the front transparent window is a lifesaver. I took out my muhurtham saree without disturbing the top 5 sarees!',
      pack: 'Purchased Pack of 4 (66L) - Navy Blue Polka'
    },
    {
      name: 'Kavitha Radhakrishnan',
      city: 'Coimbatore, Tamil Nadu',
      rating: 5,
      date: '1 week ago',
      title: 'Very sturdy steel frame, not like cheap cloth covers.',
      review: 'I was hesitant whether the steel rods would bend under weight, but they are very thick and rigid. I stacked 3 boxes on top of each other inside my Godrej steel almirah. It literally doubled my closet space. Cash on delivery was super smooth too.',
      pack: 'Purchased Pack of 4 (100L Jumbo)'
    },
    {
      name: 'Sunita Reddy',
      city: 'Hyderabad, Telangana',
      rating: 5,
      date: '2 weeks ago',
      title: 'Polka dot fabric looks so neat and premium!',
      review: 'The Oxford fabric is thick and waterproof. No moisture smell inside, and the zippers glide effortlessly. Will definitely buy 2 more for my mother in law.',
      pack: 'Purchased Pack of 2 (66L) - Royal Maroon'
    }
  ];

  return (
    <section id="reviews" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-amber-500 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="font-extrabold text-slate-900 text-lg ml-1">4.9 Out of 5</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">
              Loved by 3,420+ Indian Saree Lovers
            </h2>
            <p className="text-slate-600 text-sm mt-1">Real verified wardrobe feedback from homes across India.</p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">100% Verified Buyer Reviews</span>
              <span className="text-slate-500">Collected after actual delivery</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex text-amber-500">
                    {[...Array(r.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-400">{r.date}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{r.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{r.review}"</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{r.name}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">{r.city}</div>
                <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium truncate">{r.pack}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
