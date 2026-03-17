import { MyTouchableOpacity } from "@/components/my-pressable";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { downloadFile, getFile } from "@/utils/download";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import config from "tailwind.config";

const PDF_URL = "https://simply-life-admin.fr/api/media/file/formation.pdf";
const PDF_FILENAME = "formation.pdf";

export default function Page() {
	const insets = useSafeAreaInsets();
	const [loading, setLoading] = useState(false);

	const handleViewProgramme = async () => {
		const file = getFile(PDF_FILENAME);
		if (file.exists) {
			router.push({ pathname: "/formations/pdf/[pdf]", params: { pdf: PDF_FILENAME } });
			return;
		}
		setLoading(true);
		downloadFile(PDF_URL, PDF_FILENAME, "application/pdf")
			.then(() => {
				router.push({ pathname: "/formations/pdf/[pdf]", params: { pdf: PDF_FILENAME } });
			})
			.catch(() => Alert.alert("Erreur", "Le programme n'a pas pu être téléchargé."))
			.finally(() => setLoading(false));
	};

	return (
		<BackgroundLayout className="px-4" style={{ paddingTop: insets.top }}>
			<Title title="Formations" className="mb-6" />
			<Text className="mb-3 text-base font-semibold text-primary">Formation déclaration des revenus</Text>
			<View className="flex-row gap-3">
				<MyTouchableOpacity
					className="flex-1 items-center justify-center rounded-2xl bg-white p-4"
					onPress={handleViewProgramme}
				>
					{loading ? (
						<ActivityIndicator size="small" color={config.theme.extend.colors.primary} />
					) : (
						<Text className="font-semibold text-base text-primary">Voir le programme</Text>
					)}
				</MyTouchableOpacity>
				<MyTouchableOpacity
					className="flex-1 items-center justify-center rounded-2xl bg-primary p-4"
					onPress={() => WebBrowser.openBrowserAsync("https://daffodil-aftermath-15d.notion.site/52f5a6b1ce3c428a87f25fc46339ff4b?pvs=105")}
				>
					<Text className="font-semibold text-base text-white">S'inscrire</Text>
				</MyTouchableOpacity>
			</View>
		</BackgroundLayout>
	);
}
