# IDMX-225 — course assets

Public media host for the IDMX-225 (Web Page Development I) course wiki at
Raritan Valley Community College. Images live under [`assets/`](assets/) and are
served via GitHub Pages so they can be embedded in the wiki and pasted into
Canvas pages as absolute URLs.

The course content (text, pages, quizzes) lives in a separate **private**
repository.

## Adding an asset

1. Drop the file into `assets/`. Subfolders are supported and are walked
   recursively.
2. Add its alt text to `_data/alts.json`. The key is the file's path relative to
   `assets/` — `cat.jpg` at the top level, `grid-invite/claim-01-picker.png`
   inside a subfolder.
3. Push to `main`. The Pages workflow rebuilds the gallery and redeploys.

Preview locally with `npm start` (Eleventy dev server) or build once with
`npm run build`.

## License

Original images © 2026 Steven Caruso, Cynthia Teeters and Lynn Sichel, licensed
under [CC BY-NC-SA 4.0](LICENSE). Student work and third-party images are
excluded — see [NOTICE.md](NOTICE.md).
