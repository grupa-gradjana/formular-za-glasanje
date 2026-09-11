import React, { useEffect, useRef, useState } from "react";
import StepHeader from "../StepHeader";

/**
 * Step 2 — which document the user has in hand. Real <button>s in a radiogroup
 * rather than clickable divs, so keyboard and voice control work without a
 * hand-rolled key handler.
 *
 * The screen leads with the pasoš alone. A lična karta is the exception now:
 * a card with a chip does not carry the prebivalište in print — that address
 * lives only on the chip — so a photograph of it proves nothing and the user
 * has to očita the card themselves and attach the result. Putting all three
 * choices side by side would invite people to photograph a chip card and send
 * a zahtev that the consulate has to reject, so the two lična karta routes sit
 * behind a one-way reveal and the chip one is spelled out on a screen of its
 * own. One-way on purpose: the link that opens them is gone once they are on
 * screen, because a toggle that closes again over a made choice is a way to
 * arrive at the photo step for a document the screen no longer shows.
 *
 * @param {Object} props
 * @param {string} props.selectedDocType - "licna-karta" | "pasos" | "licna-karta-cip" | ""
 * @param {Function} props.onDocTypeSelect - handler for the choice
 * @param {Function} props.onSelectChipCard - leave for the chip-card screen,
 *     which replaces the photo step for that document
 * @param {Function} props.onPrevious - go to previous step
 * @param {Function} props.onNext - go to next step
 */
function DocumentTypeSelectionStep({
    selectedDocType,
    onDocTypeSelect,
    onSelectChipCard,
    onPrevious,
    onNext,
}) {
    // Open when the user is coming back to a choice they already made in here.
    // This screen unmounts when it is left, so the initializer runs at exactly
    // the right moment — there is no stale copy to keep in sync.
    const [showIdCard, setShowIdCard] = useState(
        () =>
            selectedDocType === "licna-karta" ||
            selectedDocType === "licna-karta-cip",
    );

    // The link that reveals these unmounts itself on the click, so the focus
    // that was on it would fall back to the document body — a keyboard or
    // screen-reader user would be dropped at the top of the page with no idea
    // that anything appeared. Move focus onto the option that was revealed
    // instead. Only after a real click: coming back to an already-open screen
    // must not steal focus from where the user left it.
    const idCardRef = useRef(null);
    const revealedByClick = useRef(false);

    useEffect(() => {
        if (showIdCard && revealedByClick.current) {
            revealedByClick.current = false;
            idCardRef.current?.focus();
        }
    }, [showIdCard]);

    const revealIdCard = () => {
        revealedByClick.current = true;
        setShowIdCard(true);
    };

    // The chip card is chosen by leaving this screen, not by a radio, so it has
    // no checked option to come back to — the state has to be said in words.
    const isChipCard = selectedDocType === "licna-karta-cip";

    const passportOption = {
        value: "pasos",
        title: "Pasoš",
        hint: "Potrebna je jedna strana",
    };

    const idCardOption = {
        value: "licna-karta",
        title: "Lična karta bez čipa",
        hint: "Potrebne su obe strane, sa odštampanom adresom",
    };

    const renderOption = (option, ref) => {
        const selected = selectedDocType === option.value;
        return (
            <button
                key={option.value}
                ref={ref}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onDocTypeSelect(option.value)}
                className={`choice ${selected ? "choice-selected" : ""}`}
            >
                <span
                    className={`choice-radio ${
                        selected ? "choice-radio-selected" : ""
                    }`}
                    aria-hidden="true"
                >
                    {selected ? "✓" : ""}
                </span>
                <span>
                    <span className="choice-title">{option.title}</span>
                    <span className="choice-hint">{option.hint}</span>
                </span>
            </button>
        );
    };

    return (
        <div role="region" aria-labelledby="doc-type-title">
            <StepHeader stage={2} label="VAŠ DOKUMENT" />

            <h2 id="doc-type-title" className="h2 mb-3">
                Lična dokumenta
            </h2>
            <p className="lead mb-7">
                Uz zahtev ide slika važećeg pasoša — strana sa slikom i
                podacima.
            </p>

            <div
                className="flex flex-col gap-3"
                role="radiogroup"
                aria-labelledby="doc-type-title"
            >
                {renderOption(passportOption)}
                {showIdCard && renderOption(idCardOption, idCardRef)}
            </div>

            <div className="mt-5">
                {!showIdCard && (
                    <button
                        type="button"
                        onClick={revealIdCard}
                        className="link-button"
                    >
                        Ako vam je istekao pasoš →
                    </button>
                )}

                {showIdCard && (
                    <div>
                        <p className="body mb-[18px]">
                            Zahtev možete da podnesete i sa ličnom kartom, ali
                            nije svejedno koja je vaša. Lična karta bez čipa ima
                            odštampanu adresu prebivališta, pa je dovoljno da je
                            slikate — izaberite je iznad.
                        </p>
                        <button
                            type="button"
                            onClick={onSelectChipCard}
                            className="link-button"
                        >
                            Lična karta sa čipom →
                            <span className="sr-only">
                                {" "}
                                (otvara uputstvo za očitavanje čipa)
                            </span>
                        </button>
                        <p className="field-hint mt-2">
                            {isChipCard
                                ? "Izabrali ste ličnu kartu sa čipom. „Nastavite“ vas vraća na uputstvo."
                                : "Na njoj adresa nije odštampana, već je upisana u čip, pa slika nije dovoljna."}
                        </p>
                    </div>
                )}
            </div>

            <p className="form-actions-hint rule-top mt-7 pt-5">
                Slika ostaje na vašem uređaju. Ne šalje se nikome — završava u
                PDF-u koji preuzimate.
            </p>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!selectedDocType}
                    aria-disabled={!selectedDocType}
                    className={`btn btn-lg btn-block ${
                        selectedDocType ? "btn-primary" : "btn-disabled"
                    }`}
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
                {isChipCard
                    ? "Sledeće je uputstvo za očitanu ličnu kartu. Nazad vas vraća na vaše podatke."
                    : selectedDocType
                      ? "Sledeće dodajete sliku dokumenta. Nazad vas vraća na vaše podatke."
                      : "Izaberite dokument da biste nastavili."}
            </p>
        </div>
    );
}

export default DocumentTypeSelectionStep;
