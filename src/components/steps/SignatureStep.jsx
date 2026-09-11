import React from "react";
import SignaturePad from "../SignaturePad";
import StepHeader from "../StepHeader";

/**
 * Step 4 — the signature. The escape hatch matters here: someone who cannot
 * draw with a finger is told, on this screen, that printing and signing by hand
 * is just as valid, instead of being stuck behind a disabled button.
 *
 * @param {Object} props
 * @param {Function} props.onSignatureSubmit - receives the signature data URL
 * @param {Function} props.onSignatureClear - clear the stored signature
 * @param {Function} props.onPrevious - go back to the photo step
 */
function SignatureStep({ onSignatureSubmit, onSignatureClear, onPrevious }) {
    return (
        <div role="region" aria-labelledby="signature-title">
            <StepHeader stage={3} label="POTPIS" />

            <h2 id="signature-title" className="h2 mb-3">
                Potpišite se
            </h2>
            <p className="lead mb-6">
                Potpis nacrtajte prstom ili mišem u belom polju ispod. Možete da
                ga obrišete i ponovite koliko god puta želite.
            </p>

            <div role="region" aria-label="Oblast za potpisivanje">
                <SignaturePad
                    onSubmit={onSignatureSubmit}
                    onClear={onSignatureClear}
                />
            </div>

            <p className="form-actions-hint mt-[18px]">
                Ako potpis ovde ne ispadne kako želite, gotov PDF možete i da
                odštampate i potpišete rukom. Takav zahtev vredi jednako.
            </p>

            <div className="mt-7">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="btn btn-lg btn-ghost btn-block"
                >
                    Nazad
                </button>
            </div>

            <div className="sr-only">
                Na ovom koraku dodajete svoj potpis. Potpis crtate mišem ili
                prstom u polju za potpis. Ako koristite tastaturu, pritisnite
                Enter ili Space dok je fokus na tom polju. Zatim pritisnite
                dugme Potvrdite potpis.
            </div>
        </div>
    );
}

export default SignatureStep;
