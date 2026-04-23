/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DESIGN.md raw tokens
        canvas: "#0E1117",
        snow: "#FFFFFF",
        ice: "#94A3B8",
        glacier: "#3B82F6",

        // Material-style dark tokens (совместимость с классами в App.jsx)
        surface: "#0E1117",
        "on-surface": "#FFFFFF",
        "surface-variant": "#1a1d24",
        "on-surface-variant": "#94A3B8",
        "surface-container": "rgba(255,255,255,0.03)",
        "surface-container-low": "rgba(255,255,255,0.05)",
        "surface-container-high": "rgba(255,255,255,0.08)",
        "surface-container-highest": "rgba(255,255,255,0.11)",
        "surface-container-lowest": "#080a0f",
        "surface-dim": "#0a0c10",
        "surface-bright": "#161a22",

        primary: "#3B82F6",
        "on-primary": "#FFFFFF",
        "primary-container": "rgba(59,130,246,0.15)",
        "on-primary-container": "#FFFFFF",

        secondary: "#64748B",
        "on-secondary": "#FFFFFF",
        "secondary-container": "rgba(100,116,139,0.15)",
        "on-secondary-container": "#FFFFFF",

        outline: "rgba(255,255,255,0.15)",
        "outline-variant": "rgba(255,255,255,0.1)",

        error: "#EF4444",
        "on-error": "#FFFFFF",
        "error-container": "rgba(239,68,68,0.15)",
        "on-error-container": "#EF4444",

        background: "#0E1117",
        "on-background": "#FFFFFF",
      },
      fontFamily: {
        headline: ["Outfit", "sans-serif"],
        body: ["Outfit", "sans-serif"],
        label: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
