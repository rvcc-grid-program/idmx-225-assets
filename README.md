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
it: files with no key, keys with no file, empty descriptions, and unsorted keys.

The Pages workflow runs `npm run check` before building, so drift fails the deploy
rather than shipping. Every asset needs a real description before it can go live —
that is deliberate, since the whole point of the gallery is copy-paste-ready
`img` tags with alt text already in them.

## License

Original images © 2026 Steven Caruso, Cynthia Teeters and Lynn Sichel, licensed
under [CC BY-NC-SA 4.0](LICENSE). Student work and third-party images are
excluded — see [NOTICE.md](NOTICE.md).
