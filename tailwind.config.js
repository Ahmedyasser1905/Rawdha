/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ff6b6b",
                secondary: "#54a0ff",
                accent: "#feca57",
                dark: "#2d3436",
            },
            fontFamily: {
                cairo: ["Cairo", "sans-serif"],
                fredoka: ["Fredoka", "cursive"],
            },
            borderRadius: {
                'lg': '20px',
            }
        },
    },
    plugins: [],
}
