import { z } from "zod";
import { motionConfigs, motionFuse } from "../registry/index.js";
import { formatMotion, joinBlocks } from "../format.js";
import type { MotionConfigEntry, MotionLibrary } from "../types.js";

const MOTION_TYPES = [
  "page-transition",
  "entrance",
  "scroll-reveal",
  "hover",
  "stagger",
  "magnetic",
] as const;

export const getMotionConfigSchema = {
  type: z
    .enum(MOTION_TYPES)
    .describe("The kind of motion you need."),
  library: z
    .enum(["framer-motion", "gsap", "css"])
    .optional()
    .describe("Filter to a specific animation library."),
};

const Input = z.object(getMotionConfigSchema);

/** get_motion_config — return ready-to-paste motion config(s) by type and library. */
export function getMotionConfig(rawArgs: unknown): { content: { type: "text"; text: string }[] } {
  const { type, library } = Input.parse(rawArgs);

  let results: MotionConfigEntry[] = motionConfigs.filter(
    (m) => m.type === type && (!library || m.library === (library as MotionLibrary))
  );

  // Fall back to a fuzzy match on the type keyword if the exact type/library pair is empty.
  if (results.length === 0) {
    results = motionFuse
      .search(type)
      .map((r) => r.item)
      .filter((m) => !library || m.library === (library as MotionLibrary));
  }

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text",
          text:
            `No motion config found for type "${type}"` +
            (library ? ` in library "${library}"` : "") +
            `.\n\nAvailable types: ${MOTION_TYPES.join(", ")}. Libraries: framer-motion, gsap, css.`,
        },
      ],
    };
  }

  const header =
    `${results.length} motion config${results.length === 1 ? "" : "s"} for "${type}"` +
    (library ? ` (${library})` : "") +
    `:`;
  const blocks = results.map(formatMotion);

  return { content: [{ type: "text", text: header + "\n\n" + joinBlocks(blocks) }] };
}
