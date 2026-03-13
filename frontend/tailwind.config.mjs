/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'mevo-dark': '#1a2230',
                'mevo-blue': '#7dd3fc',
                'mevo-gray': '#d1d5db',
            },
        },
    },
    plugins: [],
};