import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const InstallationDemo = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Unfold & Push Steel Wire Rods',
      subtitle: 'Takes only 3 seconds — no tools required',
      desc: 'Take the flat-folded box out of the package. Open top zipper and push the two heavy-duty stainless steel frame rods outwards into the side corners.',
      badge: 'Zero Assembly Tools',
      preview: 'Pushed steel frames create instant vertical & horizontal structural support.',
      icon: '🛠️ ➡️ 📦'
    },
    {
      step: 2,
      title: 'Pack Easily Through Top Zipper',
      subtitle: 'Load up to 15 to 20 sarees or heavy silk sets',
      desc: 'With the steel frame fully erect, the box stands firm and rigid on its own without collapsing. Neatly stack your Kanjivaram, Banarasi, or daily cotton sarees.',
      badge: 'Rigid Free-Standing',
      preview: 'Top zipper opens 180 degrees wide for comfortable bulk packing.',
      icon: '⬆️ 🥻 🥻 🥻'
    },
    {
      step: 3,
      title: 'Stack & Pull From Front Window',
      subtitle: 'Pull any saree out without disturbing the pile',
      desc: 'Stack up to 4 boxes on top of each other like a wardrobe closet shelf. When you need a saree, simply unzip the front transparent flap and slide it right out!',
      badge: 'Stackable Up To 4 Boxes',
      preview: 'Clear PVC window lets you spot borders and colors instantly.',
      icon: '🪟 🚪 ⬇️ 🥻'
    }
  ];

  return (
    <section id="demo" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1c2d4a] text-xs font-bold border border-blue-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#1c2d4a]" />
            <span>3-SECOND EASY POP-UP SETUP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            How The Steel Frame Living Box Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            No screwdrivers, no complicated instructions. Push the built-in steel rods and your heavy-duty organizer is ready!
          </p>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                activeStep === s.step
                  ? 'bg-blue-50/70 border-[#1c2d4a] shadow-md ring-2 ring-[#1c2d4a]/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                  activeStep === s.step ? 'bg-[#1c2d4a] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}>
                  0{s.step}
                </span>
                <span className="text-[11px] font-bold text-[#1c2d4a] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {s.badge}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{s.title}</h3>
              <p className="text-xs text-slate-500">{s.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Active Step Showcase */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#1c2d4a] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="bg-[#1c2d4a] text-white font-black text-xs px-2.5 py-1 rounded-lg border border-blue-400/30">
              STEP {activeStep} OF 3
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              {steps[activeStep - 1].title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">{steps[activeStep - 1].desc}</p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Smart Advantage</h4>
                <p className="text-xs text-slate-300 mt-0.5">{steps[activeStep - 1].preview}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveStep((prev) => (prev % 3) + 1)}
              className="bg-[#1c2d4a] hover:bg-[#253b61] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer border border-blue-400/20 shadow-md"
            >
              <span>{activeStep === 3 ? 'Restart Demo' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5 bg-slate-950/70 rounded-2xl p-8 border border-slate-700/80 text-center space-y-3">
            <div className="text-6xl">{steps[activeStep - 1].icon}</div>
            <div className="font-bold text-sm text-blue-200">{steps[activeStep - 1].badge}</div>
            <p className="text-xs text-slate-400">{steps[activeStep - 1].subtitle}</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default InstallationDemo;
