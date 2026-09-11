/**
 * The blank form and the font it gets filled in with — the last two things
 * this app needs from the network.
 *
 * They used to be fetched inside `handleGeneratePDF`, which made the final
 * click of the wizard the one step that could not be served offline: the user
 * fills everything in, the connection drops, and generation fails *after* the
 * JMBG, both sides of the ID and the signature have been entered — none of
 * which survive a reload, by design. Fetching them once at start-up is what
 * makes "loaded once, then works with the network cut" true for the whole
 * flow, not just for the steps before this one.
 *
 * Both are same-origin static files and are kept in memory as ArrayBuffers,
 * alongside the rest of the form state: nothing is written to disk, and
 * nothing goes near browser storage.
 */

import fontkit from "@pdf-lib/fontkit";

const PDF_URL = "./Zahtev-za-glasanje-u-inostranstvu.pdf";
// Roboto is the font embedded *inside* the generated PDF (the UI's own
// typeface is Piazzolla, declared in src/index.css). SIL Open Font License
// 1.1: redistributing the .ttf means shipping the licence with it, so the
// full text sits beside it as public/Roboto-OFL.txt.
const FONT_URL = "./Roboto-Regular.ttf";

/**
 * Name the finished form is saved under. Exported because DoneStep tells the
 * user which file to look for in their downloads folder — the two must not
 * drift apart, or the user is sent hunting for a file that is not there.
 */
export const PDF_FILE_NAME =
    "Zahtev-za-glasanje-u-inostranstvu-popunjen-formular.pdf";

let pending = null;

async function fetchBytes(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(
            `Neuspešno učitavanje ${url} (HTTP ${response.status})`,
        );
    }
    return await response.arrayBuffer();
}

/**
 * Load both assets, at most once per page load. A failed attempt is not
 * remembered, so a later call — the user pressing "Preuzmite PDF" — retries
 * instead of replaying the failure.
 *
 * @returns {Promise<{pdfBytes: ArrayBuffer, fontBytes: ArrayBuffer}>}
 */
export function loadPdfAssets() {
    if (!pending) {
        pending = Promise.all([fetchBytes(PDF_URL), fetchBytes(FONT_URL)])
            .then(([pdfBytes, fontBytes]) => ({ pdfBytes, fontBytes }))
            .catch((error) => {
                pending = null;
                throw error;
            });
    }
    return pending;
}

let measurer = null;

/**
 * A width function for the font the PDF is drawn with, so step 1 can tell the
 * user "this will not fit" using the same measurements step 5 draws with.
 * Reads the font already in memory — no extra fetch, nothing new on the wire.
 *
 * Note this sums the raw glyph advances rather than taking the laid-out run's
 * `advanceWidth`, which is what pdf-lib's `widthOfTextAtSize` does — the two
 * differ by the kerning fontkit applies, and a PDF viewer does not kern text
 * drawn from an embedded width array. Taking the run's width instead reads up
 * to ~5pt narrower over a line and would make step 1 promise room that step 5
 * does not have.
 *
 * @returns {Promise<(text: string, size: number) => number>} width in points
 */
export async function loadRuleTextMeasurer() {
    const { fontBytes } = await loadPdfAssets();
    if (!measurer) {
        // slice(0) so fontkit gets its own copy and can never be handed a
        // buffer that pdf-lib has already consumed.
        const font = fontkit.create(new Uint8Array(fontBytes.slice(0)));
        measurer = (text, size) => {
            const { glyphs } = font.layout(String(text));
            let advance = 0;
            for (const glyph of glyphs) advance += glyph.advanceWidth;
            return (advance * size) / font.unitsPerEm;
        };
    }
    return measurer;
}
