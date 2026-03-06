import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "elite-black": "#0c0a09",
        "elite-gold": "#f59e0b",
        "elite-dark-red": "#7f1d1d",
        "elite-dark": "#1c1917",
      },
      backgroundImage: {
        "shimmer-gold":
          "linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.5), transparent)",
      },
      animation: {
        shimmer: "shimmer 2.5s infinite",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
      });
    },
  ],
};
export default config;
