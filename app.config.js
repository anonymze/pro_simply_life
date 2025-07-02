export default {
	expo: {
		name: "Simply Life : Groupe Valorem",
		// slug used by expo for your project
		slug: "simply-life",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./src/assets/images/icon.png",
		// simply-life://some_path
		scheme: "simply-life",
		// theme
		userInterfaceStyle: "light",
		newArchEnabled: true,
		experiments: {
			tsconfigPaths: true,
			typedRoutes: true,
			buildCacheProvider: "eas",
		},
		backgroundColor: "#ffffff",
		// assetBundlePatterns: ["**/*"],
		locales: {
			en: "./src/i18n/metadata/ios/en.json",
			fr: "./src/i18n/metadata/ios/fr.json",
			es: "./src/i18n/metadata/ios/es.json",
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./src/assets/images/icon.png",
		},
		ios: {
			// appleTeamId: "AF4UD5C4UU",
			supportsTablet: true,
			bundleIdentifier: "com.anonymze.simplylife",
			associatedDomains: ["applinks:simply-life.expo.app"],
			CFBundleAllowMixedLocalizations: true,
			infoPlist: {
				ITSAppUsesNonExemptEncryption: false,
			},
			// entitlements: {
			// 	"com.apple.security.application-groups": ["group.com.anonymze.simplylife"],
			// },
		},
		android: {
			edgeToEdgeEnabled: true,
			// adaptiveIcon: {
			// 	foregroundImage: "./assets/images/adaptive-icon.png",
			// 	backgroundColor: "#ffffff",
			// },
			googleServicesFile: "./resources/google-services.json",
			package: "com.anonymze.simplylife",
			config: {
				googleMaps: {
					// can be public, restricted to the app
					apiKey: "AIzaSyDS8h4LEfphnaXei8dCRdFfoYQDNPDZ1wo",
				},
			},
			// softwareKeyboardLayoutMode: "pan",
			intentFilters: [
				{
					action: "VIEW",
					autoVerify: true,
					data: {
						host: "simply-life.expo.app",
						scheme: "https",
						pathPrefix: "/login",
					},
					category: ["DEFAULT", "BROWSABLE"],
				},
				{
					action: "VIEW",
					autoVerify: true,
					data: {
						host: "simply-life.expo.app",
						scheme: "https",
						pathPrefix: "/contact",
					},
					category: ["DEFAULT", "BROWSABLE"],
				},
			],
		},
		plugins: [
			"expo-localization",
			"expo-router",
			[
				"expo-font",
				{
					fonts: [
						"./src/assets/fonts/PlusJakartaSans-Regular.ttf",
						"./src/assets/fonts/PlusJakartaSans-Bold.ttf",
						"./src/assets/fonts/PlusJakartaSans-Italic.ttf",
						"./src/assets/fonts/PlusJakartaSans-Light.ttf",
						"./src/assets/fonts/PlusJakartaSans-Medium.ttf",
						"./src/assets/fonts/PlusJakartaSans-SemiBold.ttf",
					],
				},
			],
			[
				"expo-web-browser",
				{
					// experimentalLauncherActivity: true
				},
			],
			[
				"expo-maps",
				{
					requestLocationPermission: true,
					// translations in file so don't need
					// locationPermission: "Allow $(PRODUCT_NAME) to use your location.",
				},
			],
			[
				"expo-video",
				{
					supportsBackgroundPlayback: false,
					supportsPictureInPicture: false,
				},
			],
			[
				"expo-image-picker",
				// translations in file so don't need
				// {
				// 	photosPermission: "Allow $(PRODUCT_NAME) to access your photos",
				// 	cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
				// 	microphonePermission: "Allow $(PRODUCT_NAME) to use the microphone.",
				// },
			],
			[
				"expo-document-picker",
				{
					iCloudContainerEnvironment: "Production",
				},
			],
			[
				"expo-splash-screen",
				{
					backgroundColor: "#ffffff",
					image: "./src/assets/images/splash-icon.png",
					// dark: {
					// 	image: "./assets/images/splash-icon-dark.png",
					// 	backgroundColor: "#ffffff",
					// },
					// imageWidth: 220,
				},
			],
			[
				"@sentry/react-native/expo",
				{
					url: "https://sentry.io/",
					project: "simply_life",
					organization: "yann-metier",
				},
			],
		],
		updates: {
			url: "https://u.expo.dev/71cf24a7-3efc-4fe5-9b69-f37c315aebbc",
		},
		extra: {
			eas: {
				projectId: "71cf24a7-3efc-4fe5-9b69-f37c315aebbc",
			},
		},
		runtimeVersion: "1.0.0",
	},
};
