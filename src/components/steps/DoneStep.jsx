import React, { useEffect, useState } from "react";
import { PDF_FILE_NAME } from "../../pdfAssets";

/**
 * Step 6 — the last screen. The zahtev is finished here in two senses: the
 * PDF is downloaded from this screen (not from the review screen, which only
 * makes it), and the user is told what still has to happen by hand — a file in
 * the downloads folder is not the same thing as having applied.
 *
 * The download is a real <a href> the user taps, never a synthetic click from
 * a handler: iOS Safari honours <a download> only while the tap's gesture is
 * live, and a handler that has awaited pdf-lib no longer has one — Safari then
 * navigates to the blob: URL, covers the app with its PDF viewer, and this
 * screen is never seen.
 *
 * @param {Object} props
 * @param {string} props.docType - "licna-karta" | "pasos" | "licna-karta-cip"
 * @param {Blob|null} props.pdfBlob - The generated PDF, kept in memory only
 */
function DoneStep({ docType, pdfBlob }) {
    // With a chip card there is no image page and no second document in the
    // file: the očitana lična karta is a separate attachment the user makes
    // themselves. Every count and every "jedan fajl" on this screen has to
    // follow that, or the last thing the app says is wrong.
    const isChipCard = docType === "licna-karta-cip";

    // The link's href has to exist before the tap, so the object URL is made
    // when this screen appears and released when it goes away. It is a pointer
    // into memory; nothing is written anywhere until the user taps.
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (!pdfBlob) return undefined;
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [pdfBlob]);

    const announceDownload = () => {
        const announcer = document.getElementById("sr-announcer");
        if (announcer) {
            announcer.textContent = "Preuzimanje PDF-a je počelo.";
        }
    };

    return (
        <div role="region" aria-labelledby="done-title">
            <p className="eyebrow mb-3.5">PDF JE SPREMAN</p>
            <h1 id="done-title" className="h1 mb-3.5 max-w-[22ch]">
                Preuzmite PDF, pa ga pošaljite
            </h1>
            <p className="lead mb-8">
                Zahtev je popunjen, ali još nije podnet. Prvo preuzmite PDF na
                svoj uređaj, a zatim ga pošaljite ambasadi ili konzulatu u
                zemlji u kojoj živite. Ova stranica ne šalje ništa u vaše ime,
                niti čuva vaše podatke.
            </p>

            {isChipCard && (
                <div className="panel mb-8">
                    <p className="item-title mb-2">
                        Uz PDF ide i očitana lična karta
                    </p>
                    <p className="body m-0">
                        Vaša lična karta ima čip, pa adresa prebivališta na njoj
                        nije odštampana — u ovom PDF-u je nema. Očitajte ličnu
                        kartu čitačem i pošaljite taj ispis kao drugi prilog.
                        Bez njega zahtev nije potpun.
                    </p>
                </div>
            )}

            <div className="download-row mb-3">
                <span className="download-chip" aria-hidden="true">
                    PDF
                </span>
                <div className="min-w-0 flex-1 basis-[200px]">
                    <p className="download-name">{PDF_FILE_NAME}</p>
                    <p className="field-hint mt-1.5">
                        {isChipCard
                            ? "1 strana · zahtev i potpis"
                            : `2 strane · zahtev, ${
                                  docType === "pasos" ? "pasoš" : "lična karta"
                              } i potpis`}
                    </p>
                </div>
                {pdfUrl && (
                    <a
                        href={pdfUrl}
                        download={PDF_FILE_NAME}
                        target="_blank"
                        rel="noopener"
                        onClick={announceDownload}
                        className="btn btn-primary shrink-0"
                    >
                        Preuzmite PDF
                        <span className="sr-only"> {PDF_FILE_NAME}</span>
                    </a>
                )}
            </div>
            <p className="form-actions-hint mb-8">
                Dok ga ne preuzmete, PDF postoji samo u memoriji vašeg
                pregledača. Ako zatvorite ili osvežite ovu stranicu, zahtev
                popunjavate ponovo. Dok je otvorena, možete ga preuzeti više
                puta.
            </p>

            <ol className="numbered-list">
                <li className="numbered-row">
                    <span className="numbered-index" aria-hidden="true">
                        1
                    </span>
                    <div>
                        <p className="item-title mb-2">Pošaljite PDF i-mejlom</p>
                        <p className="body mb-4">
                            {isChipCard
                                ? "Pronađite ambasadu ili konzulat u zemlji u kojoj živite i priložite dva fajla: ovaj PDF i očitanu ličnu kartu."
                                : "Pronađite ambasadu ili konzulat u zemlji u kojoj živite i priložite ovaj jedan fajl."}
                        </p>
                        <a
                            href="https://www.mfa.gov.rs/predstavnistva/predstavnistva-srbije-u-svetu/ambasade"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost"
                        >
                            Nađite ambasadu ili konzulat →
                            <span className="sr-only">
                                (otvara se u novom prozoru)
                            </span>
                        </a>
                    </div>
                </li>
                <li className="numbered-row">
                    <span className="numbered-index" aria-hidden="true">
                        2
                    </span>
                    <div>
                        <p className="item-title mb-2">
                            Ili ga odštampajte i odnesite lično
                        </p>
                        <p className="body m-0">
                            Ako ga štampate, potpišite ga rukom preko
                            odštampanog potpisa i ponesite dokument sa sobom.
                            {isChipCard
                                ? " Ponesite i očitanu ličnu kartu, odštampanu."
                                : ""}
                        </p>
                    </div>
                </li>
            </ol>

            {/* The zahtev is only the registration; what happens on
                election day is the guide's job, not this page's. */}
            <div className="panel-quiet mt-7">
                <p className="item-title mb-2">Šta sledi posle prijave</p>
                <p className="body mb-4">
                    Prijava je prvi korak. Kako se glasa iz inostranstva i šta
                    vas čeka dalje, piše u Vodiču za glasanje.
                </p>
                <a
                    href="https://skupstinaurasejanju.org/vodiczaglasanje"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                >
                    Vodič za glasanje →
                    <span className="sr-only">(otvara se u novom prozoru)</span>
                </a>
            </div>

            <div className="panel-quiet mt-7">
                <p className="item-title mb-2">PDF ostaje na vašem uređaju</p>
                <p className="body m-0">
                    Preuzet PDF se nalazi u folderu za preuzimanja. Na
                    telefonu se ponekad otvori u pregledaču umesto da se
                    preuzme — tada ga sačuvajte dugmetom za deljenje. Ova
                    stranica ne čuva nijednu kopiju: kada je zatvorite, od
                    zahteva ostaje samo fajl koji ste preuzeli.
                </p>
            </div>

            {/* The deadline is the one thing on this screen that is not about
                the file, so it gets the red rule rather than another hint. */}
            <div className="pulled rule-top mt-7 pt-5">
                <p className="body m-0">
                    Rok za prijavu je 3 Oktobar 2026. Ako ga propustite, nećete
                    moći da glasate na izborima 2026. godine.
                </p>
            </div>
        </div>
    );
}

export default DoneStep;
