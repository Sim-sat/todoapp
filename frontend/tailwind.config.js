/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                'custom': '0 0px 60px rgba(127, 17, 224, 0.6)'
            },
        },
    },
    plugins: [],
}