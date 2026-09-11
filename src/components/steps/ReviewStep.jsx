import React, { useCallback, useEffect, useRef, useState } from "react";
import { PDFDocument, PDFName, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit"; // Import fontkit
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
 * Review and generate PDF step component
 *
 * @param {Object} props
 * @param {Object} props.formData - Form data with all user input
 * @param {string} props.docType - Type of document ("pasos" or "licna-karta")
 * @param {string|null} props.croppedImage - The front side cropped image
 * @param {string|null} props.croppedImageBack - The back side cropped image (for ID card)
 * @param {string|null} props.signature - The signature to include in PDF
 * @param {Function} props.onPrevious - Go to previous step
 * @param {Function} props.onGenerated - Advance to the final screen, handing
 *     it the generated Blob — that screen is where the file is downloaded
 * @param {Function} props.onEditData - Jump back to the fields
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
    // The finished file, and the run that is producing it. Generation is
    // started when this screen appears, not when the button is pressed — see
    // the effect below for why that matters on a phone.
    const buildRef = useRef(null);
    const blobRef = useRef(null);

    /**
     * Builds the finished PDF and returns it as a Blob. Touches no state and
     * draws nothing, so it is safe to run ahead of the user's press.
     */
    const buildPdfBlob = useCallback(async () => {
        try {
            // The blank form and the font were pulled into memory when the app
            // loaded (see src/pdfAssets.js), so this step needs no network.
            // Each generation gets its own copy of the bytes, so pressing the
            // button twice cannot hand pdf-lib a buffer the first run consumed.
            const { pdfBytes, fontBytes } = await loadPdfAssets();

            const pdfDoc = await PDFDocument.load(pdfBytes.slice(0));
            pdfDoc.registerFontkit(fontkit); // Register fontkit instance
            // subset: true embeds only the glyphs actually drawn, which keeps the
            // generated PDF ~85 KB smaller than shipping the whole Roboto face.
            const customFont = await pdfDoc.embedFont(fontBytes.slice(0), {
                subset: true,
            });

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            // --- Geometrija šablona -------------------------------------------
            // Sve vrednosti su izmerene iz samog obrasca
            // (public/Zahtev-za-glasanje-u-inostranstvu.pdf, A4 595.28 x 841.89 pt).
            // Treća vrednost je y iscrtane linije na obrascu; tekst se piše
            // iznad nje tako da descenderi (g, j, p) ne seku liniju. Veličine
            // slova i razmaci žive u src/pdfLayout.js, jer ih koristi i korak
            // 1 da upozori kada vrednost neće stati.
            // AKO SE ŠABLON ZAMENI: ponovo izmeriti linije i ažurirati samo ovu
            // tabelu — nigde drugde nema koordinata.
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
                // Duge vrednosti (adresa u inostranstvu pre svih) ne staju u
                // red pri normalnoj veličini. layOutRuleValue bira između
                // jednog reda na 10pt, jednog na 9pt i dva reda na 9pt —
                // razlozi za te brojeve su u src/pdfLayout.js.
                const { size, lines } = layOutRuleValue(
                    formData[field],
                    VALUE_X_END - x,
                    widthOf,
                );
                const baseGap = lines.length > 1 ? RULE_GAP_WRAPPED : RULE_GAP;
                lines.forEach((line, index) => {
                    // Poslednji red stoji na liniji, raniji se slažu iznad.
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

            // JMBG: 13 kućica od x=289.54 do x=522.75, svaka široka 17.94 pt,
            // između linija y=526.37 i y=550.28. Cifre se centriraju u kućici.
            const JMBG_X0 = 289.54;
            const JMBG_CELL_WIDTH = 17.94;
            const JMBG_Y = 534; // vertikalno centrirano u kućici
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

            // Datum: kućica x=131.96..213.00 iznad linije y=351.55, tekst centriran.
            const currentDate = new Date();
            const day = String(currentDate.getDate()).padStart(2, "0");
            const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
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

            // Add images as a new page
            if (croppedImage) {
                // Define A4 page dimensions in points (595.28 x 841.89)
                const a4Width = 595.28;
                const a4Height = 841.89;
                // Max image width
                const maxImageWidth = 300;

                // Function to convert and embed an image
                const prepareImage = async (imageDataUrl) => {
                    // Convert Base64 to Blob if necessary
                    const imageBlob = await fetch(imageDataUrl).then((res) =>
                        res.blob()
                    );

                    // Ensure the Blob is of type 'image/jpeg'
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
                                      // Release the blob as soon as it is on the canvas
                                      URL.revokeObjectURL(objectUrl);
                                      canvas.toBlob(resolve, "image/jpeg");
                                  };
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

                // Add a new A4 page for the document images
                const newPage = pdfDoc.addPage([a4Width, a4Height]);

                // For passport, just center the image on the page
                if (docType === "pasos") {
                    const frontEmbed = await prepareImage(croppedImage);

                    // Calculate dimensions
                    const imageAspectRatio =
                        frontEmbed.width / frontEmbed.height;
                    const imageWidth = maxImageWidth;
                    const imageHeight = maxImageWidth / imageAspectRatio;

                    // Center the image on the A4 page
                    const imageX = (a4Width - imageWidth) / 2;
                    const imageY = (a4Height - imageHeight) / 2;

                    // Draw the passport image
                    newPage.drawImage(frontEmbed, {
                        x: imageX,
                        y: imageY,
                        width: imageWidth,
                        height: imageHeight,
                    });
                }
                // For ID card, we need to handle both front and back sides
                else if (docType === "licna-karta" && croppedImageBack) {
                    const frontEmbed = await prepareImage(croppedImage);
                    const backEmbed = await prepareImage(croppedImageBack);

                    // Calculate dimensions for front
                    const frontAspectRatio =
                        frontEmbed.width / frontEmbed.height;
                    const frontWidth = maxImageWidth;
                    const frontHeight = maxImageWidth / frontAspectRatio;

                    // Calculate dimensions for back
                    const backAspectRatio = backEmbed.width / backEmbed.height;
                    const backWidth = maxImageWidth;
                    const backHeight = maxImageWidth / backAspectRatio;

                    // Calculate vertical positioning - place them 50pt apart
                    const spacing = 50;
                    const totalHeight = frontHeight + backHeight + spacing;
                    const startY = (a4Height + totalHeight) / 2;

                    // Center horizontally
                    const frontX = (a4Width - frontWidth) / 2;
                    const backX = (a4Width - backWidth) / 2;

                    // Draw front side (top)
                    newPage.drawImage(frontEmbed, {
                        x: frontX,
                        y: startY - frontHeight,
                        width: frontWidth,
                        height: frontHeight,
                    });

                    // Draw back side (bottom)
                    newPage.drawImage(backEmbed, {
                        x: backX,
                        y: startY - frontHeight - spacing - backHeight,
                        width: backWidth,
                        height: backHeight,
                    });
                }
                // Fallback case - just show the front image if we only have that
                else {
                    const frontEmbed = await prepareImage(croppedImage);

                    // Calculate dimensions
                    const imageAspectRatio =
                        frontEmbed.width / frontEmbed.height;
                    const imageWidth = maxImageWidth;
                    const imageHeight = maxImageWidth / imageAspectRatio;

                    // Center the image on the A4 page
                    const imageX = (a4Width - imageWidth) / 2;
                    const imageY = (a4Height - imageHeight) / 2;

                    // Draw the image
                    newPage.drawImage(frontEmbed, {
                        x: imageX,
                        y: imageY,
                        width: imageWidth,
                        height: imageHeight,
                    });
                }
            }

            // Add signature to first page if present
            if (signature) {
                const sigBytes = await fetch(signature).then((r) =>
                    r.arrayBuffer()
                );
                // Embed the signature image
                const sigImg = await pdfDoc.embedPng(sigBytes);
                // Polje za potpis: iznad linije y=328.56, u koloni x=335.62..522.75
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
                    // Signature is wider, fit width
                    drawW = maxW;
                    drawH = maxW / sigAspect;
                } else {
                    // Signature is taller, fit height
                    drawH = maxH;
                    drawW = maxH * sigAspect;
                }
                // Centriraj potpis u polju, oslonjen na donju ivicu
                const sigX = sigBoxX + (maxW - drawW) / 2;
                const sigY = sigBoxY;
                firstPage.drawImage(sigImg, {
                    x: sigX,
                    y: sigY,
                    width: drawW,
                    height: drawH,
                });
            }

            // Drop /Creator. pdf-lib carries the template's Info dictionary
            // into every generated file, so without this the form each user
            // sends their consulate announces that the blank was made in Pages
            // — a detail about whoever built this app, riding along in a
            // document about someone else entirely. Deleting the key is not
            // the same as setCreator(""), which leaves an empty /Creator ()
            // behind. Safe to do here: pdf-lib fills /Creator in only during
            // PDFDocument.load(), so nothing puts it back on save().
            pdfDoc.getInfoDict().delete(PDFName.of("Creator"));

            const updatedPdfBytes = await pdfDoc.save();
            const blob = new Blob([updatedPdfBytes], {
                type: "application/pdf",
            });
            return blob;
        } catch (error) {
            console.error("Error generating PDF:", error);
            // Add more specific error logging if needed
            if (error?.message?.includes("font")) {
                console.error(
                    "This might be a font loading or embedding issue. Ensure the font file exists at the specified path and supports the required characters."
                );
            }
            // Surfaced by whoever pressed the button; the ahead-of-time run
            // below swallows it and lets the press try again from scratch.
            throw error;
        }
    }, [docType, croppedImage, croppedImageBack, signature, formData]);

    // Build the PDF as soon as the review screen is shown, so the final screen
    // can render its download link with the finished bytes already behind it.
    // Nothing is downloaded from this screen at all: the file is saved from a
    // real <a download> the user taps on the next one. A synthetic click from
    // a handler that has awaited pdf-lib is exactly what broke on iOS —
    // Safari honours <a download> only while the user gesture is still live,
    // and without it navigates to the blob: URL instead, covering the app with
    // the PDF viewer so the final screen is never seen. This screen unmounts
    // when the user leaves it, so a correction in step 1 comes back to a fresh
    // build.
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
            // The ahead-of-time build is still running, or it failed. Wait for
            // it, and rebuild once if it failed — this is the only path that
            // makes the user wait, and it is the exceptional one.
            setIsGenerating(true);
            if (announcer) {
                announcer.textContent = "PDF se pravi, sačekajte.";
            }
            try {
                blob = (await buildRef.current) || (await buildPdfBlob());
                blobRef.current = blob;
            } catch {
                setIsGenerating(false);
                // The failure used to be announced to screen readers only,
                // which left a sighted user watching the button go back to its
                // resting state with nothing to explain it — at the one step
                // where all the entered data is at stake. Show it.
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

        // The Blob is handed to Form and lives in state like everything else,
        // so DoneStep can offer it as a download for as long as that screen is
        // open. Nothing is written anywhere until the user taps the link
        // there; the step change is announced by Form.
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
