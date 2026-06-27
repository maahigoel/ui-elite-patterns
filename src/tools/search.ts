import { z } from "zod";
import { allEntries, fuse } from "../registry/index.js";
import { formatEntry, joinBlocks } from "../format.js";
import type { Complexity, Framework, RegistryEntry } from "../types.js";

export const getUiPatternSchema = {
  query: z.string().describe("Natural-language description of the UI pattern you want, e.g. 'magnetic cursor', 'scroll reveal headline', 'glassmorphic sticky nav'."),
  framework: z
    .enum(["react", "vue", "html"])
    .optional()
    .describe("Filter results to patterns that support this framework."),
  complexity: z
    .enum(["clean", "elevated", "insane"])
    .optional()
    .describe("Filter by visual/interaction complexity. clean = simple, elevated = polished, insane = showpiece."),
};

const Input = z.object(getUiPatternSchema);

function applyFilters(
  entries: RegistryEntry[],
  framework?: Framework,
  complexity?: Complexity
): RegistryEntry[] {
  return entries.filter(
    (e) =>
      (!framework || e.framework.includes(framework)) &&
      (!complexity || e.complexity === complexity)
  );
}

/** get_ui_pattern — fuzzy search across patterns + components by natural language. */
export function getUiPattern(rawArgs: unknown): { content: { type: "text"; text: string }[] } {
  const { query, framework, complexity } = Input.parse(rawArgs);

  const ranked = fuse.search(query).map((r) => r.item);
  let results = applyFilters(ranked, framework, complexity);

  // If filters removed everything, fall back to a filtered scan of the whole registry
  // so users still get something relevant for broad queries.
  if (results.length === 0) {
    results = applyFilters(allEntries, framework, complexity);
  }

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text",
          text:
            `No pattern matched "${query}"` +
            (framework ? ` for framework "${framework}"` : "") +
            (complexity ? ` at "${complexity}" complexity` : "") +
            `.\n\nTry a broader query (e.g. "cursor", "scroll", "card", "nav", "text reveal", "background") or drop the filters.`,
        },
      ],
    };
  }

  const top = results.slice(0, 3);
  const header =
    `Found ${results.length} matching pattern${results.length === 1 ? "" : "s"} for "${query}". ` +
    `Showing the top ${top.length}:`;
  const blocks = top.map(formatEntry);

  return { content: [{ type: "text", text: header + "\n\n" + joinBlocks(blocks) }] };
}
