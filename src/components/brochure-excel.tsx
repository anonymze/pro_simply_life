import type { Media } from "@/types/media";
import { downloadFile } from "@/utils/download";
import { DownloadIcon, FileIcon } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export const BrochureExcel = ({
	brochure,
	updatedAt,
	title = "Brochure",
}: {
	brochure: Media;
	updatedAt: string;
	title?: string;
}) => {
	const [loadingDownload, setLoadingDownload] = React.useState(false);

	return (
		<View className="w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="text-sm text-primaryLight">{title}</Text>
			<View className="flex-row items-center justify-between gap-2">
				<View className="flex-shrink flex-row items-center gap-2">
					<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">
						<FileIcon size={18} color={config.theme.extend.colors.defaultGray} />
					</View>
					<View className="flex-shrink">
						<Text className="font-semibold text-sm text-primary" numberOfLines={2}>
							{brochure.filename}
						</Text>
						<Text className="font-semibold text-sm text-primaryLight">
							{new Date(updatedAt).toLocaleDateString("fr-FR", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							})}
						</Text>
					</View>
				</View>
				<View className="flex-row gap-3">
					<TouchableOpacity
						disabled={loadingDownload}
						onPress={() => {
							if (!brochure.url || !brochure.filename || !brochure.mimeType) return;

							setLoadingDownload(true);
							downloadFile(brochure.url, brochure.filename, brochure.mimeType, true)
								.then(() => {
									// Alert.alert("Brochure téléchargée !");
								})
								.catch((_) => {
									Alert.alert(
										"La brochure n'a pas pu être téléchargée",
										"Vérifiez que le nom du fichier n'existe pas déjà sur votre appareil ou que vous avez assez d'espace de stockage.",
									);
								})
								.finally(() => {
									setLoadingDownload(false);
								});
						}}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						{loadingDownload ? (
							<ActivityIndicator
								size="small"
								style={{ width: 16, height: 16 }}
								color={config.theme.extend.colors.primary}
							/>
						) : (
							<DownloadIcon size={16} color={config.theme.extend.colors.primary} />
						)}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};
