/**
 * How a value is fitted onto one of the printed rules on page 1.
 *
 * Kept out of ReviewStep so that the screen where the user types (step 1) and
 * the code that draws the PDF (step 5) agree on what "too long" means. A
 * warning based on a character count cannot agree with a drawing routine based
 * on glyph widths — "Đinđićeva" and "Illinois" are the same length and nowhere
 * near the same width — so both sides call layOutRuleValue() with the real
 * font and compare points.
 *
 * Sizes were chosen by measuring, not by taste. The rules on the template are
 * 22.99pt apart. Roboto's tallest ink at 10pt reaches 9.17pt above the
 * baseline (Ć, Č) and its lowest drops 2.13pt below it (j, y), so two 10pt
 * lines plus a visible gap at each end need ~23.4pt and cannot fit: the upper
 * line always grazes the rule above. Solving the same constraint for the
 * largest size that leaves ~1.5pt of air top and bottom gives 8.98pt, hence
 * 9pt whenever a value has to wrap. A wrapped block also sits 1pt lower
 * (RULE_GAP_WRAPPED) to spend that slack where it shows.
 */

/** Normal size: everything that fits on its rule in one line. */
export const FONT_SIZE = 10;
/** Size used as soon as a value no longer fits at FONT_SIZE. */
export const FONT_SIZE_WRAPPED = 9;
/** Baseline of a single line, above its rule — clears descenders. */
export const RULE_GAP = 4;
/** Baseline of the lower of two lines, above its rule. */
export const RULE_GAP_WRAPPED = 3;
/** Baseline-to-baseline distance in the two-line case. */
export const LINE_GAP = 10;

/**
 * The value column of fields 1–6: the rules run x=289.54 to x=522.75, and
 * text starts a few points in so it does not begin flush against the label.
 */
export const VALUE_X = 293;
export const VALUE_X_END = 522.75;
export const VALUE_MAX_WIDTH = VALUE_X_END - VALUE_X;

/**
 * Break a value into two lines. An address reads best broken after a comma
 * ("…Straße 45," / "60313 Frankfurt am Main"), so take the last comma whose
 * first half still fits and fall back to a plain word break when there is no
 * usable comma.
 *
 * @param {string} text
 * @param {number} maxWidth - width of the rule, in points
 * @param {(text: string, size: number) => number} widthOf
 * @returns {string[]} one or two lines
 */
function splitTwoLines(text, maxWidth, widthOf) {
    const fits = (candidate) =>
        widthOf(candidate, FONT_SIZE_WRAPPED) <= maxWidth;

    let head = "";
    for (let i = 0; i < text.length; i++) {
        if (text[i] !== ",") continue;
        const upToComma = text.slice(0, i + 1);
        if (fits(upToComma)) head = upToComma;
    }

    if (!head) {
        const words = text.split(" ");
        for (let i = 0; i < words.length - 1; i++) {
            const candidate = head ? `${head} ${words[i]}` : words[i];
            if (!fits(candidate)) break;
            head = candidate;
        }
    }

    // A single word wider than the rule: nothing to break on. Return it whole
    // and let the caller report it as an overflow.
    if (!head) return [text];

    return [head, text.slice(head.length).trim()];
}

/**
 * Fit one value to its rule, in three steps: one line at 10pt if it fits, one
 * line at 9pt if that is enough, otherwise two 9pt lines. The middle step
 * matters more than it looks — it catches the band of addresses that would
 * otherwise wrap for the sake of two or three characters.
 *
 * @param {string} text
 * @param {number} maxWidth - width of the rule, in points
 * @param {(text: string, size: number) => number} widthOf - font.widthOfTextAtSize
 * @returns {{size: number, lines: string[], overflows: boolean}}
 *     `overflows` means even this layout runs past the end of the rule; the
 *     value is drawn anyway, and step 1 warns about it.
 */
export function layOutRuleValue(text, maxWidth, widthOf) {
    const value = String(text ?? "");

    if (widthOf(value, FONT_SIZE) <= maxWidth) {
        return { size: FONT_SIZE, lines: [value], overflows: false };
    }
    if (widthOf(value, FONT_SIZE_WRAPPED) <= maxWidth) {
        return { size: FONT_SIZE_WRAPPED, lines: [value], overflows: false };
    }

    const lines = splitTwoLines(value, maxWidth, widthOf);
    return {
        size: FONT_SIZE_WRAPPED,
        lines,
        overflows: lines.some(
            (line) => widthOf(line, FONT_SIZE_WRAPPED) > maxWidth,
        ),
    };
}

/**
 * Where a value has to be cut to fit — the length of its longest prefix that
 * still lays out inside the rule. Step 1 quotes this back to the user, so it
 * is measured on their actual text rather than being a fixed character budget.
 *
 * @param {string} text
 * @param {number} maxWidth
 * @param {(text: string, size: number) => number} widthOf
 * @returns {number} number of characters that fit
 */
export function fittingLength(text, maxWidth, widthOf) {
    const value = String(text ?? "");
    for (let length = value.length - 1; length > 0; length--) {
        const prefix = value.slice(0, length);
        if (!layOutRuleValue(prefix, maxWidth, widthOf).overflows) {
            return length;
        }
    }
    return 0;
}
