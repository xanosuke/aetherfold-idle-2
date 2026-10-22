import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
const errors = [];
page.on("pageerror", (err) => {
  if (!String(err.message).includes("Hydration")) errors.push(err.message);
});
await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded" });
await page.evaluate(() => {
  localStorage.setItem("first-swing-jobs", JSON.stringify({ main: "NIN", sub: null, race: "hume" }));
  localStorage.removeItem("first-swing-loadout");
  localStorage.setItem("first-swing-home", "spawn");
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.getByRole("button", { name: "Start" }).click();
await page.waitForTimeout(600);
const spots = [[500, 250], [540, 230], [470, 270], [560, 280], [430, 240], [600, 260], [480, 200]];
let targeted = false;
for (const [x, y] of spots) {
  await page.mouse.click(x, y);
  await page.waitForTimeout(120);
  if (await page.getByRole("button", { name: "Engage" }).count()) {
    targeted = true;
    console.log("TARGET", x, y);
    break;
  }
}
if (!targeted) {
  await page.screenshot({ path: "/workspace/screenshots/dw-miss.png" });
  console.log("NO TARGET");
  await browser.close();
  process.exit(1);
}
await page.evaluate(() => window.__controlsTest?.setKeys?.(["KeyW"]));
await page.waitForTimeout(250);
await page.evaluate(() => window.__controlsTest?.setKeys?.([]));
await page.waitForTimeout(150);
await page.getByRole("button", { name: "Engage" }).click();
await page.waitForTimeout(2700);
for (let i = 0; i < 18; i++) {
  await page.screenshot({ path: `/workspace/screenshots/dw-${String(i).padStart(2, "0")}.png` });
  await page.waitForTimeout(60);
}
const text = await page.locator("body").innerText();
console.log("TEXT", JSON.stringify(text).slice(0, 1800));
console.log("ERRORS", JSON.stringify(errors));
await browser.close();
