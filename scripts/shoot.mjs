/**
 * Screenshots pages at a set of viewports and reports any horizontal overflow,
 * naming the widest offending element. Uses the Chrome already on the machine.
 */
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "./.shots";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
  { name: "tablet", width: 834, height: 1112, deviceScaleFactor: 2, isMobile: true },
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
];

const paths = process.argv.slice(2);
if (paths.length === 0) paths.push("/");

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu"],
});

let problems = 0;

for (const route of paths) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("pageerror", (e) => consoleErrors.push(String(e).slice(0, 200)));
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
    });
    await page.setViewport(vp);
    await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 60_000 });
    await page.evaluate(() => document.fonts.ready);
    // Walk the page so scroll reveals fire before the capture.
    await page.evaluate(async () => {
      // The site sets scroll-behavior: smooth, which would swallow these steps.
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      const step = window.innerHeight * 0.6;
      const total = root.scrollHeight;
      for (let y = 0; y < total; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
      root.style.scrollBehavior = previous;
    });
    await new Promise((r) => setTimeout(r, 500));

    const report = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const viewWidth = document.documentElement.clientWidth;
      const offenders = [];
      if (docWidth > viewWidth + 1) {
        const over = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const style = getComputedStyle(el);
          if (style.position === "fixed") continue; // cannot widen the document
          if (r.right <= viewWidth + 1) continue;
          // An ancestor that clips horizontally absorbs the overflow, so the
          // element cannot be what is widening the document.
          let clipped = false;
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if (ox === "hidden" || ox === "clip" || ox === "auto" || ox === "scroll") {
              clipped = true;
              break;
            }
          }
          if (clipped) continue;
          over.push({ el, r, style });
        }
        // Keep only the elements that have no overflowing descendant: those are
        // the actual causes rather than the ancestors carrying them.
        for (const entry of over) {
          const hasOverflowingChild = over.some(
            (other) => other.el !== entry.el && entry.el.contains(other.el),
          );
          if (hasOverflowingChild) continue;
          offenders.push({
            tag: entry.el.tagName.toLowerCase(),
            cls: (entry.el.className?.toString?.() ?? "").slice(0, 110),
            text: (entry.el.textContent ?? "").trim().slice(0, 40),
            pos: entry.style.position,
            left: Math.round(entry.r.left),
            right: Math.round(entry.r.right),
          });
        }
      }
      const reveals = document.querySelectorAll(".reveal").length;
      const revealed = document.querySelectorAll(".reveal.is-revealed").length;
      return { docWidth, viewWidth, reveals, revealed, offenders: offenders.slice(0, 8) };
    });

    const slug = (route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, ""));
    await page.screenshot({ path: `${OUT}/${slug}-${vp.name}.png`, fullPage: true });

    const overflow = report.docWidth > report.viewWidth + 1;
    if (overflow) problems += 1;
    console.log(
      `${overflow ? "OVERFLOW" : "ok      "} ${vp.name.padEnd(7)} ${route}  doc=${report.docWidth} view=${report.viewWidth} reveals=${report.revealed}/${report.reveals}`,
    );
    for (const e of consoleErrors) {
      problems += 1;
      console.log(`           CONSOLE ${e}`);
    }
    for (const o of report.offenders) {
      console.log(`           <${o.tag} pos=${o.pos} left=${o.left} right=${o.right}>\n             class="${o.cls}"\n             text="${o.text}"`);
    }
    await page.close();
  }
}

await browser.close();
process.exit(problems > 0 ? 1 : 0);
