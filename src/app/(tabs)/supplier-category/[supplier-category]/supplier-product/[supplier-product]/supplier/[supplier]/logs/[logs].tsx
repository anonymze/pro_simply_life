import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useLocalSearchParams } from "expo-router";
import BackgroundLayout from "@/layouts/background-layout";
import { CopyIcon, PhoneIcon } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import Title from "@/components/ui/title";
import config from "tailwind.config";


export default function Page() {
	const { logs } = useLocalSearchParams();

	if (!logs) return <Redirect href="../" />;

	const connexion = JSON.parse(logs as string) as { email?: string; password?: string };

	return (
		<BackgroundLayout className="p-4">
			<Title title="Identifiants de connexion" className="mt-3" />
			<ContactInfo connexion={connexion} />
		</BackgroundLayout>
	);
}

const ContactInfo = ({ connexion }: { connexion: { email?: string; password?: string } }) => {
	return (
		<View className="w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm font-semibold text-defaultGray">Identifiant</Text>
					<Text className="text-base font-semibold text-dark">{connexion?.email}</Text>
				</View>
				{connexion.password && (
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
					<Text className="text-sm font-semibold text-defaultGray">Mot de passe</Text>
					<Text className="text-base font-semibold text-dark">{connexion?.password}</Text>
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
