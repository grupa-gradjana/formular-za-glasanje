import React from "react";

/**
 * Screen header: the origin strip is elsewhere (App), this is the per-screen
 * "where am I" line. Three stages, three bars — the label never changes inside
 * a stage, so the reader is not told they moved when they did not.
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
