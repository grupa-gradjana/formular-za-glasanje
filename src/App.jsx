import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Form from "./components/Form";
import ErrorBoundary from "./components/ErrorBoundary";
import SiteHeader from "./components/SiteHeader";
import TrustPage from "./components/TrustPage";
import { loadPdfAssets } from "./pdfAssets";

function App() {
    // A doubtful reader needs the trust case at any moment, not only at the
    // start, so it lives above the wizard and can be opened from every screen
    // without losing form state (the wizard stays mounted underneath).
    const [showTrust, setShowTrust] = useState(false);

    // Every wizard step lands at the top of the screen; opening and closing the
    // trust page is the same kind of navigation, so it has to do it too.
    // Without this the trust page opens half-way down — the link to it sits at
    // the bottom of the welcome screen — and coming back leaves the wizard
    // scrolled just as far. It runs after the swap and without an animation for
    // the reasons written out over the same effect in Form.jsx; keep the two in
    // step.
    const goTo = (trust) => setShowTrust(trust);

    const firstRender = useRef(true);
    useLayoutEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [showTrust]);

    // Pull the blank form and the font down while the user is still reading the
    // first screen, so that the last step — the only one that needs a file from
    // the server — still works if the connection is gone by then.
    useEffect(() => {
        loadPdfAssets().catch(() => {});
    }, []);

    return (
        <div className="page">
            <SiteHeader onOpenTrust={() => goTo(true)} />
            <main className="flex-1">
                <ErrorBoundary>
                    <div hidden={showTrust}>
                        <Form onOpenTrust={() => goTo(true)} />
                    </div>
                    {showTrust && <TrustPage onBack={() => goTo(false)} />}
                </ErrorBoundary>
            </main>
            {/* The red band that closes the foot of every page in the
                identity. Decorative, and the last thing in the document. */}
            <div className="foot-band" aria-hidden="true" />
        </div>
    );
}

export default App;
