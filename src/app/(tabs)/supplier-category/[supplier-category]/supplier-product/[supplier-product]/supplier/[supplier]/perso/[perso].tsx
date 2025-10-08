import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { storage } from "@/utils/store";
import { Redirect, useLocalSearchParams } from "expo-router";
import { Text, TextInput } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import config from "tailwind.config";

export default function Page() {
	const { perso, supplier } = useLocalSearchParams();
	const id = useMMKVString((supplier as string) + "_id");
	const password = useMMKVString((supplier as string) + "_password");

	if (!perso || typeof supplier !== "string") return <Redirect href="../" />;

	return (
		<BackgroundLayout className="p-4">
			<Title title="Identifiants personnels" className="mt-3 mb-2" />
			<Text className="text-primary">
				Vous pouvez ajouter vos identifiants personnels pour ce fournisseur, ils sont uniquement visibles par vous.
			</Text>
			<Text className="mt-5 text-primary mb-2">Identifiant :</Text>
			<TextInput
				placeholderTextColor={config.theme.extend.colors.lightGray}
				returnKeyType="default"
				autoCapitalize="none"
				keyboardType="default"
				// submitBehavior="newline"
				// multiline={true}
				// numberOfLines={10}
				placeholder="Identifiant"
				className="w-full rounded-xl border border-transparent  bg-darkGray  p-5 placeholder:text-primaryLight focus:border-primaryLight"
				onChangeText={(text) => {
					storage.set((supplier as string) + "_id", text);
				}}
				defaultValue={id[0] || ""}
			/>
			<Text className="mb-2 text-primary mt-3">Mot de passe : </Text>
			<TextInput
				placeholderTextColor={config.theme.extend.colors.lightGray}
				returnKeyType="default"
				autoCapitalize="none"
				keyboardType="default"
				// submitBehavior="newline"
				// multiline={true}
				// numberOfLines={10}
				placeholder="Mot de passe"
				className="w-full rounded-xl border border-transparent  bg-darkGray  p-5 placeholder:text-primaryLight focus:border-primaryLight"
				onChangeText={(text) => {
					storage.set((supplier as string) + "_password", text);
				}}
				defaultValue={password[0] || ""}
			/>
		</BackgroundLayout>
	);
}
