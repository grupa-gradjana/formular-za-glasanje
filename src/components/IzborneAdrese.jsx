import React from "react";
import MfaListNotice, { MFA_EMBASSY_LIST_URL } from "./MfaListNotice";
import { IZBORNE_ADRESE, IZBORNE_ADRESE_DATUM } from "../data/izborneAdrese";

/**
 * The election addresses the missions published for 25. oktobar 2026,
 * grouped by country, behind a native <details> so the screen stays short for
 * everyone who already knows where to send the zahtev. The title and the
 * description sit outside it so they are read before the toggle, and the
 * <summary> is styled as a ghost pill: a bare disclosure triangle did not
 * read as something to press. It is shown on
 * WelcomeStep, TrustPage and DoneStep.
 *
 * The Ministry's list is the fallback for a mission that is not here, so its
 * link and <MfaListNotice> live at the bottom of this list rather than at the
 * call sites. TrustPage and the wizard are in the DOM at the same time, so
 * each call site passes its own `noticeId`.
 *
 * It sits above the Ministry link, not instead of it: the Ministry's list
 * still covers every mission, this one covers the missions whose election
 * notice we read. Each row links straight to that notice (or, where there is
 * none, to the contact page the address came from), so the user can check the
 * address where it was published — the same "verify, don't trust" stance as
 * <MfaListNotice>.
 *
 * Addresses are mailto: links. That is a navigation the user makes, not a
 * request the page makes, so the CSP in index.html is untouched.
 *
 * @param {Object} props
 * @param {string} props.noticeId - id for the Ministry-list caution, unique
 *   in the document
 * @param {string} [props.className] - spacing for the call site
 */
function IzborneAdrese({ noticeId, className = "" }) {
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
        <div className={className}>
            <p className="item-title mb-1">
                Stranice ambasada i konzulata o izborima 2026
            </p>
            <p className="field-hint mb-3">
                Spisak stranica na kojima su ambasade i konzulati objavili
                obaveštenje o izborima 25. oktobra 2026, sa i-mejl adresom za
                zahteve iz svakog obaveštenja.
            </p>
            <details className="izborne-adrese">
                <summary className="btn btn-ghost">
                    <span className="izborne-adrese-otvori">
                        Otvorite spisak
                    </span>
                    <span className="izborne-adrese-zatvori">
                        Zatvorite spisak
                    </span>
                    <span
                        className="izborne-adrese-strelica"
                        aria-hidden="true"
                    >
                        ▾
                    </span>
                </summary>
                <p className="field-hint mt-3 mb-4">
                    Većina predstavništava je za ove izbore objavila posebnu
                    i-mejl adresu za zahteve. Naziv grada vodi na obaveštenje o
                    izborima na sajtu tog predstavništva, a adresa pored njega
                    prepisana je iz tog obaveštenja (provereno{" "}
                    {IZBORNE_ADRESE_DATUM}). Zahtev pošaljite predstavništvu
                    koje pokriva grad u kom ćete glasati.
                </p>
                <dl className="m-0">
                    {zemlje.map(({ zemlja, redovi }) => (
                        <div key={zemlja} className="izborne-adrese-zemlja">
                            <dt className="item-title">{zemlja}</dt>
                            {redovi.map((red) => (
                                <dd key={red.mesto} className="body m-0">
                                    <a
                                        href={red.izvor}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {red.mesto}
                                        <span className="sr-only">
                                            {" "}
                                            (
                                            {red.samoKontakt ||
                                            red.bezObavestenja
                                                ? "kontakt stranica"
                                                : "obaveštenje"}{" "}
                                            predstavništva, otvara se u novom
                                            prozoru)
                                        </span>
                                    </a>
                                    :{" "}
                                    {red.mejlovi.map((mejl, i) => (
                                        <React.Fragment key={mejl}>
                                            {i > 0 && " i "}
                                            <a href={`mailto:${mejl}`}>
                                                {mejl}
                                            </a>
                                        </React.Fragment>
                                    ))}
                                    {red.ili && (
                                        <>
                                            {" "}
                                            (ili{" "}
                                            <a href={`mailto:${red.ili}`}>
                                                {red.ili}
                                            </a>
                                            )
                                        </>
                                    )}
                                    {red.samoKontakt && (
                                        <span className="field-hint">
                                            {" "}
                                            (obaveštenje ne navodi i-mejl;
                                            adresa je sa kontakt stranice)
                                        </span>
                                    )}
                                    {red.bezObavestenja && (
                                        <span className="field-hint">
                                            {" "}
                                            (obaveštenje o izborima nije
                                            pronađeno na sajtu; adresa je sa
                                            kontakt stranice)
                                        </span>
                                    )}
                                </dd>
                            ))}
                        </div>
                    ))}
                </dl>
                <div className="rule-top mt-4 pt-4">
                    <p className="body mb-3">
                        Ako na ovom spisku ne nađete svoju ambasadu ili
                        konzulat, potražite ga na spisku Ministarstva spoljnih
                        poslova.
                    </p>
                    <a
                        href={MFA_EMBASSY_LIST_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                        aria-describedby={noticeId}
                    >
                        Spisak ambasada i konzulata
                        <span className="sr-only">
                            {" "}
                            (otvara se u novom prozoru)
                        </span>
                    </a>
                    <MfaListNotice id={noticeId} className="mt-3 mb-0" />
                </div>
            </details>
        </div>
    );
}

export default IzborneAdrese;
