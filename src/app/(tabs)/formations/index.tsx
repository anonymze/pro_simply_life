import { MyTouchableOpacity } from "@/components/my-pressable";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { downloadFile, getFile } from "@/utils/download";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { CalendarIcon, ClockIcon, GraduationCapIcon, UserIcon } from "lucide-react-native";
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
			<View className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-defaultGray/10">
				<View className="h-44 items-center justify-center bg-primaryUltraLight">
					<View className="absolute left-3 top-3 rounded-full bg-backgroundChat px-3 py-1.5">
						<Text className="text-sm font-semibold text-white">Mise à jour 2026</Text>
					</View>
				</View>

				<View className="gap-4 p-4">
					<Text className="font-bold text-xl text-primary">Déclaration des revenus 2026</Text>

					<View className="gap-2.5">
						<View className="flex-row items-center gap-2">
							<CalendarIcon size={16} color={config.theme.extend.colors.primaryLight} />
							<Text className="text-base text-primary">09/04/2026</Text>
						</View>
						<View className="flex-row items-center gap-2">
							<ClockIcon size={16} color={config.theme.extend.colors.primaryLight} />
							<Text className="text-base text-primary">7h (Visio ou Présentiel)</Text>
						</View>
						<View className="flex-row items-center gap-2">
							<UserIcon size={16} color={config.theme.extend.colors.primaryLight} />
							<Text className="text-base text-primary">Par : Groupe Valorem</Text>
						</View>
					</View>

					<View className="flex-row items-center gap-2">
						<GraduationCapIcon size={18} color={config.theme.extend.colors.primary} />
						<Text className="font-bold text-lg text-primary">250 € HT</Text>
					</View>

					<View className="gap-2">
						<MyTouchableOpacity
							className="items-center justify-center rounded-xl bg-backgroundChat p-4"
							onPress={() =>
								WebBrowser.openBrowserAsync(
									"https://daffodil-aftermath-15d.notion.site/52f5a6b1ce3c428a87f25fc46339ff4b?pvs=105",
								)
							}
						>
							<Text className="font-semibold text-base text-white">S'inscrire maintenant</Text>
						</MyTouchableOpacity>
						<MyTouchableOpacity
							className="items-center justify-center rounded-xl border border-defaultGray/20 p-4"
							onPress={handleViewProgramme}
						>
							{loading ? (
								<ActivityIndicator size="small" color={config.theme.extend.colors.primary} />
							) : (
								<Text className="font-semibold text-base text-primary">Voir le programme</Text>
							)}
						</MyTouchableOpacity>
					</View>
				</View>
			</View>
		</BackgroundLayout>
	);
}
