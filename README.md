# IDMX-225 — course assets

Public media host for the IDMX-225 (Web Page Development I) course wiki at
Raritan Valley Community College. Images live under [`assets/`](assets/) and are
served via GitHub Pages so they can be embedded in the wiki and pasted into
Canvas pages as absolute URLs.

The course content (text, pages, quizzes) lives in a separate **private**
repository.

## Setup

Install once per clone, before any of the `npm run` commands below:

```bash
npm ci
```

Node 24 is what CI uses. Anything from Node 20.12 up will work — the asset walk
relies on recursive `readdirSync` and `Dirent.parentPath`.

## Using an asset that is already published

Browse the gallery: <https://rvcc-grid-program.github.io/idmx-225-assets/>

Every published asset is a card there showing the image, its filename, its alt
text, and buttons that copy a ready-made snippet to your clipboard. The search
box filters on filename *and* alt text, so you can find a screenshot by what is
in it ("lighthouse", "carrots", "drop cap") without remembering what it was
named.

Four snippet forms are available. Images get all four; non-image assets like
`.zip` and `.xls` get only **URL** and **MD link**, since there is nothing to
embed:

- **URL** — the bare absolute URL. Use it when something else wants just a link.
- **HTML** — `<img src="…" alt="…">`. Paste this into the Canvas rich content
  editor.
- **MD image** — `![alt](url)`. This is the form the private course-content repo
  uses, because its pages are markdown and its build guard rejects raw HTML in
  prose.
- **MD link** — `[filename](url)`. A plain link, for linking to a download
  rather than showing it.

The **MD image** button on `vscode-search-icon.png` copies this:

```markdown
![VS Code Search icon: a white magnifying glass on a dark background](https://rvcc-grid-program.github.io/idmx-225-assets/assets/vscode-search-icon.png)
```

The alt text travels with the snippet, but it does not stay linked to it. Once
pasted, that text belongs to the page it landed on — editing `_data/alts.json`
later changes the gallery, not any page you already built. There are two pools
of alt text and one limit: `alts.json` feeds the gallery, and the alt text that
actually reaches Canvas is written inline in the private content repo, whose own
checker enforces the same 120-character cap (`scripts/lib/check.js`, error code
`alt-text-too-long`). That repo documents the end-to-end workflow in
`docs/adding-an-image-to-a-page.md`.

## Adding an asset

1. Drop the file into `assets/`. Subfolders are supported and are walked
   recursively.
2. Add its alt text to `_data/alts.json`. The key is the file's path relative to
   `assets/` — `cat.jpg` at the top level, `grid-invite/claim-01-picker.png`
   inside a subfolder. Keep it under 120 characters — Canvas LMS flags anything
   longer — and aim for about 110.
3. Run `npm run check` to confirm every file has a description.
4. Push to `main`. The Pages workflow rebuilds the gallery and redeploys.

Preview locally with `npm start` (Eleventy dev server) or build once with
`npm run build`.

## Renaming an asset

`npm run fix-renames` carries alt text across renames. It reads git's rename
detection, so it knows which old name became which new one — no guessing:

```bash
npm run fix-renames              # dry run: prints what would move
npm run fix-renames -- --write   # applies the moves
```

Run it after committing the rename. If you rename and commit alt text in one go,
there is nothing to carry.

## Keeping alt text honest

`assets/` and `_data/alts.json` have to describe the same set of files. They drift
silently — a new file renders with a "no alt text" flag, and a renamed file leaves
its old key stranded while the new name has none. `npm run check` catches all of
it: files with no key, keys with no file, empty descriptions, descriptions over
120 characters (Canvas LMS rejects those), and unsorted keys.

The Pages workflow runs `npm run check` before building, so drift fails the deploy
rather than shipping. Every asset needs a real description before it can go live —
that is deliberate, since the whole point of the gallery is copy-paste-ready
`img` tags with alt text already in them.

## License

Original images © 2026 Steven Caruso, Cynthia Teeters and Lynn Sichel, licensed
under [CC BY-NC-SA 4.0](LICENSE). Student work and third-party images are
excluded — see [NOTICE.md](NOTICE.md).
