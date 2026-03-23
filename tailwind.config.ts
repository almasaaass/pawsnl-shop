import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        trust: {
          DEFAULT: '#0D9488',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        warm: {
          50: '#FAFAF8',
          100: '#FFF8F0',
        },
        charcoal: '#1a1a2e',
        // Apple-style neutrals
        apple: {
          black: '#1d1d1f',
          darkgray: '#424245',
          gray: '#6e6e73',
          lightgray: '#86868b',
          silver: '#d2d2d7',
          offwhite: '#f5f5f7',
          white: '#fbfbfd',
          blue: '#0071e3',
          'blue-hover': '#0077ED',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['var(--font-poppins)', 'Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px 0 rgba(0,0,0,0.1)',
        // Apple-style layered shadows
        'apple-sm': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'apple-md': '0 4px 14px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)',
        'apple-lg': '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        'apple-xl': '0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)',
        'apple-2xl': '0 32px 80px rgba(0,0,0,0.14), 0 12px 32px rgba(0,0,0,0.08)',
        'apple-inner': 'inset 0 1px 4px rgba(0,0,0,0.06)',
      },
      transitionTimingFunction: {
        // Apple cubic-bezier timing functions
        'apple-ease': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'apple-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'apple-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'apple-decel': 'cubic-bezier(0, 0, 0.2, 1)',
        'apple-accel': 'cubic-bezier(0.4, 0, 1, 1)',
      },
      backdropBlur: {
        'apple-sm': '10px',
        'apple': '20px',
        'apple-lg': '40px',
        'apple-xl': '80px',
      },
      blur: {
        'apple-sm': '10px',
        'apple': '20px',
        'apple-lg': '40px',
        'apple-xl': '80px',
      },
      borderRadius: {
        'apple-sm': '12px',
        'apple': '20px',
        'apple-lg': '28px',
        'apple-pill': '980px',
      },
      keyframes: {
        // Existing keyframes
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Apple-style keyframes
        'apple-reveal': {
          '0%': { opacity: '0', clipPath: 'inset(100% 0 0 0)' },
          '100%': { opacity: '1', clipPath: 'inset(0 0 0 0)' },
        },
        'apple-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'apple-scale': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'apple-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'apple-parallax': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-20%)' },
        },
        'counter-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'apple-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 113, 227, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 113, 227, 0.3)' },
        },
        'apple-slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-60px)' },
          '60%': { transform: 'translateX(4px)' },
          '80%': { transform: 'translateX(-2px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        // Existing animations
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        // Apple-style animations
        'apple-reveal': 'apple-reveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'apple-float': 'apple-float 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'apple-scale': 'apple-scale 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'apple-fade-up': 'apple-fade-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'apple-parallax': 'apple-parallax 1s linear both',
        'counter-up': 'counter-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'apple-glow': 'apple-glow 3s ease-in-out infinite',
        'apple-slide-in': 'apple-slide-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
      },
    },
  },
  plugins: [],
}

export default config
