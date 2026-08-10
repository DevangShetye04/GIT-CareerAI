/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F1F4EE",
        "paper-dim": "#E7EBE1",
        card: "#FFFFFF",
        ink: {
          DEFAULT: "#122019",
          soft: "#4B5A50",
          faint: "#8A968C",
        },
        line: "#DBE0D6",
        amber: {
          DEFAULT: "#E3A530",
          soft: "#FBF0DA",
          dark: "#8A5F14",
        },
        teal: {
          DEFAULT: "#1E7A68",
          soft: "#DFF0EA",
          dark: "#12503F",
        },
        coral: {
          DEFAULT: "#DD5B4C",
          soft: "#FBE4E0",
          dark: "#9E3223",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18, 32, 25, 0.04)",
      },
    },
  },
  plugins: [],
};
