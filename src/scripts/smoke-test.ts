/**
 * Smoke test: boots the ui-mcp server over an in-memory transport, lists its
 * tools, and calls each one once — verifying the registry loads and search works.
 * Exits non-zero on any failure so `npm run smoke` can gate CI.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../createServer.js";
import { registryStats } from "../registry/index.js";

type ToolResult = { content?: { type: string; text?: string }[] };

let failures = 0;
function check(label: string, ok: boolean, detail = "") {
  const mark = ok ? "PASS" : "FAIL";
  if (!ok) failures++;
  console.log(`  [${mark}] ${label}${detail ? ` — ${detail}` : ""}`);
}

function textOf(res: ToolResult): string {
  return (res.content ?? [])
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("\n");
}

async function main() {
  console.log("ui-mcp smoke test\n");
  console.log(
    `Registry: ${registryStats.patterns} patterns, ${registryStats.components} components, ` +
      `${registryStats.motionConfigs} motion configs (${registryStats.total} total)\n`
  );

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createServer();
  const client = new Client({ name: "smoke-test", version: "0.1.0" });

  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

  // 1. List tools
  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  check(
    "lists 3 tools",
    names.length === 3 &&
      ["get_component", "get_motion_config", "get_ui_pattern"].every((n) => names.includes(n)),
    names.join(", ")
  );

  // 2. get_ui_pattern
  const p = (await client.callTool({
    name: "get_ui_pattern",
    arguments: { query: "magnetic cursor" },
  })) as ToolResult;
  const pText = textOf(p);
  check("get_ui_pattern returns text", pText.length > 0);
  check("get_ui_pattern finds magnetic cursor", /magnetic/i.test(pText), pText.slice(0, 60).replace(/\n/g, " "));

  // 3. get_component
  const c = (await client.callTool({
    name: "get_component",
    arguments: { type: "modal", complexity: "elevated" },
  })) as ToolResult;
  const cText = textOf(c);
  check("get_component returns text", cText.length > 0);
  check("get_component returns a modal", /modal/i.test(cText) && /```tsx/.test(cText));

  // 4. get_motion_config
  const m = (await client.callTool({
    name: "get_motion_config",
    arguments: { type: "stagger", library: "framer-motion" },
  })) as ToolResult;
  const mText = textOf(m);
  check("get_motion_config returns text", mText.length > 0);
  check("get_motion_config returns stagger config", /stagger/i.test(mText) && /```json/.test(mText));

  // 5. Filters + graceful empties
  const filtered = (await client.callTool({
    name: "get_ui_pattern",
    arguments: { query: "scroll", complexity: "insane", framework: "react" },
  })) as ToolResult;
  check("get_ui_pattern honors filters", textOf(filtered).length > 0);

  await client.close();
  await server.close();

  console.log("");
  if (failures > 0) {
    console.error(`SMOKE TEST FAILED — ${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log("SMOKE TEST PASSED — all checks green.");
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
