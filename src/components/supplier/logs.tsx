import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import * as Clipboard from "expo-clipboard";
import { Redirect, useLocalSearchParams } from "expo-router";
import { CopyIcon } from "lucide-react-native";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function SupplierLogs() {
	const { logs, supplier } = useLocalSearchParams();

	if (!logs || typeof supplier !== "string") return <Redirect href="../" />;

	const connexion = JSON.parse(logs as string) as { email?: string; password?: string };

	return (
		<BackgroundLayout className="p-4">
			<Title title="Identifiants généraux" className="mt-3" />
			<ContactInfo connexion={connexion} />
		</BackgroundLayout>
	);
}

const ContactInfo = ({ connexion }: { connexion: { email?: string; password?: string } }) => {
	return (
		<View className="w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Identifiant</Text>
					<Text className="font-semibold text-base text-primary">{connexion?.email}</Text>
				</View>
				{connexion.email && (
					<TouchableOpacity
						onPress={() => {
							if (!connexion.email) return;
							Clipboard.setStringAsync(connexion.email);
							Alert.alert("Identifiant copié");
						}}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						<CopyIcon size={16} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				)}
			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Mot de passe</Text>
					<Text className="font-semibold text-base text-primary">{connexion?.password}</Text>
				</View>
				{connexion.password && (
					<TouchableOpacity
						onPress={async () => {
							if (!connexion.password) return;
							await Clipboard.setStringAsync(connexion.password);
							Alert.alert("Mot de passe copié");
						}}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						<CopyIcon size={16} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};
