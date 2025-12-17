/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Figma 디자인 색상
        gray: {
          200: "#DDDDDE",
        },
        black: {
          DEFAULT: "#1D1E20",
        },
        teal: {
          DEFAULT: "#3AB8A8",
          light: "#35B0A2",
        },
      },
      fontFamily: {
        noto: ["Noto Sans KR", "sans-serif"],
      },
    },
  },
  plugins: [],
};

