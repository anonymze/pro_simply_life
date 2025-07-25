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
			light: ["PlusJakartaSans-Light"],
			regular: ["PlusJakartaSans-Regular"],
			medium: ["PlusJakartaSans-Medium"],
			semibold: ["PlusJakartaSans-SemiBold"],
			bold: ["PlusJakartaSans-Bold"],
			italic: ["PlusJakartaSans-Italic"],
		},
		extend: {
			colors: {
				dark: "#15202a",
				primary: "#363F72",
				primaryLight: "#717BBC",
				primaryUltraLight: "#EBF2FF",
				backgroundChat: "#4E5BA6",
				textChat: "#15202A",
				background: "#f4f5f6",
				secondary: "#FCE7F6",
				secondaryLight: "#fcebf7",
				defaultGray: "#6A829A",
				lightGray: "#AFB5D9",
				darkGray: "#EAECF5",
				pink: "#F670C7",
				red2: "#B42318",
				production: "#FDA29B",
				encours: "#6172F3",
				structured: "#7CD4FD",
			},
		},
	},
} satisfies Config;

export default config;
