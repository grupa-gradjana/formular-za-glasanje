import React from "react";

/**
 * Presentational half of step 5: everything the user checks before the PDF is
 * made. Split out so that the delicate part — the measured coordinates and the
 * pdf-lib run in ReviewStep — and the layout can be changed independently.
 *
 * Holds no state and makes no decisions beyond what to show: the parent owns
 * the generation, its progress and its failure, and passes all three in.
 *
 * @param {Object} props
 * @param {Object} props.formData - all eight fields
 * @param {string} props.docType - "licna-karta" | "pasos" | "licna-karta-cip"
 * @param {string|null} props.croppedImage - front side
 * @param {string|null} props.croppedImageBack - back side (ID card)
 * @param {string|null} props.signature - signature PNG data URL
 * @param {boolean} props.isGenerating - generation in progress
 * @param {string|null} props.errorMessage - failure text, if any
 * @param {Function} props.onGenerate - make the PDF and go to the last screen
 * @param {Function} props.onPrevious - back to the signature step
 * @param {Function} props.onEditData - jump back to the fields
 */
function ReviewView({
    formData,
    docType,
    croppedImage,
    croppedImageBack,
    signature,
    isGenerating,
    errorMessage,
    onGenerate,
    onPrevious,
    onEditData,
}) {
    // A chip card is never photographed: its prebivalište is on the chip, so
    // the user attaches the očitana lična karta to the i-mejl themselves. The
    // review has to say so, or the missing images read as a bug.
    const isChipCard = docType === "licna-karta-cip";

    const rows = [
        ["Ime i prezime", formData.fullName],
        ["Ime roditelja", formData.parentName],
        ["JMBG", formData.jmbg],
        ["Adresa prebivališta u Srbiji", formData.addressSerbia],
        ["Adresa u inostranstvu", formData.addressAbroad],
        ["Grad i država u kojoj želite da glasate", formData.votingLocation],
        ["Kontakt telefon", formData.phone],
        ["I-mejl", formData.email],
    ];

    return (
        <div role="region" aria-labelledby="review-title">
            <p className="eyebrow mb-3.5">POSLEDNJA PROVERA</p>
            <h2 id="review-title" className="h2 mb-3">
                Pročitajte još jednom
            </h2>
            <p className="lead mb-7">
                Ovo je sve što ulazi u zahtev. Ako je nešto pogrešno, ispravite
                sada; gotov PDF više ne možete da menjate.
            </p>

            <dl className="review-list">
                {rows.map(([key, value]) => (
                    <div className="review-row" key={key}>
                        <dt className="review-key">{key}</dt>
                        <dd className="review-value m-0">
                            {value || (
                                <span className="review-missing">
                                    nije upisano
                                </span>
                            )}
                        </dd>
                    </div>
                ))}
            </dl>

            <button
                type="button"
                onClick={onEditData}
                className="btn btn-ghost mt-[22px]"
            >
                Ispravite podatke
            </button>

            {croppedImage && (
                <div className="mt-9">
                    <h3 className="h3 mb-3.5">
                        {docType === "pasos"
                            ? "Slika pasoša"
                            : "Slike lične karte"}
                    </h3>
                    <div className="flex flex-wrap gap-[18px]">
                        <figure className="m-0">
                            <img
                                src={croppedImage}
                                alt={
                                    docType === "pasos"
                                        ? "Glavna strana pasoša"
                                        : "Prednja strana lične karte"
                                }
                                className="preview-image w-[280px] max-w-full object-contain"
                            />
                            <figcaption className="preview-caption">
                                {docType === "pasos"
                                    ? "Glavna strana"
                                    : "Prednja strana"}
                            </figcaption>
                        </figure>
                        {docType === "licna-karta" && croppedImageBack && (
                            <figure className="m-0">
                                <img
                                    src={croppedImageBack}
                                    alt="Zadnja strana lične karte"
                                    className="preview-image w-[280px] max-w-full object-contain"
                                />
                                <figcaption className="preview-caption">
                                    Zadnja strana
                                </figcaption>
                            </figure>
                        )}
                    </div>
                </div>
            )}

            {isChipCard && (
                <div className="mt-9">
                    <h3 className="h3 mb-3.5">Očitana lična karta</h3>
                    <p className="body m-0">
                        Nje nema u ovom PDF-u i ne dodajete je ovde. Prilažete
                        je sami, kao drugi fajl uz i-mejl — bez nje ambasada ili
                        konzulat nema vašu adresu prebivališta.
                    </p>
                </div>
            )}

            {signature && (
                <div className="mt-7">
                    <h3 className="h3 mb-3.5">Potpis</h3>
                    <img
                        src={signature}
                        alt="Vaš potpis"
                        className="preview-image w-[280px] max-w-full max-h-24 object-contain"
                    />
                </div>
            )}

            <div className="panel-quiet mt-9">
                <p className="item-title mb-2">Šta dobijate</p>
                <p className="body m-0">
                    {isChipCard
                        ? "Jedan PDF: popunjen zahtev i vaš potpis. Njega šaljete ambasadi ili konzulatu, a uz njega i očitanu ličnu kartu."
                        : "Jedan PDF: popunjen zahtev, slike dokumenta i vaš potpis. Njega šaljete ambasadi ili konzulatu."}
                </p>
            </div>

            {isGenerating && (
                <p className="body mt-4" role="status" aria-live="polite">
                    PDF se pravi, sačekajte…
                </p>
            )}

            {errorMessage && (
                <div className="panel-error mt-4" role="alert">
                    <p className="item-title mb-2">PDF nije napravljen</p>
                    <p className="body m-0">{errorMessage}</p>
                </div>
            )}

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onGenerate}
                    disabled={isGenerating}
                    aria-disabled={isGenerating}
                    aria-busy={isGenerating}
                    className={`btn btn-lg btn-block ${
                        isGenerating ? "btn-disabled" : "btn-primary"
                    }`}
                >
                    {isGenerating ? "PDF se pravi…" : "Napravite PDF"}
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
                PDF se pravi ovde, u vašem pregledaču. Na sledećem ekranu ga
                preuzimate na svoj uređaj — to je jedini trag koji ova stranica
                ostavlja.
            </p>
        </div>
    );
}

export default ReviewView;
