import React from "react";
import markColor from "../assets/mark-color.png";
import markWhite from "../assets/mark-white.png";

/**
 * The sticky header carried on every screen: the horizontal logo lockup and
 * the one piece of chrome that has to be reachable at any moment — the route
 * into "Kako da proverite ovu stranicu". A doubtful reader should not have to
 * scroll back to the first screen to find it.
 *
 * The mark is raster artwork from the brand book (a vector version does not
 * exist yet); the wordmark is set live in Piazzolla rather than shipped as
 * artwork, which is what the design system does. Both files are bundled — no
 * remote origin, and nothing else the header needs from the network.
 *
 * @param {Object} props
 * @param {Function} props.onOpenTrust - open "Kako da proverite ovu stranicu"
 */
function SiteHeader({ onOpenTrust }) {
    return (
        <header className="site-header">
            <div className="site-header-row">
                <span className="inline-flex items-center gap-[11px]">
                    {/* Two files rather than a filter: the mark is two brand
                        colours, and a white knockout of it is its own artwork. */}
                    <img
                        src={markColor}
                        alt=""
                        width="36"
                        height="36"
                        className="block h-9 w-9 flex-none dark:hidden"
                    />
                    <img
                        src={markWhite}
                        alt=""
                        width="36"
                        height="36"
                        className="hidden h-9 w-9 flex-none dark:block"
                    />
                    <span className="block whitespace-nowrap font-serif text-[16px] font-medium leading-[1.06] tracking-[0.02em] text-ink dark:text-white">
                        Skupština
                        <br />u rasejanju
                    </span>
                </span>

                <button
                    type="button"
                    onClick={onOpenTrust}
                    className="chrome-link"
                >
                    Zašto da nam verujete
                </button>
            </div>
            <p className="origin-strip">
                NIJE DRŽAVNA STRANICA · NAPRAVILA SKUPŠTINA U RASEJANJU
            </p>
        </header>
    );
}

export default SiteHeader;
