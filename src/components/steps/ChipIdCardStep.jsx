import React from "react";
import StepHeader from "../StepHeader";

/**
 * Step 3, for `docType === "licna-karta-cip"` — the screen that stands in for
 * the photo step.
 *
 * A lična karta with a chip does not carry the prebivalište in print: that
 * address exists only on the chip, and it is exactly the thing the zahtev has
 * to prove. A photograph of such a card is therefore worthless to the
 * consulate, and this page cannot read a chip — that needs a card reader and
 * the MUP program, on the user's own machine. So there is nothing to add here;
 * the screen's whole job is to say what the user has to attach to the i-mejl
 * themselves, before they spend the rest of the wizard assuming the PDF is the
 * whole zahtev.
 *
 * @param {Object} props
 * @param {Function} props.onNext - continue to the signature step
 * @param {Function} props.onPrevious - back to the document choice
 */
function ChipIdCardStep({ onNext, onPrevious }) {
    return (
        <div role="region" aria-labelledby="chip-title">
            <StepHeader stage={2} label="VAŠ DOKUMENT" />

            <h2 id="chip-title" className="h2 mb-3">
                Lična karta sa čipom
            </h2>
            <p className="lead mb-7">
                Na ličnoj karti sa čipom adresa prebivališta nije odštampana —
                upisana je samo u čip. Zato slika te lične karte ambasadi ili
                konzulatu ne dokazuje ništa. Umesto slike, uz zahtev ide očitana
                lična karta, a nju pravite sami, van ove stranice.
            </p>

            <ol
                className="numbered-list"
                aria-label="Tri koraka za očitanu ličnu kartu"
            >
                <li className="numbered-row">
                    <span className="numbered-index" aria-hidden="true">
                        1
                    </span>
                    <div>
                        <p className="item-title mb-2">Očitajte ličnu kartu</p>
                        <p className="body mb-4">
                            Potreban vam je čitač kartica i program „Čitač
                            elektronske lične karte“ Ministarstva unutrašnjih
                            poslova. Ako nemate čitač, ličnu kartu mogu da očita
                            na šalteru u Srbiji — u policijskoj stanici, opštini
                            ili pošti — pa da vam pošalju očitanu ličnu kartu.
                        </p>
                        <a
                            href="https://www.mup.gov.rs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost"
                        >
                            Otvorite mup.gov.rs →
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
                        <p className="item-title mb-2">Sačuvajte je na svoj uređaj</p>
                        <p className="body m-0">
                            Program ispisuje vaše podatke sa čipa, zajedno sa
                            adresom prebivališta. Sačuvajte taj ispis kao PDF
                            ili ga skenirajte, ako ga imate na papiru.
                        </p>
                    </div>
                </li>
                <li className="numbered-row">
                    <span className="numbered-index" aria-hidden="true">
                        3
                    </span>
                    <div>
                        <p className="item-title mb-2">
                            Pošaljite je uz zahtev, kao drugi prilog
                        </p>
                        <p className="body m-0">
                            Ovde nastavljate normalno i na kraju preuzimate PDF
                            zahteva. Ambasadi ili konzulatu onda šaljete dva
                            priloga: taj PDF i očitanu ličnu kartu.
                        </p>
                    </div>
                </li>
            </ol>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onNext}
                    className="btn btn-lg btn-primary btn-block"
                >
                    Nastavite
                </button>
                <button
                    type="button"
                    onClick={onPrevious}
                    className="btn btn-lg btn-ghost btn-block"
                >
                    Nazad
                </button>
            </div>
            <p className="form-actions-hint">
                Sledeće se potpisujete. Nazad vas vraća na izbor dokumenta, ako
                ipak imate važeći pasoš.
            </p>
        </div>
    );
}

export default ChipIdCardStep;
