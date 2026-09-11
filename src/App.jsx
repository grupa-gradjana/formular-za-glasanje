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

    const goTo = (trust) => setShowTrust(trust);

    // Opening or closing the trust page is a navigation like any wizard step,
    // so it lands at the top of the new screen. The link into it sits at the
    // foot of the welcome screen, so without this the trust page opens
    // half-way down and coming back leaves the wizard scrolled just as far.
    // Layout effect and instant scroll, for the same two reasons spelled out
    // over the matching effect in Form.jsx; keep the two in step.
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
