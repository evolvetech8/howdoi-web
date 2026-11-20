#!/usr/bin/env node
// Kept as a compatible entrypoint. Integration tests must exercise the production engine.
const { spawnSync } = require("node:child_process");
const result = spawnSync("npm", ["run", "test:integration"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
