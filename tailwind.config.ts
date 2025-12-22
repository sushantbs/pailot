/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "safe-top": "max(env(safe-area-inset-top), 0px)",
        "safe-bottom": "max(env(safe-area-inset-bottom), 0px)",
        "safe-left": "max(env(safe-area-inset-left), 0px)",
        "safe-right": "max(env(safe-area-inset-right), 0px)",
      },
      padding: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  plugins: [],
};
