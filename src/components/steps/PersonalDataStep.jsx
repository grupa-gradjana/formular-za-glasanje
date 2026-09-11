import React, { useEffect, useState } from "react";
import StepHeader from "../StepHeader";
import { loadRuleTextMeasurer } from "../../pdfAssets";
import {
    VALUE_MAX_WIDTH,
    fittingLength,
    layOutRuleValue,
} from "../../pdfLayout";

/**
 * Step 1 — the eight fields, one column, 19px inputs.
 *
 * Two things differ from the old version beyond styling:
 *  - JMBG is a single monospace input rather than 13 boxes (same 13-digit
 *    filtering, far less to code, debug and edit).
 *  - Fields that are drawn onto a printed rule on page 1 of the template warn
 *    when the value will not fit. ReviewStep shrinks and wraps to make room
 *    (see src/pdfLayout.js), but the rule is only 229.75pt wide and past two
 *    lines at 9pt the tail is silently lost from the form the consulate
 *    receives. The check here is the same layout routine run against the same
 *    font, so what the user is warned about is exactly what would be cut —
 *    a character count could not do that, since width is a property of the
 *    glyphs and not of the number of them.
 *
 * @param {Object} props
 * @param {Object} props.formData - form data state object
 * @param {Function} props.onFormChange - handle form field changes
 * @param {Function} props.onSubmit - handle form submission
 * @param {Function} props.onPrevious - go back to the first screen
 */

function PersonalDataStep({ formData, onFormChange, onSubmit, onPrevious }) {
    // The font arrives with the rest of the PDF assets, fetched when the app
    // mounted — long before this screen can be reached. Until it is here
    // nothing is warned about, which is the right way round: a wrong warning
    // on a correct address is worse than no warning at all.
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

    // JMBG must stay exactly 13 digits, and a type="number" input ignores both
    // maxLength and pattern, so the length is enforced here instead.
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
                            najviše {fits} znakova — trenutno ih ima{" "}
                            {value.length}.
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
                    "Grad i država u kojoj želite da glasate",
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
