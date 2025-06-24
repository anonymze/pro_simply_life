import { CheckCheckIcon, CheckIcon, DownloadIcon, FileIcon } from "lucide-react-native";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import * as ContextMenu from "zeego/context-menu";
import { downloadFile } from "@/utils/download";
import { i18n } from "@/i18n/translations";
import { Message } from "@/types/chat";
import { AppUser } from "@/types/user";
import config from "tailwind.config";
import { I18n } from "@/types/i18n";
import { Image } from "expo-image";
import { cn } from "@/utils/cn";


type ItemProps = {
	firstMessage: boolean;
	item: Message;
	appUser: AppUser | null;
	stateMessage: {
		newMessageUser: boolean;
		lastMessageUser: boolean;
	};
	languageCode: I18n;
};

export const Item = ({ firstMessage, item, appUser, stateMessage, languageCode }: ItemProps) => {
	const me = item.app_user.id === appUser?.user.id;
	const optimistic = "optimistic" in item ? true : false;

	return (
		<View
			className={cn(
				"my-[0.15rem] items-end gap-1",
				me ? "self-end" : "self-start",
				me ? "flex-row-reverse" : "flex-row",
				firstMessage && "mb-3",
				stateMessage.lastMessageUser && "mt-2.5",
			)}
		>
			{!me && (
				<Image
					placeholderContentFit="cover"
					contentFit="cover"
					placeholder={item.app_user.photo?.blurhash ?? require("@/assets/icons/placeholder_user.svg")}
					source={item.app_user.photo?.url}
					style={{ width: 30, height: 30, borderRadius: 99 }}
				/>
			)}

			<View
				className={cn(
					"flex-shrink flex-row gap-3 rounded-bl-xl rounded-tr-xl p-2.5",
					me ? "rounded-tl-xl bg-backgroundChat" : "rounded-br-xl bg-white",
					item.file && "p-1.5",
				)}
			>
				<View className="flex-shrink gap-1">
					{!me && stateMessage.lastMessageUser && (
						<Text className="font-bold text-sm text-primaryLight">{`${item.app_user.firstname} ${item.app_user.lastname}`}</Text>
					)}
					{item.message && (
						<Text className={cn("flex-shrink self-start", me ? "text-white" : "text-textChat")}>{item.message}</Text>
					)}
					{item.file ? (
						optimistic ? (
							<>
								{item.file.mimeType?.startsWith("image") ? (
									<Image
										// @ts-ignore
										source={item.file.uri}
										transition={300}
										placeholderContentFit="cover"
										contentFit="cover"
										style={styles.image}
									/>
								) : (
									<View style={styles.image} className="relative items-center justify-center gap-2">
										<FileIcon size={45} color={me ? "#fff" : config.theme.extend.colors.primaryLight} />
									</View>
								)}
								<ActivityIndicator
									size="small"
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										backgroundColor: "rgba(0, 0, 0, 0.5)",
										borderRadius: 6,
									}}
									color="#fff"
								/>
							</>
						) : (
							<>
								{item.file.mimeType?.startsWith("image") ? (
									<Image
										// @ts-ignore
										placeholder={item.file.blurhash}
										placeholderContentFit="cover"
										contentFit="cover"
										// @ts-ignore
										source={item.file.url}
										transition={300}
										style={styles.image}
									/>
								) : (
									<ContextMenu.Root>
										<ContextMenu.Trigger>
											<View style={styles.image} className="relative items-center justify-center gap-2">
												<FileIcon size={45} color={me ? "#fff" : config.theme.extend.colors.primaryLight} />
												<DownloadIcon
													size={20}
													color={me ? "#fff" : config.theme.extend.colors.primaryLight}
													style={{ position: "absolute", top: 10, right: 10 }}
												/>
												{"filename" in item.file && (
													<Text
														className={cn("text-center text-primaryLight", me ? "text-white" : "text-primaryLight")}
													>
														{item.file.filename}
													</Text>
												)}
											</View>
										</ContextMenu.Trigger>
										<ContextMenu.Content>
											<ContextMenu.Preview>
												<View style={styles.image} className="relative items-center justify-center gap-2">
													<FileIcon size={45} color={me ? "#fff" : config.theme.extend.colors.primaryLight} />
													<DownloadIcon
														size={20}
														color={me ? "#fff" : config.theme.extend.colors.primaryLight}
														style={{ position: "absolute", top: 10, right: 10 }}
													/>
													{"filename" in item.file && (
														<Text
															className={cn("text-center text-primaryLight", me ? "text-white" : "text-primaryLight")}
														>
															{item.file.filename}
														</Text>
													)}
												</View>
											</ContextMenu.Preview>
											<ContextMenu.Item
												key="download"
												onSelect={async () => {
													if (
														item?.file &&
														"url" in item.file &&
														"filename" in item.file &&
														item.file.url &&
														item.file.filename
													) {
														downloadFile(item.file.url, item.file.filename, item.file.mimeType ?? undefined)
															.then((res) => {})
															.catch((error) => {
																console.log(error);
																Alert.alert(
																	"Erreur",
																	"Il est possible que vous n'ayez plus d'espace de stockage sur votre appareil ou que vous n'ayez pas les permissions nécessaires pour télécharger le fichier.",
																);
															});
													}
												}}
											>
												<ContextMenu.ItemTitle>{i18n[languageCode]("DOWNLOAD")}</ContextMenu.ItemTitle>
												<ContextMenu.ItemIcon
													// androidIconName="arrow_down_float"
													ios={{
														name: "arrow.down",
														pointSize: 15,
														weight: "semibold",
														paletteColors: [
															{
																dark: config.theme.extend.colors.primaryLight,
																light: config.theme.extend.colors.primaryLight,
															},
														],
													}}
												/>
											</ContextMenu.Item>
										</ContextMenu.Content>
									</ContextMenu.Root>
								)}
							</>
						)
					) : null}
				</View>
				<View className={cn("flex-row gap-1 self-end", item.file && "absolute bottom-2 right-2")}>
					<Text className={cn("text-xs", me ? "text-lightGray" : "text-defaultGray")}>
						{new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
					</Text>
					{me &&
						(optimistic ? (
							<CheckIcon size={14} color={config.theme.extend.colors.lightGray} />
						) : (
							<CheckCheckIcon size={14} color={config.theme.extend.colors.primaryUltraLight} />
						))}
				</View>
			</View>
		</View>
	);
};

// for debugging in react devtools
Item.displayName = "Item";

const styles = StyleSheet.create({
	image: {
		width: 140,
		height: 180,
		borderRadius: 6,
	},
});
