import React from "react";

/**
 * The per-screen "where am I" line: an eyebrow and three bars, one per stage.
 * (The site-wide chrome — lockup, trust link, origin strip — is SiteHeader's.)
 *
 * The unit is the stage, not the step: the wizard's seven screens map onto
 * three stages, and steps 2 and 3 share one, so the caller passes the stage it
 * belongs to and the reader is not told they moved when they did not. The bars
 * are decorative; the same "Korak n od 3" is given to screen readers in the
 * sr-only paragraph below them.
 *
 * @param {Object} props
 * @param {number} props.stage - 1-based stage the user is in (1..3)
 * @param {string} props.label - stage name, e.g. "VAŠ DOKUMENT"
 */
function StepHeader({ stage, label }) {
    const total = 3;

    return (
        <div className="mb-8">
            <p className="eyebrow mb-3">
                KORAK {stage} OD {total} · {label}
            </p>
            <div className="stage-bars" aria-hidden="true">
                {[1, 2, 3].map((n) => (
                    <div
                        key={n}
                        className={`stage-bar ${
                            n <= stage ? "stage-bar-done" : ""
                        }`}
                    />
                ))}
            </div>
            <p className="sr-only">
                Korak {stage} od {total}: {label}
            </p>
        </div>
    );
}

export default StepHeader;
