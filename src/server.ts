#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./createServer.js";
import { registryStats } from "./registry/index.js";

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log to stderr only — stdout is the MCP protocol channel.
  console.error(
    `[ui-mcp] ready — ${registryStats.patterns} patterns, ` +
      `${registryStats.components} components, ${registryStats.motionConfigs} motion configs ` +
      `(${registryStats.total} entries). Tools: get_ui_pattern, get_component, get_motion_config.`
  );
}

main().catch((err) => {
  console.error("[ui-mcp] fatal error:", err);
  process.exit(1);
});
