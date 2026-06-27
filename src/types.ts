/**
 * Shared type definitions for the ui-mcp registry.
 *
 * Every pattern and component in the registry conforms to {@link RegistryEntry}.
 * Motion configs use the leaner {@link MotionConfigEntry} shape.
 */

export type Complexity = "clean" | "elevated" | "insane";

export type Framework = "react" | "vue" | "html";

export type Interaction = "scroll" | "hover" | "entrance" | "ambient";

export type ComponentType =
  | "hero"
  | "nav"
  | "card"
  | "modal"
  | "scroll-section"
  | "cursor"
  | "overlay"
  | "loader"
  | "text-reveal"
  | "background";

export type MotionLibrary = "framer-motion" | "gsap" | "css";

export type MotionType =
  | "page-transition"
  | "entrance"
  | "scroll-reveal"
  | "hover"
  | "stagger"
  | "magnetic";

/** Optional motion metadata attached to a pattern/component. */
export interface EntryMotion {
  library: MotionLibrary;
  config: Record<string, unknown>;
  variants?: Record<string, unknown>;
}

/** A single curated UI pattern or component. */
export interface RegistryEntry {
  id: string;
  name: string;
  tags: string[];
  complexity: Complexity;
  framework: Framework[];
  /** Set on component entries so `get_component` can filter by type. */
  componentType?: ComponentType;
  /** Primary interaction model, used by `get_component`. */
  interaction?: Interaction;
  description: string;
  implementation_notes: string;
  /** A full, standalone, copy-pasteable React/TSX component. */
  code: string;
  /** The key Tailwind utility classes used by the snippet. */
  tailwind: string;
  motion?: EntryMotion;
  /** Inspiration sources, e.g. "aceternity", "godly", "mobbin", "refero". */
  sources: string[];
}

/** A ready-to-paste motion/animation configuration. */
export interface MotionConfigEntry {
  id: string;
  name: string;
  type: MotionType;
  library: MotionLibrary;
  tags: string[];
  description: string;
  /** The config object (transition / options) ready to paste. */
  config: Record<string, unknown>;
  /** Variant definitions where applicable (Framer Motion). */
  variants?: Record<string, unknown>;
  /** A complete usage snippet. */
  code: string;
  /** One-line note on how/where to apply it. */
  usage: string;
}
