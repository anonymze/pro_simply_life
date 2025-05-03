import type { Config } from "tailwindcss";


const config = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				// regular: ["AtkinsonRegular"],
				// bold: ["AtkinsonBold"],
				// italic: ["AtkinsonItalic"],
			},
			colors: {
				primary: "#0b45c2",
				primaryLight: "#265aca",
				primaryDark: "#02287a",
				background: "#F3F2F9",
				greenChat: "#134d38",
				grayChat: "#242625",
				secondary: "#F68324",
				secondaryLight: "#FA8A26",
				secondaryDark: "#ED6617",
				defaultGray: "#666666",
				lightGray: "#c6c6c6",
			},
		},
	},
} satisfies Config;

export default config;
