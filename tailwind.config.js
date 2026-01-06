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
          1: "#DDDDDE",
          2: "#BDBDBD",
          300: "#C7C7C9",
          400: "#A5A6A9",
        },
        black: {
          DEFAULT: "#1D1E20",
        },
        teal: {
          DEFAULT: "#3AB8A8",
          light: "#35B0A2",
        },
        "main-1": "#42D6BA",
        etc: {
          "light-green": "#D6F3E1",
          "light-blue": "#DFE2FF",
          green: "#00A63E",
        },
        sub: {
          blue: "#1F3B70",
          gray: "#909193",
        },
      },
      fontFamily: {
        noto: ["Noto Sans KR", "sans-serif"],
      },
      fontSize: {
        // Headline (Bold, 125%)
        Headline_L_Bold: ["32px", { lineHeight: "40px", fontWeight: "700" }],
        Headline_M_Bold: ["28px", { lineHeight: "35px", fontWeight: "700" }],
        Headline_S_Bold: ["24px", { lineHeight: "30px", fontWeight: "700" }],

        // Title (Medium, 125%)
        Title_L_Medium: ["24px", { lineHeight: "30px", fontWeight: "500" }],
        Title_M_Medium: ["20px", { lineHeight: "25px", fontWeight: "500" }],

        // Subtitle (Regular, 125%)
        Subtitle_L_Regular: ["20px", { lineHeight: "25px", fontWeight: "400" }],
        Subtitle_M_Regular: ["18px", { lineHeight: "23px", fontWeight: "400" }],
        Subtitle_S_Regular: ["16px", { lineHeight: "23px", fontWeight: "400" }],

        // Subtitle (Medium, 125%)
        Subtitle_L_Medium: ["20px", { lineHeight: "25px", fontWeight: "500" }],
        Subtitle_M_Medium: ["18px", { lineHeight: "23px", fontWeight: "500" }],
        Subtitle_S_Medium: ["16px", { lineHeight: "23px", fontWeight: "500" }],

        // Body (Light, 140%)
        Body_L_Light: ["16px", { lineHeight: "22px", fontWeight: "300" }],
        Body_M_Light: ["14px", { lineHeight: "20px", fontWeight: "300" }],
        Body_S_Light: ["12px", { lineHeight: "17px", fontWeight: "300" }],

        // Body (Regular, 140%)
        Body_L_Regular: ["16px", { lineHeight: "22px", fontWeight: "400" }],
        Body_M_Regular: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        Body_S_Regular: ["12px", { lineHeight: "17px", fontWeight: "400" }],

        // Caption (Light, 140%)
        Caption_L_Light: ["12px", { lineHeight: "17px", fontWeight: "300" }],
        Caption_M_Light: ["10px", { lineHeight: "14px", fontWeight: "300" }],
      },
    },
  },
  plugins: [],
};
