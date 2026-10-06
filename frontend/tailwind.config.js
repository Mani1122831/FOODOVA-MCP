/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF5F0',
          100: '#FFE4D4',
          200: '#FFC4A0',
          300: '#FF9A6C',
          400: '#FF7A40',
          500: '#FF6B35',
          600: '#E55A25',
          700: '#CC4A1A',
          800: '#993512',
          900: '#66200A',
        },
        cream: {
          50: '#FFFBF7',
          100: '#FFF5EC',
          200: '#FFEEDD',
        },
        dark: {
          900: '#0A0A0A',
          800: '#1A1A1A',
          700: '#2A2A2A',
          600: '#3A3A3A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fly-to-cart': 'flyToCart 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'bounce-soft': 'bounceSoft 0.5s ease',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        flyToCart: {
          '0%': { transform: 'scale(1) translate(0, 0)', opacity: '1' },
          '100%': { transform: 'scale(0.1) translate(300px, -300px)', opacity: '0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.14)',
        'brand': '0 4px 24px rgba(255, 107, 53, 0.35)',
        'brand-lg': '0 8px 40px rgba(255, 107, 53, 0.45)',
        'glass': '0 8px 32px rgba(0,0,0,0.12)',
        'cart': '0 0 0 1px rgba(255,107,53,0.15), 0 20px 60px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}
