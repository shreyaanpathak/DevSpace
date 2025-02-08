/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-gradient-start': '#3b82f6',
        'primary-gradient-end': '#60a5fa',
        'secondary-gradient-start': '#10b981',
        'secondary-gradient-end': '#34d399',
        'accent-gradient-start': '#6366f1',
        'accent-gradient-end': '#818cf8',
      },
      animation: {
        'matrix': 'matrix 8s ease infinite',
        'quantum': 'quantum 8s ease infinite',
        'neon': 'neon 8s ease infinite',
        'starwars': 'starwars 8s ease infinite',
        'monochrome': 'monochrome 8s ease infinite',
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'spin-slow': 'spin 4s linear infinite',
        'glitch': 'glitch 500ms infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        matrix: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 0.3 },
          '50%': { transform: 'translateY(-10px) scale(1.05)', opacity: 0.5 },
          '100%': { transform: 'translateY(0) scale(1)', opacity: 0.3 }
        },
        quantum: {
          '0%': { transform: 'rotate(0deg) scale(1)', opacity: 0.3 },
          '50%': { transform: 'rotate(180deg) scale(1.1)', opacity: 0.5 },
          '100%': { transform: 'rotate(360deg) scale(1)', opacity: 0.3 }
        },
        neon: {
          '0%': { filter: 'brightness(1) blur(0px)', opacity: 0.3 },
          '50%': { filter: 'brightness(1.2) blur(2px)', opacity: 0.5 },
          '100%': { filter: 'brightness(1) blur(0px)', opacity: 0.3 }
        },
        starwars: {
          '0%': { transform: 'perspective(1000px) rotateX(0deg)', opacity: 0.3 },
          '50%': { transform: 'perspective(1000px) rotateX(10deg)', opacity: 0.5 },
          '100%': { transform: 'perspective(1000px) rotateX(0deg)', opacity: 0.3 }
        },
        monochrome: {
          '0%': { filter: 'contrast(1) brightness(1)', opacity: 0.3 },
          '50%': { filter: 'contrast(1.1) brightness(1.1)', opacity: 0.5 },
          '100%': { filter: 'contrast(1) brightness(1)', opacity: 0.3 }
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': {
            boxShadow: '0 0 20px -5px rgba(59, 130, 246, 0.5)',
            filter: 'brightness(1)'
          },
          '100%': {
            boxShadow: '0 0 30px -5px rgba(59, 130, 246, 0.8)',
            filter: 'brightness(1.2)'
          }
        },
        slideUp: {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        slideDown: {
          '0%': {
            transform: 'translateY(-20px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        bounceSubtle: {
          '0%, 100%': {
            transform: 'translateY(-2%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        glitch: {
          '0%': {
            transform: 'translate(0)'
          },
          '20%': {
            transform: 'translate(-2px, 2px)'
          },
          '40%': {
            transform: 'translate(-2px, -2px)'
          },
          '60%': {
            transform: 'translate(2px, 2px)'
          },
          '80%': {
            transform: 'translate(2px, -2px)'
          },
          '100%': {
            transform: 'translate(0)'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      spacing: {
        '18': '4.5rem',
        '68': '17rem',
        '100': '25rem',
        '120': '30rem',
      },
      blur: {
        '4xl': '100px',
        '5xl': '160px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 60px -15px rgba(59, 130, 246, 0.5)',
        'glow-xl': '0 0 80px -20px rgba(59, 130, 246, 0.5)',
        'inner-glow': 'inset 0 0 20px 0 rgba(59, 130, 246, 0.3)',
        'sharp': '0 1px 1px rgba(0,0,0,0.075), 0 2px 2px rgba(0,0,0,0.075), 0 4px 4px rgba(0,0,0,0.075), 0 8px 8px rgba(0,0,0,0.075)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, rgb(55 65 81 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(55 65 81 / 0.1) 1px, transparent 1px)',
      },
      scale: {
        '98': '.98',
        '102': '1.02',
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: '500',
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            code: {
              color: 'inherit',
              fontWeight: '400',
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.12)',
        },
        '.text-shadow-glow': {
          'text-shadow': '0 0 10px currentColor',
        },
        '.backdrop-blur-xs': {
          'backdrop-filter': 'blur(2px)',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.mask-gradient-b': {
          'mask-image': 'linear-gradient(to bottom, black 0%, transparent 100%)',
        },
        '.mask-gradient-t': {
          'mask-image': 'linear-gradient(to top, black 0%, transparent 100%)',
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
      }
      addUtilities(newUtilities)
    },
  ],
  darkMode: 'class',
};
