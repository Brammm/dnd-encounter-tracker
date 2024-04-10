/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#69140E',
                highlight: '#A44200',
                dark: '#3C1518',
                accent: '#669bbc',
            },
            fontFamily: {
                serif: ['"Roboto Slab"', ...defaultTheme.fontFamily.serif],
                sans: ['"Nunito Sans"', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
