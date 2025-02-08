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
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
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
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '68': '17rem',
        '100': '25rem',
        '120': '30rem',
      },
      blur: {
        '4xl': '100px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 60px -15px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [
    require("daisyui"),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.12)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#3b82f6",
          secondary: "#10b981",
          accent: "#6366f1",
          neutral: "#3d4451",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          info: "#06b6d4",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#60a5fa",
          secondary: "#34d399",
          accent: "#818cf8",
          neutral: "#2a2e37",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
          info: "#06b6d4",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
    themeRoot: ":root",
  },
}