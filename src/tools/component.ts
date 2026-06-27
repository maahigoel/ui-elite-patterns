import { z } from "zod";
import { components } from "../registry/index.js";
import { formatEntry, joinBlocks } from "../format.js";
import type { Complexity, RegistryEntry } from "../types.js";

const COMPONENT_TYPES = [
  "hero",
  "nav",
  "card",
  "modal",
  "scroll-section",
  "cursor",
  "overlay",
  "loader",
  "text-reveal",
  "background",
] as const;

const COMPLEXITY_ORDER: Complexity[] = ["clean", "elevated", "insane"];

export const getComponentSchema = {
  type: z
    .enum(COMPONENT_TYPES)
    .describe("The kind of component you need."),
  interaction: z
    .enum(["scroll", "hover", "entrance", "ambient"])
    .optional()
    .describe("Preferred interaction model for the component."),
  complexity: z
    .enum(["clean", "elevated", "insane"])
    .optional()
    .describe("Preferred complexity. If an exact match is missing, the nearest available is returned."),
};

const Input = z.object(getComponentSchema);

/** Pick the entry whose complexity is closest to the requested one. */
function nearestByComplexity(entries: RegistryEntry[], target: Complexity): RegistryEntry {
  const ti = COMPLEXITY_ORDER.indexOf(target);
  return [...entries].sort(
    (a, b) =>
      Math.abs(COMPLEXITY_ORDER.indexOf(a.complexity) - ti) -
      Math.abs(COMPLEXITY_ORDER.indexOf(b.complexity) - ti)
  )[0];
}

/** get_component — return component(s) of a given type, filtered by interaction/complexity. */
export function getComponent(rawArgs: unknown): { content: { type: "text"; text: string }[] } {
  const { type, interaction, complexity } = Input.parse(rawArgs);

  const ofType = components.filter((c) => c.componentType === type);
  if (ofType.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `No components registered for type "${type}". Available types: ${COMPONENT_TYPES.join(", ")}.`,
        },
      ],
    };
  }

  // Optionally narrow by interaction (keep all if it would empty the set).
  let pool = ofType;
  if (interaction) {
    const byInteraction = ofType.filter((c) => c.interaction === interaction);
    if (byInteraction.length > 0) pool = byInteraction;
  }

  let selected: RegistryEntry[];
  if (complexity) {
    const exact = pool.filter((c) => c.complexity === complexity);
    selected = exact.length > 0 ? exact : [nearestByComplexity(pool, complexity)];
  } else {
    // No complexity preference: return all variants of this type, clean → insane.
    selected = [...pool].sort(
      (a, b) =>
        COMPLEXITY_ORDER.indexOf(a.complexity) - COMPLEXITY_ORDER.indexOf(b.complexity)
    );
  }

  const header =
    `${type} component${selected.length === 1 ? "" : "s"}` +
    (interaction ? ` (interaction: ${interaction})` : "") +
    (complexity ? ` (complexity: ${complexity})` : "") +
    `:`;
  const blocks = selected.map(formatEntry);

  return { content: [{ type: "text", text: header + "\n\n" + joinBlocks(blocks) }] };
}
