/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Microsoft Blue Theme
        primary: {
          DEFAULT: '#0078d4', // Microsoft Blue
          light: '#50a3e0',
          dark: '#005a9e',
          50: '#e6f4ff',
          100: '#b3e0ff',
          200: '#80ccff',
          300: '#4db8ff',
          400: '#1aa3ff',
          500: '#0078d4',
          600: '#005a9e',
          700: '#004578',
          800: '#003052',
          900: '#001b2c',
        },
        secondary: {
          DEFAULT: '#106ebe', // Microsoft Blue Secondary
          light: '#2b88d8',
          dark: '#0050a0',
        },
        accent: {
          DEFAULT: '#00bcf2', // Microsoft Cyan
          light: '#33ccf5',
          dark: '#0099c7',
        },
        success: {
          DEFAULT: '#107c10', // Microsoft Green
          light: '#3d9c3d',
          dark: '#0b5e0b',
        },
        warning: {
          DEFAULT: '#ffb900', // Microsoft Yellow
          light: '#ffc933',
          dark: '#cc9400',
        },
        error: {
          DEFAULT: '#e81123', // Microsoft Red
          light: '#ed4757',
          dark: '#ba0e1c',
        },
        ms: {
          50: '#f3f9fd',
          100: '#e1f0fa',
          200: '#c3e1f5',
          300: '#91c9ec',
          400: '#58ade0',
          500: '#0078d4',
          600: '#0064b0',
          700: '#00508e',
          800: '#003d6c',
          900: '#002a4a',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'ms-sm': '0 1.6px 3.6px 0 rgba(0, 0, 0, 0.132), 0 0.3px 0.9px 0 rgba(0, 0, 0, 0.108)',
        'ms': '0 3.2px 7.2px 0 rgba(0, 0, 0, 0.132), 0 0.6px 1.8px 0 rgba(0, 0, 0, 0.108)',
        'ms-lg': '0 6.4px 14.4px 0 rgba(0, 0, 0, 0.132), 0 1.2px 3.6px 0 rgba(0, 0, 0, 0.108)',
        'ms-xl': '0 25.6px 57.6px 0 rgba(0, 0, 0, 0.22), 0 4.8px 14.4px 0 rgba(0, 0, 0, 0.18)',
      },
      borderRadius: {
        'ms': '4px',
        'ms-lg': '8px',
      },
      backdropBlur: {
        'ms': '30px',
      },
    },
  },
  plugins: [],
}
