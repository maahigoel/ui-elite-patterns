import type { RegistryEntry } from "../types.js";

/**
 * 20 curated components — a clean and an elevated/insane variant for each of the
 * 10 component types (hero, nav, card, modal, scroll-section, cursor, overlay,
 * loader, text-reveal, background). Every `code` field is standalone TSX.
 */
export const components: RegistryEntry[] = [
  // ───────────────────────────── HERO ─────────────────────────────
  {
    id: "hero-clean",
    name: "Simple Centered Hero",
    tags: ["hero", "landing", "cta", "centered", "marketing"],
    complexity: "clean",
    framework: ["react", "html"],
    componentType: "hero",
    interaction: "entrance",
    description: "A minimal centered hero with headline, subcopy and a single primary CTA.",
    implementation_notes:
      "Flex column, centered, width-constrained headline for readable line length. Swap copy and CTA target. Works as the top of any landing page.",
    code: `export default function SimpleHero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-center">
      <h1 className="max-w-2xl text-4xl font-bold text-white md:text-6xl">
        The fastest way to build your next idea
      </h1>
      <p className="mt-5 max-w-lg text-white/60">
        Everything you need to design, build and launch — in one place.
      </p>
      <button className="mt-7 rounded-full bg-white px-6 py-3 font-medium text-neutral-950">
        Get started free
      </button>
    </section>
  );
}`,
    tailwind: "flex, flex-col, items-center, justify-center, max-w-2xl, text-4xl, md:text-6xl",
    sources: ["tailwindui", "vercel"],
  },
  {
    id: "hero-elevated",
    name: "Animated Hero with Grid + Glow",
    tags: ["hero", "entrance", "stagger", "grid", "glow", "motion", "landing"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "hero",
    interaction: "entrance",
    description:
      "A hero whose eyebrow, headline, copy and CTAs stagger in on load over a faint grid and a soft accent glow.",
    implementation_notes:
      "A container variant staggers child variants (fade + y). The grid is a pure-CSS double linear-gradient with bg-[size]; the glow is a blurred radial blob. Everything sits above with relative positioning.",
    code: `import { motion } from "framer-motion";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function AnimatedHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 text-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]" />
      <motion.div variants={container} initial="hidden" animate="visible" className="relative">
        <motion.span variants={item} className="mb-6 inline-block rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70">
          v2.0 is here
        </motion.span>
        <motion.h1 variants={item} className="max-w-3xl text-5xl font-bold leading-tight text-white md:text-7xl">
          Build interfaces people remember
        </motion.h1>
        <motion.p variants={item} className="mx-auto mt-6 max-w-xl text-lg text-white/60">
          A premium starting point with motion and polish baked in.
        </motion.p>
        <motion.div variants={item} className="mt-8 flex justify-center gap-4">
          <button className="rounded-full bg-white px-6 py-3 font-medium text-neutral-950">Start building</button>
          <button className="rounded-full border border-white/20 px-6 py-3 font-medium text-white">Watch demo</button>
        </motion.div>
      </motion.div>
    </section>
  );
}`,
    tailwind: "bg-[linear-gradient(...)], bg-[size:48px_48px], blur-[120px], relative, overflow-hidden",
    motion: {
      library: "framer-motion",
      config: { staggerChildren: 0.12, delayChildren: 0.1 },
      variants: {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      },
    },
    sources: ["vercel", "linear", "aceternity"],
  },

  // ───────────────────────────── NAV ─────────────────────────────
  {
    id: "nav-clean",
    name: "Simple Top Nav",
    tags: ["nav", "header", "links", "logo", "simple"],
    complexity: "clean",
    framework: ["react", "html"],
    componentType: "nav",
    interaction: "hover",
    description: "A horizontal top navigation with brand, link list and a log-in button.",
    implementation_notes:
      "max-width centered row; links use a hover color transition. Add aria-current to the active link in a real app and collapse to a drawer on mobile (see the responsive-navbar pattern).",
    code: `export default function SimpleNav() {
  const links = ["Product", "Solutions", "Pricing", "Docs"];
  return (
    <header className="bg-neutral-950">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="font-semibold text-white">Quartz</span>
        <ul className="hidden gap-7 sm:flex">
          {links.map((l) => (
            <li key={l}>
              <a href="#" className="text-sm text-white/70 transition-colors hover:text-white">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <button className="rounded-lg border border-white/15 px-4 py-1.5 text-sm text-white">Log in</button>
      </nav>
    </header>
  );
}`,
    tailwind: "mx-auto, max-w-5xl, flex, justify-between, transition-colors, hover:text-white",
    sources: ["tailwindui", "vercel"],
  },
  {
    id: "nav-elevated",
    name: "Nav with Animated Active Underline",
    tags: ["nav", "underline", "indicator", "layoutId", "active", "motion"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "nav",
    interaction: "hover",
    description:
      "A centered nav where an accent underline glides between items using a shared layoutId spring.",
    implementation_notes:
      "Each item renders the underline as a motion.span with layoutId='nav-underline' only when active, so Framer animates it between buttons. Keep the underline absolutely positioned at the item's baseline.",
    code: `import { motion } from "framer-motion";
import { useState } from "react";

export default function UnderlineNav() {
  const links = ["Home", "Work", "Studio", "Contact"];
  const [active, setActive] = useState(0);
  return (
    <header className="bg-neutral-950">
      <nav className="mx-auto flex max-w-3xl items-center justify-center gap-8 px-6 py-5">
        {links.map((l, i) => (
          <button
            key={l}
            onClick={() => setActive(i)}
            className="relative py-1 text-sm text-white/70 transition-colors hover:text-white"
          >
            <span className={active === i ? "text-white" : ""}>{l}</span>
            {active === i && (
              <motion.span
                layoutId="nav-underline"
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-emerald-400"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        ))}
      </nav>
    </header>
  );
}`,
    tailwind: "relative, absolute, -bottom-0.5, h-0.5, bg-emerald-400, rounded-full",
    motion: {
      library: "framer-motion",
      config: { type: "spring", stiffness: 400, damping: 32, layoutId: "nav-underline" },
    },
    sources: ["linear", "framer", "vercel"],
  },

  // ───────────────────────────── CARD ─────────────────────────────
  {
    id: "card-clean",
    name: "Content Card",
    tags: ["card", "content", "image", "article", "media"],
    complexity: "clean",
    framework: ["react", "html"],
    componentType: "card",
    interaction: "entrance",
    description: "A media card with cover image, eyebrow category, title and description.",
    implementation_notes:
      "overflow-hidden rounds the image with the card. Fixed image height keeps the grid even. Drop into a responsive grid for a blog/listing layout.",
    code: `export default function ContentCard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="w-80 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
        <img
          src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600"
          alt=""
          className="h-40 w-full object-cover"
        />
        <div className="p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-emerald-400">Article</span>
          <h3 className="mt-2 text-lg font-semibold text-white">Designing for clarity</h3>
          <p className="mt-1.5 text-sm text-white/55">
            A practical guide to interface hierarchy and restraint.
          </p>
        </div>
      </div>
    </div>
  );
}`,
    tailwind: "w-80, overflow-hidden, rounded-2xl, object-cover, border-white/10",
    sources: ["tailwindui", "mobbin"],
  },
  {
    id: "card-elevated",
    name: "Gradient-Border Glow Card",
    tags: ["card", "gradient-border", "glow", "hover", "lift", "premium"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "card",
    interaction: "hover",
    description:
      "A card with a conic-style gradient border that brightens and lifts on hover via a 1px padding wrapper trick.",
    implementation_notes:
      "Outer wrapper has p-px and the gradient as its background; the inner solid panel masks the center, leaving a 1px gradient ring. group-hover raises opacity and translates the whole card up.",
    code: `export default function GlowCard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="group relative w-80 rounded-2xl p-px transition-transform duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/60 via-transparent to-indigo-500/60 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative rounded-2xl bg-neutral-900 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-emerald-400">★</div>
          <h3 className="mt-4 text-lg font-semibold text-white">Pro plan</h3>
          <p className="mt-1.5 text-sm text-white/55">A gradient-border card that lights up on hover.</p>
        </div>
      </div>
    </div>
  );
}`,
    tailwind: "group, p-px, rounded-2xl, bg-gradient-to-br, group-hover:opacity-100, hover:-translate-y-1",
    sources: ["aceternity", "linear", "vercel"],
  },

  // ───────────────────────────── MODAL ─────────────────────────────
  {
    id: "modal-clean",
    name: "Basic Modal",
    tags: ["modal", "dialog", "overlay", "basic", "confirm"],
    complexity: "clean",
    framework: ["react"],
    componentType: "modal",
    interaction: "entrance",
    description: "A minimal modal shell with backdrop click-to-close and a centered panel.",
    implementation_notes:
      "Conditional render with a fixed backdrop; stopPropagation on the panel so inner clicks don't close. For production add Escape-to-close, focus trap and aria-modal/role='dialog'.",
    code: `import { useState } from "react";

export default function BasicModal() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <button onClick={() => setOpen(true)} className="rounded-lg bg-white px-5 py-2.5 font-medium text-neutral-950">
        Open
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6"
          >
            <h2 className="text-lg font-semibold text-white">Title</h2>
            <p className="mt-2 text-sm text-white/60">A minimal accessible modal shell.</p>
            <button onClick={() => setOpen(false)} className="mt-6 w-full rounded-lg bg-white py-2 text-sm font-medium text-neutral-950">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}`,
    tailwind: "fixed, inset-0, z-50, bg-black/50, max-w-sm, rounded-2xl",
    sources: ["radix", "tailwindui"],
  },
  {
    id: "modal-elevated",
    name: "Spring Modal with Blur Backdrop",
    tags: ["modal", "dialog", "spring", "blur", "backdrop", "motion"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "modal",
    interaction: "entrance",
    description:
      "A dialog that springs in with scale + lift over a blurred, dimmed backdrop; exit-animated via AnimatePresence.",
    implementation_notes:
      "AnimatePresence wraps the conditional. Backdrop animates opacity + backdrop-blur; the panel uses a spring on scale/y/opacity. stopPropagation keeps backdrop clicks from bubbling out of the panel.",
    code: `import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function SpringModal() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <button onClick={() => setOpen(true)} className="rounded-lg bg-white px-5 py-2.5 font-medium text-neutral-950">
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
              <h2 className="text-lg font-semibold text-white">Upgrade to Pro</h2>
              <p className="mt-2 text-sm text-white/60">Unlock unlimited projects and priority support.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm text-white/70 hover:text-white">
                  Maybe later
                </button>
                <button onClick={() => setOpen(false)} className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-neutral-950">
                  Upgrade
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`,
    tailwind: "fixed, inset-0, z-50, backdrop-blur-sm, rounded-2xl, shadow-2xl",
    motion: {
      library: "framer-motion",
      config: { type: "spring", stiffness: 320, damping: 28 },
      variants: {
        initial: { scale: 0.9, y: 20, opacity: 0 },
        animate: { scale: 1, y: 0, opacity: 1 },
        exit: { scale: 0.95, y: 10, opacity: 0 },
      },
    },
    sources: ["vaul", "radix", "aceternity"],
  },

  // ───────────────────────── SCROLL-SECTION ─────────────────────────
  {
    id: "scroll-section-clean",
    name: "Scroll Reveal Sections",
    tags: ["scroll", "reveal", "whileInView", "viewport", "fade-up", "sections"],
    complexity: "clean",
    framework: ["react"],
    componentType: "scroll-section",
    interaction: "scroll",
    description:
      "Full-height sections that fade and rise into place the first time they enter the viewport.",
    implementation_notes:
      "whileInView with viewport={{ once: true, amount: 0.5 }} fires the reveal once when ~half the section is visible — no manual IntersectionObserver needed.",
    code: `import { motion } from "framer-motion";

export default function ScrollRevealSection() {
  const items = ["Discover", "Create", "Refine", "Ship"];
  return (
    <div className="bg-neutral-950">
      {items.map((t) => (
        <motion.section
          key={t}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-screen items-center justify-center"
        >
          <span className="text-6xl font-bold text-white">{t}</span>
        </motion.section>
      ))}
    </div>
  );
}`,
    tailwind: "h-screen, flex, items-center, justify-center, text-6xl",
    motion: {
      library: "framer-motion",
      config: { duration: 0.6, ease: [0.22, 1, 0.36, 1], viewport: { once: true, amount: 0.5 } },
      variants: { initial: { opacity: 0, y: 60 }, whileInView: { opacity: 1, y: 0 } },
    },
    sources: ["framer", "godly"],
  },
  {
    id: "scroll-section-elevated",
    name: "Parallax Scroll Section",
    tags: ["scroll", "parallax", "useScroll", "useTransform", "depth", "layers"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "scroll-section",
    interaction: "scroll",
    description:
      "A section where a background layer and foreground heading move at different speeds for depth as you scroll past.",
    implementation_notes:
      "useScroll with offset ['start end','end start'] maps the element's full pass through the viewport to 0→1. Two useTransform mappings move background and foreground in opposite directions to create parallax. overflow-hidden clips the over-scrolled background.",
    code: `import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const yFore = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  return (
    <div className="bg-neutral-950">
      <div className="h-[50vh]" />
      <div ref={ref} className="relative flex h-screen items-center justify-center overflow-hidden">
        <motion.div style={{ y: yBack }} className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-neutral-950" />
        <motion.h2 style={{ y: yFore }} className="relative text-7xl font-bold text-white">
          Parallax
        </motion.h2>
      </div>
      <div className="h-[50vh]" />
    </div>
  );
}`,
    tailwind: "relative, h-screen, overflow-hidden, absolute, inset-0, bg-gradient-to-b",
    motion: {
      library: "framer-motion",
      config: { offset: ["start end", "end start"], back: ["-20%", "20%"], fore: ["10%", "-10%"] },
    },
    sources: ["studio-freight", "godly", "framer"],
  },

  // ───────────────────────────── CURSOR ─────────────────────────────
  {
    id: "cursor-clean",
    name: "Custom Dot Cursor",
    tags: ["cursor", "dot", "pointer", "custom", "follow"],
    complexity: "clean",
    framework: ["react"],
    componentType: "cursor",
    interaction: "hover",
    description: "A simple custom cursor: a small dot that follows the pointer exactly.",
    implementation_notes:
      "Hide the native cursor with cursor-none on the container, track mousemove into state and position a fixed dot. Center it with -translate-x-1/2 -translate-y-1/2 so it sits under the pointer.",
    code: `import { useEffect, useState } from "react";

export default function DotCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div className="flex min-h-screen cursor-none items-center justify-center bg-neutral-950">
      <p className="text-white/50">Move your cursor</p>
      <div
        className="pointer-events-none fixed z-50 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ left: pos.x, top: pos.y }}
      />
    </div>
  );
}`,
    tailwind: "cursor-none, pointer-events-none, fixed, z-50, -translate-x-1/2, -translate-y-1/2",
    sources: ["godly", "cuberto"],
  },
  {
    id: "cursor-elevated",
    name: "Trailing Ring Cursor",
    tags: ["cursor", "trailing", "ring", "spring", "hover-grow", "magnetic"],
    complexity: "insane",
    framework: ["react"],
    componentType: "cursor",
    interaction: "hover",
    description:
      "A two-part cursor — an instant dot plus a spring-lagged ring that grows when hovering links and buttons.",
    implementation_notes:
      "The dot binds directly to the raw motion values for a 1:1 feel; the ring binds to spring-smoothed values so it trails. A mousemove handler also checks closest('a, button') to scale the ring up over interactive targets.",
    code: `import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function TrailingCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 150, damping: 20 });
  const ringY = useSpring(y, { stiffness: 150, damping: 20 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHovering(!!(e.target as HTMLElement).closest("a, button"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <div className="flex min-h-screen cursor-none items-center justify-center bg-neutral-950">
      <a href="#" className="text-2xl font-semibold text-white underline">
        Hover me
      </a>
      <motion.div
        style={{ left: x, top: y }}
        className="pointer-events-none fixed z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />
      <motion.div
        style={{ left: ringX, top: ringY }}
        animate={{ scale: hovering ? 1.8 : 1 }}
        className="pointer-events-none fixed z-50 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60"
      />
    </div>
  );
}`,
    tailwind: "cursor-none, pointer-events-none, fixed, rounded-full, border-white/60",
    motion: {
      library: "framer-motion",
      config: { ring: { stiffness: 150, damping: 20 }, hoverScale: 1.8 },
    },
    sources: ["cuberto", "godly", "olivier-larose"],
  },

  // ───────────────────────────── OVERLAY ─────────────────────────────
  {
    id: "overlay-clean",
    name: "Side Sheet Drawer",
    tags: ["overlay", "drawer", "sheet", "side", "panel", "slide"],
    complexity: "clean",
    framework: ["react"],
    componentType: "overlay",
    interaction: "entrance",
    description: "A right-side drawer that slides in over a dimmed backdrop for filters or details.",
    implementation_notes:
      "The aside is always mounted and toggled between translate-x-full (hidden) and translate-x-0 (shown) with a transition for a smooth slide. The backdrop is conditionally rendered to capture outside clicks.",
    code: `import { useState } from "react";

export default function SideSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <button onClick={() => setOpen(true)} className="rounded-lg bg-white px-5 py-2.5 font-medium text-neutral-950">
        Open panel
      </button>
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/50" />}
      <aside
        className={[
          "fixed right-0 top-0 z-50 h-full w-80 border-l border-white/10 bg-neutral-900 p-6 transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Panel</h2>
          <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
            ✕
          </button>
        </div>
        <p className="mt-4 text-sm text-white/60">Slide-in side sheet for filters, details, or settings.</p>
      </aside>
    </div>
  );
}`,
    tailwind: "fixed, right-0, h-full, w-80, translate-x-full, translate-x-0, transition-transform",
    sources: ["radix", "tailwindui"],
  },
  {
    id: "overlay-elevated",
    name: "Draggable Bottom Sheet",
    tags: ["overlay", "bottom-sheet", "drag", "spring", "vaul", "mobile"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "overlay",
    interaction: "entrance",
    description:
      "A mobile-style bottom sheet that springs up, can be dragged down to dismiss, and dims/blurs the page behind it.",
    implementation_notes:
      "drag='y' with dragConstraints pinned to 0 lets it rubber-band; onDragEnd dismisses when dragged past a threshold. The grab handle is a small rounded bar. AnimatePresence animates the y: '100%' enter/exit.",
    code: `import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function BottomSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <button onClick={() => setOpen(true)} className="rounded-lg bg-white px-5 py-2.5 font-medium text-neutral-950">
        Open sheet
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => info.offset.y > 120 && setOpen(false)}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-white/10 bg-neutral-900 p-6 pb-10"
            >
              <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/20" />
              <h2 className="text-lg font-semibold text-white">Bottom sheet</h2>
              <p className="mt-2 text-sm text-white/60">Drag down or tap the backdrop to dismiss.</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}`,
    tailwind: "fixed, inset-x-0, bottom-0, rounded-t-3xl, backdrop-blur-sm, z-50",
    motion: {
      library: "framer-motion",
      config: { type: "spring", stiffness: 300, damping: 30, drag: "y", dismissThreshold: 120 },
    },
    sources: ["vaul", "mobbin", "radix"],
  },

  // ───────────────────────────── LOADER ─────────────────────────────
  {
    id: "loader-clean",
    name: "Spinner",
    tags: ["loader", "spinner", "loading", "progress", "circle"],
    complexity: "clean",
    framework: ["react", "html"],
    componentType: "loader",
    interaction: "ambient",
    description: "A minimal CSS ring spinner using Tailwind's animate-spin.",
    implementation_notes:
      "A circle with a faint full border and one bright top border segment; animate-spin rotates it. Size via h/w. Pure CSS, no JS.",
    code: `export default function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-white" />
    </div>
  );
}`,
    tailwind: "h-10, w-10, animate-spin, rounded-full, border-2, border-t-white",
    sources: ["tailwindui"],
  },
  {
    id: "loader-elevated",
    name: "Shimmer Skeleton List",
    tags: ["loader", "skeleton", "shimmer", "loading", "placeholder", "list"],
    complexity: "elevated",
    framework: ["react", "html"],
    componentType: "loader",
    interaction: "ambient",
    description:
      "A list-row skeleton with avatar and text placeholders, each sweeping a shimmer highlight while loading.",
    implementation_notes:
      "Every placeholder is overflow-hidden with a faint base; an absolutely-positioned gradient bar sweeps via the inline `shimmer` keyframe. The keyframe is injected once in a scoped <style> tag so the snippet is standalone.",
    code: `export default function ShimmerList() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <style>{\`@keyframes shimmer { 100% { transform: translateX(100%); } }\`}</style>
      <div className="w-80 space-y-4 rounded-2xl border border-white/10 bg-neutral-900 p-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/5">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent [animation:shimmer_1.6s_infinite]" />
            </div>
            <div className="flex-1 space-y-2">
              {["h-3 w-3/4", "h-3 w-1/2"].map((c, j) => (
                <div key={j} className={"relative overflow-hidden rounded bg-white/5 " + c}>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent [animation:shimmer_1.6s_infinite]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    tailwind: "relative, overflow-hidden, -translate-x-full, bg-gradient-to-r, [animation:shimmer_1.6s_infinite]",
    motion: {
      library: "css",
      config: { keyframes: "shimmer", duration: "1.6s", timing: "infinite" },
    },
    sources: ["linear", "mobbin", "tailwindui"],
  },

  // ─────────────────────────── TEXT-REVEAL ───────────────────────────
  {
    id: "text-reveal-clean",
    name: "Fade-Up Text on View",
    tags: ["text-reveal", "fade-up", "whileInView", "viewport", "entrance"],
    complexity: "clean",
    framework: ["react"],
    componentType: "text-reveal",
    interaction: "scroll",
    description: "A paragraph that fades and rises into place when it scrolls into view.",
    implementation_notes:
      "whileInView + viewport once. The [0.22,1,0.36,1] ease makes the rise feel deliberate. Use on section intros and pull-quotes.",
    code: `import { motion } from "framer-motion";

export default function FadeUpText() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md text-center text-3xl font-medium text-white"
      >
        Content that gracefully fades up as it enters the viewport.
      </motion.p>
    </div>
  );
}`,
    tailwind: "max-w-md, text-center, text-3xl, font-medium",
    motion: {
      library: "framer-motion",
      config: { duration: 0.6, ease: [0.22, 1, 0.36, 1], viewport: { once: true, amount: 0.6 } },
    },
    sources: ["framer", "godly"],
  },
  {
    id: "text-reveal-elevated",
    name: "Per-Word Stagger Heading",
    tags: ["text-reveal", "stagger", "words", "whileInView", "heading", "motion"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "text-reveal",
    interaction: "scroll",
    description:
      "A heading whose words fade and rise one after another when scrolled into view, via container/child variants.",
    implementation_notes:
      "Split on spaces and animate each word as a child variant; the parent container variant staggers them. whileInView with once:true triggers on scroll. gap-x keeps word spacing without needing literal spaces.",
    code: `import { motion } from "framer-motion";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const word = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function WordRevealHeading() {
  const text = "Designed for the details";
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <motion.h2
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="flex flex-wrap justify-center gap-x-3 text-4xl font-bold text-white md:text-6xl"
      >
        {text.split(" ").map((w, i) => (
          <motion.span key={i} variants={word} className="inline-block">
            {w}
          </motion.span>
        ))}
      </motion.h2>
    </div>
  );
}`,
    tailwind: "flex, flex-wrap, justify-center, gap-x-3, inline-block, md:text-6xl",
    motion: {
      library: "framer-motion",
      config: { staggerChildren: 0.08 },
      variants: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      },
    },
    sources: ["aceternity", "godly", "olivier-larose"],
  },

  // ─────────────────────────── BACKGROUND ───────────────────────────
  {
    id: "background-clean",
    name: "Mesh Gradient Background",
    tags: ["background", "gradient", "mesh", "blur", "blobs", "ambient"],
    complexity: "clean",
    framework: ["react", "html"],
    componentType: "background",
    interaction: "ambient",
    description:
      "A soft mesh-gradient backdrop made from a few large, heavily-blurred colored blobs over a dark base.",
    implementation_notes:
      "Position 2–3 oversized rounded blobs with strong blur-[120px] and low-opacity accent colors; overflow-hidden clips them to the frame. Content sits above with relative z-10. Pure CSS, no JS.",
    code: `export default function MeshBackground() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950">
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/30 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500/30 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[120px]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <h1 className="text-6xl font-bold text-white">Mesh gradient</h1>
      </div>
    </div>
  );
}`,
    tailwind: "relative, overflow-hidden, absolute, blur-[120px], bg-emerald-500/30, z-10",
    sources: ["vercel", "linear", "godly"],
  },
  {
    id: "background-elevated",
    name: "Animated Aurora Background",
    tags: ["background", "aurora", "animated", "gradient", "blur", "ambient"],
    complexity: "elevated",
    framework: ["react"],
    componentType: "background",
    interaction: "ambient",
    description:
      "A living aurora backdrop: two big gradient blobs drift and rotate on offset loops behind your content.",
    implementation_notes:
      "Two blurred gradient blobs run the same `aurora` keyframe at different durations (one reversed) so they never sync, creating organic motion. Keyframes are injected via a scoped <style> tag. Keep opacity moderate so foreground text stays legible.",
    code: `export default function AuroraBackground() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950">
      <style>{\`@keyframes aurora { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(8%,-6%) rotate(8deg); } }\`}</style>
      <div className="absolute left-1/4 top-1/4 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-emerald-500/40 to-cyan-500/30 blur-[120px] [animation:aurora_12s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-indigo-500/40 to-fuchsia-500/30 blur-[120px] [animation:aurora_16s_ease-in-out_infinite_reverse]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <h1 className="text-6xl font-bold text-white">Aurora</h1>
      </div>
    </div>
  );
}`,
    tailwind: "relative, overflow-hidden, [animation:aurora_12s_ease-in-out_infinite], blur-[120px]",
    motion: {
      library: "css",
      config: { keyframes: "aurora", durations: ["12s", "16s"], timing: "ease-in-out infinite" },
    },
    sources: ["aceternity", "godly", "vercel"],
  },
];
