# ui-mcp

> A local MCP server that gives Claude Code (and any MCP client) access to a curated registry of **elite UI patterns, components, and motion configs** — so it pulls real, copy-pasteable implementations mid-build instead of defaulting to generic layouts.

Magnetic cursors, scroll-jacked sections, reactive particle grids, clip-path page transitions, text-scramble reveals, glassmorphic navs, spring modals, bento grids, and more — every entry ships **real working React/TSX**, valid Tailwind classes, and Framer Motion / GSAP / CSS motion values.

- **30** UI patterns (clean · elevated · insane)
- **20** components keyed by type (hero, nav, card, modal, scroll-section, cursor, overlay, loader, text-reveal, background)
- **15** ready-to-paste motion configs (Framer Motion, GSAP, CSS)
- Fuzzy natural-language search via [Fuse.js](https://www.fusejs.io/)

---

## Install & setup

```bash
git clone https://github.com/maahigoel/ui-elite-patterns.git
cd ui-elite-patterns
npm install
npm run build
```

This compiles `src/` → `dist/`. The server entry is `dist/server.js`.

### Add to Claude Code

A ready-to-use [`.mcp.json`](./.mcp.json) is included:

```json
{
  "mcpServers": {
    "ui-mcp": {
      "command": "node",
      "args": ["dist/server.js"]
    }
  }
}
```

- **Project scope:** copy `.mcp.json` into your project root and run Claude Code from there. (If `args` is a relative path, run Claude Code from the `ui-mcp` directory, or change it to the absolute path of `dist/server.js`.)
- **CLI:** `claude mcp add ui-mcp -- node /absolute/path/to/ui-mcp/dist/server.js`

Restart Claude Code, then ask it to use the `ui-mcp` tools. Verify the server boots:

```bash
npm run smoke   # builds, boots the server in-memory, and exercises every tool
```

---

## Live demo site

A local showcase website that renders **every pattern and component live** lives in [`demo/`](./demo). It uses a codegen script that pulls each component straight from this registry, so it always reflects exactly what the MCP server hands to Claude Code.

```bash
cd demo
npm install
npm run dev        # generates components from the registry, then starts Vite at http://localhost:5173
```

- Browse all 50 patterns + components in a filterable gallery (search, complexity, kind).
- Click any card to view it **full-screen, running live**, with a slide-in source panel + copy button.
- `npm run generate` re-syncs the demo with the registry after you add patterns. (`npm run dev`/`build` run it automatically.)

Built with Vite + React + Tailwind + Framer Motion. Local only — no hosting required.

---

## Tools

### 1. `get_ui_pattern`

Fuzzy-search the registry by natural language.

**Input**

| field | type | required | description |
| --- | --- | --- | --- |
| `query` | string | ✅ | What you want, e.g. `"magnetic cursor"` |
| `framework` | `"react" \| "vue" \| "html"` | – | Filter by framework support |
| `complexity` | `"clean" \| "elevated" \| "insane"` | – | Filter by complexity |

**Example**

```jsonc
// input
{ "query": "scroll reveal headline", "complexity": "insane" }
```

```md
// output (truncated)
Found 3 matching patterns for "scroll reveal headline". Showing the top 3:

## Text Scramble Reveal on Scroll
**Complexity:** insane • **Frameworks:** react • **Interaction:** scroll
**Tags:** text, scramble, decode, scroll, reveal, monospace, raf
...
### Code
```tsx
import { useEffect, useRef, useState } from "react";
...
```
```

### 2. `get_component`

Get component(s) of a given type.

**Input**

| field | type | required | description |
| --- | --- | --- | --- |
| `type` | `hero \| nav \| card \| modal \| scroll-section \| cursor \| overlay \| loader \| text-reveal \| background` | ✅ | Component kind |
| `interaction` | `scroll \| hover \| entrance \| ambient` | – | Preferred interaction |
| `complexity` | `clean \| elevated \| insane` | – | Preferred complexity (nearest returned if exact missing) |

**Example**

```jsonc
// input
{ "type": "modal", "complexity": "elevated" }
```

Returns the **Spring Modal with Blur Backdrop** with full TSX and its Framer Motion config. Omit `complexity` to get every variant of that type (clean → insane).

### 3. `get_motion_config`

Get a paste-ready motion configuration.

**Input**

| field | type | required | description |
| --- | --- | --- | --- |
| `type` | `page-transition \| entrance \| scroll-reveal \| hover \| stagger \| magnetic` | ✅ | Motion kind |
| `library` | `framer-motion \| gsap \| css` | – | Filter by library |

**Example**

```jsonc
// input
{ "type": "stagger", "library": "framer-motion" }
```

```md
// output (truncated)
## Framer Motion Stagger Children (0.08s)
**Type:** stagger • **Library:** framer-motion
### Config
```json
{ "config": { "staggerChildren": 0.08, "delayChildren": 0.1 }, "variants": { ... } }
```
### Code
```tsx
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
...
```
**Usage:** Put `container` on the parent and `item` on each child; the parent drives timing.
```

---

## Example prompts inside Claude Code

- *"Use ui-mcp to find a magnetic cursor pattern and add it to my landing page."*
- *"Get me an `insane` complexity background component from ui-mcp for the hero."*
- *"Build a pricing section — grab the pricing card pattern from ui-mcp first."*
- *"I need a page transition. Pull the Framer Motion `page-transition` config from ui-mcp."*
- *"Find a scroll-jacked horizontal section in ui-mcp and wire it up with my project's content."*
- *"Get the `text-reveal` component (elevated) from ui-mcp and use it for the section heading."*

---

## Contributing — add a pattern

The registry lives in `src/registry/`:

- `patterns.ts` — patterns surfaced by `get_ui_pattern`
- `components.ts` — components surfaced by `get_component` (must set `componentType`)
- `motion.ts` — configs surfaced by `get_motion_config`

Add a new entry to the relevant array following the `RegistryEntry` shape (`src/types.ts`):

```ts
{
  id: "my-pattern",                 // unique kebab-case id
  name: "My Pattern",
  tags: ["..."],                    // drives fuzzy search — be generous
  complexity: "elevated",           // "clean" | "elevated" | "insane"
  framework: ["react"],
  componentType: "card",            // components only — enables get_component
  interaction: "hover",             // optional
  description: "One sentence on what it is.",
  implementation_notes: "How it works / gotchas.",
  code: `/* full, standalone, copy-pasteable TSX */`,
  tailwind: "the key classes used",
  motion: {                          // optional, if animated
    library: "framer-motion",
    config: { /* ... */ },
    variants: { /* ... */ },
  },
  sources: ["aceternity", "godly"],
}
```

Guidelines:

1. **Code must actually run.** Full component with imports and a `default export`, valid Tailwind, correct Framer Motion / GSAP APIs. No `// add animation here` placeholders.
2. **Tag generously** — tags are weighted heavily in search.
3. Run `npm run smoke` (it builds + type-checks + exercises the tools) before opening a PR.
4. Keep snippets self-contained (inline SVGs over icon deps; scoped `<style>` for keyframes).

---

## Credits

Patterns are original implementations inspired by the craft of the design-engineering community:

- [Aceternity UI](https://ui.aceternity.com/)
- [Godly](https://godly.website/)
- [Mobbin](https://mobbin.com/)
- [Refero](https://refero.design/)

Built on the [Model Context Protocol](https://modelcontextprotocol.io/) TypeScript SDK.

## License

[MIT](./LICENSE)
