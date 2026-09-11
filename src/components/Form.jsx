import React, { useState, useRef, useLayoutEffect } from "react";
import "react-advanced-cropper/dist/style.css";
import "./Form.css";

import WelcomeStep from "./steps/WelcomeStep";
import PersonalDataStep from "./steps/PersonalDataStep";
import DocumentTypeSelectionStep from "./steps/DocumentTypeSelectionStep";
import PhotoStep from "./steps/PhotoStep";
import ChipIdCardStep from "./steps/ChipIdCardStep";
import SignatureStep from "./steps/SignatureStep";
import ReviewStep from "./steps/ReviewStep";
import DoneStep from "./steps/DoneStep";

/**
 * All app state + step routing (the hub), unchanged in spirit from the previous
 * version: one linear wizard driven by a single `step` integer, everything held
 * in React state, nothing serialized anywhere.
 *
 * What changed is the presentation: the seven screens are grouped into THREE
 * named stages, and the old separate confirmation screen is folded into the
 * photo screen (you confirm the crop you are looking at).
 *
 *   step 0  Welcome                       (no stage bar)
 *   step 1  Vaši podaci        → stage 1
 *   step 2  Vaš dokument: izbor → stage 2
 *   step 3  Vaš dokument: slika → stage 2   (runs twice for a lična karta;
 *                                            for a chip card it is the
 *                                            ChipIdCardStep instead — nothing
 *                                            to photograph, see that file)
 *   step 4  Potpis             → stage 3
 *   step 5  Pregled i preuzimanje
 *   step 6  Šta sad (posle preuzimanja)
 *
 * @param {Object} props
 * @param {Function} props.onOpenTrust - open the "Kako da proverite ovu stranicu" page
 */
const Form = ({ onOpenTrust }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        parentName: "",
        jmbg: "",
        addressSerbia: "",
        addressAbroad: "",
        votingLocation: "",
        phone: "",
        email: "",
    });
    const [step, setStep] = useState(0);
    // "licna-karta" (no chip: photographed) | "pasos" | "licna-karta-cip"
    // (chip: nothing to photograph, the user attaches the očitana lična
    // karta to the i-mejl themselves — see ChipIdCardStep)
    const [docType, setDocType] = useState("");
    const [imageSrc, setImageSrc] = useState(null); // raw upload
    const [croppedImage, setCroppedImage] = useState(null); // front
    const [croppedImageBack, setCroppedImageBack] = useState(null); // ID back
    const [signature, setSignature] = useState(null);
    const [isCapturingIdBack, setIsCapturingIdBack] = useState(false);
    // The generated file. DoneStep is where it is downloaded from, so this is
    // the only copy that exists until the user taps the link there. In memory,
    // like the rest of the state — a reload means filling the zahtev again.
    const [pdfBlob, setPdfBlob] = useState(null);
    const [rotationAngle, setRotationAngle] = useState(0);

    const cropperRef = useRef(null);

    // ID card: 1.66, passport: 1.44 — measured from the documents themselves.
    const getAspectRatio = () => (docType === "licna-karta" ? 1.66 : 1.44);

    // Every navigation lands at the top of the new screen. Two details of this
    // are not decoration:
    //
    //  - The scroll runs in a layout effect, i.e. AFTER React has swapped the
    //    step in, never inside the click handler. Fired before the commit it
    //    races the layout change that immediately follows it, and the browser
    //    resolves that race by keeping the old offset — intermittently, which
    //    is why it looked like "sometimes it works". Step 0 -> 1 is where it
    //    shows, because the welcome screen is the only one tall enough that
    //    the user is always far down the page when they leave it.
    //  - The scroll is instant, not smooth. A smooth animation is still
    //    running while the new screen mounts, and anything the browser does in
    //    the meantime — scroll anchoring on the changed document height, focus
    //    leaving the button that was just unmounted — cancels it silently and
    //    leaves the user in the middle of a screen they have never seen.
    //
    // `navSeq` rather than `step` is the dependency because confirming the
    // front of a lična karta re-enters step 3 from step 3, and that navigation
    // has to scroll like any other.
    const [navSeq, setNavSeq] = useState(0);

    useLayoutEffect(() => {
        if (navSeq === 0) return; // initial mount is already at the top
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [navSeq]);

    const announceToScreenReader = (message) => {
        const announcer = document.getElementById("sr-announcer");
        if (announcer) {
            announcer.textContent = message;
        } else {
            const newAnnouncer = document.createElement("div");
            newAnnouncer.id = "sr-announcer";
            newAnnouncer.className = "sr-only";
            newAnnouncer.setAttribute("aria-live", "polite");
            newAnnouncer.textContent = message;
            document.body.appendChild(newAnnouncer);
        }
    };

    const stepNames = [
        "Popunite zahtev za glasanje iz inostranstva",
        "Vaši podaci",
        "Vaš dokument: izbor",
        "Vaš dokument: slika",
        "Potpis",
        "Pregled podataka",
        "Preuzmite PDF i pošaljite ga",
    ];

    // Step 3 is two different screens. `docType` is set in the same batch as
    // the navigation that leaves the choice screen, so the announcement cannot
    // read it out of this closure — the caller passes the name instead.
    const stepName = (n) =>
        n === 3 && docType === "licna-karta-cip"
            ? "Vaš dokument: očitana lična karta"
            : stepNames[n];

    const handleNextStep = (nextStep, announcement) => {
        setStep(nextStep);
        setNavSeq((n) => n + 1);
        announceToScreenReader(announcement || stepName(nextStep));
    };

    // The chip card is picked by a link, not by the radiogroup: it leaves for
    // the screen that explains it instead of arming "Nastavite".
    const handleSelectChipCard = () => {
        setDocType("licna-karta-cip");
        setImageSrc(null);
        setCroppedImage(null);
        setCroppedImageBack(null);
        setIsCapturingIdBack(false);
        setRotationAngle(0);
        handleNextStep(3, "Vaš dokument: očitana lična karta");
    };

    // The crop is confirmed on the photo screen itself. For a lična karta the
    // screen runs a second time for the back side — the single most breakable
    // part of the navigation, so re-test both document types after touching it.
    const handlePhotoConfirmed = (img) => {
        if (isCapturingIdBack) {
            setCroppedImageBack(img);
            handleNextStep(4);
            return;
        }
        setCroppedImage(img);
        if (docType === "licna-karta") {
            setIsCapturingIdBack(true);
            setImageSrc(null);
            setRotationAngle(0);
            handleNextStep(3);
            announceToScreenReader(
                "Sada dodajte sliku zadnje strane."
            );
        } else {
            handleNextStep(4);
        }
    };

    const handlePhotoPrevious = () => {
        if (isCapturingIdBack) {
            // Back from the back side returns to the front side's photo.
            setIsCapturingIdBack(false);
            setImageSrc(null);
            setRotationAngle(0);
            handleNextStep(3);
        } else {
            handleNextStep(2);
        }
    };

    const photoSideLabel = () => {
        if (docType === "pasos") return "Glavna strana pasoša";
        return isCapturingIdBack ? "Zadnja strana" : "Prednja strana";
    };

    return (
        <div
            className="shell"
            role="region"
            aria-label="Zahtev za glasanje u inostranstvu"
        >
            <div className="sr-only" aria-live="polite">
                {stepName(step)}
            </div>

            {step === 0 && (
                <WelcomeStep
                    onNext={() => handleNextStep(1)}
                    onOpenTrust={onOpenTrust}
                />
            )}

            {step === 1 && (
                <PersonalDataStep
                    formData={formData}
                    onFormChange={setFormData}
                    onSubmit={() => handleNextStep(2)}
                    onPrevious={() => handleNextStep(0)}
                />
            )}

            {step === 2 && (
                <DocumentTypeSelectionStep
                    selectedDocType={docType}
                    onDocTypeSelect={setDocType}
                    onSelectChipCard={handleSelectChipCard}
                    onPrevious={() => handleNextStep(1)}
                    onNext={() => handleNextStep(3)}
                />
            )}

            {step === 3 && docType === "licna-karta-cip" && (
                <ChipIdCardStep
                    onNext={() => handleNextStep(4)}
                    onPrevious={() => handleNextStep(2)}
                />
            )}

            {step === 3 && docType !== "licna-karta-cip" && (
                <PhotoStep
                    imageSrc={imageSrc}
                    onImageUpload={(img) => {
                        setImageSrc(img);
                        setRotationAngle(0);
                    }}
                    aspectRatio={getAspectRatio()}
                    rotationAngle={rotationAngle}
                    onRotationChange={setRotationAngle}
                    onPrevious={handlePhotoPrevious}
                    onConfirm={handlePhotoConfirmed}
                    cropperRef={cropperRef}
                    docType={docType}
                    sideLabel={photoSideLabel()}
                    isCapturingIdBack={isCapturingIdBack}
                />
            )}

            {step === 4 && (
                <SignatureStep
                    onSignatureSubmit={(url) => {
                        setSignature(url);
                        handleNextStep(5);
                    }}
                    onSignatureClear={() => setSignature(null)}
                    onPrevious={() => {
                        if (docType === "licna-karta") {
                            setIsCapturingIdBack(true);
                        }
                        handleNextStep(3);
                    }}
                />
            )}

            {step === 5 && (
                <ReviewStep
                    formData={formData}
                    docType={docType}
                    croppedImage={croppedImage}
                    croppedImageBack={croppedImageBack}
                    signature={signature}
                    onPrevious={() => handleNextStep(4)}
                    onGenerated={(blob) => {
                        setPdfBlob(blob);
                        handleNextStep(6);
                    }}
                    onEditData={() => handleNextStep(1)}
                />
            )}

            {step === 6 && <DoneStep docType={docType} pdfBlob={pdfBlob} />}
        </div>
    );
};

export default Form;
