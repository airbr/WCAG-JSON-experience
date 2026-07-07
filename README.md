# WCAG-JSON — Interactive WCAG learning experience

WCAG-JSON is a small dependency-free html/css/js project meant to encourage hands-on learning of the Web Content Accessibility Guidelines (WCAG). It uses the Official JSON unaltered as the primary data source but is split into pieces in the app.

The idea: embed the WCAG material as structured JSON and present it in an interactive, exploratory UI so people can learn guidelines, success criteria, failures, and techniques by starting from the beginning, browsing, and experimenting with the little app.

### Key points
- Intent: teach WCAG concepts through a simple interactive experience that is ideally a bit fun as well to activate.
- Small and focused: the repo bundles a copy of the structured WCAG data (`js/wcag.json`) plus a tiny UI in `index.html` and `js/app.js`.

Quick start (no dependencies - other than a web server)

Use a lightweight static server as you prefer e.g. `python3 -m http.server` from the project folder

Future iterations of the project may be completely inline or have an inline distrution so as to be workable on file mode. 

### What you'll find

- `index.html` — the html 'shell'.
- `js/app.js` — core UI logic (reads `js/wcag.json`).
- `js/wcag.json` — the structured WCAG JSON content used by the UI.
- `css/style.css` — presentation styles.
- `img/` and `vendor/` — images and any small third-party assets used by the demo (currently no third-party assets).

### Notes and disclaimers

- This project is an educational view of the WCAG content meant for learning and exploration. It is not a substitute for the official WCAG documentation at https://www.w3.org/TR/WCAG22/. The WCAG JSON in this Project is used aiming to follow their terms completely. 
- It is easy to run and inspect, but also intentionally minimal — feel free to work and improve.


### Roadmap

Main goal: Improve accessibility of dynamically loaded content. Testing with various assistive tech. Get the back button to work or do something better.

Improve Navigation and Progress through the Journey.