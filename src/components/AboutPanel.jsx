import React from "react";

/**
 * Who made this page, and where the voting guide is. Shown on the first
 * screen and on the trust page — the two places a reader asks "ko ovo
 * pravi". Kept in one component so the two screens cannot drift apart.
 *
 * The guide is the only link here; it is an outside page, so it opens in a
 * new tab and says so to a screen reader. No ids inside: the wizard stays
 * mounted (hidden) while the trust page is open, so both copies can be in the
 * document at once.
 */
function AboutPanel() {
    return (
        <div className="panel-quiet">
            <p className="item-title mb-2">Ko stoji iza ove stranice</p>
            <p className="body mb-4">
                Skupština u rasejanju predstavlja slobodnu građansku platformu,
                nastalu iz ljubavi prema našoj zemlji i potrebe da se unaprede i
                očuvaju demokratija i vladavina prava u Srbiji.
            </p>
            <a
                href="https://skupstinaurasejanju.org/vodiczaglasanje"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
            >
                Vodič za glasanje →
                <span className="sr-only">(otvara se u novom prozoru)</span>
            </a>
        </div>
    );
}

export default AboutPanel;
