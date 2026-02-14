import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0b0c10",
        foreground: "#f9fafb",
        muted: "#1f2937",
        border: "#374151",
        primary: "#60a5fa",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};

export default config;
