/** @type {import('tailwindcss').Config} */
// The "Skupština u rasejanju" palette and type scale, transcribed from the
// design system's tokens/*.css. Everything here is a plain value — no plugin,
// no font import, no remote origin (invariant 4). Piazzolla is self-hosted and
// declared with @font-face in src/index.css; the Google Fonts @import the
// design system ships with would break both invariant 4 and the page's own
// `font-src 'self'` policy.
//
// Four official colours (blue-700, red-500, white, black) carry the identity;
// the tints below exist for interaction states and hairlines only. Do not add
// a fifth hue.
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,css}",
        "./src/components/Form.css",
    ],
    darkMode: "media",
    theme: {
        extend: {
            colors: {
                blue: {
                    900: "#082C51",
                    800: "#0A3663",
                    700: "#0C4076",
                    600: "#124E8C",
                    300: "#7C9BBB",
                    100: "#D3DEE9",
                    50: "#EDF2F7",
                },
                red: {
                    700: "#9E2A2F",
                    600: "#B22F35",
                    500: "#C6363C",
                    300: "#DE8A8D",
                    100: "#F5DEDF",
                },
                grey: {
                    900: "#1A1A1A",
                    600: "#5C5C5C",
                    400: "#9AA3AB",
                    200: "#E2E5E8",
                    100: "#F2F3F5",
                },
                // The one literal alias kept as a utility: `text-ink` pairs
                // with an explicit `dark:text-white` in the header lockup,
                // where the *shape* differs between themes and a token would
                // not help. Everything else reads a CSS variable from
                // src/index.css — see the colour convention in CLAUDE.md.
                ink: "#0C4076",
            },
            fontFamily: {
                // Piazzolla carries headings *and* body copy — the identity's
                // distinctive move. The sans is UI chrome only.
                serif: ["Piazzolla", "Georgia", "Times New Roman", "serif"],
                sans: [
                    "Helvetica Neue",
                    "Helvetica",
                    "Arimo",
                    "Arial",
                    "sans-serif",
                ],
            },
            borderRadius: {
                pill: "999px",
            },
            transitionTimingFunction: {
                standard: "cubic-bezier(.2,0,.2,1)",
            },
        },
    },
    plugins: [],
};
