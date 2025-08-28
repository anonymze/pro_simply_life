import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
import { CopyIcon, SquareArrowOutUpRightIcon } from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	return (
		<BackgroundLayout className="p-4">
			<Title title="Identifiants de connexion" className="mt-3" />
			<ContactInfo
				connexion={{
					site: "https://fidnet.fidroit.fr",
					email: "m.dasilva@groupe-valorem.fr",
					password: "TeamValorem2025*",
				}}
			/>
		</BackgroundLayout>
	);
}

const ContactInfo = ({ connexion }: { connexion: { site: string; email: string; password: string } }) => {
	return (
		<View className="w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Site internet</Text>
					<Text className="font-semibold text-base text-primary">{connexion.site}</Text>
				</View>
				<TouchableOpacity
					onPress={async () => {
						await WebBrowser.openBrowserAsync(connexion.site);
					}}
					className="rounded-full bg-primaryUltraLight p-3"
				>
					<SquareArrowOutUpRightIcon size={16} color={config.theme.extend.colors.primary} />
				</TouchableOpacity>
			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Identifiant</Text>
					<Text className="font-semibold text-base text-primary">{connexion.email}</Text>
				</View>
				<TouchableOpacity
					onPress={() => {
						Clipboard.setStringAsync(connexion.email);
						Alert.alert("Identifiant copié");
					}}
					className="rounded-full bg-primaryUltraLight p-3"
				>
					<CopyIcon size={16} color={config.theme.extend.colors.primary} />
				</TouchableOpacity>
			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Mot de passe</Text>
					<Text className="font-semibold text-base text-primary">{connexion.password}</Text>
				</View>
				<TouchableOpacity
					onPress={async () => {
						await Clipboard.setStringAsync(connexion.password);
						Alert.alert("Mot de passe copié");
					}}
					className="rounded-full bg-primaryUltraLight p-3"
				>
					<CopyIcon size={16} color={config.theme.extend.colors.primary} />
				</TouchableOpacity>
			</View>
		</View>
	);
};
