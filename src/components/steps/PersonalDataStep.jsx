import React, { useEffect, useState } from "react";
import StepHeader from "../StepHeader";
import { loadRuleTextMeasurer } from "../../pdfAssets";
import {
    VALUE_MAX_WIDTH,
    fittingLength,
    layOutRuleValue,
} from "../../pdfLayout";

/**
 * Step 1 — the eight fields the zahtev asks for, in one column.
 *
 * Six of them are drawn onto a printed rule on page 1 of the template, and a
 * rule is only 229.75pt wide. ReviewStep shrinks and wraps to make room (see
 * src/pdfLayout.js), but past two lines at 9pt the tail runs off the end and
 * is lost from the form the consulate receives — so `ruleField` warns while
 * the user can still do something about it. The value is deliberately not
 * capped: an address that long should be flagged, not blocked.
 *
 * The warning runs the very same layout routine against the very same font
 * the PDF is drawn with, so it cannot promise room that step 5 does not have,
 * and it quotes the measured cut point rather than a fixed character budget —
 * width is a property of the glyphs, not of how many there are ("Đinđićeva"
 * and "Illinois" are the same length and nowhere near the same width).
 *
 * JMBG is one input rather than thirteen boxes; the 13-digit rule is enforced
 * in handleJmbgChange, and the PDF is what splits the digits into the
 * template's cells.
 *
 * @param {Object} props
 * @param {Object} props.formData - form data state object
 * @param {Function} props.onFormChange - handle form field changes
 * @param {Function} props.onSubmit - handle form submission
 * @param {Function} props.onPrevious - go back to the first screen
 */

/**
 * "znak" / "znaka" / "znakova" for a count — Serbian agrees the noun with the
 * last digit (1 → znak, 2–4 → znaka, everything else → znakova), except in the
 * teens, which always take the genitive plural. The measured cut point lands
 * anywhere in the tens and hundreds, so the warning cannot hard-code one form.
 *
 * @param {number} n
 * @returns {string}
 */
const characterWord = (n) => {
    const lastTwo = n % 100;
    const last = n % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return "znakova";
    if (last === 1) return "znak";
    if (last >= 2 && last <= 4) return "znaka";
    return "znakova";
};

function PersonalDataStep({ formData, onFormChange, onSubmit, onPrevious }) {
    // The width function comes from the font that was fetched when the app
    // mounted, so it is normally here before this screen can be reached. While
    // it is not, `cutAt` returns null and nothing is warned about — the right
    // way round: a wrong warning on a correct address is worse than none.
    const [measure, setMeasure] = useState(null);
    useEffect(() => {
        let cancelled = false;
        loadRuleTextMeasurer()
            .then((widthOf) => {
                // setState treats a bare function as an updater, hence the wrap.
                if (!cancelled) setMeasure(() => widthOf);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFormChange({ ...formData, [name]: value });
    };

    // JMBG is 13 digits by definition. The field is type="text" with a numeric
    // inputMode rather than type="number", because a number input ignores both
    // maxLength and pattern — so the filtering and the cap happen here, and
    // the attributes on the input only back them up for native validation.
    const handleJmbgChange = (e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 13);
        onFormChange({ ...formData, jmbg: digits });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    /**
     * How many characters of this value would survive, or null when it fits.
     * @param {string} value
     * @returns {number|null}
     */
    const cutAt = (value) => {
        if (!measure || !value) return null;
        const { overflows } = layOutRuleValue(value, VALUE_MAX_WIDTH, measure);
        if (!overflows) return null;
        return fittingLength(value, VALUE_MAX_WIDTH, measure);
    };

    /**
     * One text field that lands on a printed rule.
     * @param {string} name - formData key
     * @param {string} label - visible label
     * @param {string} [autoComplete] - autofill hint
     */
    const ruleField = (name, label, autoComplete) => {
        const value = formData[name];
        const fits = cutAt(value);
        const over = fits !== null;
        return (
            <div className="form-group">
                <label htmlFor={name} className="form-label">
                    {label}
                </label>
                <input
                    type="text"
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    autoComplete={autoComplete}
                    aria-describedby={over ? `${name}-warn` : undefined}
                    className={`form-input ${over ? "form-input-warn" : ""}`}
                />
                {over && (
                    <p id={`${name}-warn`} className="field-warn" role="alert">
                        <span aria-hidden="true" className="font-bold">
                            !
                        </span>
                        <span>
                            Ovo ne staje u polje na zahtevu. Skratite na
                            najviše {fits} {characterWord(fits)} — trenutno ih
                            ima {value.length}.
                        </span>
                    </p>
                )}
            </div>
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            aria-labelledby="personal-data-title"
            noValidate={false}
        >
            <StepHeader stage={1} label="VAŠI PODACI" />

            <h2 id="personal-data-title" className="h2 mb-7">
                Vaši podaci
            </h2>

            <fieldset className="form-stack m-0 border-0 p-0">
                <legend className="sr-only">Lični podaci</legend>
                {ruleField("fullName", "Ime i prezime", "name")}
                {ruleField("parentName", "Ime roditelja")}

                <div className="form-group">
                    <label htmlFor="jmbg" className="form-label">
                        JMBG — jedinstveni matični broj građana
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        id="jmbg"
                        name="jmbg"
                        value={formData.jmbg}
                        onChange={handleJmbgChange}
                        required
                        aria-required="true"
                        pattern="[0-9]{13}"
                        maxLength={13}
                        title="JMBG mora imati tačno 13 cifara"
                        aria-describedby="jmbg-hint"
                        className="form-input form-input-digits"
                    />
                    <p id="jmbg-hint" className="field-hint" aria-live="polite">
                        Upisali ste {formData.jmbg.length} od 13 cifara.
                    </p>
                </div>
            </fieldset>

            <fieldset className="form-stack m-0 mt-[22px] border-0 p-0">
                <legend className="sr-only">Adrese</legend>
                {ruleField(
                    "addressSerbia",
                    "Adresa prebivališta u Srbiji",
                    "address-line1",
                )}
                {ruleField("addressAbroad", "Adresa u inostranstvu")}
                {ruleField(
                    "votingLocation",
                    "Grad i država u kojima želite da glasate",
                )}
            </fieldset>

            <fieldset className="form-stack m-0 mt-[22px] border-0 p-0">
                <legend className="sr-only">Kontakt</legend>
                <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                        Kontakt telefon
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        autoComplete="tel"
                        aria-describedby="phone-hint"
                        className="form-input"
                    />
                    <p id="phone-hint" className="field-hint">
                        Sa pozivnim brojem države, na primer +49 za Nemačku.
                    </p>
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        I-mejl
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        autoComplete="email"
                        className="form-input"
                    />
                </div>
            </fieldset>

            <div className="form-actions">
                <button
                    type="submit"
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
                Sledeće birate dokument — ličnu kartu ili pasoš.
            </p>
        </form>
    );
}

export default PersonalDataStep;
