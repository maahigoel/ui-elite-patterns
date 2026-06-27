import type { RegistryEntry } from "../types.js";

/**
 * 30 curated UI patterns spanning clean → elevated → insane complexity.
 * Every `code` field is a complete, standalone, copy-pasteable React/TSX component.
 */
export const patterns: RegistryEntry[] = [
  // ───────────────────────────── INSANE ─────────────────────────────
  {
    id: "magnetic-cursor",
    name: "Magnetic Cursor + Magnetic Buttons",
    tags: ["cursor", "magnetic", "spring", "pointer", "follow", "interaction", "hover"],
    complexity: "insane",
    framework: ["react"],
    interaction: "hover",
    description:
      "A custom cursor dot that springs after the pointer and grows over interactive targets, paired with buttons that are magnetically pulled toward the cursor while hovered.",
    implementation_notes:
      "Two pieces: (1) <Magnetic> wraps any element and translates it toward the pointer using getBoundingClientRect to find the element center, driven by useMotionValue + useSpring. (2) <CustomCursor> tracks window mousemove into spring-smoothed motion values and scales up when the pointer is over any element with [data-magnetic]. Set `cursor-none` on the container and `mix-blend-difference` so the dot reads on any background. For a *repel* variant, invert the sign of the offset (push elements away from the cursor instead of toward it).",
    code: `import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Pulls its child toward the cursor while hovered. */
function Magnetic({ children, strength = 0.4 }: { children: React.ReactNode; strength?: number }) {
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
}

/** A spring-following cursor dot that grows over [data-magnetic] targets. */
function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) =>
      setActive(!!(e.target as HTMLElement).closest("[data-magnetic]"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  return (
    <motion.div
      style={{ left: sx, top: sy }}
      animate={{ scale: active ? 2.5 : 1, opacity: active ? 0.4 : 1 }}
      className="pointer-events-none fixed z-50 -ml-2 -mt-2 h-4 w-4 rounded-full bg-white mix-blend-difference"
    />
  );
}

export default function MagneticCursorDemo() {
  return (
    <div className="relative flex min-h-screen cursor-none items-center justify-center gap-6 bg-neutral-950">
      <CustomCursor />
      <Magnetic strength={0.5}>
        <button data-magnetic className="rounded-full bg-white px-8 py-4 font-medium text-neutral-950">
          Get started
        </button>
      </Magnetic>
      <Magnetic strength={0.5}>
        <button data-magnetic className="rounded-full border border-white/30 px-8 py-4 font-medium text-white">
          Learn more
        </button>
      </Magnetic>
    </div>
  );
}`,
    tailwind:
      "cursor-none, pointer-events-none, fixed, z-50, mix-blend-difference, rounded-full, inline-block",
    motion: {
      library: "framer-motion",
      config: { stiffness: 150, damping: 15, mass: 0.1 },
      variants: {
        cursor: { spring: { stiffness: 500, damping: 40, mass: 0.3 } },
      },
    },
    sources: ["aceternity", "godly", "olivier-larose"],
  },
  {
    id: "scroll-jacked-horizontal",
    name: "Scroll-Jacked Horizontal Section",
    tags: ["scroll", "horizontal", "pin", "sticky", "useScroll", "useTransform", "gallery"],
    complexity: "insane",
    framework: ["react"],
    interaction: "scroll",
    description:
      "A vertically tall section that pins to the viewport and translates a horizontal track of panels sideways as the user scrolls — the classic 'scroll hijack' gallery.",
    implementation_notes:
      "Give the outer <section> a tall height (e.g. h-[400vh]) and a sticky inner viewport (sticky top-0 h-screen overflow-hidden). useScroll({ target }) maps section progress 0→1, and useTransform converts that into an x translate of the flex track. Tune the end value ('-75%') to (numberOfPanels - 1) / numberOfPanels * 100 so the last panel lands flush.",
    code: `import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const panels = ["01 / Strategy", "02 / Design", "03 / Build", "04 / Launch"];

export default function HorizontalScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  // Move the track from 0% to -75% across the tall section (4 panels).
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-neutral-950">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 px-8">
          {panels.map((p) => (
            <div
              key={p}
              className="flex h-[70vh] w-[80vw] shrink-0 items-end rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-10 md:w-[60vw]"
            >
              <span className="text-5xl font-semibold text-white">{p}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}`,
    tailwind: "h-[400vh], sticky, top-0, h-screen, overflow-hidden, shrink-0, w-[80vw]",
    motion: {
      library: "framer-motion",
      config: { input: [0, 1], output: ["0%", "-75%"], source: "scrollYProgress" },
    },
    sources: ["godly", "aceternity", "studio-freight"],
  },
  {
    id: "particle-dot-grid",
    name: "Reactive Particle Dot Grid",
    tags: ["canvas", "particles", "background", "mouse", "grid", "interactive", "ambient"],
    complexity: "insane",
    framework: ["react"],
    interaction: "ambient",
    description:
      "A full-bleed canvas grid of dots that push away from the cursor and brighten based on proximity, running on a requestAnimationFrame loop with devicePixelRatio scaling.",
    implementation_notes:
      "Build the dot grid once on mount (and on resize) at GAP spacing. Each frame, compute distance from the cursor; a normalized force = max(0, 1 - dist/RADIUS) drives both an outward offset and the dot's radius/alpha. Scale the context by devicePixelRatio for crisp dots on retina. Always cancelAnimationFrame and remove listeners on cleanup to avoid leaks.",
    code: `import { useEffect, useRef } from "react";

export default function DotGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const GAP = 32;
    const RADIUS = 140; // cursor influence radius in px
    let dots: { x: number; y: number }[] = [];

    const build = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let x = GAP; x < canvas.offsetWidth; x += GAP)
        for (let y = GAP; y < canvas.offsetHeight; y += GAP) dots.push({ x, y });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - dist / RADIUS);
        const ox = (dx / (dist || 1)) * force * 12; // push away from cursor
        const oy = (dy / (dist || 1)) * force * 12;
        const r = 1 + force * 2.5;
        ctx.beginPath();
        ctx.arc(d.x + ox, d.y + oy, r, 0, Math.PI * 2);
        ctx.fillStyle = \`rgba(255,255,255,\${0.12 + force * 0.8})\`;
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    build();
    render();
    window.addEventListener("resize", build);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="relative h-screen w-full bg-neutral-950">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none relative z-10 flex h-full items-center justify-center">
        <h1 className="text-6xl font-bold text-white">Move your cursor</h1>
      </div>
    </div>
  );
}`,
    tailwind: "absolute, inset-0, h-full, w-full, pointer-events-none, relative, z-10",
    sources: ["godly", "aceternity", "refero"],
  },
  {
    id: "clip-path-page-transition",
    name: "Clip-Path Wipe Page Transition",
    tags: ["transition", "page", "clip-path", "wipe", "route", "AnimatePresence"],
    complexity: "insane",
    framework: ["react"],
    interaction: "entrance",
    description:
      "Pages wipe in and out using an animated clip-path inset, creating a clean directional reveal instead of a plain fade.",
    implementation_notes:
      "Wrap the keyed section in <AnimatePresence mode='wait'> so the exit completes before the next enters. Animate clipPath from inset(0 0 100% 0) → inset(0 0 0 0) on enter and to inset(100% 0 0 0) on exit. The cubic-bezier [0.76,0,0.24,1] gives the signature 'expo' wipe. In a real app, key on the router pathname.",
    code: `import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const pages: Record<string, string> = {
  home: "Home",
  work: "Selected Work",
  about: "About",
};

export default function ClipPathPageTransition() {
  const [page, setPage] = useState("home");

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white">
      <nav className="flex gap-6 p-6">
        {Object.keys(pages).map((key) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className="text-sm uppercase tracking-wide text-white/60 hover:text-white"
          >
            {key}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.section
          key={page}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(100% 0 0 0)" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="flex h-[70vh] items-center justify-center"
        >
          <h1 className="text-7xl font-semibold">{pages[page]}</h1>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}`,
    tailwind: "relative, min-h-screen, flex, items-center, justify-center",
    motion: {
      library: "framer-motion",
      config: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
      variants: {
        initial: { clipPath: "inset(0 0 100% 0)" },
        animate: { clipPath: "inset(0 0 0% 0)" },
        exit: { clipPath: "inset(100% 0 0 0)" },
      },
    },
    sources: ["godly", "studio-freight", "olivier-larose"],
  },
  {
    id: "text-scramble-reveal",
    name: "Text Scramble Reveal on Scroll",
    tags: ["text", "scramble", "decode", "scroll", "reveal", "monospace", "raf"],
    complexity: "insane",
    framework: ["react"],
    interaction: "scroll",
    description:
      "A headline that 'decodes' itself character-by-character — each glyph cycles through random symbols before settling on the final letter when it scrolls into view.",
    implementation_notes:
      "useScramble drives a requestAnimationFrame loop: each character gets a random start/end frame; before its start it shows a 'from' glyph, between start and end it flickers random chars (30% chance per frame), and after its end it locks to the target. An IntersectionObserver flips `visible` true the first time the heading enters the viewport. A monospace font keeps width stable while characters change.",
    code: `import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_/[]{}=+*^?#@$%&";

function useScramble(text: string, start: boolean, speed = 1) {
  const [output, setOutput] = useState(text.replace(/./g, " "));

  useEffect(() => {
    if (!start) return;
    let frame = 0;
    let raf = 0;
    const queue = text.split("").map((to) => ({
      to,
      from: CHARS[Math.floor(Math.random() * CHARS.length)],
      begin: Math.floor(Math.random() * 20),
      end: Math.floor(Math.random() * 20) + 20,
    }));

    const tick = () => {
      let out = "";
      let done = 0;
      for (const q of queue) {
        if (frame >= q.end) {
          out += q.to;
          done++;
        } else if (frame >= q.begin) {
          out += Math.random() < 0.3 ? CHARS[Math.floor(Math.random() * CHARS.length)] : q.to;
        } else {
          out += q.from;
        }
      }
      setOutput(out);
      if (done < queue.length) {
        frame += speed;
        raf = requestAnimationFrame(tick);
      }
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [text, start, speed]);

  return output;
}

export default function ScrambleReveal() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), {
      threshold: 0.6,
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const text = useScramble("DESIGN ENGINEERING", visible);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <h1
        ref={ref}
        className="font-mono text-5xl font-bold tracking-tight text-emerald-400 md:text-7xl"
      >
        {text}
      </h1>
    </div>
  );
}`,
    tailwind: "font-mono, text-5xl, md:text-7xl, font-bold, tracking-tight, text-emerald-400",
    sources: ["aceternity", "godly", "hover.dev"],
  },
  {
    id: "tilt-card-shine",
    name: "3D Tilt Card with Shine Overlay",
    tags: ["card", "tilt", "3d", "perspective", "shine", "hover", "gradient"],
    complexity: "insane",
    framework: ["react"],
    interaction: "hover",
    description:
      "A card that tilts in 3D toward the cursor with a moving radial 'shine' highlight that tracks the pointer position.",
    implementation_notes:
      "Set [perspective:1200px] on the parent and [transform-style:preserve-3d] on the card. Map normalized pointer position (0–1) to rotateX / rotateY (invert rotateX so the top tilts toward the cursor). A second absolutely-positioned layer renders a radial-gradient whose center follows the pointer (mx%, my%) for the shine. Reset to center on mouse leave with a short transition.",
    code: `import { useRef, useState } from "react";

export default function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setS({ rx: (py - 0.5) * -16, ry: (px - 0.5) * 16, mx: px * 100, my: py * 100 });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 [perspective:1200px]">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setS({ rx: 0, ry: 0, mx: 50, my: 50 })}
        style={{
          transform: \`rotateX(\${s.rx}deg) rotateY(\${s.ry}deg)\`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative h-80 w-72 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800 to-neutral-900 [transform-style:preserve-3d]"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: \`radial-gradient(circle at \${s.mx}% \${s.my}%, rgba(255,255,255,0.25), transparent 45%)\`,
          }}
        />
        <div className="absolute bottom-0 p-6">
          <h3 className="text-xl font-semibold text-white">Aurora</h3>
          <p className="mt-1 text-sm text-white/60">Tilt me with your cursor</p>
        </div>
      </div>
    </div>
  );
}`,
    tailwind:
      "[perspective:1200px], [transform-style:preserve-3d], overflow-hidden, rounded-2xl, pointer-events-none",
    sources: ["aceternity", "godly", "mobbin"],
  },
  {
    id: "infinite-marquee",
    name: "Infinite Marquee with Pause on Hover",
    tags: ["marquee", "ticker", "loop", "scroll", "logos", "hover", "css-animation"],
    complexity: "insane",
    framework: ["react"],
    interaction: "ambient",
    description:
      "A seamless, infinitely looping horizontal marquee that pauses when hovered — perfect for logo walls and tech stacks.",
    implementation_notes:
      "Render the content twice side by side; animate translateX to -100% minus one gap so the second copy lines up exactly where the first started, making the loop seamless. animation-play-state: paused on group hover stops it. Mark the duplicate aria-hidden so screen readers don't read it twice. The keyframes are injected via a scoped <style> tag so the snippet is fully self-contained.",
    code: `export default function Marquee() {
  const items = ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "GSAP", "Three.js"];
  return (
    <div className="group flex overflow-hidden bg-neutral-950 py-10 [--gap:2.5rem] [gap:var(--gap)]">
      <style>{\`
        @keyframes marquee { to { transform: translateX(calc(-100% - var(--gap))); } }
        .marquee-track { animation: marquee 18s linear infinite; }
        .group:hover .marquee-track { animation-play-state: paused; }
      \`}</style>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className="marquee-track flex shrink-0 items-center [gap:var(--gap)] pr-[var(--gap)]"
        >
          {items.map((t) => (
            <span key={t} className="text-3xl font-semibold text-white/80">
              {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}`,
    tailwind: "group, overflow-hidden, shrink-0, [--gap:2.5rem], [gap:var(--gap)], pr-[var(--gap)]",
    motion: {
      library: "css",
      config: { animation: "marquee 18s linear infinite", pauseOn: "group-hover" },
    },
    sources: ["aceternity", "godly", "tailwindui"],
  },
  {
    id: "noise-grain-overlay",
    name: "Noise / Grain Texture Overlay",
    tags: ["noise", "grain", "texture", "overlay", "svg", "feTurbulence", "hero"],
    complexity: "insane",
    framework: ["react", "html"],
    interaction: "ambient",
    description:
      "A subtle film-grain overlay generated entirely in SVG with feTurbulence — no image assets — layered over a hero with mix-blend-overlay.",
    implementation_notes:
      "An absolutely-positioned full-bleed <svg> with a fractalNoise feTurbulence filter painted onto a <rect>. Keep opacity very low (~0.1–0.15) and use mix-blend-overlay so the grain modulates the underlying color rather than greying it out. pointer-events-none so it never blocks interaction. Raise baseFrequency for finer grain.",
    code: `export default function GrainHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-neutral-950 to-black">
      <h1 className="relative z-10 text-7xl font-bold text-white">Texture.</h1>
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </section>
  );
}`,
    tailwind: "relative, overflow-hidden, pointer-events-none, absolute, inset-0, opacity-[0.12], mix-blend-overlay",
    sources: ["godly", "refero", "aceternity"],
  },
  {
    id: "lenis-smooth-scroll-progress",
    name: "Lenis Smooth Scroll + Progress Bar",
    tags: ["scroll", "smooth", "lenis", "progress", "indicator", "inertia"],
    complexity: "insane",
    framework: ["react"],
    interaction: "scroll",
    description:
      "Buttery inertia-based smooth scrolling via Lenis, with a fixed top progress bar that fills as you move through the page.",
    implementation_notes:
      "Requires `npm i lenis`. Instantiate Lenis once in an effect and drive it from a requestAnimationFrame loop. Subscribe to its 'scroll' event to read { scroll, limit } and derive 0–1 progress. Always lenis.destroy() and cancel the rAF on cleanup. The bar uses origin-left + width% (transform-scaleX is also fine and cheaper to animate).",
    code: `import { useEffect, useState } from "react";
import Lenis from "lenis";

export default function SmoothScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      setProgress(limit > 0 ? scroll / limit : 0);
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-neutral-950 text-white">
      <div
        className="fixed left-0 top-0 z-50 h-1 origin-left bg-emerald-400"
        style={{ width: \`\${progress * 100}%\` }}
      />
      {["Intro", "Work", "About", "Contact"].map((s) => (
        <section key={s} className="flex h-screen items-center justify-center text-6xl font-semibold">
          {s}
        </section>
      ))}
    </div>
  );
}`,
    tailwind: "fixed, left-0, top-0, z-50, h-1, origin-left, bg-emerald-400",
    motion: {
      library: "framer-motion",
      config: { lenis: { duration: 1.2, smoothWheel: true } },
    },
    sources: ["studio-freight", "godly", "lenis"],
  },
  {
    id: "split-text-stagger",
    name: "Split Text Entrance (Per-Character Stagger)",
    tags: ["text", "split", "stagger", "entrance", "reveal", "mask", "characters"],
    complexity: "insane",
    framework: ["react"],
    interaction: "entrance",
    description:
      "A headline whose characters rise into place one after another from behind a mask, using Framer Motion variant staggering.",
    implementation_notes:
      "Split the text into words (kept on one line via inline-flex + overflow-hidden mask) and then characters. The parent <motion.h1> holds a container variant with staggerChildren; each character is a child variant animating y from 110% → 0% behind the per-word overflow-hidden mask. The [0.22,1,0.36,1] ease is the 'easeOutQuint'-style curve that makes the rise feel premium.",
    code: `import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const child = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function SplitTextReveal() {
  const text = "We build the future";
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <motion.h1
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center text-5xl font-bold text-white md:text-7xl"
      >
        {text.split(" ").map((word, wi) => (
          <span key={wi} className="mr-4 inline-flex overflow-hidden">
            {word.split("").map((char, ci) => (
              <motion.span key={ci} variants={child} className="inline-block">
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.h1>
    </div>
  );
}`,
    tailwind: "flex, flex-wrap, inline-flex, overflow-hidden, inline-block, mr-4",
    motion: {
      library: "framer-motion",
      config: { staggerChildren: 0.04, delayChildren: 0.1 },
      variants: {
        hidden: { y: "110%" },
        visible: { y: "0%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      },
    },
    sources: ["aceternity", "godly", "olivier-larose"],
  },

  // ──────────────────────────── ELEVATED ────────────────────────────
  {
    id: "morphing-sticky-nav",
    name: "Morphing Sticky Nav (Blur on Scroll)",
    tags: ["nav", "sticky", "scroll", "blur", "morph", "glass", "header"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "nav",
    interaction: "scroll",
    description:
      "A floating navbar that contracts into a rounded, blurred glass pill once the page scrolls, then expands back to full width at the top.",
    implementation_notes:
      "Track window.scrollY past a threshold to toggle a `scrolled` flag. Swap the className set with a long transition-all duration so width, padding, radius, border and backdrop-blur all interpolate together. Keep the nav fixed and centered (flex justify-center) so the max-width change reads as a morph. Use a class-array + join(' ') instead of template strings for readable conditional styling.",
    code: `import { useEffect, useState } from "react";

export default function MorphingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-[200vh] bg-neutral-950">
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={[
            "flex items-center justify-between gap-8 transition-all duration-500 ease-out",
            scrolled
              ? "w-full max-w-3xl rounded-full border border-white/10 bg-white/10 px-6 py-3 backdrop-blur-xl"
              : "w-full max-w-6xl rounded-2xl border border-transparent bg-transparent px-2 py-4",
          ].join(" ")}
        >
          <span className="font-semibold text-white">Orbit</span>
          <div className="hidden gap-6 text-sm text-white/70 sm:flex">
            <a href="#" className="hover:text-white">Product</a>
            <a href="#" className="hover:text-white">Pricing</a>
            <a href="#" className="hover:text-white">Docs</a>
          </div>
          <button className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-neutral-950">
            Sign in
          </button>
        </nav>
      </header>
    </div>
  );
}`,
    tailwind: "fixed, inset-x-0, top-0, z-50, transition-all, duration-500, backdrop-blur-xl, bg-white/10",
    sources: ["aceternity", "vercel", "linear"],
  },
  {
    id: "spring-modal-blur",
    name: "Spring Modal with Backdrop Blur",
    tags: ["modal", "dialog", "spring", "backdrop", "blur", "overlay", "AnimatePresence"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "modal",
    interaction: "entrance",
    description:
      "A dialog that springs in with scale + lift while the page behind it blurs and dims; click-outside and Escape friendly structure.",
    implementation_notes:
      "Wrap in <AnimatePresence> so exit animations run. The backdrop fades opacity and applies backdrop-blur-sm; the panel uses a spring transition on scale/y/opacity. stopPropagation on the panel so clicking it doesn't close, while clicking the backdrop calls onClose. Add a keydown Escape listener in a real implementation and trap focus for accessibility.",
    code: `import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function SpringModal() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-white px-5 py-2.5 font-medium text-neutral-950"
      >
        Open modal
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
            >
              <h2 className="text-lg font-semibold text-white">Confirm action</h2>
              <p className="mt-2 text-sm text-white/60">
                This spring-loaded dialog blurs everything behind it.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`,
    tailwind: "fixed, inset-0, z-50, bg-black/40, backdrop-blur-sm, rounded-2xl, shadow-2xl",
    motion: {
      library: "framer-motion",
      config: { type: "spring", stiffness: 320, damping: 28 },
      variants: {
        initial: { scale: 0.9, y: 20, opacity: 0 },
        animate: { scale: 1, y: 0, opacity: 1 },
        exit: { scale: 0.95, y: 10, opacity: 0 },
      },
    },
    sources: ["aceternity", "vaul", "radix"],
  },
  {
    id: "bento-grid",
    name: "Bento Grid with Hover Lift",
    tags: ["bento", "grid", "card", "layout", "hover", "lift", "dashboard"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "card",
    interaction: "hover",
    description:
      "An asymmetric 'bento box' grid where cells span different rows/columns and lift with a subtle glow on hover.",
    implementation_notes:
      "Use grid-cols + auto-rows with a fixed row height, then let featured cells span via col-span / row-span utilities. On hover, translate the card up slightly, brighten the border and add a colored shadow; a gradient overlay layer fades in for extra depth. group/group-hover coordinates the inner overlay.",
    code: `export default function BentoGrid() {
  const cells = [
    { t: "Analytics", d: "Real-time insights", c: "md:col-span-2 md:row-span-2" },
    { t: "Speed", d: "Edge-fast delivery", c: "" },
    { t: "Secure", d: "SOC2 ready", c: "" },
    { t: "Integrations", d: "120+ apps", c: "md:col-span-2" },
  ];
  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="mx-auto grid max-w-4xl auto-rows-[160px] grid-cols-1 gap-4 md:grid-cols-3">
        {cells.map((cell) => (
          <div
            key={cell.t}
            className={[
              "group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-6",
              "transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/10",
              cell.c,
            ].join(" ")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent transition-all duration-300 group-hover:to-emerald-500/10" />
            <h3 className="relative text-lg font-semibold text-white">{cell.t}</h3>
            <p className="relative mt-1 text-sm text-white/50">{cell.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    tailwind: "grid, auto-rows-[160px], md:col-span-2, md:row-span-2, group, hover:-translate-y-1",
    sources: ["aceternity", "vercel", "linear"],
  },
  {
    id: "floating-label-input",
    name: "Floating Label Input with Animated Border",
    tags: ["input", "form", "floating-label", "border", "focus", "field"],
    complexity: "elevated",
    framework: ["react"],
    interaction: "hover",
    description:
      "A text field whose label floats up and shrinks when focused or filled, while the border animates to an accent color.",
    implementation_notes:
      "Track focus and value to derive an `active` state. The label is absolutely positioned and transitions top/size/color; the input adds top padding so the floated label has room. The border color transitions on focus. (You can also do label floating purely with Tailwind's peer-focus / peer-[:not(:placeholder-shown)] variants if you set a placeholder of ' '.)",
    code: `import { useState } from "react";

export default function FloatingLabelInput() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="relative w-80">
        <input
          id="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl border border-white/15 bg-transparent px-4 pb-2 pt-5 text-white outline-none transition-colors focus:border-emerald-400"
        />
        <label
          htmlFor="email"
          className={[
            "pointer-events-none absolute left-4 origin-left transition-all duration-200",
            active ? "top-2 text-xs text-emerald-400" : "top-4 text-base text-white/50",
          ].join(" ")}
        >
          Email address
        </label>
      </div>
    </div>
  );
}`,
    tailwind: "relative, pointer-events-none, absolute, transition-all, focus:border-emerald-400, pt-5",
    sources: ["mobbin", "material", "tailwindui"],
  },
  {
    id: "skeleton-shimmer",
    name: "Skeleton Loader with Shimmer",
    tags: ["skeleton", "loader", "shimmer", "loading", "placeholder", "pulse"],
    complexity: "elevated",
    framework: ["react", "html"],
    componentType: "loader",
    interaction: "ambient",
    description:
      "Content placeholders with a moving light sweep that signals loading, built from a single keyframe and a gradient.",
    implementation_notes:
      "Each placeholder block is overflow-hidden with a faint base fill; an absolutely-positioned gradient bar starts at -translate-x-full and sweeps to translate-x-full on a looping `shimmer` keyframe. Using a Tailwind arbitrary animation ([animation:shimmer_1.6s_infinite]) keeps it inline. The keyframe is injected via a scoped <style> tag so the snippet is standalone.",
    code: `export default function SkeletonCard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <style>{\`@keyframes shimmer { 100% { transform: translateX(100%); } }\`}</style>
      <div className="w-80 rounded-2xl border border-white/10 bg-neutral-900 p-5">
        {["h-40 w-full rounded-xl", "mt-4 h-4 w-3/4 rounded", "mt-3 h-4 w-1/2 rounded"].map(
          (c, i) => (
            <div key={i} className={"relative overflow-hidden bg-white/5 " + c}>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent [animation:shimmer_1.6s_infinite]" />
            </div>
          )
        )}
      </div>
    </div>
  );
}`,
    tailwind: "relative, overflow-hidden, -translate-x-full, bg-gradient-to-r, [animation:shimmer_1.6s_infinite]",
    motion: {
      library: "css",
      config: { keyframes: "shimmer", duration: "1.6s", timing: "infinite" },
    },
    sources: ["mobbin", "linear", "tailwindui"],
  },
  {
    id: "toast-swipe-stack",
    name: "Toast Stack with Swipe to Dismiss",
    tags: ["toast", "notification", "swipe", "drag", "stack", "dismiss", "spring"],
    complexity: "elevated",
    framework: ["react"],
    interaction: "hover",
    description:
      "A bottom-right stack of toasts that animate in with spring, reflow with layout animation, and can be flung away horizontally to dismiss.",
    implementation_notes:
      "Each toast is a draggable motion.div constrained to the x axis (dragConstraints left/right 0 so it rubber-bands back). onDragEnd, if |offset.x| exceeds a threshold, remove it. `layout` makes the remaining toasts smoothly reflow. AnimatePresence handles enter/exit. Keep a monotonic id counter for keys.",
    code: `import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

let idCounter = 0;

export default function ToastStack() {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const push = () => setToasts((t) => [...t, { id: idCounter++, msg: "Saved successfully" }]);
  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <button onClick={push} className="rounded-lg bg-white px-5 py-2.5 font-medium text-neutral-950">
        Add toast
      </button>
      <div className="fixed bottom-6 right-6 flex w-80 flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => Math.abs(info.offset.x) > 100 && remove(toast.id)}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="flex cursor-grab items-center gap-3 rounded-xl border border-white/10 bg-neutral-900 p-4 active:cursor-grabbing"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-sm text-white">{toast.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}`,
    tailwind: "fixed, bottom-6, right-6, cursor-grab, active:cursor-grabbing, rounded-xl",
    motion: {
      library: "framer-motion",
      config: { type: "spring", stiffness: 350, damping: 30, drag: "x" },
    },
    sources: ["sonner", "vercel", "mobbin"],
  },
  {
    id: "command-palette",
    name: "Command Palette (cmdk-style)",
    tags: ["command", "palette", "cmdk", "search", "overlay", "keyboard", "shortcut"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "overlay",
    interaction: "entrance",
    description:
      "A ⌘K-triggered overlay with a search input and filtered command list, springing in from the top with a blurred backdrop.",
    implementation_notes:
      "Global keydown listener toggles open on (meta|ctrl)+K and closes on Escape. Filter a command list by the query with useMemo. The backdrop fades + blurs; the panel springs scale/y. autoFocus the input on open. Add arrow-key navigation and Enter-to-run for a production version (or use the `cmdk` library directly).",
    code: `import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ALL = [
  "Dashboard",
  "Settings",
  "Billing",
  "New project",
  "Invite teammate",
  "Documentation",
  "Log out",
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => ALL.filter((c) => c.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <p className="text-white/60">
        Press <kbd className="rounded bg-white/10 px-2 py-1 text-white">⌘K</kbd>
      </p>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[20vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, y: -8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl"
            >
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full border-b border-white/10 bg-transparent px-4 py-3.5 text-white outline-none placeholder:text-white/40"
              />
              <ul className="max-h-72 overflow-y-auto p-2">
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-white/40">No results</li>
                )}
                {results.map((c) => (
                  <li
                    key={c}
                    className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`,
    tailwind: "fixed, inset-0, z-50, pt-[20vh], backdrop-blur-sm, max-h-72, overflow-y-auto",
    motion: {
      library: "framer-motion",
      config: { type: "spring", stiffness: 400, damping: 30 },
    },
    sources: ["cmdk", "linear", "raycast"],
  },
  {
    id: "scroll-counter",
    name: "Scroll-Triggered Counter Animation",
    tags: ["counter", "number", "count-up", "scroll", "stats", "intersection-observer"],
    complexity: "elevated",
    framework: ["react"],
    interaction: "scroll",
    description:
      "Stat numbers that count up from zero with an ease-out curve the first time they scroll into view.",
    implementation_notes:
      "An IntersectionObserver fires once (disconnects immediately) when the element is 60% visible. A requestAnimationFrame loop interpolates 0→target over a duration using an ease-out cubic (1 - (1-p)^3) and rounds for display. toLocaleString adds thousands separators.",
    code: `import { useEffect, useRef, useState } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsCounters() {
  const metrics = [
    { to: 12000, s: "+" },
    { to: 98, s: "%" },
    { to: 240, s: "k" },
  ];
  return (
    <div className="flex min-h-screen items-center justify-center gap-12 bg-neutral-950">
      {metrics.map((m) => (
        <div key={m.to} className="text-center">
          <div className="text-5xl font-bold text-white">
            <Counter to={m.to} suffix={m.s} />
          </div>
          <p className="mt-2 text-sm text-white/50">metric</p>
        </div>
      ))}
    </div>
  );
}`,
    tailwind: "text-5xl, font-bold, text-center, gap-12",
    sources: ["mobbin", "stripe", "linear"],
  },
  {
    id: "sliding-tabs",
    name: "Tab Switcher with Sliding Indicator",
    tags: ["tabs", "switcher", "indicator", "pill", "layoutId", "segmented"],
    complexity: "elevated",
    framework: ["react"],
    interaction: "hover",
    description:
      "A segmented control where a white pill smoothly slides between tabs using Framer Motion's shared layout animation.",
    implementation_notes:
      "Render the active pill as a motion.span with a shared layoutId='tab-pill' positioned absolutely behind the active tab's label. Because every tab reuses the same layoutId, Framer animates the pill between positions automatically with a spring. The label sits relative above the pill; toggle its text color for contrast.",
    code: `import { motion } from "framer-motion";
import { useState } from "react";

const TABS = ["Overview", "Analytics", "Reports", "Settings"];

export default function SlidingTabs() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="flex gap-1 rounded-full border border-white/10 bg-neutral-900 p-1">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className="relative rounded-full px-5 py-2 text-sm font-medium transition-colors"
          >
            {active === i && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className={active === i ? "relative text-neutral-950" : "relative text-white/60"}>
              {tab}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}`,
    tailwind: "relative, rounded-full, absolute, inset-0, bg-white, transition-colors",
    motion: {
      library: "framer-motion",
      config: { type: "spring", stiffness: 380, damping: 32, layoutId: "tab-pill" },
    },
    sources: ["linear", "vercel", "framer"],
  },
  {
    id: "image-reveal-hover",
    name: "Masked Image Reveal on Hover",
    tags: ["image", "reveal", "mask", "clip-path", "hover", "wipe"],
    complexity: "elevated",
    framework: ["react"],
    interaction: "hover",
    description:
      "An image card that wipes a colored mask away on hover while the photo subtly scales — a tactile, editorial reveal.",
    implementation_notes:
      "Stack the image and a solid colored overlay in a relative container. On hover, animate the overlay's clip-path from inset(0) to inset(100% 0 0 0) (wiping upward) and scale the image to 1.08. The expo cubic-bezier on the clip-path transition gives the premium snap. transition-[clip-path] targets only the clip-path so timing is precise.",
    code: `import { useState } from "react";

export default function ImageRevealHover() {
  const [hover, setHover] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative h-80 w-64 overflow-hidden rounded-2xl"
      >
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600"
          alt="Abstract gradient"
          className="h-full w-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: hover ? "scale(1.08)" : "scale(1)" }}
        />
        <div
          className="absolute inset-0 bg-emerald-500 transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ clipPath: hover ? "inset(100% 0 0 0)" : "inset(0 0 0 0)" }}
        />
        <div className="absolute bottom-0 p-5">
          <h3 className="text-lg font-semibold text-white">Aurora #04</h3>
        </div>
      </div>
    </div>
  );
}`,
    tailwind: "relative, overflow-hidden, object-cover, transition-[clip-path], ease-[cubic-bezier(0.76,0,0.24,1)]",
    sources: ["godly", "refero", "cuberto"],
  },

  // ───────────────────────────── CLEAN ──────────────────────────────
  {
    id: "responsive-navbar-drawer",
    name: "Responsive Navbar with Mobile Drawer",
    tags: ["nav", "navbar", "responsive", "drawer", "mobile", "menu", "hamburger"],
    complexity: "clean",
    framework: ["react"],
    componentType: "nav",
    interaction: "hover",
    description:
      "A standard top navbar that collapses into a full-screen sliding drawer on mobile with a hamburger toggle.",
    implementation_notes:
      "Desktop links are hidden below md and shown at md+; the hamburger is the inverse. The drawer is a fixed full-screen panel translated off-canvas (translate-x-full) and slid in (translate-x-0) when open. Close on link click for good mobile UX. Inline SVGs avoid an icon dependency.",
    code: `import { useState } from "react";

export default function ResponsiveNavbar() {
  const [open, setOpen] = useState(false);
  const links = ["Home", "Features", "Pricing", "About"];
  return (
    <header className="bg-neutral-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold text-white">Nimbus</span>
        <div className="hidden gap-8 md:flex">
          {links.map((l) => (
            <a key={l} href="#" className="text-sm text-white/70 hover:text-white">
              {l}
            </a>
          ))}
        </div>
        <button className="hidden rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 md:block">
          Sign up
        </button>
        <button onClick={() => setOpen(true)} className="text-white md:hidden" aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <div
        className={[
          "fixed inset-0 z-50 bg-neutral-950 transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold text-white">Nimbus</span>
          <button onClick={() => setOpen(false)} className="text-white" aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2 px-6 pt-6">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-4 text-2xl text-white"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}`,
    tailwind: "hidden, md:flex, md:hidden, fixed, inset-0, translate-x-full, translate-x-0, transition-transform",
    sources: ["tailwindui", "mobbin", "vercel"],
  },
  {
    id: "gradient-hero",
    name: "Hero with Gradient Headline",
    tags: ["hero", "gradient", "headline", "landing", "cta", "text-gradient"],
    complexity: "clean",
    framework: ["react", "html"],
    componentType: "hero",
    interaction: "entrance",
    description:
      "A centered marketing hero with an eyebrow pill, a gradient-clipped headline, supporting copy and dual CTAs.",
    implementation_notes:
      "The gradient headline uses bg-gradient-to-br + bg-clip-text + text-transparent so the gradient fills the glyphs. Fade the gradient toward a lower-opacity white for the subtle 'fog' look. Keep the column centered and width-constrained with max-w utilities for readable line lengths.",
    code: `export default function GradientHero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-center">
      <span className="mb-6 rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70">
        ✦ Now in public beta
      </span>
      <h1 className="max-w-3xl bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-7xl">
        Ship beautiful products faster than ever
      </h1>
      <p className="mt-6 max-w-xl text-lg text-white/60">
        A modern toolkit for teams who care about craft. Build, ship, and scale with confidence.
      </p>
      <div className="mt-8 flex gap-4">
        <button className="rounded-full bg-white px-6 py-3 font-medium text-neutral-950">
          Start free
        </button>
        <button className="rounded-full border border-white/20 px-6 py-3 font-medium text-white">
          Book a demo
        </button>
      </div>
    </section>
  );
}`,
    tailwind: "bg-gradient-to-br, bg-clip-text, text-transparent, max-w-3xl, rounded-full",
    sources: ["vercel", "linear", "tailwindui"],
  },
  {
    id: "pricing-cards",
    name: "Pricing Cards with Highlight Tier",
    tags: ["pricing", "card", "tier", "highlight", "plan", "cta"],
    complexity: "clean",
    framework: ["react"],
    componentType: "card",
    interaction: "hover",
    description:
      "Three pricing tiers with the middle plan visually elevated via accent border, ring, badge and filled CTA.",
    implementation_notes:
      "Drive the featured styling off a boolean on each tier; the highlighted card gets an accent border + ring + tinted background and a 'Most popular' badge. Checkmarks are inline SVGs. For a responsive layout, switch the flex row to stacked on small screens.",
    code: `export default function PricingCards() {
  const tiers = [
    { name: "Starter", price: "$0", featured: false, features: ["1 project", "Community support", "1GB storage"] },
    { name: "Pro", price: "$24", featured: true, features: ["Unlimited projects", "Priority support", "100GB storage", "Advanced analytics"] },
    { name: "Team", price: "$72", featured: false, features: ["Everything in Pro", "SSO & SAML", "Audit logs"] },
  ];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 p-8 md:flex-row md:items-stretch">
      {tiers.map((t) => (
        <div
          key={t.name}
          className={[
            "w-72 rounded-2xl border p-6",
            t.featured
              ? "border-emerald-400/50 bg-emerald-400/5 ring-1 ring-emerald-400/30"
              : "border-white/10 bg-neutral-900",
          ].join(" ")}
        >
          {t.featured && (
            <span className="mb-3 inline-block rounded-full bg-emerald-400 px-3 py-1 text-xs font-medium text-neutral-950">
              Most popular
            </span>
          )}
          <h3 className="text-lg font-semibold text-white">{t.name}</h3>
          <p className="mt-2 text-4xl font-bold text-white">
            {t.price}
            <span className="text-base font-normal text-white/40">/mo</span>
          </p>
          <button
            className={[
              "mt-5 w-full rounded-lg py-2.5 text-sm font-medium",
              t.featured ? "bg-emerald-400 text-neutral-950" : "bg-white/10 text-white",
            ].join(" ")}
          >
            Get started
          </button>
          <ul className="mt-6 space-y-3">
            {t.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-emerald-400">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}`,
    tailwind: "border-emerald-400/50, bg-emerald-400/5, ring-1, ring-emerald-400/30, rounded-2xl",
    sources: ["tailwindui", "stripe", "mobbin"],
  },
  {
    id: "feature-grid",
    name: "Feature Grid with Icon + Description",
    tags: ["features", "grid", "icon", "marketing", "benefits", "responsive"],
    complexity: "clean",
    framework: ["react", "html"],
    interaction: "entrance",
    description:
      "A responsive 1/2/3-column grid of features, each with an accent icon tile, title and description.",
    implementation_notes:
      "Standard responsive grid (grid-cols-1 → sm:2 → lg:3). Each icon sits in a rounded tinted tile for a consistent rhythm. Swap the inline SVG for your icon set (lucide-react etc.). Constrain max width and add vertical section padding for breathing room.",
    code: `export default function FeatureGrid() {
  const features = [
    { t: "Lightning fast", d: "Optimized for performance at every layer." },
    { t: "Secure by default", d: "Encryption and best practices baked in." },
    { t: "Developer first", d: "APIs and docs your team will love." },
    { t: "Scales with you", d: "From prototype to millions of users." },
    { t: "Real-time", d: "Live updates with zero configuration." },
    { t: "Observable", d: "Metrics, logs, and traces out of the box." },
  ];
  return (
    <section className="bg-neutral-950 px-6 py-24">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.t}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-white">{f.t}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}`,
    tailwind: "grid, grid-cols-1, sm:grid-cols-2, lg:grid-cols-3, gap-8, rounded-xl",
    sources: ["tailwindui", "vercel", "linear"],
  },
  {
    id: "footer-newsletter",
    name: "Footer with Newsletter Input",
    tags: ["footer", "newsletter", "subscribe", "links", "email", "form"],
    complexity: "clean",
    framework: ["react", "html"],
    interaction: "entrance",
    description:
      "A multi-column footer pairing a brand + newsletter signup with grouped navigation link columns.",
    implementation_notes:
      "Two-part layout: a brand/newsletter block and a responsive grid of link columns. The newsletter form prevents default submit (wire to your provider). Link groups are data-driven from a nested array. Top border separates it from page content.",
    code: `export default function FooterNewsletter() {
  const groups: [string, string[]][] = [
    ["Product", ["Features", "Pricing", "Changelog"]],
    ["Company", ["About", "Blog", "Careers"]],
    ["Legal", ["Privacy", "Terms"]],
  ];
  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col justify-between gap-10 md:flex-row">
        <div className="max-w-sm">
          <span className="text-lg font-semibold text-white">Nimbus</span>
          <p className="mt-3 text-sm text-white/50">Get product updates and articles. No spam.</p>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="you@company.com"
              className="flex-1 rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-400"
            />
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950">
              Subscribe
            </button>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {groups.map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white">{title}</h4>
              <ul className="mt-3 space-y-2">
                {items.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-white/50 hover:text-white">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}`,
    tailwind: "border-t, flex-col, md:flex-row, grid, grid-cols-2, sm:grid-cols-3, focus:border-emerald-400",
    sources: ["tailwindui", "vercel", "stripe"],
  },
  {
    id: "testimonial-carousel",
    name: "Testimonial Carousel",
    tags: ["testimonial", "carousel", "quote", "slider", "social-proof", "dots"],
    complexity: "clean",
    framework: ["react"],
    interaction: "hover",
    description:
      "A single-quote testimonial slider with fade/slide transitions, prev/next controls and clickable progress dots.",
    implementation_notes:
      "Index state with wraparound math. AnimatePresence mode='wait' keys on the index so each quote fades/slides as it changes. The active dot widens (w-6) to indicate position. Add a setInterval autoplay in a real build if desired.",
    code: `import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUOTES = [
  { q: "This completely changed how our team ships.", a: "Maya Chen", r: "CTO, Drift" },
  { q: "The best developer experience we've ever had.", a: "Leo Park", r: "Lead Eng, Vault" },
  { q: "We cut our build times in half overnight.", a: "Sara Diaz", r: "VP Eng, Loop" },
];

export default function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const go = (dir: number) => setI((p) => (p + dir + QUOTES.length) % QUOTES.length);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
      <div className="w-full max-w-xl text-center">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="text-2xl font-medium leading-relaxed text-white"
          >
            “{QUOTES[i].q}”
            <footer className="mt-6 text-base font-normal text-white/50">
              {QUOTES[i].a} · {QUOTES[i].r}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} className="rounded-full border border-white/15 px-3 py-1 text-white/70 hover:text-white" aria-label="Previous">
            ‹
          </button>
          <div className="flex gap-2">
            {QUOTES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={"h-2 rounded-full transition-all " + (idx === i ? "w-6 bg-white" : "w-2 bg-white/30")}
                aria-label={"Go to slide " + (idx + 1)}
              />
            ))}
          </div>
          <button onClick={() => go(1)} className="rounded-full border border-white/15 px-3 py-1 text-white/70 hover:text-white" aria-label="Next">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}`,
    tailwind: "max-w-xl, text-center, rounded-full, transition-all, w-6, w-2",
    motion: {
      library: "framer-motion",
      config: { duration: 0.35 },
      variants: {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
      },
    },
    sources: ["tailwindui", "mobbin", "stripe"],
  },
  {
    id: "avatar-group",
    name: "Avatar Group with Overflow Count",
    tags: ["avatar", "group", "overlap", "overflow", "users", "stack"],
    complexity: "clean",
    framework: ["react", "html"],
    interaction: "hover",
    description:
      "Overlapping circular avatars capped at a max, with a '+N' chip summarizing the remainder.",
    implementation_notes:
      "Negative horizontal margin (-space-x-3) overlaps the avatars; a matching border in the background color creates the 'cutout' separation. Slice to a max and render a count chip for the rest. A small hover lift adds life.",
    code: `export default function AvatarGroup() {
  const users = [
    "https://i.pravatar.cc/80?img=1",
    "https://i.pravatar.cc/80?img=2",
    "https://i.pravatar.cc/80?img=3",
    "https://i.pravatar.cc/80?img=4",
    "https://i.pravatar.cc/80?img=5",
    "https://i.pravatar.cc/80?img=6",
    "https://i.pravatar.cc/80?img=7",
  ];
  const max = 4;
  const extra = users.length - max;
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="flex -space-x-3">
        {users.slice(0, max).map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="h-11 w-11 rounded-full border-2 border-neutral-950 object-cover transition-transform hover:-translate-y-1"
          />
        ))}
        {extra > 0 && (
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-neutral-950 bg-white/10 text-sm font-medium text-white">
            +{extra}
          </div>
        )}
      </div>
    </div>
  );
}`,
    tailwind: "flex, -space-x-3, rounded-full, border-2, border-neutral-950, object-cover",
    sources: ["tailwindui", "mobbin", "linear"],
  },
  {
    id: "badge-variants",
    name: "Badge / Tag Variants",
    tags: ["badge", "tag", "label", "chip", "status", "pill", "variants"],
    complexity: "clean",
    framework: ["react", "html"],
    interaction: "entrance",
    description:
      "A set of semantic status badges (default/success/warning/danger/info) plus a dot and outline variant.",
    implementation_notes:
      "Each variant is a tinted background + matching text color at low opacity for an on-dark look. A bg-current dot inherits the text color. The outline variant uses a border instead of a fill. Data-drive the color classes so adding a variant is one line.",
    code: `export default function BadgeVariants() {
  const badges = [
    { label: "Default", c: "bg-white/10 text-white" },
    { label: "Success", c: "bg-emerald-400/15 text-emerald-300" },
    { label: "Warning", c: "bg-amber-400/15 text-amber-300" },
    { label: "Danger", c: "bg-red-400/15 text-red-300" },
    { label: "Info", c: "bg-sky-400/15 text-sky-300" },
  ];
  return (
    <div className="flex min-h-screen flex-wrap items-center justify-center gap-3 bg-neutral-950">
      {badges.map((b) => (
        <span
          key={b.label}
          className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium " + b.c}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {b.label}
        </span>
      ))}
      <span className="inline-flex items-center rounded-md border border-white/15 px-2.5 py-1 text-xs font-medium text-white/80">
        Outline
      </span>
    </div>
  );
}`,
    tailwind: "inline-flex, rounded-full, bg-emerald-400/15, text-emerald-300, bg-current",
    sources: ["tailwindui", "mobbin", "radix"],
  },
  {
    id: "empty-state",
    name: "Empty State with Illustration Placeholder",
    tags: ["empty-state", "placeholder", "illustration", "cta", "onboarding", "zero-data"],
    complexity: "clean",
    framework: ["react", "html"],
    interaction: "entrance",
    description:
      "A centered empty-state with a dashed icon tile, headline, supportive copy and a primary action.",
    implementation_notes:
      "A dashed-border rounded tile stands in for an illustration (swap for an SVG/Lottie). Keep copy short and action-oriented; one clear primary CTA. Center everything in a constrained column.",
    code: `export default function EmptyState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
            <path d="M3 7l9-4 9 4-9 4-9-4z" />
            <path d="M3 7v10l9 4 9-4V7" />
            <path d="M12 11v10" />
          </svg>
        </div>
        <h3 className="mt-5 text-lg font-semibold text-white">No projects yet</h3>
        <p className="mt-1.5 text-sm text-white/50">
          Create your first project to get started. It only takes a minute.
        </p>
        <button className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-950">
          New project
        </button>
      </div>
    </div>
  );
}`,
    tailwind: "max-w-sm, text-center, border-dashed, rounded-2xl, bg-white/5",
    sources: ["mobbin", "linear", "tailwindui"],
  },
  {
    id: "step-progress",
    name: "Step Progress Indicator",
    tags: ["steps", "stepper", "progress", "wizard", "checkout", "indicator"],
    complexity: "clean",
    framework: ["react"],
    interaction: "entrance",
    description:
      "A horizontal stepper with numbered nodes, connecting bars that fill as steps complete, and prev/next controls.",
    implementation_notes:
      "Derive done/active per node from the current index. Completed nodes fill with the accent and show a check; the active node gets an accent ring. Connector bars between nodes fill width 0→100% with a transition when the prior step is done. Labels are absolutely offset below each node.",
    code: `import { useState } from "react";

export default function StepProgress() {
  const steps = ["Account", "Profile", "Billing", "Done"];
  const [current, setCurrent] = useState(1);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 bg-neutral-950 px-6">
      <div className="flex w-full max-w-lg items-center">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="relative flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    done
                      ? "border-emerald-400 bg-emerald-400 text-neutral-950"
                      : active
                        ? "border-emerald-400 text-emerald-400"
                        : "border-white/20 text-white/40",
                  ].join(" ")}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span className={"absolute top-11 whitespace-nowrap text-xs " + (active || done ? "text-white" : "text-white/40")}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-2 h-0.5 flex-1 bg-white/15">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{ width: done ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white"
        >
          Back
        </button>
        <button
          onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950"
        >
          Next
        </button>
      </div>
    </div>
  );
}`,
    tailwind: "flex-1, rounded-full, border-2, border-emerald-400, transition-all, duration-500",
    sources: ["tailwindui", "stripe", "mobbin"],
  },
];
