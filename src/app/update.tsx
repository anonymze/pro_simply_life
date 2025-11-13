
import BackgroundLayout from "@/layouts/background-layout";
import { APP_URL_ANDROID, APP_URL_IOS, VERSION_NUMBER } from "@/utils/helper";
import { Image } from "expo-image";
import { Linking, Platform, Pressable, Text } from "react-native";

export default function Page() {
	return (
		<BackgroundLayout className="justify-center p-6">
			<Image source={require("@/assets/images/logo.png")} style={{ height: 80, width: 80 }} contentFit="contain" />
			<Text className="mt-4 max-w-[90%] text-start font-medium text-lg text-primary">
				Une importante mise à jour de l'application est nécessaire pour continuer à l'utiliser.
			</Text>
			{/*<Text className="mt-4 max-w-[90%] text-start font-medium text-lg text-primary">
				Veuillez télécharger la mise à jour sur le store en appuyant sur le bouton ci-dessous.
			</Text>*/}
			{Platform.OS === "ios" && (
				<Text className="text-lg mt-4 max-w-[90%] text-start font-medium text-red-500">
					Vous allez être redirigé vers l'App Store avec toutes vos applications, il suffit de scroller
					jusqu'à trouver Simply Life et mettre à jour.
				</Text>
			)}
			<Pressable
				onPress={() => {
					Linking.openURL(Platform.OS === "ios" ? APP_URL_IOS : APP_URL_ANDROID);
				}}
				className="mt-8 h-14 w-full items-center justify-center rounded-lg bg-primary disabled:opacity-70"
			>
				<Text className="text-center text-white">Mettre à jour</Text>
			</Pressable>
			<Text className="mt-8 text-center text-xs text-primaryLight">Version {VERSION_NUMBER}</Text>
		</BackgroundLayout>
	);
}
