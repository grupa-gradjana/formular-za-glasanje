import React, { useRef } from "react";
import { Cropper } from "react-advanced-cropper";
import StepHeader from "../StepHeader";

/**
 * Step 3 — add the image, crop it, rotate it, confirm it. This is the
 * old ImageUploadCropStep and ImageConfirmationStep merged: you confirm the
 * crop you are already looking at, which removes a screen that asked "da li je
 * slika dobra?" about an image the user had just approved.
 *
 * The rotation logic is unchanged from the previous version — only the icon
 * buttons are now plain text glyphs, which drops the @fortawesome dependency.
 *
 * @param {Object} props
 * @param {string|null} props.imageSrc - raw uploaded image as a data URL
 * @param {Function} props.onImageUpload - receives the raw data URL
 * @param {number} props.aspectRatio - crop aspect ratio for this document
 * @param {number} props.rotationAngle - user-requested rotation, in degrees
 * @param {Function} props.onRotationChange - store the new angle
 * @param {Function} props.onPrevious - go back
 * @param {Function} props.onConfirm - receives the cropped image data URL
 * @param {Object} props.cropperRef - ref to the cropper instance
 * @param {string} props.docType - "licna-karta" | "pasos"
 * @param {string} props.sideLabel - which side of the document this pass covers
 * @param {boolean} props.isCapturingIdBack - back side of an ID card
 */
const PhotoStep = ({
    imageSrc,
    onImageUpload,
    aspectRatio,
    rotationAngle,
    onRotationChange,
    onPrevious,
    onConfirm,
    cropperRef,
    docType,
    sideLabel,
    isCapturingIdBack,
}) => {
    // `imageSrc` from Form is the only copy of the raw photo. PhotoStep used to
    // mirror it in local state, which broke the ID card's second pass: the
    // screen is not unmounted between the front and the back side (both are
    // step 3), so a mirror initialised from the prop kept showing the front
    // photo under a "Zadnja strana" heading after Form had already cleared it.

    // The crop rotation is the app's one real animation. A reader who has
    // asked their system for less motion gets the same result without the
    // sweep — the cropper animates in JS, so a CSS media query cannot reach it.
    const animates = () =>
        !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // The angle the cropper is already showing the photo at before the user
    // touches anything. A phone photo carries an EXIF orientation tag that the
    // cropper applies on load, so this is 0 only for images without one.
    const rotationBaselineRef = useRef(0);

    /**
     * Turn the image to `target` degrees away from how it was first shown.
     * @param {number} target - absolute angle the user asked for
     * @param {boolean} animate - animate the change; off while dragging
     * @param {Object} [instance] - cropper to act on, when the ref is not set
     */
    const applyRotation = (target, animate, instance) => {
        const cropper = instance || cropperRef.current;
        if (!cropper || !cropper.getState()) return;

        const transforms = cropper.getTransforms();
        const current =
            transforms && typeof transforms.rotate === "number"
                ? transforms.rotate
                : 0;
        const delta = rotationBaselineRef.current + target - current;
        if (delta === 0) return;

        // Deliberately no `center`: rotateImage() reads a centre it is given as
        // boundary coordinates and converts it into image coordinates, so
        // handing it the crop box centre (already in image coordinates) sends
        // the image drifting further with every step. Its default is that same
        // centre, correctly interpreted.
        cropper.rotateImage(delta, { transitions: animate });
    };

    const handleCropperReady = (cropper) => {
        const transforms = cropper.getTransforms();
        rotationBaselineRef.current =
            transforms && typeof transforms.rotate === "number"
                ? transforms.rotate
                : 0;
        applyRotation(rotationAngle, false, cropper);
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageUpload(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (imageSrc && cropperRef.current) {
            const canvas = cropperRef.current.getCanvas();
            if (canvas) {
                onConfirm(canvas.toDataURL());
            }
        }
    };

    const rotateBy = (angle) => {
        const target = rotationAngle + angle;
        onRotationChange(target);
        applyRotation(target, animates());
    };

    const handleSliderChange = (event) => {
        const target = parseInt(event.target.value, 10);
        if (Number.isNaN(target)) return;
        onRotationChange(target);
        applyRotation(target, false);
    };

    const documentName = docType === "pasos" ? "pasoša" : "lične karte";

    return (
        <form onSubmit={handleSubmit} aria-labelledby="photo-title">
            <StepHeader stage={2} label="VAŠ DOKUMENT" />

            {!imageSrc && (
                <>
                    <h2 id="photo-title" className="h2 mb-3">
                        {sideLabel} — dodajte sliku
                    </h2>
                    <p className="lead mb-7">
                        Izaberite sliku {documentName} koju već imate na
                        uređaju, ili je napravite kamerom.
                    </p>
                    <label
                        htmlFor="image-upload"
                        className="btn btn-lg btn-primary btn-block"
                    >
                        Dodajte sliku
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                        aria-label="Dodajte sliku dokumenta"
                    />
                    <p className="form-actions-hint">
                        Slika ostaje na vašem uređaju i ne šalje se nikome.
                    </p>
                </>
            )}

            {imageSrc && (
                <>
                    <h2 id="photo-title" className="h2 mb-3">
                        {sideLabel} — poravnajte u okvir
                    </h2>
                    <p className="lead mb-6">
                        Pomerite i uvećajte sliku tako da dokument popuni okvir.
                        Ne mora da bude savršeno, ali sva slova moraju da se
                        čitaju.
                    </p>

                    <div className="cropper-container">
                        <Cropper
                            src={imageSrc}
                            ref={cropperRef}
                            onReady={handleCropperReady}
                            aspectRatio={aspectRatio}
                            stencilProps={{ aspectRatio }}
                            style={{ height: "100%" }}
                        />
                    </div>

                    <p className="form-label mb-2.5 mt-5">
                        Zarotirajte sliku ako je nakrivljena
                    </p>
                    <div className="rotate-row">
                        <button
                            type="button"
                            onClick={() => rotateBy(-90)}
                            className="rotate-btn"
                            aria-label="Zarotirajte ulevo za 90 stepeni"
                        >
                            ↺ 90°
                        </button>
                        <button
                            type="button"
                            onClick={() => rotateBy(-1)}
                            className="rotate-btn"
                        >
                            −1°
                            <span className="sr-only">
                                , zarotirajte ulevo za jedan stepen
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => rotateBy(1)}
                            className="rotate-btn"
                        >
                            +1°
                            <span className="sr-only">
                                , zarotirajte udesno za jedan stepen
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => rotateBy(90)}
                            className="rotate-btn"
                            aria-label="Zarotirajte udesno za 90 stepeni"
                        >
                            ↻ 90°
                        </button>
                    </div>

                    <div className="mt-3.5 flex items-center gap-3">
                        <span className="rotate-scale">−180°</span>
                        <input
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            value={rotationAngle}
                            onChange={handleSliderChange}
                            className="rotate-slider"
                            aria-label="Klizač za rotaciju slike"
                        />
                        <span className="rotate-scale">+180°</span>
                    </div>
                    <p className="field-hint mt-2 text-center" aria-live="polite">
                        {rotationAngle === 0
                            ? "Slika nije zarotirana"
                            : `Zarotirano za ${rotationAngle}°`}
                    </p>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-lg btn-primary btn-block"
                        >
                            Potvrdite sliku
                        </button>
                        <label
                            htmlFor="replace-image"
                            className="btn btn-lg btn-ghost btn-block"
                        >
                            Izaberite drugu sliku
                        </label>
                        <input
                            type="file"
                            id="replace-image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                            aria-label="Zamenite sliku dokumenta"
                        />
                    </div>
                    <p className="form-actions-hint">
                        {docType === "licna-karta" && !isCapturingIdBack
                            ? "Sledeće dodajete sliku zadnje strane lične karte."
                            : "Sledeće potpisujete zahtev."}
                    </p>
                </>
            )}

            <div className="mt-5">
                <button
                    type="button"
                    onClick={onPrevious}
                    className="btn btn-lg btn-ghost btn-block"
                >
                    Nazad
                </button>
            </div>
        </form>
    );
};

export default PhotoStep;
