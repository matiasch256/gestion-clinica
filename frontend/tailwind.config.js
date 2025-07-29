/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      cell: "320px",
      // => @media (min-width: 320px) { ... }

      xs: "480px",
      // => @media (min-width: 440px) { ... }

      sm: "669px",

      // => @media (min-width: 640px) { ... }

      md: "1024px",
      // => @media (min-width: 1024px) { ... }

      lx: "1280px",
      // => @media (min-width: 1280px) { ... }
    },

    colors: {
      "button-blue": "#2191FB",
      whitish: "#F2F5EA",
      blackish: "#1D1B18",
      Footer: "#b1b1b1",
      Footerdown: "#AFB5E5",
      bodycolor: "#6d6d6d",
      customYellow: "#D5B263",
    },
    extend: {},
  },
  plugins: [],
};
