# WCAG-JSON — Interactive WCAG learning experience

> NOTE: Current website still under construction. Some techniques under success criteria do not populate. 01/13/2026

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

### Performance notes

From some quick tests:
1. First load, approximately 104kb transferred. These are all the assets described above, without the data of the JSON.
2. Upon Interaction, 515kb of JSON is loaded and should be cached for all subsequent fetch requests and navigation of the website.

An overall session and repeat visits... under a megabyte? Pretty good for a start.

### Notes and disclaimers

- This project is an educational view of the WCAG content meant for learning and exploration. It is not a substitute for the official WCAG documentation at https://www.w3.org/TR/WCAG22/. The WCAG JSON in this Project is used aiming to follow their terms completely. 
- It is easy to run and inspect, but also intentionally minimal — feel free to work and improve.


### Roadmap

Main goal: Improve accessibility of dynamically loaded content. Testing with various assistive tech. Get the back button to work or do something better.

Improve Navigation and Progress through the Journey.

Secondary goal:

Fix remaining undefined issues, such as when `and` and `using` are both used in a success criteria

```
                  {
                    "title": "Fifth Requirement: Techniques to ensure text can be resized without assistive technology up to 200 percent in a way that does not require the user to scroll horizontally to read a line of text on a full-screen window",
                    "techniques": [
                      {
                        "id": "G204",
                        "technology": "general",
                        "title": "Not interfering with the user agent's reflow of text as the viewing window is narrowed"
                      },
                      {
                        "and": [
                          {
                            "id": "G146",
                            "technology": "general",
                            "title": "Using liquid layout"
                          },
                          {
                            "title": "using measurements that are relative to other measurements in the content"
                          }
                        ],
                        "using": [
                          {
                            "id": "C12",
                            "technology": "css",
                            "title": "Using percent for font sizes"
                          },
                          {
                            "id": "C13",
                            "technology": "css",
                            "title": "Using named font sizes"
                          },
                          {
                            "id": "C14",
                            "technology": "css",
                            "title": "Using em units for font sizes"
                          },
                          {
                            "id": "C24",
                            "technology": "css",
                            "title": "Using percentage values in CSS for container sizes"
                          },
                          {
                            "id": "SCR34",
                            "technology": "client-side-script",
                            "title": "Calculating size and position in a way that scales with text size"
                          }
                        ]
                      },
```

Also


```
{
                    "title": "Situation F: If the non-text content should be ignored by assistive technology:",
                    "techniques": [
                      {
                        "title": "Implementing or marking the non-text content so that it will be ignored by assistive technology",
                        "suffix": "using one technique from each group outlined below"
                      }
                    ],
                    "groups": [
                      {
                        "id": "text-equiv-all-situation-f-notrequired",
                        "title": "Techniques to indicate that text alternatives are not required for Situation F",
                        "techniques": [
                          {
                            "id": "C9",
                            "technology": "css",
                            "title": "Using CSS to include decorative images"
                          },
                          {
                            "id": "H67",
                            "technology": "html",
                            "title": "Using null alt text and no title attribute on img elements for images that assistive technology should ignore"
                          },
                          {
                            "id": "PDF4",
                            "technology": "pdf",
                            "title": "Hiding decorative images with the Artifact tag in PDF documents"
                          }
                        ]
                      }
                    ]
                  }
```