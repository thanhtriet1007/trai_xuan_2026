import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // 👈 Dòng này bắt buộc phải có để quét thư mục app
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;