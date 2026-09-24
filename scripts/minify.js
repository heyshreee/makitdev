#!/usr/bin/env node
/**
 * makitdev — CSS minifier (no dependencies).
 *
 * Regenerates the `.min.css` artifacts used by the pages from the readable
 * source files in assets/css/. Run after editing any stylesheet:
 *
 *     node scripts/minify.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

/**
 * Conservative CSS minification. It intentionally leaves the whitespace inside
 * calc()/nth-child() expressions intact (no stripping around `+`/`-`/`~`/`=`),
 * so math expressions stay valid.
 */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "") // strip comments
    .replace(/\s+/g, " ") // collapse newlines/whitespace to one space
    .replace(/\s*([{}:;,>])\s*/g, "$1") // trim around safe punctuation
    .replace(/;}/g, "}") // drop the last semicolon before a closing brace
    .trim();
}

const pairs = [
  ["assets/css/main.css", "assets/css/main.min.css"],
  ["assets/css/contributors.css", "assets/css/contributors.min.css"],
];

for (const [src, out] of pairs) {
  const input = fs.readFileSync(path.join(ROOT, src), "utf8");
  const output = minifyCss(input) + "\n";
  fs.writeFileSync(path.join(ROOT, out), output);
  const savedPct = ((1 - output.length / input.length) * 100).toFixed(0);
  console.log(
    `${src} -> ${out}  (${input.length} -> ${output.length} bytes, ${savedPct}% smaller)`
  );
}