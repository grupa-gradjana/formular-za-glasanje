import React from "react";
import { IZBORNE_ADRESE, IZBORNE_ADRESE_DATUM } from "../data/izborneAdrese";

/**
 * The election addresses the missions published for 25. oktobar 2026,
 * grouped by country, behind a native <details> so the done screen stays short
 * for everyone who already knows where to send the zahtev.
 *
 * It sits above the Ministry link, not instead of it: the Ministry's list
 * still covers every mission, this one covers the missions whose election
 * notice we read. Each row links to the mission's own site, so the user can
 * check the address where it was published — the same "verify, don't trust"
 * stance as <MfaListNotice>.
 *
 * Addresses are mailto: links. That is a navigation the user makes, not a
 * request the page makes, so the CSP in index.html is untouched.
 *
 * @param {Object} props
 * @param {string} [props.className] - spacing for the call site
 */
function IzborneAdrese({ className = "" }) {
    const zemlje = [];
    for (const red of IZBORNE_ADRESE) {
        const poslednja = zemlje[zemlje.length - 1];
        if (poslednja && poslednja.zemlja === red.zemlja) {
            poslednja.redovi.push(red);
        } else {
            zemlje.push({ zemlja: red.zemlja, redovi: [red] });
        }
    }

    return (
        <details className={`izborne-adrese ${className}`}>
            <summary className="item-title">
                Adrese ambasada i konzulata za izbore 2026.
            </summary>
            <p className="field-hint mt-3 mb-4">
                Većina predstavništava je za ove izbore objavila posebnu
                i-mejl adresu za zahteve. Svaka adresa ispod prepisana je iz
                obaveštenja o izborima na sajtu tog predstavništva (provereno{" "}
                {IZBORNE_ADRESE_DATUM}). Zahtev pošaljite predstavništvu koje
                pokriva grad u kom ćete glasati.
            </p>
            <dl className="m-0">
                {zemlje.map(({ zemlja, redovi }) => (
                    <div key={zemlja} className="izborne-adrese-zemlja">
                        <dt className="item-title">{zemlja}</dt>
                        {redovi.map((red) => (
                            <dd key={red.mesto} className="body m-0">
                                <a
                                    href={red.sajt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {red.mesto}
                                    <span className="sr-only">
                                        {" "}
                                        (sajt predstavništva, otvara se u novom
                                        prozoru)
                                    </span>
                                </a>
                                :{" "}
                                {red.mejlovi.map((mejl, i) => (
                                    <React.Fragment key={mejl}>
                                        {i > 0 && " i "}
                                        <a href={`mailto:${mejl}`}>{mejl}</a>
                                    </React.Fragment>
                                ))}
                                {red.samoKontakt && (
                                    <span className="field-hint">
                                        {" "}
                                        (obaveštenje ne navodi i-mejl; adresa
                                        je sa kontakt stranice)
                                    </span>
                                )}
                            </dd>
                        ))}
                    </div>
                ))}
            </dl>
            <p className="field-hint mt-4 mb-0">
                Nema vaše zemlje? Koristite spisak Ministarstva ispod.
            </p>
        </details>
    );
}

export default IzborneAdrese;
