# Serbian Vote Abroad Form Filler

A single-page React app that helps Serbian citizens living abroad prepare their
voting registration request (_Zahtev za glasanje u inostranstvu_). The user
fills in a short wizard, adds a photo of their ID card or passport, draws a
signature, and the app stamps all of it onto the official PDF template and hands
the finished file back for e-mailing or printing.

It is a **local PDF filling tool that happens to be delivered over the web**,
not a web service. The user is the only party that ever sees their data.

## Security and privacy are the primary architectural concern

Everything else in this project is negotiable; this is not. The app handles a
JMBG, a home address, scans of an identity document and a handwritten
signature — the exact data set that must never end up on someone else's server.
The architecture is built so that it cannot.

- **Self-contained SPA.** The whole thing is static files: a JS bundle, a CSS
  file, two fonts, and the blank PDF template. There is no backend, no API, no
  database, no deploy-time environment variable, and there must never be one.
- **No data leaves the browser tab.** No API calls, no form posts, no
  telemetry, no analytics, no error reporting, no "anonymous" usage counters,
  no CDN pings. The only network requests the app makes are for two of its own
  static assets, both at page load.
- **No persistence of any kind.** Nothing is written to `localStorage`,
  `sessionStorage`, IndexedDB, cookies, the Cache API, or the File System
  Access API. Every field, image and the generated PDF live in React state and
  are gone on reload or tab close. The only artifact that touches the disk is
  the PDF the user explicitly downloads at the end.
- **Everything is processed locally.** PDF generation (`pdf-lib`), image
  cropping and JPEG re-encoding (an offscreen `<canvas>`), and signature
  capture all run in the tab. No server ever sees an input or an output.
- **No third-party runtime origins.** No Google Fonts, no icon CDN, no remote
  scripts, stylesheets, images or source maps. Both typefaces are vendored into
  the repository.
- **Fully offline after the first load.** Once the page has loaded, the wizard
  completes and the PDF downloads with the network cut. The template and the
  PDF's Roboto are fetched into memory at start-up (`src/pdfAssets.js`) rather
  than at generation time, so the last step needs nothing from the server.

This is enforced by the browser, not just by review: `index.html` ships a
**Content-Security-Policy** whose `connect-src 'self' data: blob:` makes it
impossible for the page — or for anything that ends up bundled into it — to
post the personal data anywhere, and whose `form-action 'none'` stops a native
form submission from putting it in a query string if a React submit handler
ever fails to run. Adding a dependency that needs a new CSP source is the
signal to re-read this section, not to widen the policy.

The app can also make the case to its own users: **"Kako da proverite ovu
stranicu"** (`src/components/TrustPage.jsx`) is reachable from every screen and
tells a non-technical reader how to check the claims — cut the internet and
finish the form anyway, or send the public repository to someone who reads
code.

**Banned throughout `src/` and `index.html`:** `fetch`/`XMLHttpRequest` to any
origin other than a same-origin relative path, `navigator.sendBeacon`,
`WebSocket`, `EventSource`, `navigator.serviceWorker`, `localStorage`,
`sessionStorage`, `indexedDB`, `document.cookie`, `navigator.geolocation`,
`navigator.clipboard.read*`, analytics initialisers of any kind, and any
`<img>`, `<link>` or `<script>` pointing at a remote host.

The only network calls in the codebase are
`fetch("./Zahtev-za-glasanje-u-inostranstvu.pdf")` and
`fetch("./Roboto-Regular.ttf")` — both same-origin, both in `src/pdfAssets.js`,
both at page load — plus `fetch(dataURL)` and `URL.createObjectURL(blob)`,
which are in-memory conversions that never touch the network. The grep that
enforces this is under [Verification](#verification), and it is short enough
that a sceptical reader can run it against a fresh clone themselves.

## Tech stack

### Runtime dependencies

-   **React 19** — UI, with no router and no state library; one linear wizard
    driven by a single `step` integer
-   **pdf-lib 1.17** + **@pdf-lib/fontkit** — fills the official template and
    embeds a Unicode font so Serbian diacritics survive into the PDF
-   **react-advanced-cropper 0.20** — the document crop stage

That is the whole list. A new package needs a privacy read first: it must make
no network calls and touch no storage.

### Build and tooling

-   **Vite 6** — dev server and production build
-   **Tailwind CSS 3** + **PostCSS** / **Autoprefixer** — layout and spacing
    utilities, over the design tokens declared as CSS variables in
    `src/index.css`
-   **ESLint 9** (flat config) — `no-unused-vars` is an error

## Project structure

```
index.html                 mounts src/main.jsx; carries the Content-Security-Policy
src/
├── main.jsx               entry point
├── App.jsx                page chrome: header, wizard/trust swap, foot band,
│                          and the PDF asset preload on mount
├── index.css              @font-face for Piazzolla, design tokens (light + dark),
│                          base styles, react-advanced-cropper overrides
├── pdfAssets.js           fetches the blank PDF + Roboto once at load and keeps
│                          the bytes in memory; owns PDF_FILE_NAME
├── pdfLayout.js           how a value is fitted onto a printed rule — shared by
│                          the step-1 warning and the step-5 drawing
├── assets/
│   ├── fonts/             Piazzolla woff2 subsets (latin, latin-ext)
│   └── mark-color.png, mark-white.png
└── components/
    ├── Form.jsx           ALL app state + step routing (the hub)
    ├── Form.css           shared class layer (.btn, .form-input, .panel, …)
    ├── SiteHeader.jsx     sticky header, trust link, "NIJE DRŽAVNA STRANICA" strip
    ├── StepHeader.jsx     "KORAK n OD 3" eyebrow + stage bars
    ├── TrustPage.jsx      "Kako da proverite ovu stranicu"
    ├── AboutPanel.jsx     who is behind the page (welcome + trust screens)
    ├── SignaturePad.jsx   canvas signature capture → cropped PNG data URL
    ├── ErrorBoundary.jsx  last-resort catch
    └── steps/
        ├── WelcomeStep.jsx                step 0
        ├── PersonalDataStep.jsx           step 1
        ├── DocumentTypeSelectionStep.jsx  step 2
        ├── PhotoStep.jsx                  step 3 (upload + crop, same screen)
        ├── ChipIdCardStep.jsx             step 3 (chip card: nothing to photograph)
        ├── SignatureStep.jsx              step 4
        ├── ReviewStep.jsx                 step 5 (pdf-lib generation)
        ├── ReviewView.jsx                 presentational half of step 5
        └── DoneStep.jsx                   step 6 (the download itself)
public/
├── Zahtev-za-glasanje-u-inostranstvu.pdf  blank official form (template)
├── Roboto-Regular.ttf                     font embedded *inside* the generated PDF
├── Piazzolla-OFL.txt, Roboto-OFL.txt      font licences, served with the site
└── favicon.svg
scripts/e2e.sh             drives the whole wizard in real Chrome via chrome-cli
```

## Features

-   Seven-screen guided wizard in Serbian (Latin script), addressing the user
    formally throughout
-   Three document paths — passport, chip-less ID card (two images), and
    chip ID card (no image, because the address it must prove is not printed on
    such a card)
-   Personal data entry with native HTML validation, a 13-digit JMBG field, and
    a warning when a value is too wide for the printed rule it has to fit on
-   Document upload and cropping at a fixed per-document aspect ratio, with
    rotation
-   Signature capture by mouse, touch, or keyboard (accessible fallback)
-   Client-side PDF generation: fields stamped at measured coordinates, the
    document images appended as a second page, the signature embedded
-   Accessibility as a requirement: labelled step regions, `aria-*` attributes,
    screen-reader announcements on every step change
-   Light and dark themes through a single set of design tokens
-   Works offline after the initial page load

## Getting started

### Prerequisites

-   Node.js version compatible with Vite 6
-   npm

### Install

```bash
git clone git@github.com:grupa-gradjana/formular-za-glasanje.git
cd formular-za-glasanje
npm install
```

### Commands

```bash
npm run dev       # Vite dev server, typically http://localhost:5173/
npm run lint      # ESLint (flat config); currently clean, keep it that way
npm run build     # production build into dist/
npm run preview   # serve dist/ locally — use this to verify the offline claim
npm run test:e2e  # drive the whole wizard in real Chrome (see below)
```

## Verification

There is no unit test suite. Verification is manual, but most of it can be
driven from the terminal.

**End to end.** `npm run test:e2e` drives the real wizard in Chrome through
`chrome-cli` — the cropper, the file inputs, the signature canvas and a real
`pdf-lib` run — then checks the generated PDF: that it is a valid PDF with the
page count that document type should produce (2, or 1 for a chip card), that
the download link carries the right filename and a `blob:` href, and that
`~/Downloads` is untouched by the run. It covers all three document paths
(`npm run test:e2e -- pasos` for one). It needs Chrome's **View → Developer →
Allow JavaScript from Apple Events** enabled once, and says so if it is not.

**Offline.** `npm run build && npm run preview`, load the page, stop the
server, then complete the wizard. The PDF must still download.

**Privacy self-check.** Before any commit:

```bash
grep -rnE "localStorage|sessionStorage|indexedDB|document\.cookie|sendBeacon|WebSocket|EventSource|serviceWorker|gtag|dataLayer" src/ index.html
grep -rnoE "https?://[^\"' )]+" src/ index.html   # only user-facing links are OK
grep -rn "fetch(" src/                            # every hit must be ./relative or data:/blob:
grep -n "Content-Security-Policy" index.html      # the policy must still be there
```

What still needs a human: the mobile layout, and whether a photo of a real
document comes out legible (the e2e script feeds the cropper a synthetic
image, so it proves the plumbing, not the quality).

## Workflow

| Step | Screen | What happens |
| --- | --- | --- |
| 0 | Welcome | what this is, what it does not do, who is behind it |
| 1 | Personal data | eight fields; warns when a value is too wide for its rule |
| 2 | Document type | passport first; both ID-card routes behind a one-way reveal |
| 3 | Photo **or** chip card | upload + crop (twice for an ID card), or the instructions for attaching an _očitana lična karta_ by hand |
| 4 | Signature | mouse, touch, or keyboard |
| 5 | Review | the PDF is built here as the screen appears |
| 6 | Done | the real `<a download>` the user taps, and what to do next |

Steps 1–5 map onto three named stages in the progress header; the numbering the
user sees is "KORAK n OD 3".

The download deliberately lives on step 6 rather than on the review screen:
iOS Safari honours `<a download>` only while the tap's user gesture is still
live, so the bytes are built ahead of time and the final screen offers a
genuine anchor to tap.

## Notes for contributors

**`src/components/steps/ReviewStep.jsx` is the most fragile file here.** It
draws each field at coordinates measured from the template itself — the y of
the printed rule the value sits on, the pitch of the thirteen JMBG boxes, the
date box, the signature box. **Replacing the PDF in `public/` invalidates every
one of those numbers.** They are collected in one `RULES` table plus a handful
of constants so that a template swap needs new numbers in one place rather than
in nine scattered `drawText` calls, but they do have to be re-measured, not
guessed: rasterise the page (`gs -sDEVICE=png16m -r110 -dFirstPage=1
-dLastPage=1 -sOutputFile=out.png <pdf>`) and check, because a field a few
points low is struck through by its own rule.

A new template also arrives with its own PDF metadata, and `PDFDocument.load()`
inherits most of the Info dictionary from it. Check a generated output for
`/Author`, `/Creator`, `/Title`, any XMP packet, and EXIF in the embedded
images before shipping one — otherwise a stranger's name rides along in every
request a citizen sends.

**Re-walk all three document paths after touching the wizard**, not just the
one you changed: `pasos` (one image), `licna-karta` (two images, so step 3 is
entered twice) and `licna-karta-cip` (no image, one-page PDF). The double pass
through step 3 is the most breakable part of the navigation.

**Conventions.** 4-space indentation, double quotes, semicolons; match the
surrounding file. Colour goes through a token in `src/index.css`, never through
a literal — the palette is four colours and swaps for dark mode in one place.
Tailwind utilities inline for layout and spacing; anything carrying the visual
identity belongs in the shared classes in `Form.css`. All user-visible copy is
Serbian in Latin script, addressing the reader formally, with the `sr-only`
text and `aria-*` attributes kept in sync with it. `npm run lint` is clean
today; `no-unused-vars` is an error.

Do not commit `dist/` or `node_modules/`. Do not add a backend, a deploy
pipeline, or an environment variable implying either.

## License

This project is licensed under the MIT License. The two bundled typefaces are
third-party works under their own terms:

| Font | Where | Licence |
| --- | --- | --- |
| **Piazzolla** (Huerta Tipográfica) — the UI typeface | `src/assets/fonts/*.woff2` | SIL OFL 1.1 — [`public/Piazzolla-OFL.txt`](public/Piazzolla-OFL.txt) |
| **Roboto** (The Roboto Project Authors) — embedded inside the generated PDF | `public/Roboto-Regular.ttf` | SIL OFL 1.1 — [`public/Roboto-OFL.txt`](public/Roboto-OFL.txt) |

Both licence files are served with the site, because OFL 1.1 clause 2 requires
each copy of the font binaries to travel with its copyright notice and licence.
Neither font may be sold on its own; both may be bundled and redistributed with
this software, which is what happens here.

The project's own terms:

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
