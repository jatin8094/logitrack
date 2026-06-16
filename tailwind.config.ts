import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0E14",
          raised: "#12161F",
          card: "#161B26",
          line: "#232A38",
        },
        ink: {
          DEFAULT: "#E7EAF0",
          muted: "#8B93A5",
          faint: "#5B6275",
        },
        signal: {
          DEFAULT: "#2DD4BF",
          dim: "#0F2E2C",
        },
        status: {
          pending: "#F5A623",
          pendingDim: "#3A2B12",
          transit: "#3B82F6",
          transitDim: "#15233F",
          delivered: "#34D399",
          deliveredDim: "#11302A",
          delayed: "#F87171",
          delayedDim: "#3A1A1A",
        },
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        "ticker-in": "ticker-in 0.35s ease-out",
        "modal-in": "modal-in 0.18s ease-out",
        "backdrop-in": "backdrop-in 0.18s ease-out",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.7)" },
        },
        "ticker-in": {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "modal-in": {
          "0%": { opacity: "0", transform: "scale(0.97) translateY(4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "backdrop-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
