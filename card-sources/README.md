# Canvas course card sources

The SVG sources for the Canvas course card images. Canvas shows these as the
course tile on the dashboard, so their job is to make a course findable at a
glance — course number, who it belongs to, and an oversized mark in a distinct
hue per course.

These are **build sources, not course media**. They deliberately live outside
`assets/`: that directory is the published gallery, where every file needs an
`alts.json` key (`npm run check` enforces it) and gets a public URL. A source
file has no business in the gallery.

## Regenerating

```sh
rsvg-convert -w 800 -h 450 -o ../assets/idmx225-card-caruso.png idmx225-card-caruso.svg
```

Verified: re-rendering `idmx225-card-caruso.svg` and `idmx225-card-sichel.svg`
with that exact command reproduces the committed PNGs with **zero** differing
pixels (`magick compare -metric AE`). Card canvas is 800×450.

## What is here

| Source | Published PNG | Course |
| --- | --- | --- |
| `idmx225-card-caruso.svg` | `assets/idmx225-card-caruso.png` | IDMX 225, Steve Caruso |
| `idmx225-card-sichel.svg` | `assets/idmx225-card-sichel.png` | IDMX 225, Lynn Sichel |
| `idmx268-card-sandbox.svg` | *(none — uploaded straight to Canvas)* | IDMX 268 sandbox |

`idmx268-card-sandbox.svg` is the odd one out: it is the card for the emptied
IDMX-268 Web Page Development II sandbox, and it was uploaded directly to that
course as a Canvas course file rather than published here, because it needs no
public URL. Its source is kept here so it does not rot in scratch.

**`assets/idmx225-card-teeters.png` has no source in this folder.** It was
generated the same way but its SVG was never recovered from scratch. Anyone
editing that card has to rebuild the source from the PNG first, or re-derive it
from a sibling — the two `idmx225-*.svg` files here are the template.

## Conventions

- Colors are `hsl()` only, never hex.
- Each course gets its own hue so the dashboard tiles are distinguishable:
  Caruso blue-teal, Sichel magenta-purple, the 268 sandbox navy-to-violet.
- Text contrast is checked against the *actual gradient pixels* behind each
  text run, not against a flat guess — the target is 4.5:1, which Canvas's
  accessibility audit also expects.
