module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      colors: {
        'primary': '#2B6AE0',
        'secondary': '#1AA7ED',
        'accent': '#2BDDE0',
        'light-gray': '#F5F5F5',
        'dark-purple': '#5E2BE0',
        'light-blue': '#759AE0',
      },
    },
  },
  plugins: [],
};
