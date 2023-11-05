import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  mode: 'jit',
  darkMode: 'class',
  theme: {
    colors: {
      text: {
        50: 'hsl(var(--text-50) / <alpha-value>)',
        100: 'hsl(var(--text-100) / <alpha-value>)',
        200: 'hsl(var(--text-200) / <alpha-value>)',
        300: 'hsl(var(--text-300) / <alpha-value>)',
        400: 'hsl(var(--text-400) / <alpha-value>)',
        500: 'hsl(var(--text-500) / <alpha-value>)',
        600: 'hsl(var(--text-600) / <alpha-value>)',
        700: 'hsl(var(--text-700) / <alpha-value>)',
        800: 'hsl(var(--text-800) / <alpha-value>)',
        900: 'hsl(var(--text-900) / <alpha-value>)',
        950: 'hsl(var(--text-950) / <alpha-value>)',
      },
      background: {
        50: 'hsl(var(--background-50) / <alpha-value>)',
        100: 'hsl(var(--background-100) / <alpha-value>)',
        200: 'hsl(var(--background-200) / <alpha-value>)',
        300: 'hsl(var(--background-300) / <alpha-value>)',
        400: 'hsl(var(--background-400) / <alpha-value>)',
        500: 'hsl(var(--background-500) / <alpha-value>)',
        600: 'hsl(var(--background-600) / <alpha-value>)',
        700: 'hsl(var(--background-700) / <alpha-value>)',
        800: 'hsl(var(--background-800) / <alpha-value>)',
        900: 'hsl(var(--background-900) / <alpha-value>)',
        950: 'hsl(var(--background-950) / <alpha-value>)',
      },
      primary: {
        50: 'hsl(var(--primary-50) / <alpha-value>)',
        100: 'hsl(var(--primary-100) / <alpha-value>)',
        200: 'hsl(var(--primary-200) / <alpha-value>)',
        300: 'hsl(var(--primary-300) / <alpha-value>)',
        400: 'hsl(var(--primary-400) / <alpha-value>)',
        500: 'hsl(var(--primary-500) / <alpha-value>)',
        600: 'hsl(var(--primary-600) / <alpha-value>)',
        700: 'hsl(var(--primary-700) / <alpha-value>)',
        800: 'hsl(var(--primary-800) / <alpha-value>)',
        900: 'hsl(var(--primary-900) / <alpha-value>)',
        950: 'hsl(var(--primary-950) / <alpha-value>)',
      },
      secondary: {
        50: 'hsl(var(--secondary-50) / <alpha-value>)',
        100: 'hsl(var(--secondary-100) / <alpha-value>)',
        200: 'hsl(var(--secondary-200) / <alpha-value>)',
        300: 'hsl(var(--secondary-300) / <alpha-value>)',
        400: 'hsl(var(--secondary-400) / <alpha-value>)',
        500: 'hsl(var(--secondary-500) / <alpha-value>)',
        600: 'hsl(var(--secondary-600) / <alpha-value>)',
        700: 'hsl(var(--secondary-700) / <alpha-value>)',
        800: 'hsl(var(--secondary-800) / <alpha-value>)',
        900: 'hsl(var(--secondary-900) / <alpha-value>)',
        950: 'hsl(var(--secondary-950) / <alpha-value>)',
      },
      tertiary: {
        50: 'hsl(var(--accent-50) / <alpha-value>)',
        100: 'hsl(var(--accent-100) / <alpha-value>)',
        200: 'hsl(var(--accent-200) / <alpha-value>)',
        300: 'hsl(var(--accent-300) / <alpha-value>)',
        400: 'hsl(var(--accent-400) / <alpha-value>)',
        500: 'hsl(var(--accent-500) / <alpha-value>)',
        600: 'hsl(var(--accent-600) / <alpha-value>)',
        700: 'hsl(var(--accent-700) / <alpha-value>)',
        800: 'hsl(var(--accent-800) / <alpha-value>)',
        900: 'hsl(var(--accent-900) / <alpha-value>)',
        950: 'hsl(var(--accent-950) / <alpha-value>)',
      },
    },
    screens: {
      mobile: '840px',
      tablet: '1280px',
    },
    fontSize: {
      'display-large': [
        '3.563rem',
        { lineHeight: '4rem', letterSpacing: '-0.016rem' },
      ],
      'display-medium': [
        '2.813rem',
        { lineHeight: '3.25rem', letterSpacing: '0rem' },
      ],
      'display-small': [
        '2.25rem',
        { lineHeight: '2.75rem', letterSpacing: '0rem' },
      ],
      'headline-large': [
        '2rem',
        { lineHeight: '2.5rem', letterSpacing: '0rem' },
      ],
      'headline-medium': [
        '1.75rem',
        { lineHeight: '2.25rem', letterSpacing: '0rem' },
      ],
      'headline-small': [
        '1.5rem',
        { lineHeight: '2rem', letterSpacing: '0.031rem' },
      ],
      'body-large': [
        '1rem',
        { lineHeight: '1.5rem', letterSpacing: '0.031rem' },
      ],
      'body-medium': [
        '0.875rem',
        { lineHeight: '1.25rem', letterSpacing: '0.016rem' },
      ],
      'body-small': [
        '0.75rem',
        { lineHeight: '1rem', letterSpacing: '0.025rem' },
      ],
      'label-large': [
        '0.875rem',
        { lineHeight: '1.25rem', letterSpacing: '0.006rem' },
      ],
      'label-medium': [
        '0.75rem',
        { lineHeight: '1rem', letterSpacing: '0.031rem' },
      ],
      'label-small': [
        '0.688rem',
        { lineHeight: '1rem', letterSpacing: '0.031rem' },
      ],
      'title-large': [
        '1.375rem',
        { lineHeight: '1.75rem', letterSpacing: '0rem' },
      ],
      'title-medium': [
        '1rem',
        { lineHeight: '1.5rem', letterSpacing: '0.009rem' },
      ],
      'title-small': [
        '0.875rem',
        { lineHeight: '1.25rem', letterSpacing: '0.006rem' },
      ],
    },
    fontFamily: {
      sans: ["'GeistVF', sans-serif", ...defaultTheme.fontFamily.sans],
      mono: ["'Inter', monospace", ...defaultTheme.fontFamily.mono],
      code: ["'Source Code Pro', monospace", ...defaultTheme.fontFamily.mono],
    },
  },
  plugins: [],
};
