import React, { useState, useRef, useEffect } from "react";
import "./Form.css";

/**
 * Draw and capture a signature.
 *
 * The canvas has a fixed 1200x400 internal surface and is displayed at
 * whatever width the container gives it, keeping that 3:1 ratio; pointer and
 * touch coordinates are scaled from the displayed box into the internal one
 * (getScalingFactor). Drawing at a constant resolution means the PNG handed to
 * the PDF is the same quality on a phone as on a desktop.
 *
 * On submit the drawing is cropped to the bounding box of its ink, so the PDF
 * gets the signature rather than a mostly-empty rectangle that would have to
 * be letterboxed into the form's signature box.
 *
 * Enter or Space on the focused canvas draws a stock curve: a signature is a
 * required field, and a keyboard-only user must not be stranded behind a
 * disabled button. SignatureStep says so in words as well.
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - receives the signature PNG data URL
 * @param {Function} props.onClear - called when the canvas is cleared
 */
function SignaturePad({ onSubmit, onClear }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [displaySize, setDisplaySize] = useState({ width: 600, height: 200 });
    const [hasSignature, setHasSignature] = useState(false);

    const internalCanvasSize = { width: 1200, height: 400 };

    const getScalingFactor = () => ({
        scaleX: internalCanvasSize.width / displaySize.width,
        scaleY: internalCanvasSize.height / displaySize.height,
    });

    useEffect(() => {
        const updateDisplaySize = () => {
            if (containerRef.current) {
                // Fill the container: the internal surface is 3:1, so the
                // displayed box keeps that ratio at whatever width it gets.
                const width = containerRef.current.clientWidth;
                if (!width) return;
                const height = Math.round(width / 3);
                setDisplaySize({ width, height });
            }
        };

        updateDisplaySize();
        window.addEventListener("resize", updateDisplaySize);
        return () => {
            window.removeEventListener("resize", updateDisplaySize);
        };
    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            canvas.width = internalCanvasSize.width;
            canvas.height = internalCanvasSize.height;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = "black";
        }
    }, [internalCanvasSize.width, internalCanvasSize.height]);

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.style.width = `${displaySize.width}px`;
            canvasRef.current.style.height = `${displaySize.height}px`;
        }
    }, [displaySize]);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const { scaleX, scaleY } = getScalingFactor();

        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY,
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const startDrawing = (e) => {
        setDrawing(true);
        setHasSignature(true);
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        const { x, y } = getPos(e);
        ctx.moveTo(x, y);
    };

    const endDrawing = () => setDrawing(false);

    const draw = (e) => {
        if (!drawing) return;
        const ctx = canvasRef.current.getContext("2d");
        const { x, y } = getPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        if (onClear) onClear();
    };

    const handleSubmit = () => {
        // Crop the signature to its bounding box before handing it over.
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let minX = width;
        let minY = height;
        let maxX = 0;
        let maxY = 0;
        let found = false;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                if (data[idx + 3] > 0) {
                    found = true;
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (!found) {
            onSubmit(canvas.toDataURL("image/png"));
            return;
        }

        const pad = 8;
        minX = Math.max(minX - pad, 0);
        minY = Math.max(minY - pad, 0);
        maxX = Math.min(maxX + pad, width);
        maxY = Math.min(maxY + pad, height);
        const cropW = maxX - minX;
        const cropH = maxY - minY;
        const cropped = document.createElement("canvas");
        cropped.width = cropW;
        cropped.height = cropH;
        cropped
            .getContext("2d")
            .drawImage(
                canvas,
                minX,
                minY,
                cropW,
                cropH,
                0,
                0,
                cropW,
                cropH
            );
        onSubmit(cropped.toDataURL("image/png"));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setHasSignature(true);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const width = internalCanvasSize.width;
            const height = internalCanvasSize.height;
            ctx.beginPath();
            ctx.moveTo(width * 0.2, height * 0.6);
            ctx.bezierCurveTo(
                width * 0.4,
                height * 0.4,
                width * 0.6,
                height * 0.8,
                width * 0.8,
                height * 0.5
            );
            ctx.stroke();
        }
    };

    return (
        <div ref={containerRef} className="signature-container">
            {/* The drawing surface stays white in dark mode too: what you see
                is what gets printed onto the form. */}
            <div className="relative">
                <canvas
                    id="signature-canvas"
                    ref={canvasRef}
                    className="signature-canvas"
                    tabIndex="0"
                    role="img"
                    aria-label="Polje za potpis. Pritisnite Space ili Enter da potpis unesete tastaturom."
                    style={{
                        width: `${displaySize.width}px`,
                        height: `${displaySize.height}px`,
                    }}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={endDrawing}
                    onTouchCancel={endDrawing}
                    onTouchMove={draw}
                    onKeyDown={handleKeyDown}
                />
                {!hasSignature && (
                    <span className="signature-placeholder" aria-hidden="true">
                        potpišite se iznad linije
                    </span>
                )}
                <span className="signature-guide" aria-hidden="true" />
            </div>

            <div className="mt-3.5 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleClear}
                    className="btn btn-lg btn-ghost flex-1"
                >
                    Obrišite
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!hasSignature}
                    aria-disabled={!hasSignature}
                    className={`btn btn-lg flex-1 ${
                        hasSignature ? "btn-primary" : "btn-disabled"
                    }`}
                >
                    Potvrdite potpis
                </button>
            </div>

            <div className="sr-only">
                Potpis crtate mišem ili prstom u polju iznad. Ako koristite
                tastaturu, pritisnite Space ili Enter da biste uneli potpis.
            </div>
        </div>
    );
}

export default SignaturePad;
