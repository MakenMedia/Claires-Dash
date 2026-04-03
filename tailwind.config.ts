import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#0f1117',
        card: '#1a1d27',
        card2: '#21243a',
        border: '#2a2d3e',
        muted: '#64748b',
        accent: '#5b6af0',
      },
    },
  },
  plugins: [],
};
export default config;
