import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { CheckCheckIcon, CheckIcon } from "lucide-react-native";
import { Directory, File, Paths } from "expo-file-system/next";
import * as ContextMenu from "zeego/context-menu";
import { i18n } from "@/i18n/translations";
import { Message } from "@/types/chat";
import { AppUser } from "@/types/user";
import config from "tailwind.config";
import { I18n } from "@/types/i18n";
import { Image } from "expo-image";
import { cn } from "@/utils/cn";
import React from "react";

import VideoScreen from "./video-screen";


const destination = new Directory(Paths.cache, "simply-life");
const widthWindow = Dimensions.get("window").width;
const heightWindow = Dimensions.get("window").height;

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
	const [open, setOpen] = React.useState(false);

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
					me ? "rounded-tl-xl bg-primary" : "rounded-br-xl bg-white",
					item.file && "p-1.5",
				)}
			>
				<View className="flex-shrink gap-1">
					{!me && stateMessage.lastMessageUser && (
						<Text className="font-bold text-sm text-primaryLight">{`${item.app_user.firstname} ${item.app_user.lastname}`}</Text>
					)}
					{item.message && (
						<Text className={cn("flex-shrink self-start", me ? "text-white" : "text-black")}>{item.message}</Text>
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
									<View style={styles.image} className="items-center justify-center">
										<Text className="text-center text-white">{i18n[languageCode]("FILE_NOT_SUPPORTED")}</Text>
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
							// <ContextMenu.Root onOpenChange={setOpen}>
							// 	<ContextMenu.Trigger>
							// 		<>
							// 			{item.file.mimeType?.startsWith("image") ? (
							// 				<Image
							// 					// @ts-ignore
							// 					placeholder={item.file.blurhash}
							// 					placeholderContentFit="cover"
							// 					// @ts-ignore
							// 					source={item.file.url}
							// 					transition={300}
							// 					contentFit="cover"
							// 					style={styles.image}
							// 				/>
							// 			) : // TODO: add video
							// 			item.file.mimeType?.startsWith("image") ? (
							// 				<Image
							// 					// @ts-ignore
							// 					placeholder={item.file.blurhash}
							// 					placeholderContentFit="cover"
							// 					// @ts-ignore
							// 					source={item.file.url}
							// 					transition={300}
							// 					contentFit="cover"
							// 					style={styles.image}
							// 				/>
							// 			) : (
							// 				<View style={styles.image} className="items-center justify-center">
							// 					<Text className="text-center text-white">{i18n[languageCode]("FILE_NOT_SUPPORTED")}</Text>
							// 				</View>
							// 			)}
							// 		</>
							// 	</ContextMenu.Trigger>
							// 	<ContextMenu.Content>
							// 		<ContextMenu.Preview>
							// 			{item.file.mimeType?.startsWith("image") && (
							// 				<Image
							// 					// @ts-ignore
							// 					source={item.file.url}
							// 					contentFit="cover"
							// 					style={{
							// 						width: widthWindow,
							// 						height: heightWindow / 1.8,
							// 						borderRadius: styles.image.borderRadius,
							// 					}}
							// 				/>
							// 			)}

							// 			{item.file.mimeType?.startsWith("video") && (
							// 				<VideoScreen controls={open} width={widthWindow} height={heightWindow / 1.8} />
							// 			)}
							// 		</ContextMenu.Preview>
							// 		<ContextMenu.Item
							// 			key="download"
							// 			onSelect={async () => {
							// 				if (!item.file || "uri" in item?.file || !item.file.url) return;

							// 				try {
							// 					if (!destination.exists) destination.create();
							// 					const output = await File.downloadFileAsync(item.file.url, destination);
							// 				} catch (error) {
							// 					console.warn(error);
							// 					// Alert.alert(
							// 					// 	i18n[languageCode]("ERROR_GENERIC_PART1"),
							// 					// 	i18n[languageCode]("ERROR_GENERIC_PART2"),
							// 					// );
							// 				}
							// 			}}
							// 		>
							// 			<ContextMenu.ItemTitle>{i18n[languageCode]("DOWNLOAD")}</ContextMenu.ItemTitle>
							// 			<ContextMenu.ItemIcon
							// 				// androidIconName="arrow_down_float"
							// 				ios={{
							// 					name: "arrow.down",
							// 					pointSize: 15,
							// 					weight: "semibold",
							// 					paletteColors: [
							// 						{
							// 							dark: config.theme.extend.colors.primaryLight,
							// 							light: config.theme.extend.colors.primaryLight,
							// 						},
							// 					],
							// 				}}
							// 			/>
							// 		</ContextMenu.Item>
							// 	</ContextMenu.Content>
							// </ContextMenu.Root>
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
								) : // TODO: add video
								item.file.mimeType?.startsWith("image") ? (
									<></>
								) : (
									<View style={styles.image} className="items-center justify-center">
										<Text className="text-center text-white">{i18n[languageCode]("FILE_NOT_SUPPORTED")}</Text>
									</View>
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
