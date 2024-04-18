import headlessui from "@headlessui/tailwindcss";
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "health-progress":
          "linear-gradient(270deg, rgba(47, 137, 0, 0.50) 5.75%, rgba(255, 255, 255, 0.00) 123.03%), linear-gradient(168deg, #25FEDF 9.04%, rgba(0, 0, 0, 0.00) 142.89%, rgba(0, 0, 0, 0.00) 142.89%)",
        "stamina-progress":
          "linear-gradient(0deg, rgba(0, 0, 0, 0.70) -5.88%, rgba(255, 255, 255, 0.00) 100%), linear-gradient(90deg, #F6E34A 0%, #FDAC19 36.05%, #F6E34A 70.13%, #F0B21B 100%)",
        backdrop:
          "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.50) 75.52%)",
      },
      colors: {
        primary: {
          "100": "#feff41",
          "200": "#F6E34A",
          "500": "#FFD812",
          "700": "#F0B21B",
          "900": "#FDAC19",
        },
        gray: {
          thin: "#D9D9D9",
          light: "#A8A8A8",
          main: "#333333",
        },
        white: "#FFFFFF",
        black: "#000000",
      },
    },
  },
  plugins: [require("daisyui"), headlessui({ prefix: "ui" })],
  daisyui: {
    themes: ["light", "dark", "luxury"],
  },
} satisfies Config;
