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

ZONE RULES (all zones)
- STRICT: every zone line must sit in the retail map square on BOTH sides and lead to the right neighbour. The source of truth is src/game/world-links.ts (WORLD_LINKS). Never move a gate without updating that table, and never edit the table to make a wrong gate pass.
- LOOSE: layouts don't have to be 1:1 with retail. Keep each zone's rough shape, major landmarks and character (forest, orc canyon, crypt, glacier). Don't redraw a zone's coast polygon or rooms unless a step asks.
- Squares come from src/game/zone-grid.ts (ZONE_GRIDS / squareOf). Don't hand-roll "ABCDEFGHIJKL"[...] in zone files.
- After every step, assertWorldLinks() must pass along with the existing checks (once Step A2 starts fixing exits).

PAINTED GROUND (Yughott first; later zones use this pattern)
- Bake the walkable trace to a ground texture, about 2 px per yalm, in 256-yalm tiles (scripts/bake-yughott-paint.mjs). Floor colour, a soft 2-yalm vignette at the wall foot, rock outside fading toward the fog.
- In game the floor is flat textured quads (MeshBasicMaterial), named so the grotto view still reads them as floor. Not a slope shader. Keep the heightfield only for groundY, so feet stay on the terrace they are standing on.
- Walls are one extruded strip along the walkable edge: 2.5 yalms on the north and sides, 1.0 on the south (camera) side, flat colour with a lighter top. No terrace-step mesh, no shelf, no strata shader, no rim fill.
- Props stay few (about 15–40 a map), merged by map, and do not cast shadows. Actors use blob shadows in the grotto and their parts draw as one batched toon mesh so a zone stays under 60 draw calls. Pools stay painted water with a soft sheen.


