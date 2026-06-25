# Coopers Golf — Logo Options

Logo exploration for **Coopers Golf**, a new Australian golf-apparel brand
("Australia's best golf apparel"). Two complete directions, 25 concepts each,
delivered as scalable vector **SVG** + preview **PNG**.

> Vectors (not AI raster) are the deliverable on purpose: they're crisp at any
> size and editable for embroidery, hangtags, web and caps. The Higgsfield AI
> image path is still wired up (see `BRIEF.md`) for when that engine reconnects.

## ⚡ Direction B — "POP" (current) — `renders-pop/` · `svg-pop/`
Bright, bold, modern golf-streetwear energy with an Aussie-sun punch.
Contact sheet: `renders-pop/_contact-sheet.png`

| # | Name | # | Name | # | Name |
|---|------|---|------|---|------|
| 01 | Sunburst CG | 10 | Lightning Tee | 19 | Starburst Badge |
| 02 | Mega Wordmark | 11 | Sun Australia | 20 | Neon Outline |
| 03 | Ball Blast | 12 | Retro Arch | 21 | Sunray Wordmark |
| 04 | Sunset Scene | 13 | Halftone Ball | 22 | Eclipse Ball |
| 05 | Smiley Ball | 14 | Bolt CG | 23 | Boomerang Pop |
| 06 | Bold Roundel | 15 | Gradient Ring | 24 | Checker Pop |
| 07 | Flag Pop | 16 | Pop Shield | 25 | Big Sun Roundel |
| 08 | Swing Speed | 17 | Double-O Pop | | |
| 09 | Stacked Blocks | 18 | Wave Links | | |

**Palette:** ink `#0E0E12`, coral `#FF5630`, flame `#FF7A18`, sun `#FFC02E`,
lime `#9BE022`, grass `#2FBF4F`, teal `#06C3C3`, blue `#2E5BFF`, violet `#7B4DFF`,
pink `#FF3D8B`, cream `#FFF6E6`.

## 🏛️ Direction A — "Heritage" (first pass) — `renders/` · `svg/`
Premium clubhouse: navy / fairway-green / brass crests, monograms, wordmarks.
Kept as an alternate. Contact sheet: `renders/_contact-sheet.png`

## Regenerate / tweak
```bash
npm i @resvg/resvg-js
node generate-pop.js        # → svg-pop/ + renders-pop/
node generate-heritage.js   # → svg/ + renders/
```
Every mark is plain code — colours, type and layout are trivial to adjust. Tell
me which numbers you like and I'll refine those (colourways, wordmark, real brand
font) and export final logo packs (full-colour / 1-colour / reversed / icon-only).
