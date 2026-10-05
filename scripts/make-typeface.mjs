// One-off: turn a font into a three.js typeface JSON for the 3D balloon title.
// Run with `node scripts/make-typeface.mjs` (defaults to Fredoka Bold).
import { readFileSync, writeFileSync } from "node:fs";
import opentype from "opentype.js";

const src = process.argv[2] ?? "node_modules/@fontsource/fredoka/files/fredoka-latin-700-normal.woff";
const out = process.argv[3] ?? "public/fonts/fredoka-bold.typeface.json";
const buf = readFileSync(src);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const round = (n) => Math.round(n);

const glyphs = {};
for (const ch of "abcdefghijklmnopqrstuvwxyz ") {
  const g = font.charToGlyph(ch);
  // three.js wants the end point first, then the control points
  const o = g.path.commands
    .map((c) => {
      switch (c.type) {
        case "M": return `m ${round(c.x)} ${round(c.y)}`;
        case "L": return `l ${round(c.x)} ${round(c.y)}`;
        case "Q": return `q ${round(c.x)} ${round(c.y)} ${round(c.x1)} ${round(c.y1)}`;
        case "C": return `b ${round(c.x)} ${round(c.y)} ${round(c.x1)} ${round(c.y1)} ${round(c.x2)} ${round(c.y2)}`;
        default: return "";
      }
    })
    .filter(Boolean)
    .join(" ");
  const bb = g.getBoundingBox();
  glyphs[ch] = { ha: round(g.advanceWidth), x_min: round(bb.x1), x_max: round(bb.x2), o };
}

const head = font.tables.head;
writeFileSync(
  out,
  JSON.stringify({
    glyphs,
    familyName: font.names.fontFamily?.en ?? "font",
    ascender: font.ascender,
    descender: font.descender,
    underlinePosition: font.tables.post.underlinePosition,
    underlineThickness: font.tables.post.underlineThickness,
    boundingBox: { xMin: head.xMin, yMin: head.yMin, xMax: head.xMax, yMax: head.yMax },
    resolution: font.unitsPerEm,
    original_font_information: { fontFamily: font.names.fontFamily?.en, license: "SIL Open Font License 1.1" },
  }),
);
console.log(`wrote ${out}`);
