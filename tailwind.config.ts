import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
