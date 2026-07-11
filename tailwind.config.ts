import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--sf-canvas) / <alpha-value>)",
        "canvas-2": "rgb(var(--sf-canvas-2) / <alpha-value>)",
        panel: "rgb(var(--sf-panel) / <alpha-value>)",
        "panel-2": "rgb(var(--sf-panel-2) / <alpha-value>)",
        line: "rgb(var(--sf-line) / <alpha-value>)",
        "line-strong": "rgb(var(--sf-line-strong) / <alpha-value>)",
        ink: "rgb(var(--sf-ink) / <alpha-value>)",
        muted: "rgb(var(--sf-muted) / <alpha-value>)",
        primary: "rgb(var(--sf-primary) / <alpha-value>)",
        secondary: "rgb(var(--sf-secondary) / <alpha-value>)",
        accent: "rgb(var(--sf-accent) / <alpha-value>)",
        warning: "rgb(var(--sf-warning) / <alpha-value>)",
        danger: "rgb(var(--sf-danger) / <alpha-value>)",
      },
      borderRadius: {
        panel: "8px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--sf-line) / 0.85), 0 18px 60px rgb(0 0 0 / 0.35)",
        "glow-red": "0 0 0 1px rgb(var(--sf-primary) / 0.35), 0 20px 70px rgb(var(--sf-primary) / 0.10)",
        "glow-blue": "0 0 0 1px rgb(var(--sf-secondary) / 0.28), 0 18px 60px rgb(var(--sf-secondary) / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
