import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { DownloadIcon, EyeIcon, FileIcon } from "lucide-react-native";
import { downloadFile, getFile } from "@/utils/download";
import { HrefObject, router } from "expo-router";
import type { Media } from "@/types/media";
import config from "tailwind.config";
import React from "react";


export const Brochure = ({ brochure, updatedAt, link, title = "Brochure" }: { brochure: Media; updatedAt: string; link: HrefObject; title?: string }) => {
	const [loadingDownload, setLoadingDownload] = React.useState(false);
	const [loadingOpen, setLoadingOpen] = React.useState(false);

	return (
		<View className="w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="text-sm text-primaryLight">{title}</Text>
			<View className="flex-row items-center justify-between gap-2">
				<View className="flex-shrink flex-row items-center gap-2">
					<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">
						<FileIcon size={18} color={config.theme.extend.colors.defaultGray} />
					</View>
					<View className="flex-shrink">
						<Text className="font-semibold text-sm text-primary">{brochure.filename}</Text>
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
							downloadFile(brochure.url, brochure.filename, brochure.mimeType)
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
					<TouchableOpacity
						disabled={loadingOpen}
						onPress={async () => {
							if (!brochure.filename || !brochure.url || !brochure.mimeType) return;

							const file = getFile(brochure.filename);

							if (file.exists) {
								router.push(link);
								return;
							}

							setLoadingOpen(true);

							downloadFile(brochure.url, brochure.filename, brochure.mimeType, true)
								.then((_) => {
									router.push(link);
								})
								.catch((_) => {
									Alert.alert(
										"La brochure n'a pas pu être téléchargée pour être visualisée",
										"Vérifiez que vous avez assez d'espace de stockage.",
									);
								})
								.finally(() => {
									setLoadingOpen(false);
								});
						}}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						{loadingOpen ? (
							<ActivityIndicator
								size="small"
								style={{ width: 16, height: 16 }}
								color={config.theme.extend.colors.primary}
							/>
						) : (
							<EyeIcon size={16} color={config.theme.extend.colors.primary} />
						)}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};