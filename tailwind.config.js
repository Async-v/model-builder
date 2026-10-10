/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {
    colors: {
      ink: "#17211d",
      muted: "#758079",
      line: "#e7ebe8",
      canvas: "#f7f9f7",
      accent: "#24785b",
      "accent-soft": "#eaf4ee"
    },
    boxShadow: { soft: "0 8px 28px rgba(23, 33, 29, 0.045)" }
  }},
  plugins: []
};