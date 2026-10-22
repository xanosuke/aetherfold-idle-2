import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { assertRonfaure, liveField } = await jiti.import("/workspace/src/game/ronfaure.ts");
assertRonfaure();
const out = liveField().filter((b) => b.x < -400);
const names = {};
for (const b of out) names[b.name] = (names[b.name] || 0) + 1;
console.log("outpost", out.length);
console.log(names);
let near = 0;
for (const b of out) {
  if (Math.hypot(b.x + 1009.8, b.z - 486.8) < 18) near += 1;
}
console.log("within 18 of the screenshot spot", near);
