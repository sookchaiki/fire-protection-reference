[README.md](https://github.com/user-attachments/files/28147718/README.md)
# SOLAS II-2/14.2.2 — Fire Protection Maintenance & Inspection Reference

A single-file, offline-capable reference and survey-planning tool for the
maintenance, testing and inspection of shipboard fire protection systems,
grounded on SOLAS reg. II-2/14.2.2 and the associated IMO instruments
(MSC.1/Circ.1432 as amended by 1516, MSC.1/Circ.1318/Rev.1, MSC.1/Circ.1312,
resolution A.951(23)).

## What's in this repo

- `index.html` — the entire application in one self-contained file (React,
  fonts, and all data embedded; no build step, no external dependencies, works
  offline). This is the file GitHub Pages serves.

## Features

- Searchable / filterable reference of periodic items by interval, system
  (medium), and flag administration, with smart natural-language search.
- LR Approved Firm lookup per equipment type.
- Survey Planner: enter a ship build date to project age-based due / overdue /
  upcoming periodic items, with optional last-completed-date overrides.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (public is simplest for Pages).
2. Upload `index.html` to the repository root (drag-and-drop in the GitHub web
   UI, or `git add index.html && git commit && git push`).
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch **main** (or your default) and folder **/ (root)**, then
   **Save**.
6. Wait ~1 minute. Your site goes live at
   `https://<your-username>.github.io/<repo-name>/`.

Because the app is a single self-contained file, no build tools, Actions
workflow, or framework configuration is required.

## Updating

Edit the source (`FireSafetyRef.jsx`) and rebuild `index.html`, or edit the
data and re-deploy. Bump the `VERSION` / `BUILD_DATE` / `CHANGELOG` constants
near the top of the source on each change — the version shows in the app header
and footer.

## Disclaimer

This tool organises maintenance, testing and inspection requirements for
surveyor reference and planning. It is not a substitute for the full text of
the applicable IMO instruments, the manufacturer's maintenance instructions, or
the flag Administration's current requirements. Always verify against the
latest applicable circular and the ship's survey records.
