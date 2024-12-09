import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          900: "#001529", // Override blue-900 with your desired color
        },
        neutral: {
          100: "#F1F5F9",
          500: "#64748B",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
