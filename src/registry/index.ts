import Fuse from "fuse.js";
import type { RegistryEntry, MotionConfigEntry } from "../types.js";
import { patterns } from "./patterns.js";
import { components } from "./components.js";
import { motionConfigs } from "./motion.js";

export { patterns } from "./patterns.js";
export { components } from "./components.js";
export { motionConfigs } from "./motion.js";

/** Every searchable pattern/component entry in one array. */
export const allEntries: RegistryEntry[] = [...patterns, ...components];

/** Fuse index over patterns + components for natural-language search. */
export const fuse = new Fuse(allEntries, {
  includeScore: true,
  threshold: 0.45,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: "name", weight: 0.35 },
    { name: "tags", weight: 0.3 },
    { name: "description", weight: 0.2 },
    { name: "implementation_notes", weight: 0.1 },
    { name: "componentType", weight: 0.05 },
  ],
});

/** Fuse index over motion configs (used as a fallback fuzzy match). */
export const motionFuse = new Fuse(motionConfigs, {
  includeScore: true,
  threshold: 0.4,
  ignoreLocation: true,
  keys: [
    { name: "name", weight: 0.4 },
    { name: "tags", weight: 0.35 },
    { name: "type", weight: 0.15 },
    { name: "description", weight: 0.1 },
  ],
});

export const registryStats = {
  patterns: patterns.length,
  components: components.length,
  motionConfigs: motionConfigs.length,
  total: patterns.length + components.length + motionConfigs.length,
};

export type { RegistryEntry, MotionConfigEntry };
