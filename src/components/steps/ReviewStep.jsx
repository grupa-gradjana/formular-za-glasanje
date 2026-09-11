import React, { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument, PDFName, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { loadPdfAssets, PDF_FILE_NAME } from "../../pdfAssets";
import {
    FONT_SIZE,
    LINE_GAP,
    RULE_GAP,
    RULE_GAP_WRAPPED,
    VALUE_X,
    VALUE_X_END,
    layOutRuleValue,
} from "../../pdfLayout";
import ReviewView from "./ReviewView";

/**
 * Step 5 — the last look at the data, and the step that turns it into the
 * finished PDF. ReviewView draws the screen; everything here is the file.
 *
 * `buildPdfBlob()` stamps the entered values onto the blank official form:
 * the text fields onto the printed rules of page 1, the JMBG digit by digit
 * into its thirteen cells, today's date into its box, the signature into the
 * signature box, and the document images onto an A4 page appended after it.
 * Every coordinate below was measured off the template itself, so **replacing
 * the template invalidates all of them** — they are gathered into the RULES
 * table and a handful of named constants so that a swap needs new numbers in
 * one place rather than in nine drawText calls.
 *
 * Nothing is downloaded from this screen. The Blob goes to Form through
 * onGenerated() and is saved from DoneStep's anchor; see the effect below for
 * why the bytes are built before the user presses anything.
 *
 * @param {Object} props
 * @param {Object} props.formData - all eight entered fields
 * @param {string} props.docType - "pasos" | "licna-karta" | "licna-karta-cip"
 * @param {string|null} props.croppedImage - front side, as a data URL
 * @param {string|null} props.croppedImageBack - back side (ID card only)
 * @param {string|null} props.signature - signature PNG data URL
 * @param {Function} props.onPrevious - back to the signature step
 * @param {Function} props.onGenerated - advance to the final screen, handing
 *     it the generated Blob — that screen is where the file is downloaded
 * @param {Function} props.onEditData - jump back to the fields
 */
function ReviewStep({
    formData,
    docType,
    croppedImage,
    croppedImageBack,
    signature,
    onPrevious,
    onGenerated,
    onEditData,
}) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    // The finished file (blobRef) and the run producing it (buildRef). Refs
    // rather than state: the build starts when the screen appears, and a
    // re-render on its completion would show the user nothing new.
    const buildRef = useRef(null);
    const blobRef = useRef(null);

    /**
     * Builds the finished PDF and returns it as a Blob. Touches no state and
     * renders nothing, so it is safe to run ahead of the user's press.
     */
    const buildPdfBlob = useCallback(async () => {
        try {
            // Already in memory since page load (see src/pdfAssets.js), so
            // this step needs no network. Each run takes its own .slice(0)
            // copy of the bytes: pdf-lib detaches the buffers it is handed, so
            // a second press would otherwise be given an empty one.
            const { pdfBytes, fontBytes } = await loadPdfAssets();

            const pdfDoc = await PDFDocument.load(pdfBytes.slice(0));
            // The embedded Roboto is not a style choice: pdf-lib's built-in
            // StandardFonts cannot encode šđčćž and throw at draw time.
            // Embedding a .ttf needs fontkit registered on the document.
            pdfDoc.registerFontkit(fontkit);
            // subset: true embeds only the glyphs actually drawn, which keeps the
            // generated PDF ~85 KB smaller than shipping the whole Roboto face.
            const customFont = await pdfDoc.embedFont(fontBytes.slice(0), {
                subset: true,
            });

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            // --- Template geometry --------------------------------------------
            // [field, x where the value starts, y of the printed rule], all in
            // PDF points with the origin bottom-left, measured off
            // public/Zahtev-za-glasanje-u-inostranstvu.pdf (A4, 595.28x841.89).
            // The text is drawn a few points ABOVE the rule so that descenders
            // (g, j, p) do not cross it; how far above, and at what size, is
            // src/pdfLayout.js, because step 1 needs the same numbers to warn
            // when a value will not fit.
            // Fields 1-6 share the wide value column (VALUE_X); the contact
            // pair sits in the narrower one that starts at x=335.62.
            const RULES = [
                ["fullName", VALUE_X, 596.26],
                ["parentName", VALUE_X, 573.27],
                ["addressSerbia", VALUE_X, 503.38],
                ["addressAbroad", VALUE_X, 480.39],
                ["votingLocation", VALUE_X, 455.64],
                ["phone", 340, 284.97],
                ["email", 340, 238.81],
            ];

            const widthOf = (text, size) =>
                customFont.widthOfTextAtSize(text, size);

            for (const [field, x, ruleY] of RULES) {
                // A long value — a foreign address above all — does not fit on
                // its rule at full size. layOutRuleValue picks between one line
                // at 10pt, one at 9pt and two at 9pt; the reasoning behind
                // those three is in src/pdfLayout.js.
                const { size, lines } = layOutRuleValue(
                    formData[field],
                    VALUE_X_END - x,
                    widthOf,
                );
                const baseGap = lines.length > 1 ? RULE_GAP_WRAPPED : RULE_GAP;
                lines.forEach((line, index) => {
                    // The last line sits on the rule; earlier ones stack above
                    // it, one LINE_GAP apart.
                    const linesBelow = lines.length - 1 - index;
                    firstPage.drawText(line, {
                        x,
                        y: ruleY + baseGap + linesBelow * LINE_GAP,
                        size,
                        font: customFont,
                        color: rgb(0, 0, 0),
                    });
                });
            }

            // JMBG has thirteen printed cells rather than a rule: they run
            // from x=289.54 to x=522.75 at a 17.94pt pitch, between the lines
            // at y=526.37 and y=550.28. Each digit is centred in its own cell,
            // so they are drawn one at a time instead of as a string.
            const JMBG_X0 = 289.54;
            const JMBG_CELL_WIDTH = 17.94;
            const JMBG_Y = 534; // baseline that centres a digit in the cell
            [...String(formData.jmbg)].forEach((char, i) => {
                const charWidth = customFont.widthOfTextAtSize(char, FONT_SIZE);
                firstPage.drawText(char, {
                    x:
                        JMBG_X0 +
                        JMBG_CELL_WIDTH * i +
                        (JMBG_CELL_WIDTH - charWidth) / 2,
                    y: JMBG_Y,
                    size: FONT_SIZE,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });
            });

            // Date of the request: centred in the box x=131.96..213.00, above
            // the rule at y=351.55.
            const currentDate = new Date();
            const day = String(currentDate.getDate()).padStart(2, "0");
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 0-indexed
            const year = currentDate.getFullYear();
            const formattedDate = `${day}.${month}.${year}.`;
            const DATE_X0 = 131.96;
            const DATE_X1 = 213.0;
            const dateWidth = customFont.widthOfTextAtSize(
                formattedDate,
                FONT_SIZE
            );
            firstPage.drawText(formattedDate, {
                x: DATE_X0 + (DATE_X1 - DATE_X0 - dateWidth) / 2,
                y: 351.55 + RULE_GAP,
                size: FONT_SIZE,
                font: customFont,
                color: rgb(0, 0, 0),
            });

            // The document images go on a second page, appended after the
            // form. A chip card has none — its prebivalište is on the chip and
            // the user attaches the očitana lična karta themselves — so this
            // whole block is skipped and the file comes out at one page.
            if (croppedImage) {
                const a4Width = 595.28;
                const a4Height = 841.89;
                // Scans are drawn at 300pt wide, about half the page. Wide
                // enough to read, small enough to keep the attachment mailable.
                const maxImageWidth = 300;

                /**
                 * Normalise one cropped data URL into an embedded PDF image.
                 * Everything is embedded as JPEG, so whatever the cropper
                 * handed over (a PNG data URL, as things stand) is re-encoded
                 * through a canvas first. Redrawing it also means only pixels
                 * reach the file: no EXIF block, no camera model, no GPS.
                 */
                const prepareImage = async (imageDataUrl) => {
                    // fetch() on a data: URL is an in-memory decode, not a
                    // request; it never touches the network.
                    const imageBlob = await fetch(imageDataUrl).then((res) =>
                        res.blob()
                    );

                    const jpegBlob =
                        imageBlob.type === "image/jpeg"
                            ? imageBlob
                            : await new Promise((resolve, reject) => {
                                  const canvas =
                                      document.createElement("canvas");
                                  const img = new Image();
                                  const objectUrl =
                                      URL.createObjectURL(imageBlob);
                                  img.onload = () => {
                                      canvas.width = img.width;
                                      canvas.height = img.height;
                                      const ctx = canvas.getContext("2d");
                                      ctx.drawImage(img, 0, 0);
                                      // Nothing holds a URL to the user's
                                      // document longer than it takes to draw it.
                                      URL.revokeObjectURL(objectUrl);
                                      canvas.toBlob(resolve, "image/jpeg");
                                  };
                                  // Without this the promise would never settle
                                  // and the whole generation would hang.
                                  img.onerror = () => {
                                      URL.revokeObjectURL(objectUrl);
                                      reject(
                                          new Error(
                                              "Slika dokumenta ne može da se učita."
                                          )
                                      );
                                  };
                                  img.src = objectUrl;
                              });

                    const imageBytes = await jpegBlob.arrayBuffer();
                    return await pdfDoc.embedJpg(imageBytes);
                };

                const newPage = pdfDoc.addPage([a4Width, a4Height]);

                // A passport is one page of the document: centre it.
                if (docType === "pasos") {
                    const frontEmbed = await prepareImage(croppedImage);

                    const imageAspectRatio =
                        frontEmbed.width / frontEmbed.height;
                    const imageWidth = maxImageWidth;
                    const imageHeight = maxImageWidth / imageAspectRatio;

                    const imageX = (a4Width - imageWidth) / 2;
                    const imageY = (a4Height - imageHeight) / 2;

                    newPage.drawImage(frontEmbed, {
                        x: imageX,
                        y: imageY,
                        width: imageWidth,
                        height: imageHeight,
                    });
                }
                // An ID card needs both sides — the address the consulate is
                // checking is printed on the back — so they are stacked front
                // above back, as a block centred on the page.
                else if (docType === "licna-karta" && croppedImageBack) {
                    const frontEmbed = await prepareImage(croppedImage);
                    const backEmbed = await prepareImage(croppedImageBack);

                    const frontAspectRatio =
                        frontEmbed.width / frontEmbed.height;
                    const frontWidth = maxImageWidth;
                    const frontHeight = maxImageWidth / frontAspectRatio;

                    const backAspectRatio = backEmbed.width / backEmbed.height;
                    const backWidth = maxImageWidth;
                    const backHeight = maxImageWidth / backAspectRatio;

                    // startY is the top edge of the two-image block; each
                    // drawImage is given the BOTTOM-left corner of its image,
                    // hence the subtractions below.
                    const spacing = 50;
                    const totalHeight = frontHeight + backHeight + spacing;
                    const startY = (a4Height + totalHeight) / 2;

                    const frontX = (a4Width - frontWidth) / 2;
                    const backX = (a4Width - backWidth) / 2;

                    newPage.drawImage(frontEmbed, {
                        x: frontX,
                        y: startY - frontHeight,
                        width: frontWidth,
                        height: frontHeight,
                    });

                    newPage.drawImage(backEmbed, {
                        x: backX,
                        y: startY - frontHeight - spacing - backHeight,
                        width: backWidth,
                        height: backHeight,
                    });
                }
                // An ID card whose back side is missing: draw what there is
                // rather than losing the front too. The user can only reach
                // this by leaving step 3 half-done, which the wizard does not
                // offer, but a page with one scan beats a page with none.
                else {
                    const frontEmbed = await prepareImage(croppedImage);

                    const imageAspectRatio =
                        frontEmbed.width / frontEmbed.height;
                    const imageWidth = maxImageWidth;
                    const imageHeight = maxImageWidth / imageAspectRatio;

                    const imageX = (a4Width - imageWidth) / 2;
                    const imageY = (a4Height - imageHeight) / 2;

                    newPage.drawImage(frontEmbed, {
                        x: imageX,
                        y: imageY,
                        width: imageWidth,
                        height: imageHeight,
                    });
                }
            }

            // The signature goes back on page 1, letterboxed into the box the
            // form leaves for it: above the rule at y=328.56, in the column
            // x=335.62..522.75. SignaturePad has already cropped it to its ink,
            // so the aspect ratio here is the signature's own.
            if (signature) {
                const sigBytes = await fetch(signature).then((r) =>
                    r.arrayBuffer()
                );
                const sigImg = await pdfDoc.embedPng(sigBytes);
                const sigBoxX = 340;
                const sigBoxY = 330.5;
                const maxW = 178;
                const maxH = 44;
                const sigDims = sigImg.scale(1);
                let drawW = maxW;
                let drawH = maxH;
                const sigAspect = sigDims.width / sigDims.height;
                const boxAspect = maxW / maxH;
                if (sigAspect > boxAspect) {
                    drawW = maxW; // wider than the box: fit its width
                    drawH = maxW / sigAspect;
                } else {
                    drawH = maxH; // taller than the box: fit its height
                    drawW = maxH * sigAspect;
                }
                // Centred across the box and resting on its bottom edge, the
                // way a signature sits on the printed line.
                const sigX = sigBoxX + (maxW - drawW) / 2;
                const sigY = sigBoxY;
                firstPage.drawImage(sigImg, {
                    x: sigX,
                    y: sigY,
                    width: drawW,
                    height: drawH,
                });
            }

            // Drop /Creator. PDFDocument.load() copies the template's Info
            // dictionary into the generated file and only overwrites
            // /Producer and /ModDate, so the template's own metadata would
            // otherwise ride along in a document about the user — here, the
            // name of the program the blank was made in. Delete the key rather
            // than calling setCreator(""), which leaves an empty /Creator ()
            // behind. Doing it at this point is safe: /Creator is filled in
            // during load(), and nothing puts it back on save().
            //
            // Re-check the whole Info dict after a template swap; other keys
            // (/Author above all) can carry a real person's name.
            pdfDoc.getInfoDict().delete(PDFName.of("Creator"));

            const updatedPdfBytes = await pdfDoc.save();
            const blob = new Blob([updatedPdfBytes], {
                type: "application/pdf",
            });
            return blob;
        } catch (error) {
            console.error("Error generating PDF:", error);
            // Optional-chained: a throw without a .message must not break the
            // error path itself, which is what tells the user their data is
            // still there.
            if (error?.message?.includes("font")) {
                console.error(
                    "This might be a font loading or embedding issue. Ensure the font file exists at the specified path and supports the required characters."
                );
            }
            // Rethrown for whoever is waiting: the ahead-of-time run below
            // swallows it, and the button press reports it to the user.
            throw error;
        }
    }, [docType, croppedImage, croppedImageBack, signature, formData]);

    // Build the PDF as soon as this screen is shown, ahead of the press, so
    // that the next screen can render its download link with finished bytes
    // already behind it. That is what lets the file be saved by a genuine tap
    // on an <a download>: iOS Safari honours the attribute only while the
    // tap's user gesture is live, and a handler that has awaited pdf-lib no
    // longer has one — it would navigate to the blob: URL instead, covering
    // the app with the PDF viewer so the final screen is never seen.
    //
    // The dependency is the whole build closure, so any correction the user
    // makes upstream produces a new file; this screen also unmounts when it is
    // left, so coming back from step 1 always rebuilds.
    useEffect(() => {
        blobRef.current = null; // never hand out the previous run's bytes
        const run = buildPdfBlob().then(
            (blob) => {
                blobRef.current = blob;
                return blob;
            },
            () => null // the press rebuilds and reports the failure
        );
        buildRef.current = run;
    }, [buildPdfBlob]);

    const handleGeneratePDF = async () => {
        setErrorMessage(null);
        const announcer = document.getElementById("sr-announcer");

        let blob = blobRef.current;
        if (!blob) {
            // The ahead-of-time build is still running, or it failed: wait for
            // it and rebuild once if it failed. This is the only path that
            // makes the user wait, and the only one that shows the spinner
            // state. It costs nothing but a delayed screen change, because no
            // download hangs off this gesture.
            setIsGenerating(true);
            if (announcer) {
                announcer.textContent = "PDF se pravi, sačekajte.";
            }
            try {
                blob = (await buildRef.current) || (await buildPdfBlob());
                blobRef.current = blob;
            } catch {
                setIsGenerating(false);
                // Reported twice on purpose: on screen and to the live region.
                // A failure signalled only to screen readers would leave a
                // sighted user watching the button return to its resting state
                // with nothing to explain it, at the one step where everything
                // they have entered is at stake. Both messages say the data is
                // still there, since the obvious reaction is to reload.
                setErrorMessage(
                    "Vaši podaci su i dalje upisani. Pokušajte ponovo."
                );
                if (announcer) {
                    announcer.textContent =
                        "PDF nije napravljen. Vaši podaci su i dalje upisani, pokušajte ponovo.";
                }
                return;
            }
            setIsGenerating(false);
        }

        // Hand the Blob to Form, which holds it in state like everything else
        // and passes it to DoneStep — the only copy of the file there is, and
        // still nothing written anywhere until the user taps the link there.
        // This call is also what advances the step; Form announces the change.
        onGenerated(blob);
    };

    return (
        <ReviewView
            formData={formData}
            docType={docType}
            croppedImage={croppedImage}
            croppedImageBack={croppedImageBack}
            signature={signature}
            isGenerating={isGenerating}
            errorMessage={errorMessage}
            onGenerate={handleGeneratePDF}
            onPrevious={onPrevious}
            onEditData={onEditData}
        />
    );
}

export default ReviewStep;
