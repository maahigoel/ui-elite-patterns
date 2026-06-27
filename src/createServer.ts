import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getUiPattern, getUiPatternSchema } from "./tools/search.js";
import { getComponent, getComponentSchema } from "./tools/component.js";
import { getMotionConfig, getMotionConfigSchema } from "./tools/motion.js";

/** Builds the ui-mcp server with all three tools registered (transport-agnostic). */
export function createServer(): McpServer {
  const server = new McpServer({ name: "ui-mcp", version: "0.1.0" });

  server.registerTool(
    "get_ui_pattern",
    {
      title: "Get UI Pattern",
      description:
        "Search a curated registry of elite UI patterns and components by natural language. " +
        "Returns real, copy-pasteable React/TSX code with Tailwind classes and motion configs. " +
        "Use this mid-build instead of inventing generic layouts — e.g. 'magnetic cursor', " +
        "'scroll-jacked horizontal section', 'glassmorphic sticky nav', 'text scramble reveal'.",
      inputSchema: getUiPatternSchema,
    },
    async (args) => getUiPattern(args)
  );

  server.registerTool(
    "get_component",
    {
      title: "Get Component",
      description:
        "Get a specific component by type (hero, nav, card, modal, scroll-section, cursor, overlay, " +
        "loader, text-reveal, background) with optional interaction (scroll/hover/entrance/ambient) " +
        "and complexity (clean/elevated/insane). Returns full working TSX.",
      inputSchema: getComponentSchema,
    },
    async (args) => getComponent(args)
  );

  server.registerTool(
    "get_motion_config",
    {
      title: "Get Motion Config",
      description:
        "Get a ready-to-paste animation/motion config by type (page-transition, entrance, " +
        "scroll-reveal, hover, stagger, magnetic) and optional library (framer-motion/gsap/css). " +
        "Returns easing curves, durations, variant definitions and a usage snippet.",
      inputSchema: getMotionConfigSchema,
    },
    async (args) => getMotionConfig(args)
  );

  return server;
}
