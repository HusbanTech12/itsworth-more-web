"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "CNBC", src: "https://www.vectorlogo.zone/logos/cnbc/cnbc-ar21.svg" },
  { name: "USA Today", src: "https://upload.wikimedia.org/wikipedia/commons/f/fe/USA_Today_%282020-01-29%29.svg" },
  { name: "ZDNet", src: "https://upload.wikimedia.org/wikipedia/commons/7/72/ZDNet_Logo.svg" },
  { name: "CNET", src: "https://upload.wikimedia.org/wikipedia/commons/9/95/Cnet-logo-red-2020.svg" },
  { name: "PCWorld", src: "https://upload.wikimedia.org/wikipedia/commons/0/07/PC_World_logo.svg" },
  { name: "LA Times", src: "https://upload.wikimedia.org/wikipedia/commons/b/be/Los_Angeles_Times.svg" },
];

export function AsSeenOn() {
  return (
    <section className="border-t border-white/5 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-orange mb-8"
        >
          As featured on
        </motion.p>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <img
                key={`${logo.name}-${i}`}
                src={logo.src}
                alt={logo.name}
                className="h-7 sm:h-8 w-auto opacity-40 shrink-0"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
