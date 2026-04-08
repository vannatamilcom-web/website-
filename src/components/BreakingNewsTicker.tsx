import React from 'react';

export default function BreakingNewsTicker() {
  const news = [
    "தமிழகத்தில் புதிய தொழில் கொள்கை வெளியீடு - முதல்வர் ஸ்டாலின் அறிவிப்பு",
    "ஐபிஎல் 2024: சென்னை சூப்பர் கிங்ஸ் அபார வெற்றி",
    "வானிலை அறிக்கை: அடுத்த 3 நாட்களுக்கு கனமழை எச்சரிக்கை",
    "தங்கம் விலை நிலவரம்: இன்று அதிரடி சரிவு",
    "புதிய ஐபோன் 16 வெளியீடு: தொழில்நுட்ப உலகில் பெரும் எதிர்பார்ப்பு"
  ];

  return (
    <div className="bg-red-600 text-white py-2 flex items-center">
      <div className="px-4 font-black text-xs uppercase tracking-widest border-r border-white/20 whitespace-nowrap shrink-0">
        முக்கிய செய்திகள்
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
        {news.map((item, i) => (
          <span key={i} className="mx-8 text-sm font-medium">
            • {item}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {news.map((item, i) => (
          <span key={`dup-${i}`} className="mx-8 text-sm font-medium">
            • {item}
          </span>
        ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
