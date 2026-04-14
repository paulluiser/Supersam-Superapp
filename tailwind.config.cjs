/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#fbe106",
          dark: "#010812",
          cream: "#fffeec"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(1, 8, 18, 0.15)",
        glow: "0 0 0 1px rgba(254, 215, 76, 0.35), 0 12px 28px rgba(254, 215, 76, 0.2)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" }
        }
      },
      animation: {
        fadeUp: "fadeUp 0.35s ease-out",
        pulseSoft: "pulseSoft 2.6s ease-in-out infinite"
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
