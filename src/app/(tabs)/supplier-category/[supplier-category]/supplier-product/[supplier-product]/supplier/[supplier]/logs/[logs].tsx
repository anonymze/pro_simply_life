import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { storage } from "@/utils/store";
import * as Clipboard from "expo-clipboard";
import { Redirect, useLocalSearchParams } from "expo-router";
import { CopyIcon } from "lucide-react-native";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import config from "tailwind.config";

export default function Page() {
	const { logs, supplier } = useLocalSearchParams();
  const notes = useMMKVString(supplier as string);

	if (!logs || typeof supplier !== "string") return <Redirect href="../" />;

	const connexion = JSON.parse(logs as string) as { email?: string; password?: string };

	return (
		<BackgroundLayout className="p-4">
			<Title title="Identifiants de connexion" className="mt-3" />
			<ContactInfo connexion={connexion} />
			<View className="mt-5 gap-3 shadow-sm shadow-defaultGray/20">
				<Text className="font-semibold text-lg text-primary">Notes supplémentaires</Text>
				<TextInput
					placeholderTextColor={config.theme.extend.colors.lightGray}
					returnKeyType="default"
					autoCapitalize="none"
					keyboardType="default"
					submitBehavior="newline"
					multiline={true}
					numberOfLines={10}
					placeholder="Ajouter des informations supplémentaires"
					className="w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4"
					onChangeText={(text) => {
						storage.set(supplier, text);
					}}
					defaultValue={notes[0] || ""}
				/>
			</View>
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
