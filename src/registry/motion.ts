import type { MotionConfigEntry } from "../types.js";

/**
 * 15 ready-to-paste motion/animation configs across Framer Motion, GSAP and CSS.
 * Each entry carries a structured `config` (and `variants` where relevant) plus a
 * complete `code` usage snippet.
 */
export const motionConfigs: MotionConfigEntry[] = [
  {
    id: "fm-page-transition",
    name: "Framer Motion Page Transition (opacity + y)",
    type: "page-transition",
    library: "framer-motion",
    tags: ["page", "route", "transition", "fade", "slide", "AnimatePresence"],
    description:
      "A drop-in page transition that fades and slides content vertically on route change, exit-animated through AnimatePresence.",
    config: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -12 },
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    variants: {
      hidden: { opacity: 0, y: 12 },
      enter: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -12 },
    },
    code: `import { AnimatePresence, motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function PageTransition({ routeKey, children }: { routeKey: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={routeKey}
        variants={pageVariants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}`,
    usage: "Wrap your routed page content; pass the router pathname as routeKey.",
  },
  {
    id: "fm-stagger-children",
    name: "Framer Motion Stagger Children (0.08s)",
    type: "stagger",
    library: "framer-motion",
    tags: ["stagger", "list", "children", "container", "sequence"],
    description:
      "Container + item variants that reveal children one after another with an 0.08s delay between each.",
    config: { staggerChildren: 0.08, delayChildren: 0.1 },
    variants: {
      container: { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } },
      item: {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      },
    },
    code: `import { motion } from "framer-motion";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function StaggerList({ items }: { items: string[] }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="visible">
      {items.map((t) => (
        <motion.li key={t} variants={item}>{t}</motion.li>
      ))}
    </motion.ul>
  );
}`,
    usage: "Put `container` on the parent and `item` on each child; the parent drives timing.",
  },
  {
    id: "gsap-scrolltrigger-text-reveal",
    name: "GSAP ScrollTrigger Text Reveal",
    type: "scroll-reveal",
    library: "gsap",
    tags: ["gsap", "scrolltrigger", "text", "reveal", "scroll", "lines"],
    description:
      "Reveals split lines/words of a heading as it scrolls into view using GSAP + ScrollTrigger.",
    config: {
      from: { yPercent: 110, opacity: 0 },
      to: { yPercent: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.08 },
      scrollTrigger: { start: "top 80%", toggleActions: "play none none reverse" },
    },
    code: `import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollRevealHeading({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-word", {
        yPercent: 110,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <h2 ref={ref} className="flex flex-wrap gap-x-3 overflow-hidden text-5xl font-bold">
      {text.split(" ").map((w, i) => (
        <span key={i} className="reveal-word inline-block">{w}</span>
      ))}
    </h2>
  );
}`,
    usage: "npm i gsap. Wrap words in .reveal-word spans; gsap.context auto-cleans on unmount.",
  },
  {
    id: "css-ease-out-expo",
    name: "CSS Easing Preset — ease-out-expo",
    type: "entrance",
    library: "css",
    tags: ["css", "easing", "cubic-bezier", "expo", "preset"],
    description:
      "The signature 'expo out' curve — fast start, long graceful settle. Great for entrances and reveals.",
    config: { cubicBezier: [0.16, 1, 0.3, 1], css: "cubic-bezier(0.16, 1, 0.3, 1)" },
    code: `/* Tailwind arbitrary value */
/* className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" */

:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal {
  transition: transform 700ms var(--ease-out-expo), opacity 700ms var(--ease-out-expo);
}`,
    usage: "Use for enter/reveal motion where you want a punchy start and soft landing.",
  },
  {
    id: "css-ease-in-out-quart",
    name: "CSS Easing Preset — ease-in-out-quart",
    type: "hover",
    library: "css",
    tags: ["css", "easing", "cubic-bezier", "quart", "preset", "smooth"],
    description:
      "A balanced in-out quart curve — smooth acceleration and deceleration, ideal for hovers and toggles.",
    config: { cubicBezier: [0.76, 0, 0.24, 1], css: "cubic-bezier(0.76, 0, 0.24, 1)" },
    code: `/* Tailwind arbitrary value */
/* className="transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" */

:root {
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
}
.toggle {
  transition: all 500ms var(--ease-in-out-quart);
}`,
    usage: "Use for symmetric motion: hover states, accordions, clip-path wipes.",
  },
  {
    id: "css-spring-like",
    name: "CSS Easing Preset — spring-like overshoot",
    type: "entrance",
    library: "css",
    tags: ["css", "easing", "cubic-bezier", "spring", "overshoot", "bounce"],
    description:
      "A cubic-bezier that overshoots past 1 for a springy, bouncy settle without a JS spring.",
    config: { cubicBezier: [0.34, 1.56, 0.64, 1], css: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    code: `/* Tailwind arbitrary value */
/* className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" */

:root {
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop {
  transition: transform 500ms var(--ease-spring);
}
.pop:hover { transform: scale(1.05); }`,
    usage: "Use for playful pops — buttons, badges, popovers — where a little overshoot adds life.",
  },
  {
    id: "fm-magnetic-hover",
    name: "Framer Motion Magnetic Hover",
    type: "magnetic",
    library: "framer-motion",
    tags: ["magnetic", "hover", "useMotionValue", "useSpring", "pointer", "follow"],
    description:
      "A reusable magnetic wrapper that pulls its child toward the cursor with spring smoothing.",
    config: { spring: { stiffness: 150, damping: 15, mass: 0.1 }, strength: 0.4 },
    code: `import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Magnetic({ children, strength = 0.4 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className="inline-block"
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}`,
    usage: "Wrap buttons/links: <Magnetic><button>…</button></Magnetic>. Tune strength 0.2–0.6.",
  },
  {
    id: "fm-shared-layout",
    name: "Framer Motion Shared Layout Transition",
    type: "hover",
    library: "framer-motion",
    tags: ["layout", "layoutId", "shared", "indicator", "morph", "tabs"],
    description:
      "Uses a shared layoutId so an element (pill/underline/highlight) animates smoothly between positions.",
    config: { layoutId: "active-indicator", transition: { type: "spring", stiffness: 380, damping: 32 } },
    code: `import { motion } from "framer-motion";
import { useState } from "react";

export function SegmentedControl({ options }: { options: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex gap-1 rounded-full bg-neutral-900 p-1">
      {options.map((o, i) => (
        <button key={o} onClick={() => setActive(i)} className="relative rounded-full px-4 py-2 text-sm">
          {active === i && (
            <motion.span
              layoutId="active-indicator"
              className="absolute inset-0 rounded-full bg-white"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          <span className={active === i ? "relative text-neutral-950" : "relative text-white/60"}>{o}</span>
        </button>
      ))}
    </div>
  );
}`,
    usage: "Give the moving element the same layoutId across states; Framer interpolates position/size.",
  },
  {
    id: "fm-entrance-variants",
    name: "Framer Motion Entrance Variants (fadeUp / fadeIn / scaleIn / slideLeft)",
    type: "entrance",
    library: "framer-motion",
    tags: ["entrance", "variants", "fade", "scale", "slide", "library"],
    description:
      "A small library of named entrance variants you can spread onto any motion element.",
    config: { defaultTransition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    variants: {
      fadeUp: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
      fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
      scaleIn: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
      slideLeft: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    },
    code: `import { motion } from "framer-motion";

export const variants = {
  fadeUp: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  scaleIn: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  slideLeft: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
};

export function Reveal({ name, children }: { name: keyof typeof variants; children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants[name]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}`,
    usage: 'Pick a variant by name: <Reveal name="fadeUp">…</Reveal>.',
  },
  {
    id: "fm-scroll-progress-bar",
    name: "Framer Motion Scroll Progress Bar",
    type: "scroll-reveal",
    library: "framer-motion",
    tags: ["scroll", "progress", "bar", "useScroll", "useSpring", "indicator"],
    description:
      "A top reading-progress bar driven by useScroll, with spring smoothing via scaleX.",
    config: { spring: { stiffness: 100, damping: 30, restDelta: 0.001 }, transformOrigin: "0%" },
    code: `import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-emerald-400"
    />
  );
}`,
    usage: "Mount once near the page root; scaleX animates from 0→1 as the page scrolls.",
  },
  {
    id: "gsap-horizontal-scroll",
    name: "GSAP Smooth Horizontal Scroll",
    type: "scroll-reveal",
    library: "gsap",
    tags: ["gsap", "scrolltrigger", "horizontal", "pin", "scrub", "panels"],
    description:
      "Pins a section and translates a horizontal track of panels using a scrubbed ScrollTrigger.",
    config: {
      xPercent: -100,
      ease: "none",
      scrollTrigger: { pin: true, scrub: 1, end: "+=3000" },
    },
    code: `import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalScroll({ panels }: { panels: string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const total = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -total,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + total,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="overflow-hidden">
      <div ref={track} className="flex">
        {panels.map((p) => (
          <div key={p} className="flex h-screen w-screen shrink-0 items-center justify-center text-6xl">
            {p}
          </div>
        ))}
      </div>
    </section>
  );
}`,
    usage: "npm i gsap. The end is computed from the track width so it pins for exactly its overflow.",
  },
  {
    id: "css-keyframes-shimmer",
    name: "CSS @keyframes — shimmer",
    type: "scroll-reveal",
    library: "css",
    tags: ["css", "keyframes", "shimmer", "skeleton", "loading"],
    description: "A sweeping highlight keyframe for skeleton loaders.",
    config: { name: "shimmer", duration: "1.6s", timing: "linear", iteration: "infinite" },
    code: `@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* Apply to an absolutely-positioned gradient bar that starts at -100% */
.shimmer-bar {
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shimmer 1.6s infinite;
}

/* Tailwind: [animation:shimmer_1.6s_infinite] on the bar, -translate-x-full to start */`,
    usage: "Place a .shimmer-bar inside an overflow-hidden placeholder block.",
  },
  {
    id: "css-keyframes-float",
    name: "CSS @keyframes — float",
    type: "hover",
    library: "css",
    tags: ["css", "keyframes", "float", "bob", "ambient", "idle"],
    description: "A gentle vertical bob for idle/ambient motion on cards, icons or mockups.",
    config: { name: "float", duration: "6s", timing: "ease-in-out", iteration: "infinite" },
    code: `@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.float {
  animation: float 6s ease-in-out infinite;
}

/* Tailwind arbitrary: className="[animation:float_6s_ease-in-out_infinite]" */`,
    usage: "Apply to hero mockups or floating badges for subtle life. Pair with a small rotation for variety.",
  },
  {
    id: "css-keyframes-pulse-glow",
    name: "CSS @keyframes — pulse-glow",
    type: "hover",
    library: "css",
    tags: ["css", "keyframes", "pulse", "glow", "shadow", "accent"],
    description: "A pulsing box-shadow glow for live indicators, CTAs or status dots.",
    config: { name: "pulse-glow", duration: "2s", timing: "ease-in-out", iteration: "infinite" },
    code: `@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
  50% { box-shadow: 0 0 24px 6px rgba(16,185,129,0.35); }
}

.pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Tailwind arbitrary: className="[animation:pulse-glow_2s_ease-in-out_infinite]" */`,
    usage: "Apply to a 'live' dot, a primary CTA, or an active status chip.",
  },
  {
    id: "fm-hover-spring",
    name: "Framer Motion Hover Spring (whileHover/whileTap)",
    type: "hover",
    library: "framer-motion",
    tags: ["hover", "tap", "spring", "scale", "button", "interaction"],
    description:
      "A tactile button interaction: springy scale-up on hover and scale-down on press.",
    config: {
      whileHover: { scale: 1.04 },
      whileTap: { scale: 0.96 },
      transition: { type: "spring", stiffness: 400, damping: 17 },
    },
    code: `import { motion } from "framer-motion";

export function SpringButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="rounded-full bg-white px-6 py-3 font-medium text-neutral-950"
    >
      {children}
    </motion.button>
  );
}`,
    usage: "Drop onto any clickable; the spring gives instant, physical feedback on hover and tap.",
  },
];
