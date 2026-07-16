"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const easeOut = [0.16, 1, 0.3, 1] as const;
const badgeReveal = {
  hidden: { opacity: 0, y: -20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOut },
  },
};

const lineReveal = {
  hidden: { opacity: 0, y: 60, scale: 0.9, filter: "blur(12px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay: 0.15 + i * 0.2, ease: easeOut },
  }),
};

const descReveal = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOut, delay: 0.45 },
  },
};

const ctaReveal = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 18, delay: 0.65 },
  },
};

const trustReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.85 + i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const rightReveal = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: easeOut, delay: 0.5 },
  },
};

const floatBadges = [
  { label: "Flawless", x: "3%", y: "6%", color: "bg-lime", delay: 0.7 },
  { label: "Good", x: "58%", y: "1%", color: "bg-lime", delay: 0.85 },
  { label: "Fair", x: "0%", y: "52%", color: "bg-orange", delay: 1.0 },
  { label: "Broken", x: "52%", y: "54%", color: "bg-orange", delay: 1.15 },
];

const statBadges = [
  { label: "$2M+ Paid Out", x: "60%", y: "72%", delay: 1.3 },
  { label: "24hr Payment", x: "-2%", y: "80%", delay: 1.45 },
];


function DeviceIllustration() {
  return (
    <motion.div
      className="relative w-full max-w-[420px] mx-auto"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 360 380" fill="none" className="w-full h-auto drop-shadow-2xl">
        <defs>
          <linearGradient id="phone-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#111111" />
          </linearGradient>
          <linearGradient id="phone-screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0d0d1a" />
          </linearGradient>
        </defs>
        <rect x="50" y="10" width="180" height="320" rx="24" fill="url(#phone-body)" stroke="#333" strokeWidth="2" />
        <rect x="56" y="18" width="168" height="304" rx="18" fill="url(#phone-screen)" />
        <rect x="110" y="4" width="60" height="8" rx="4" fill="#222" />
        <circle cx="180" cy="8" r="3" fill="#1a1a1a" />
        <rect x="56" y="18" width="168" height="304" rx="18" fill="url(#phone-screen)" opacity="0.6" />
        <text x="140" y="52" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="sans-serif">9:41</text>
        <circle cx="140" cy="120" r="36" fill="none" stroke="rgba(198,241,53,0.15)" strokeWidth="1" />
        <circle cx="140" cy="120" r="24" fill="none" stroke="rgba(198,241,53,0.1)" strokeWidth="0.5" />
        <path d="M140 102v18l12 6" stroke="#C6F135" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="140" y="190" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="sans-serif" letterSpacing="3">YOUR OFFER</text>
        <text x="140" y="215" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="sans-serif">
          <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
          $394
        </text>
        <rect x="90" y="240" width="100" height="20" rx="4" fill="rgba(198,241,53,0.15)" />
        <text x="140" y="254" textAnchor="middle" fill="#C6F135" fontSize="8" fontWeight="700" fontFamily="sans-serif">INSTANT OFFER</text>
        <rect x="70" y="285" width="12" height="12" rx="2" fill="rgba(240,83,45,0.6)" />
        <rect x="88" y="285" width="12" height="12" rx="2" fill="rgba(240,83,45,0.4)" />
        <rect x="106" y="285" width="12" height="12" rx="2" fill="rgba(240,83,45,0.2)" />
        <rect x="130" y="285" width="40" height="12" rx="2" fill="rgba(240,83,45,0.1)" />
        <text x="140" y="294" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="sans-serif">★★★★★</text>
        <rect x="190" y="306" width="12" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="78" y="306" width="12" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="115" y="314" width="50" height="2" rx="1" fill="rgba(255,255,255,0.08)" />
        {/* Tablet device next to phone */}
        <rect x="240" y="80" width="90" height="120" rx="8" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
        <rect x="244" y="84" width="82" height="112" rx="6" fill="url(#phone-screen)" />
        <rect x="275" y="78" width="20" height="4" rx="2" fill="#222" />
        <text x="285" y="100" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="sans-serif">iPad</text>
        <rect x="252" y="115" width="66" height="40" rx="4" fill="rgba(198,241,53,0.06)" />
        <text x="285" y="135" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">$289</text>
        <text x="285" y="148" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="5" fontFamily="sans-serif">Instant offer</text>
        {/* Small MacBook outline */}
        <rect x="228" y="210" width="100" height="60" rx="4" fill="#222" stroke="#333" strokeWidth="1" />
        <rect x="232" y="213" width="92" height="48" rx="2" fill="url(#phone-screen)" />
        <rect x="260" y="207" width="32" height="5" rx="2" fill="#222" />
        <text x="278" y="233" textAnchor="middle" fill="white" fontSize="6" fontWeight="600" fontFamily="sans-serif">MacBook</text>
        <text x="278" y="248" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="sans-serif">$694</text>
      </svg>

      {/* Condition badges */}
      {floatBadges.map((badge, i) => (
        <motion.div
          key={badge.label}
          className="absolute z-10"
          style={{ left: badge.x, top: badge.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{ delay: badge.delay, duration: 0.5, ease: easeOut, y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: badge.delay } }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-ink text-[11px] font-semibold shadow-lg shadow-ink/5 ring-1 ring-ink/5">
            <span className={`w-1.5 h-1.5 rounded-full ${badge.color}`} />
            {badge.label}
          </span>
        </motion.div>
      ))}

      {/* Stat badges */}
      {statBadges.map((badge, i) => (
        <motion.div
          key={badge.label}
          className="absolute z-10"
          style={{ left: badge.x, top: badge.y }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
          transition={{ delay: badge.delay, duration: 0.5, ease: easeOut, y: { duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: badge.delay } }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink/80 backdrop-blur-sm text-white text-[10px] font-semibold shadow-lg shadow-ink/10 ring-1 ring-white/10">
            <span className="w-1 h-1 rounded-full bg-lime" />
            {badge.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative bg-cream min-h-[85vh] flex items-center overflow-hidden isolate">
      {/* Pulsing blur orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-orange/40 blur-[100px]"
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: "10%", top: "15%" }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-lime/30 blur-[120px]"
          animate={{
            x: [0, -60, 60, 0],
            y: [0, 50, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ right: "10%", bottom: "10%" }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full bg-orange/25 blur-[80px]"
          animate={{
            x: [0, -40, 50, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: "40%", top: "30%" }}
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 py-20 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT - Text */}
          <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            {/* Badge */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={badgeReveal}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-ink text-lime px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] shadow-lg shadow-ink/10">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                Premium Buyback · Trusted by 20K+
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="mt-10">
              {["Turn tech", "into more"].map((word, i) => (
                <motion.span
                  key={word}
                  className={`block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.85] tracking-[-0.03em] mt-1 font-heading ${word === "into more" ? "" : "text-ink"}`}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  variants={lineReveal}
                >
                  {word === "Turn tech" ? (
                    <span className="whitespace-nowrap">Turn tech</span>
                  ) : word === "into more" ? (
                    <span className="text-orange italic font-normal whitespace-nowrap font-display">
                      into more
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </h1>

            {/* Description */}
            <motion.p
              className="mt-6 text-base sm:text-lg text-ink-muted max-w-md leading-relaxed"
              initial="hidden"
              animate="visible"
              variants={descReveal}
            >
              Get a premium instant offer for your used electronics. Fast hassle-free payment and no hidden fees.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center lg:items-start gap-4"
              initial="hidden"
              animate="visible"
              variants={ctaReveal}
            >
              <Link
                href="/sell"
                className="group relative inline-flex items-center justify-center h-14 px-10 rounded-md bg-lime text-ink font-bold uppercase tracking-wide overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-lime/30 text-sm"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-lime via-lime to-lime" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-ink/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center gap-3">
                  Get Instant Offer
                  <motion.span
                    className="text-lg inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    →
                  </motion.span>
                </span>
              </Link>

              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center h-14 px-10 rounded-md border-2 border-ink/15 text-ink font-bold uppercase tracking-wide overflow-hidden transition-all duration-300 text-sm hover:bg-ink hover:text-white hover:border-ink hover:shadow-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 opacity-0 group-hover:opacity-100" />
                <span className="relative">Contact Us</span>
                <motion.span
                  className="ml-2 inline-block relative"
                  initial={{ x: -4, opacity: 0 }}
                  whileHover={{ x: 2, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT - Illustration */}
          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
            initial="hidden"
            animate="visible"
            variants={rightReveal}
          >
            <DeviceIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
