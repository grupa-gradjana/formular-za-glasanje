import React from "react";

/**
 * The URL of the Ministry's list of Serbian embassies and consulates, and the
 * caution that has to travel with it.
 *
 * The list is the only way the user finds the address the finished zahtev is
 * sent to, so every screen offers it — but it is someone else's page, it is
 * not always current, and a zahtev sent to a dead i-mejl is lost silently.
 * Every link to it therefore carries <MfaListNotice> underneath, pointed at by
 * the link's aria-describedby, so the caution is part of the link's
 * description rather than a paragraph a screen reader may never reach.
 *
 * Keep the wording a claim about the list, not about the Ministry: the page
 * cannot verify the data, which is checkable, rather than accusing anyone.
 */
export const MFA_EMBASSY_LIST_URL =
    "https://www.mfa.gov.rs/predstavnistva/predstavnistva-srbije-u-svetu/ambasade";

/**
 * @param {Object} props
 * @param {string} props.id - unique in the document; TrustPage and the wizard
 *   are mounted at the same time, so each use needs its own id
 * @param {string} [props.className] - spacing for the call site
 */
function MfaListNotice({ id, className = "" }) {
    return (
        <p id={id} className={`field-warn ${className}`}>
            <span aria-hidden="true" className="font-bold">
                !
            </span>
            <span>
                Spisak ambasada i konzulata održava Ministarstvo spoljnih
                poslova. <b> I-mejl adrese i telefoni ponekad su zastareli.</b>{" "}
                Pre nego što pošaljete zahtev, potvrdite kontakt na stranici
                same ambasade ili konzulata ili telefonom.
            </span>
        </p>
    );
}

export default MfaListNotice;
