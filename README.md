# WCAG-JSON — Interactive WCAG learning experience

WCAG-JSON is a small, dependency-free, browser-based project meant to encourage hands-on learning of the Web Content Accessibility Guidelines (WCAG). It uses the Official JSON unaltered as the primary data source.

The idea: embed the WCAG material as structured JSON and present it in an interactive, exploratory UI so people can learn guidelines, success criteria, failures, and techniques by trying, browsing, and experimenting.

Key points
- Intent: teach WCAG concepts through a simple interactive experience that is ideally a bit fun..
- Small and focused: the repo bundles a copy of the structured WCAG data (`js/wcag.json`) plus a tiny UI in `index.html` and `js/app.js`.

Quick start (no dependencies)

 Use a lightweight static server as you prefer e.g. `python3 -m http.server` from the project folder

What you'll find

- `index.html` — the interactive UI shell.
- `js/app.js` — core UI logic (reads `js/wcag.json` and renders interactive screens).
- `js/wcag.json` — the structured WCAG content used by the UI.
- `css/style.css` — presentation styles.
- `img/` and `vendor/` — images and any small third-party assets used by the demo.

Notes and disclaimers

- This project is an educational view of the WCAG content meant for learning and exploration. It is not a substitute for the official WCAG documentation at https://www.w3.org/TR/WCAG22/. The WCAG JSON in this Project is used aiming to follow their terms completely. 
- It is easy to run and inspect, but also intentionally minimal — feel free to fork and extend.


## Roadmap

Main goal: Fix Undefined issues with some SC's

1. Add Header - Done
2. Deploy on Cloudflare - Done 
3. "What is this?" Details/Summary element - Done
4. Explore Breadcrumb/Navigation styles. ?? TODO
5. Clarify functionality-
    * Choices
      * Of Guidelines - Now random option and choice available
    * Random
      * Of success criteria - TODO
