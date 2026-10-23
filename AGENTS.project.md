ZONE LAYOUT RULES (Aetherfold Idle 2)
- The Ranguemont Pass layout lives ONLY in src/game/pass-graph.ts (PASS_GRAPH). Never invent,
  add, remove, widen or straighten tunnels, rooms, exits or doors. If the graph looks wrong,
  stop and tell me; do not "fix" it.
- World axes are the ones in src/game/world.ts: yalms, +X east, +Z south (screen-down), north = -Z.
- Ranguemont grid: PASS_CELL = 48 yalms per square, PASS_X = 80, PASS_Z = -470, column 0 = A,
  row 0 = row 1. world x = PASS_X + gx * PASS_CELL, world z = PASS_Z + gy * PASS_CELL.
  Use passSquare() for grid labels.
- Keep the public API of src/game/pass.ts working, because world.ts, YardMap.tsx and engine.ts
  import it: inPass, clampPass, passWet, passSquare, passChart, oneWayBlocks, assertPass,
  PASS_GATES, PASS_DOORS, PASS_ARRIVE, PASS_FROM_GLACIER, PASS_NPCS, PASS_PLACES, PASS_CELL.
  Change what they do inside, not their names or parameters.
- Don't touch other zones (ronfaure.ts, east-ronfaure.ts, glacier.ts, tomb.ts, ghelsba.ts)
  unless the step says so.
- After every step: npm run typecheck, npm run build and node scripts/browser-smoke.mjs must
  pass, and assertPass() must not throw. List the files you changed and stop.
- After every step, once typecheck, build, smoke and any zone checks pass, commit all changes
  with a message starting with the step name (e.g. "Step 7b: ...") and push to the main
  branch of https://github.com/xanosuke/aetherfold-idle-2. Never push if a check fails.
  End your reply with the commit SHA.
