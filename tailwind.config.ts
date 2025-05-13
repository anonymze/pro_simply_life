import type { Config } from "tailwindcss";


const config = {
	corePlugins: {
		// we remove the font weight because we use the font family instead for each font, and font weight can interfere with the font family on Android
		// when you set font-bold for example, it sets the font weight and the font family so the font family will still be applied
		fontWeight: false,	
		// default base style tailwind on elements (does not remove utilities ex: text-white)
		preflight: false,
	},
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	darkMode: "class",
	theme: {
		fontFamily: {
			light: ["DMSans18pt-Light"],
			regular: ["DMSans18pt-Regular"],
			medium: ["DMSans18pt-Medium"],
			semibold: ["DMSans18pt-SemiBold"],
			bold: ["DMSans18pt-Bold"],
			italic: ["DMSans18pt-Italic"],
		},
		extend: {
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
