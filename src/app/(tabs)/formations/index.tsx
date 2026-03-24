import { getFormationsQuery } from "@/api/queries/formation-queries";
import { MyTouchableOpacity } from "@/components/my-pressable";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { Formation } from "@/types/formations";
import { downloadFile, getFile } from "@/utils/download";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { CalendarIcon, ClockIcon, GraduationCapIcon, UserIcon } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import config from "tailwind.config";

const presenceLabel: Record<string, string> = {
	presentiel: "En présentiel",
	en_ligne: "En ligne",
};

export default function Page() {
	const insets = useSafeAreaInsets();
	return withQueryWrapper<Formation>(
		{
			queryKey: ["formations"],
			queryFn: getFormationsQuery,
		},
		({ data }) => {
			return (
				<BackgroundLayout className="px-4" style={{ paddingTop: insets.top }}>
					<Title title="Formations" className="mb-6" />
					<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24, gap: 16 }}>
						{data.docs.map((formation) => (
							<FormationCard key={formation.id} formation={formation} />
						))}
					</ScrollView>
				</BackgroundLayout>
			);
		},
	)();
}

const FormationCard = ({ formation }: { formation: Formation }) => {
	const [loading, setLoading] = useState(false);

	const handleViewPdf = async () => {
		if (!formation.pdf?.url || !formation.pdf?.filename) return;
		const file = getFile(formation.pdf.filename);
		if (file.exists) {
			router.push({ pathname: "/formations/pdf/[pdf]", params: { pdf: formation.pdf.filename } });
			return;
		}
		setLoading(true);
		downloadFile(formation.pdf.url, formation.pdf.filename, "application/pdf")
			.then(() => {
				router.push({ pathname: "/formations/pdf/[pdf]", params: { pdf: formation.pdf!.filename! } });
			})
			.catch(() => Alert.alert("Erreur", "Le programme n'a pas pu être téléchargé."))
			.finally(() => setLoading(false));
	};

	return (
		<View className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-defaultGray/10">
			{formation.photo?.url && (
				<ImagePlaceholder
					source={formation.photo.url}
					placeholder={formation.photo.blurhash}
					style={{ width: "100%", height: 176 }}
					contentFit="cover"
				/>
			)}
			<View className="gap-4 p-4">
				<View className="gap-2">
					<Text className="text-xl font-bold text-primary">{formation.title}</Text>
					<View className="flex-row flex-wrap gap-2">
						{formation.presence.map((p) => (
							<View key={p} className="self-start rounded-full bg-backgroundChat px-3 py-1.5">
								<Text className="text-sm font-semibold text-white">{presenceLabel[p] ?? p}</Text>
							</View>
						))}
					</View>
				</View>

				<View className="gap-2.5">
					<View className="flex-row items-center gap-2">
						<CalendarIcon size={16} color={config.theme.extend.colors.primaryLight} />
						<Text className="text-base text-primary">
							{new Date(formation.date).toLocaleDateString("fr-FR")}
						</Text>
					</View>
					{formation.duration && (
						<View className="flex-row items-center gap-2">
							<ClockIcon size={16} color={config.theme.extend.colors.primaryLight} />
							<Text className="text-base text-primary">{formation.duration}</Text>
						</View>
					)}
					<View className="flex-row items-center gap-2">
						<UserIcon size={16} color={config.theme.extend.colors.primaryLight} />
						<Text className="text-base text-primary">Par : {formation.author}</Text>
					</View>
				</View>

				<View className="flex-row items-center gap-2">
					<GraduationCapIcon size={18} color={config.theme.extend.colors.primary} />
					<Text className="text-lg font-bold text-primary">{formation.price}</Text>
				</View>

				<View className="gap-2">
					<MyTouchableOpacity
						className="items-center justify-center rounded-xl bg-backgroundChat p-4"
						onPress={() => WebBrowser.openBrowserAsync(formation.inscription_url)}
					>
						<Text className="text-base font-semibold text-white">S'inscrire maintenant</Text>
					</MyTouchableOpacity>
					{formation.pdf?.url && (
						<MyTouchableOpacity
							className="items-center justify-center rounded-xl border border-defaultGray/20 p-4"
							onPress={handleViewPdf}
						>
							{loading ? (
								<ActivityIndicator size="small" color={config.theme.extend.colors.primary} />
							) : (
								<Text className="text-base font-semibold text-primary">Voir le programme</Text>
							)}
						</MyTouchableOpacity>
					)}
				</View>
			</View>
		</View>
	);
};
