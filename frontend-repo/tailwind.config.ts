import type { Config } from "tailwindcss";
import Colors from "tailwindcss/colors";
export default {
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
        primary: "#000957",
        secondary: "#344CB7",
        ternary: "#577BC1",
        accent: "#FFEB00",
        transparent: "transparent",
        gray: Colors.slate,
        red: Colors.red,
        green: Colors.green,
        blue: Colors.blue,
        yellow: Colors.yellow,
        white: Colors.white,
        black: Colors.black,
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shine: {
          "0%": { "background-position": "100%" },
          "100%": { "background-position": "-100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shine: "shine 5s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
