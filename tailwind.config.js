/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "#f3f7fb",
        surface: "#ffffff",
        "surface-soft": "#eaf2f9",
        ink: {
          900: "#1c2b3d",
          700: "#34495f",
          500: "#647689",
          400: "#8a99ac",
          300: "#b8c4d2",
        },
        accent: {
          DEFAULT: "#7ab8dc",
          hover: "#5a9cc4",
          soft: "#dcecf6",
          ring: "#a5cde4",
        },
        sage: {
          DEFAULT: "#8cc8a8",
          soft: "#dcefe2",
        },
        peach: {
          DEFAULT: "#f0b890",
          soft: "#fae3d2",
        },
        rose: {
          DEFAULT: "#eaa5a5",
          soft: "#fae2e2",
        },
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
