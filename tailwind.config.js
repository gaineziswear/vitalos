/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── VitalOS Design Tokens ──────────────────────────────────────────
        surface: {
          base:    '#080b0b',   // absolute canvas
          raised:  '#0e1212',   // primary card surface
          overlay: '#141919',   // elevated modal / drawer
          muted:   '#1a2020',   // segmented controls / dividers
          border:  '#1f2828',   // default border
          'border-hi': '#2a3535', // hover / focus border
        },
        ink: {
          primary:   '#eef3f3', // primary text
          secondary: '#7a9494', // secondary labels
          muted:     '#3d5252', // placeholders / disabled
          disabled:  '#263030', // disabled controls
        },
        mint: {
          50:  '#ecfdf6',
          100: '#d0fbe8',
          200: '#a4f5d3',
          300: '#63ebba',
          400: '#28d99e',
          500: '#0dbf86',  // primary brand accent
          600: '#089b6e',
          700: '#077a57',
          800: '#076145',
          900: '#064e38',
          950: '#022c21',
        },
        // Secondary accents
        electric: {
          400: '#38bdf8', // sky blue — secondary highlight
          500: '#0ea5e9',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        amber: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
        },
        orange: {
          400: '#fb923c',
          500: '#f97316',
        },
        // Semantic risk palette — never use colour alone
        risk: {
          low:      '#0dbf86',
          moderate: '#f59e0b',
          high:     '#f97316',
          critical: '#ef4444',
        },
      },
      fontFamily: {
        display: ['"Manrope"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        tight:    '-0.02em',
        tighter:  '-0.03em',
        tightest: '-0.04em',
        wide:     '0.06em',
        wider:    '0.08em',
        widest:   '0.12em',
      },
      boxShadow: {
        // Layered card elevations
        'card-xs': '0 1px 2px rgba(0,0,0,0.5)',
        'card':    '0 1px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.25)',
        'card-lg': '0 2px 8px rgba(0,0,0,0.6), 0 16px 48px rgba(0,0,0,0.35)',
        // Brand glows
        'glow-mint':     '0 0 24px rgba(13,191,134,0.18), 0 0 8px rgba(13,191,134,0.10)',
        'glow-mint-sm':  '0 0 12px rgba(13,191,134,0.14)',
        'glow-electric': '0 0 20px rgba(56,189,248,0.15)',
        // Focus ring
        'focus':   '0 0 0 2px #080b0b, 0 0 0 4px #0dbf86',
      },
      backgroundImage: {
        // Noise overlay for card texture
        'noise':            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Subtle hero gradient for cards
        'card-shine':       'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)',
        // Mint accent gradient
        'mint-glow':        'radial-gradient(ellipse at 50% 0%, rgba(13,191,134,0.12) 0%, transparent 70%)',
        // Sidebar gradient
        'sidebar-gradient': 'linear-gradient(180deg, #0e1212 0%, #080b0b 100%)',
      },
      animation: {
        'glow-pulse':   'glowPulse 2.5s ease-in-out infinite',
        'slide-up':     'slideUp 0.2s ease-out',
        'fade-in':      'fadeIn 0.15s ease-out',
        'spin-slow':    'spin 3s linear infinite',
        'scan':         'scan 2s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.95)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scan: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}
