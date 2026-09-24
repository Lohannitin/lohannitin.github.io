// Renders the CV HTML sources to A4 PDFs with headless Chromium (Playwright).
// Usage: python3 build.py   (runs this script, then writes PDF metadata)
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const here = path.dirname(fileURLToPath(import.meta.url));
const jobs = [
  ['academic.html', '../Nitin_Lohan_CV_Academic.pdf'],
  ['ai-trainer.html', '../Nitin_Lohan_CV_AI_Trainer.pdf'],
];

const browser = await playwright.chromium.launch();
const page = await browser.newPage();
for (const [src, out] of jobs) {
  await page.goto(pathToFileURL(path.join(here, src)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(here, out), preferCSSPageSize: true, printBackground: true });
  console.log('wrote', out);
}
await browser.close();
