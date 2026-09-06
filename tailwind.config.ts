import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080a",
          900: "#0b0c0f",
          850: "#101216",
          800: "#16181d",
          700: "#1f2127",
          600: "#2a2d34",
          500: "#3a3d46",
        },
        paper: {
          50: "#fbfaf8",
          100: "#f3f2ee",
          200: "#e6e5e0",
        },
        mist: {
          400: "#8a8d96",
          500: "#6f7280",
          600: "#585a66",
        },
        accent: {
          DEFAULT: "#d99a4e",
          light: "#e8b876",
          dim: "#8a6636",
          50: "#fbf1e2",
        },
        signal: {
          on: "#3ecf8e",
          warn: "#e0b24c",
          off: "#7a7d87",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 60px -20px rgba(0,0,0,0.6)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        pulseDot: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(62,207,142,0.45)" },
          "70%": { boxShadow: "0 0 0 6px rgba(62,207,142,0)" },
        },
      },
      animation: {
        blink: "blink 1.2s ease-in-out infinite",
        pulseDot: "pulseDot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
