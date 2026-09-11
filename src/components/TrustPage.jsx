import React from "react";
import AboutPanel from "./AboutPanel";

/**
 * "Kako da proverite ovu stranicu" — reachable from every screen, mounted
 * beside the wizard so opening it never costs the user their entered data.
 *
 * Four proofs, then permission to skip this site entirely. The last part is
 * deliberate: for a reader who suspects a scam, being handed the manual route
 * is more convincing than any reassurance.
 *
 * @param {Object} props
 * @param {Function} props.onBack - return to the wizard
 */
function TrustPage({ onBack }) {
    return (
        <div className="shell" role="region" aria-labelledby="trust-title">
            <button type="button" onClick={onBack} className="chrome-link mb-4">
                ← Nazad na zahtev
            </button>

            <h1 id="trust-title" className="h1 mb-4 max-w-[22ch]">
                Kako da proverite ovu stranicu
            </h1>
            <p className="lead mb-9">
                Ne morate ništa da nam verujete na reč. Sve što ovde piše možete
                sami da proverite — a možete i da zaobiđete ovu stranicu i
                popunite zahtev rukom.
            </p>

            {/* A 3px red rule opens the list of proofs — the one place on this
                page where the accent carries structure. */}
            <div className="border-t-[3px] border-red-500">
                <div className="numbered-row py-6">
                    <span className="numbered-index" aria-hidden="true">
                        1
                    </span>
                    <div>
                        <h2 className="h3 mb-2.5">
                            Isključite internet i probajte
                        </h2>
                        <p className="body m-0">
                            Isključite Wi-Fi ili mobilni internet, pa popunite
                            zahtev do kraja. PDF se svejedno napravi i preuzme.
                            Da vaši podaci negde odlaze, bez interneta ne biste
                            stigli dalje od prve strane.
                        </p>
                    </div>
                </div>

                <div className="numbered-row py-6">
                    <span className="numbered-index" aria-hidden="true">
                        2
                    </span>
                    <div>
                        <h2 className="h3 mb-2.5">
                            Nema servera koji bi vaše podatke primio
                        </h2>
                        <p className="body mb-4">
                            Ovo je samo jedna stranica. Učita se u vaš pregledač
                            i dalje od njega ne ide ništa.
                        </p>
                        <div className="deny-list">
                            <div className="deny-item">
                                <span className="deny-mark" aria-hidden="true">
                                    ✕
                                </span>
                                <span>Nema naloga, lozinke ni prijave.</span>
                            </div>
                            <div className="deny-item">
                                <span className="deny-mark" aria-hidden="true">
                                    ✕
                                </span>
                                <span>Nema kolačića ni brojanja poseta.</span>
                            </div>
                            <div className="deny-item">
                                <span className="deny-mark" aria-hidden="true">
                                    ✕
                                </span>
                                <span>
                                    Ništa se ne pamti — osvežite stranicu i sve
                                    nestaje.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="numbered-row py-6">
                    <span className="numbered-index" aria-hidden="true">
                        3
                    </span>
                    <div>
                        <h2 className="h3 mb-2.5">
                            Kod je javan — neka ga pogleda neko kome verujete
                        </h2>
                        <p className="body mb-4">
                            Ne morate vi da ga čitate. Pošaljite link nekome ko
                            se razume u računare i pitajte ga šta misli.
                        </p>
                        <a
                            href="https://github.com/grupa-gradjana/formular-za-glasanje"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost"
                        >
                            Pogledajte izvorni kod →
                            <span className="sr-only">
                                (otvara se u novom prozoru)
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="panel-quiet mt-8">
                <h2 className="h3 mb-2.5">Možete i bez ove stranice</h2>
                <p className="body mb-3.5">
                    Isti zahtev možete da popunite i rukom.{" "}
                </p>
                <ol className="body m-0 mb-5 list-decimal pl-6 leading-[1.7]">
                    <li>Preuzmite prazan zvanični zahtev.</li>
                    <li>Popunite ga rukom i potpišite.</li>
                    <li>Priložite fotokopiju lične karte ili pasoša.</li>
                    <li>
                        Pošaljite ga i-mejlom ambasadi ili konzulatu, ili
                        odnesite lično.
                    </li>
                </ol>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="./Zahtev-za-glasanje-u-inostranstvu.pdf"
                        download
                        className="btn btn-ghost"
                    >
                        Prazan zahtev (PDF)
                    </a>
                    <a
                        href="https://www.mfa.gov.rs/predstavnistva/predstavnistva-srbije-u-svetu/ambasade"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                    >
                        Spisak ambasada i konzulata
                        <span className="sr-only">
                            (otvara se u novom prozoru)
                        </span>
                    </a>
                </div>
            </div>

            <div className="mt-8">
                <AboutPanel />
            </div>

            <div className="mt-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="btn btn-lg btn-primary btn-block"
                >
                    Nazad na zahtev
                </button>
            </div>
        </div>
    );
}

export default TrustPage;
