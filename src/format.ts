import type { RegistryEntry, MotionConfigEntry } from "./types.js";

/** Renders a pattern/component entry into a markdown block for the MCP text response. */
export function formatEntry(entry: RegistryEntry): string {
  const lines: string[] = [];
  lines.push(`## ${entry.name}`);
  lines.push("");
  lines.push(
    `**Complexity:** ${entry.complexity}  •  **Frameworks:** ${entry.framework.join(", ")}` +
      (entry.componentType ? `  •  **Type:** ${entry.componentType}` : "") +
      (entry.interaction ? `  •  **Interaction:** ${entry.interaction}` : "")
  );
  lines.push(`**Tags:** ${entry.tags.join(", ")}`);
  lines.push("");
  lines.push(entry.description);
  lines.push("");
  lines.push(`**Implementation notes:** ${entry.implementation_notes}`);
  lines.push("");
  lines.push("### Code");
  lines.push("```tsx");
  lines.push(entry.code);
  lines.push("```");
  lines.push("");
  lines.push(`**Key Tailwind classes:** ${entry.tailwind}`);

  if (entry.motion) {
    lines.push("");
    lines.push(`### Motion (${entry.motion.library})`);
    lines.push("```json");
    lines.push(
      JSON.stringify(
        { config: entry.motion.config, variants: entry.motion.variants ?? undefined },
        null,
        2
      )
    );
    lines.push("```");
  }

  lines.push("");
  lines.push(`*Inspiration: ${entry.sources.join(", ")}*`);
  return lines.join("\n");
}

/** Renders a motion config entry into a markdown block. */
export function formatMotion(entry: MotionConfigEntry): string {
  const lines: string[] = [];
  lines.push(`## ${entry.name}`);
  lines.push("");
  lines.push(`**Type:** ${entry.type}  •  **Library:** ${entry.library}`);
  lines.push(`**Tags:** ${entry.tags.join(", ")}`);
  lines.push("");
  lines.push(entry.description);
  lines.push("");
  lines.push("### Config");
  lines.push("```json");
  lines.push(
    JSON.stringify({ config: entry.config, variants: entry.variants ?? undefined }, null, 2)
  );
  lines.push("```");
  lines.push("");
  lines.push("### Code");
  lines.push("```tsx");
  lines.push(entry.code);
  lines.push("```");
  lines.push("");
  lines.push(`**Usage:** ${entry.usage}`);
  return lines.join("\n");
}

/** Joins multiple rendered blocks with a divider. */
export function joinBlocks(blocks: string[]): string {
  return blocks.join("\n\n---\n\n");
}
