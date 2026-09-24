/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        text: {
          main: '#1F2937',
          muted: '#64748B',
          light: '#94A3B8'
        },
        qnavy: {
          DEFAULT: '#163B63',
          dark: '#0F2742',
          light: '#204E80'
        },
        qblue: {
          DEFAULT: '#5B9BD5',
          light: '#EBF3FC',
          dark: '#407DB5'
        },
        qteal: {
          DEFAULT: '#5CB8A5',
          light: '#E6F7F4'
        },
        qgreen: {
          DEFAULT: '#A8D5BA',
          light: '#EFF8F3',
          dark: '#3B8759'
        },
        qorange: {
          DEFAULT: '#F2B880',
          light: '#FEF5EC',
          dark: '#D97A24'
        },
        qlavender: {
          DEFAULT: '#C8B8E8',
          light: '#F5F1FB'
        },
        qred: {
          DEFAULT: '#EFA3A3',
          light: '#FDF2F2',
          dark: '#C93B3B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'soft': '0 4px 20px -2px rgba(22, 59, 99, 0.06)',
        'soft-lg': '0 10px 30px -4px rgba(22, 59, 99, 0.08)',
        'card': '0 2px 12px rgba(22, 59, 99, 0.05)'
      },
      borderRadius: {
        'card': '1rem',
        'pill': '9999px'
      }
    },
  },
  plugins: [],
}
