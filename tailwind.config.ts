import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 👇 THÊM ĐOẠN NÀY ĐỂ KÍCH HOẠT FONT VIẾT TAY
      fontFamily: {
        hand: ['var(--font-hand)'], 
        serif: ['var(--font-serif)'],
      },
      // ---------------------------------------------
    },
  },
  plugins: [],
};
export default config;