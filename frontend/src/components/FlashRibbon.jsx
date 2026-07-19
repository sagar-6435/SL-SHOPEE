import React from 'react';

// Brand Logo Components
const AppleLogo = () => (
  <div className="flex items-center gap-2">
    <svg className="h-6 w-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94 1.07.08 2.15-.52 2.81-1.33z" />
    </svg>
    <span className="font-sans font-semibold text-gray-800 tracking-tight text-sm">Apple</span>
  </div>
);

const SamsungLogo = () => (
  <span className="font-sans font-black tracking-tighter text-[#074C9F] text-lg italic">SAMSUNG</span>
);

const XiaomiLogo = () => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 bg-[#FF6700] rounded-md flex items-center justify-center">
      <span className="text-white font-bold text-sm tracking-tighter font-sans">mi</span>
    </div>
    <span className="font-sans font-bold text-[#FF6700] text-sm">Xiaomi</span>
  </div>
);

const OnePlusLogo = () => (
  <div className="flex items-center gap-1.5 text-[#EB0029]">
    <div className="w-6 h-6 border-2 border-[#EB0029] flex items-center justify-center rounded font-sans font-black text-xs">
      1+
    </div>
    <span className="font-sans font-black tracking-wide text-xs">ONEPLUS</span>
  </div>
);

const SonyLogo = () => (
  <span className="font-serif font-extrabold tracking-[0.25em] text-black text-lg">SONY</span>
);

const LgLogo = () => (
  <div className="flex items-center gap-1.5">
    <div className="w-7 h-7 rounded-full bg-[#A50034] flex items-center justify-center text-white font-sans text-xs font-bold border border-white/20">
      LG
    </div>
    <span className="font-sans font-bold text-xs text-gray-700 tracking-wider">Life's Good</span>
  </div>
);

const HpLogo = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-[#0096D6] flex items-center justify-center text-white font-serif italic font-bold text-sm">
      hp
    </div>
    <span className="font-sans font-semibold text-[#0096D6] text-xs">Invent</span>
  </div>
);

const DellLogo = () => (
  <div className="w-8 h-8 rounded-full border-2 border-[#0076CE] flex items-center justify-center text-[#0076CE] font-sans font-black text-[9px] tracking-tighter">
    DELL
  </div>
);

const LenovoLogo = () => (
  <span className="font-sans font-semibold tracking-tight text-white bg-black px-2.5 py-0.5 rounded text-xs uppercase">
    lenovo
  </span>
);

const AsusLogo = () => (
  <span className="font-sans font-black italic tracking-widest text-[#0066B3] text-md">ASUS</span>
);

const IntelLogo = () => (
  <span className="font-sans font-bold italic text-[#0071C5] text-md tracking-tighter">intel.</span>
);

const NvidiaLogo = () => (
  <div className="flex items-center gap-1 text-[#76B900]">
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm0-4c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v3.5z" />
    </svg>
    <span className="font-sans font-extrabold italic text-sm tracking-tighter">NVIDIA</span>
  </div>
);

const AmdLogo = () => (
  <div className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded font-sans font-black text-[10px] tracking-wider">
    <span>AMD</span>
    <span className="text-[#ED1C24]">▼</span>
  </div>
);

const JblLogo = () => (
  <div className="flex items-baseline text-[#FF6600]">
    <span className="font-sans font-black italic text-lg tracking-tighter">JBL</span>
    <span className="text-[10px] font-bold">®</span>
  </div>
);

const GoogleLogo = () => (
  <span className="font-sans font-bold text-md tracking-tight">
    <span className="text-[#4285F4]">G</span>
    <span className="text-[#EA4335]">o</span>
    <span className="text-[#FBBC05]">o</span>
    <span className="text-[#4285F4]">g</span>
    <span className="text-[#34A853]">l</span>
    <span className="text-[#EA4335]">e</span>
  </span>
);

const PanasonicLogo = () => (
  <span className="font-sans font-extrabold text-[#0F2D6B] tracking-normal text-sm uppercase">Panasonic</span>
);

const PhilipsLogo = () => (
  <span className="font-sans font-bold text-[#0B5C9E] tracking-wider text-xs uppercase">Philips</span>
);

const CanonLogo = () => (
  <span className="font-serif font-extrabold text-[#C51118] text-base tracking-tight">Canon</span>
);

const NikonLogo = () => (
  <div className="flex items-center font-sans font-black text-black bg-[#FFE600] px-2 py-0.5 rounded italic text-xs tracking-tight">
    Nikon
  </div>
);

const BoseLogo = () => (
  <span className="font-sans font-black italic text-gray-800 text-xs tracking-[0.15em]">BOSE</span>
);

const FlashRibbon = () => {
  const brands = [
    { id: 'apple', component: <AppleLogo /> },
    { id: 'samsung', component: <SamsungLogo /> },
    { id: 'xiaomi', component: <XiaomiLogo /> },
    { id: 'oneplus', component: <OnePlusLogo /> },
    { id: 'sony', component: <SonyLogo /> },
    { id: 'lg', component: <LgLogo /> },
    { id: 'hp', component: <HpLogo /> },
    { id: 'dell', component: <DellLogo /> },
    { id: 'lenovo', component: <LenovoLogo /> },
    { id: 'asus', component: <AsusLogo /> },
    { id: 'intel', component: <IntelLogo /> },
    { id: 'nvidia', component: <NvidiaLogo /> },
    { id: 'amd', component: <AmdLogo /> },
    { id: 'jbl', component: <JblLogo /> },
    { id: 'google', component: <GoogleLogo /> },
    { id: 'panasonic', component: <PanasonicLogo /> },
    { id: 'philips', component: <PhilipsLogo /> },
    { id: 'canon', component: <CanonLogo /> },
    { id: 'nikon', component: <NikonLogo /> },
    { id: 'bose', component: <BoseLogo /> }
  ];

  // Duplicate brands array to guarantee seamless smooth infinite scrolling (matches -50% translation)
  const scrollBrands = [...brands, ...brands];

  return (
    <section className="w-full py-6 bg-gradient-to-r from-purple-50/60 via-indigo-50/40 to-purple-50/60 border-y border-purple-100/70 overflow-hidden relative shadow-[inset_0_1px_3px_rgba(157,78,141,0.03)]">
      {/* Decorative linear overlay gradients for smooth edge fading */}
      <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-purple-50/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-purple-50/90 to-transparent z-10 pointer-events-none" />

      <div className="text-center mb-5 relative z-20">
        <span className="text-sm md:text-base font-bold uppercase tracking-[0.25em] text-[var(--color-primary)] bg-white px-6 py-2 rounded-full border border-gray-100 shadow-[0_3px_8px_rgba(157,78,141,0.06)] font-sans">
          Brands We Deal In
        </span>
      </div>

      <div className="w-max flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer">
        {scrollBrands.map((brand, index) => (
          <div
            key={`${brand.id}-${index}`}
            className="inline-flex items-center justify-center min-w-[130px] h-[64px] mx-4 px-5 bg-white rounded-xl border border-purple-100/50 shadow-[0_3px_10px_rgba(157,78,141,0.02)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_20px_rgba(157,78,141,0.08)] hover:border-purple-200"
          >
            {brand.component}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashRibbon;
