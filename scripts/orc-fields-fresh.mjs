import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

export const BAKE_INPUTS = [
  "src/game/fort-graph.ts",
  "src/game/yughott-graph.ts",
  "src/game/orc-bake.ts",
];

export function bakeInputsHash() {
  const hash = createHash("sha256");
  for (const file of BAKE_INPUTS) {
    hash.update(file);
    hash.update("\0");
    hash.update(readFileSync(resolve(root, file)));
    hash.update("\0");
  }
  return hash.digest("hex");
}

export function assertOrcFieldsFresh() {
  const path = resolve(root, "src/game/orc-fields.generated.ts");
  let src = "";
  try {
    src = readFileSync(path, "utf8");
  } catch {
    throw new Error("orc fields missing; run npm run bake");
  }
  const marked = src.match(/ORC_FIELDS_HASH = "([a-f0-9]+)"/);
  const live = bakeInputsHash();
  if (!marked || marked[1] !== live) throw new Error(`orc fields stale (file ${marked ? marked[1].slice(0, 12) : "none"} live ${live.slice(0, 12)}); run npm run bake`);
}
