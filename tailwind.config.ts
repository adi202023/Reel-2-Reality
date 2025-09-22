import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './screens/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './App.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors with muted palette
        background: '#0f172a',
        foreground: '#f1f5f9',
        card: '#141a29',
        'card-foreground': '#f1f5f9',
        popover: '#141a29',
        'popover-foreground': '#f1f5f9',
        primary: '#d8bfff',
        'primary-foreground': '#0f172a',
        secondary: '#6b7280',
        'secondary-foreground': '#f1f5f9',
        muted: '#6b7280',
        'muted-foreground': '#94a3b8',
        accent: '#6b7280',
        'accent-foreground': '#f1f5f9',
        destructive: '#dc2626',
        'destructive-foreground': '#f1f5f9',
        border: '#6b7280',
        input: '#6b7280',
        ring: '#3b82f6',

        // Reel theme colors
        'reel-gold': '#ffd700',
        'reel-silver': '#b1b1b1',
        'reel-film': '#333333',

        // Challenge theme colors
        'challenge-primary': '#c7b8ea',
        'challenge-secondary': '#87ceeb',
        'challenge-accent': '#ffc0cb',
      },
      backgroundImage: {
        'gradient-reel': 'linear-gradient(135deg, #ffd700 0%, #ffd700 100%)',
        'gradient-reel-reverse': 'linear-gradient(135deg, #ffd700 0%, #ffd700 100%)',
        'gradient-challenge': 'linear-gradient(135deg, #c7b8ea 0%, #ffc0cb 100%)',
        'gradient-challenge-reverse': 'linear-gradient(135deg, #ffc0cb 0%, #c7b8ea 100%)',
        'gradient-hero': 'linear-gradient(135deg, #d8bfff 0%, #c7b8ea 100%)',
        'gradient-hero-reverse': 'linear-gradient(135deg, #c7b8ea 0%, #d8bfff 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'reel-glow': '0 0 30px rgba(255, 215, 0, 0.4)',
        'challenge-glow': '0 0 25px rgba(168, 85, 247, 0.4)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'reel-spin': 'reelSpin 8s linear infinite',
        'film-slide': 'filmSlide 20s linear infinite',
        'challenge-pulse': 'challengePulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        reelSpin: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        filmSlide: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        challengePulse: {
          '0%, 100%': {
            opacity: '0.8',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
