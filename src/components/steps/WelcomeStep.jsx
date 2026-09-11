import React from "react";
import AboutPanel from "../AboutPanel";

/**
 * Step 0. Answers "what is this, is it safe, what will it cost me" before
 * asking for a single field. The privacy panel is phrased as what the page
 * does not do, each claim being something the reader can go and check —
 * TrustPage, reachable from here and from the header, shows them how.
 *
 * @param {Object} props
 * @param {Function} props.onNext - advance to the personal data step
 * @param {Function} props.onOpenTrust - open "Kako da proverite ovu stranicu"
 */
function WelcomeStep({ onNext, onOpenTrust }) {
    return (
        <div role="region" aria-labelledby="welcome-title">
            <h1
                id="welcome-title"
                className="h1 mb-4 max-w-[20ch] sm:text-[40px] sm:leading-[1.1]"
            >
                Popunite zahtev za glasanje iz inostranstva
            </h1>
            <p className="lead mb-7 max-w-[46ch]">
                Ovaj stranica vam pomaže da samo za nekoliko minuta popunite i
                pripremite zvaničan formular-zahtev za glasanje iz inostranstva
                objavljen na internet stranicama ambasada.
            </p>

            {/* The two dates the whole flow hangs on, as the identity's solid
                blocks. The label carries the deadline, the block carries the
                urgency — blue for the one you should aim at, red for the one
                after which it is too late. */}
            <div className="deadline-cards mb-7">
                <div className="deadline-card deadline-card-early">
                    <p className="deadline-label">Idealni rok za prijavu</p>
                    <p className="deadline-date">do 24. septembra</p>
                    <span className="deadline-node" aria-hidden="true" />
                </div>
                <div className="deadline-card deadline-card-last">
                    <p className="deadline-label">Krajnji rok</p>
                    <p className="deadline-date">3. oktobar</p>
                    <span className="deadline-node" aria-hidden="true" />
                </div>
            </div>

            <div className="pulled mb-7">
                <div>
                    <p className="body mb-[18px]">
                        Popunjeni zahtev-formular, sa slikom pasoša (ili slikom
                        lične karte), preuzimate u PDF formatu.{" "}
                        <span className="font-extrabold italic">
                            Preuzeti fajl potom pošaljite imejlom ambasadi ili
                            konzulatu.{" "}
                        </span>
                        Ova stranica ne prikuplja vaše podatke i ne šalje ništa
                        ni u vaše ime, a ni bez vašeg znanja.
                    </p>
                    <p className="body m-0">Proces je jako jednostavan.</p>
                </div>
            </div>

            <ol className="numbered-list" aria-label="Tri koraka">
                <li className="numbered-row">
                    <span className="numbered-index" aria-hidden="true">
                        1
                    </span>
                    <div>
                        <p className="item-title m-0 mb-1.5">
                            Unesite svoje podatke
                        </p>
                        <p className="field-hint">
                            Ime, JMBG, adresu u Srbiji i inostranstvu, kontakt
                            telefon i imejl.
                        </p>
                    </div>
                </li>
                <li className="numbered-row">
                    <span className="numbered-index" aria-hidden="true">
                        2
                    </span>
                    <div>
                        <p className="item-title m-0 mb-1.5">
                            Dodajte sliku dokumenta
                        </p>
                        <p className="field-hint">
                            Slika važećeg pasoša ili lične karte sa vašeg
                            računara ili telefona.
                        </p>
                    </div>
                </li>
                <li className="numbered-row">
                    <span className="numbered-index" aria-hidden="true">
                        3
                    </span>
                    <div>
                        <p className="item-title m-0 mb-1.5">
                            Preuzmite popunjen zahtev
                        </p>
                        <p className="field-hint">
                            Pošaljite ga ambasadi ili konzulatu imejlom, ili ga
                            odnesite lično.
                        </p>
                    </div>
                </li>
            </ol>

            <div
                className="panel mt-8"
                role="region"
                aria-labelledby="privacy-title"
            >
                <p id="privacy-title" className="h3 mb-[18px]">
                    Šta ova stranica <u>ne</u> radi:
                </p>
                <div className="deny-list">
                    <div className="deny-item">
                        <span className="deny-mark" aria-hidden="true">
                            ✕
                        </span>
                        <span>Ne šalje vaše podatke nikome.</span>
                    </div>
                    <div className="deny-item">
                        <span className="deny-mark" aria-hidden="true">
                            ✕
                        </span>
                        <span>
                            Ne koristi server ni bazu podataka. Podaci, slike
                            dokumenata i izrada PDF-a obrađuju se samo na vašem
                            uređaju.
                        </span>
                    </div>
                    <div className="deny-item">
                        <span className="deny-mark" aria-hidden="true">
                            ✕
                        </span>
                        <span>Ne pravi nalog i ne traži lozinku.</span>
                    </div>
                    <div className="deny-item">
                        <span className="deny-mark" aria-hidden="true">
                            ✕
                        </span>
                        <span>
                            Ne pamti ništa — kada zatvorite stranicu, svi podaci
                            nestaju.
                        </span>
                    </div>
                    <div className="deny-item">
                        <span className="deny-mark" aria-hidden="true">
                            ✕
                        </span>
                        <span>Ne koristi kolačiće i ne meri posete.</span>
                    </div>
                </div>
            </div>

            <div
                className="panel mt-8"
                role="region"
                aria-labelledby="safety-title"
            >
                <p id="safety-title" className="h3 mb-[18px]">
                    Ne verujete nam?
                </p>
                <div className="allow-list">
                    <div className="allow-item">
                        Slobodno isključite internet ako želite. Sve
                        informacije, uključujući podatke, slike dokumenata i
                        izradu PDF-a, obrađuju se samo lokalno na vašem uređaju
                        u okviru ove stranice.
                    </div>
                </div>
            </div>

            <div className="form-actions mt-8">
                <button
                    type="button"
                    onClick={onNext}
                    className="btn btn-lg btn-primary btn-block"
                >
                    Počnite
                </button>
            </div>

            <div className="mt-8">
                <AboutPanel />
            </div>

            <div className="mt-7 flex flex-col gap-3.5 rule-top pt-5 text-[17px]">
                <button
                    type="button"
                    onClick={onOpenTrust}
                    className="link-button"
                >
                    Zašto da nam verujete →
                </button>
                <a
                    href="https://www.mfa.gov.rs/predstavnistva/predstavnistva-srbije-u-svetu/ambasade"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Spisak ambasada i konzulata →
                    <span className="sr-only">(otvara se u novom prozoru)</span>
                </a>
            </div>
        </div>
    );
}

export default WelcomeStep;
