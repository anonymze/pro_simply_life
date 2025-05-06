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
				dark: "#15202a",
				primary: "#047684",
				primaryLight: "#0794a4",
				primaryUltraLight: "#d5f3f6",
				primaryDark: "#e7b528",
				background: "#f4f5f6",
				greenChat: "#134d38",
				grayChat: "#242625",
				secondary: "#e7b528",
				secondaryLight: "#fef2cd",
				secondaryDark: "#816514",
				defaultGray: "#758ba1",
				lightGray: "#c6c6c6",
			},
		},
	},
} satisfies Config;

export default config;
