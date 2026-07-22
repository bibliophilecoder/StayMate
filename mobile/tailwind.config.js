/** @type {import('tailwindcss').Config} */
module.exports = { content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"], presets: [require("nativewind/preset")], theme: { extend: { colors: { ink: "#13213C", primary: "#5267E8", emerald: "#20A464", mist: "#F3F7FB", lavender: "#F1EEFF" }, borderRadius: { card: "28px" } } }, plugins: [] };
