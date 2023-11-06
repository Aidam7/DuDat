import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        black: "#0B191E",
        cobalt: "#1D5B72",
        blue: "#043B62",
        "neon-blue": "#58C6BE",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
