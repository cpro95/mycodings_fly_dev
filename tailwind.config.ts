import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  prefix: "",
  theme: {},
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;

export default config;
