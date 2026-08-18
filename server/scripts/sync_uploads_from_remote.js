/**
 * Download CMS /uploads files referenced by a live site into server/uploads.
 * Defaults: pull from production (refex.co.in) using paths listed on UAT CMS APIs.
 *
 * Usage:
 *   node scripts/sync_uploads_from_remote.js
 *   node scripts/sync_uploads_from_remote.js --refs=https://uat.refex.co.in --source=https://refex.co.in
 *   node scripts/sync_uploads_from_remote.js --source=https://refex.co.in --paths=/uploads/images/foo.jpg
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

function argValue(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

const refsBase = argValue("refs", "https://uat.refex.co.in");
const sourceBase = argValue("source", "https://refex.co.in").replace(/\/$/, "");
const singlePaths = argValue("paths", "");
const uploadsRoot = path.join(__dirname, "..", "uploads");

const endpoints = [
  "/api/cms/header",
  "/api/cms/footer",
  "/api/cms/home/slides",
  "/api/cms/home/offerings",
  "/api/cms/home/awards",
  "/api/cms/home/flip-cards",
  "/api/cms/home/news-items",
  "/api/cms/about/presence",
  "/api/cms/about/hero",
  "/api/cms/esg/hero",
  "/api/cms/esg/sdg-section",
  "/api/cms/esg/programs",
  "/api/cms/esg/awards",
  "/api/cms/esg/reports",
  "/api/cms/esg/policies",
  "/api/cms/esg/refex-on-esg",
  "/api/cms/esg/sustainable-business",
  "/api/cms/ash-utilization/hero",
  "/api/cms/green-mobility/hero",
  "/api/cms/venwind-refex/hero",
  "/api/cms/newsroom/hero",
  "/api/cms/contact/hero",
  "/api/cms/investors/hero",
];

function walk(value, out) {
  if (value == null) return;
  if (typeof value === "string") {
    const matches = value.match(/\/uploads\/[^\s"'\\]+/g);
    if (matches) matches.forEach((p) => out.add(p.split("?")[0]));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v) => walk(v, out));
    return;
  }
  if (typeof value === "object") {
    Object.values(value).forEach((v) => walk(v, out));
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const lib = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    lib
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve()));
      })
      .on("error", (err) => {
        file.close();
        try {
          fs.unlinkSync(dest);
        } catch (_) {}
        reject(err);
      });
  });
}

async function collectRefs() {
  if (singlePaths) {
    return singlePaths.split(",").map((p) => p.trim()).filter(Boolean);
  }
  const refs = new Set();
  for (const ep of endpoints) {
    try {
      const json = await fetchJson(`${refsBase}${ep}`);
      walk(json, refs);
    } catch (_) {
      /* ignore missing endpoints */
    }
  }
  return [...refs].sort();
}

async function main() {
  console.log(`Refs from:   ${refsBase}`);
  console.log(`Download from: ${sourceBase}`);
  console.log(`Save into:   ${uploadsRoot}\n`);

  const refs = await collectRefs();
  console.log(`Found ${refs.length} upload paths\n`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const rel of refs) {
    const clean = rel.startsWith("/uploads/") ? rel.slice("/uploads/".length) : rel.replace(/^\//, "");
    const dest = path.join(uploadsRoot, clean);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      console.log(`  ✓ exists ${rel}`);
      skipped += 1;
      continue;
    }
    const url = `${sourceBase}/uploads/${clean}`.replace(/([^:]\/)\/+/g, "$1");
    try {
      await download(url, dest);
      console.log(`  + ${rel}`);
      ok += 1;
    } catch (err) {
      console.log(`  ✗ ${rel} (${err.message})`);
      failed += 1;
    }
  }

  console.log(`\nDone. downloaded=${ok} skipped=${skipped} failed=${failed}`);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
