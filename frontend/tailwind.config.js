/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#2563eb",
          secondary: "#7c3aed",
          accent: "#0891b2",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
        dark: {
          primary: "#3b82f6",
          secondary: "#a78bfa",
          accent: "#22d3ee",
          neutral: "#111827",
          "base-100": "#1e293b",
          "base-200": "#0f172a",
          "base-300": "#334155",
          info: "#60a5fa",
          success: "#4ade80",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
    ],
  },
};
