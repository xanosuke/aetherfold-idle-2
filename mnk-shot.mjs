import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
page.on("console", (msg) => console.log("BROWSER", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR", err.message));
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  localStorage.setItem("first-swing-jobs", JSON.stringify({ main: "MNK", sub: null }));
});
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
const label = await page.locator("header").innerText();
console.log("HEADER", JSON.stringify(label));
await page.getByRole("button", { name: "Start" }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/mnk-yard.png" });
await browser.close();
