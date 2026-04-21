/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1f2937',
        paper: '#f4efe7',
        accent: '#0f766e',
        income: '#d9f99d',
        incomeDark: '#4d7c0f',
        deduction: '#fecaca',
        deductionDark: '#b91c1c',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        sheet: '0 24px 70px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
