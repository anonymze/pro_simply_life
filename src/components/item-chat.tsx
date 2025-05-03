import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { Directory, File, Paths } from "expo-file-system/next";
import { CheckCheckIcon } from "lucide-react-native";
// import * as ContextMenu from "zeego/context-menu";
// import { MessageOptimistic } from "@/types/chat";
import { CheckIcon } from "lucide-react-native";
import { i18n } from "@/i18n/translations";
import { Message } from "@/types/chat";
import { AppUser } from "@/types/user";
import config from "tailwind.config";
import { I18n } from "@/types/i18n";
import { Image } from "expo-image";
import { cn } from "@/utils/cn";
import React from "react";


// import VideoScreen from "./video-screen";


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

export const Item = React.memo(({ firstMessage, item, appUser, stateMessage, languageCode }: ItemProps) => {
	const me = item.app_user.id === appUser?.user.id;
	const optimistic = "optimistic" in item ? true : false;
	const [open, setOpen] = React.useState(false);

	// console.log(item);

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
					placeholderContentFit="contain"
					placeholder={require("@/assets/icons/placeholder_user.svg")}
					source={item.app_user.photo?.url}
					style={{ width: 28, height: 28, borderRadius: 99, objectFit: "contain" }}
				/>
			)}
			<View
				className={cn(
					"flex-shrink flex-row gap-3 rounded-xl p-2.5",
					me ? "bg-greenChat" : "bg-grayChat",
					item.file && "p-1.5",
				)}
			>
				<View className="flex-shrink gap-1">
					{!me && stateMessage.lastMessageUser && (
						<Text className="text-sm font-bold text-primaryLight">{`${item.app_user.firstname} ${item.app_user.lastname}`}</Text>
					)}
					{item.message && <Text className="flex-shrink self-start text-white">{item.message}</Text>}
					{item.file ? (
						optimistic ? (
							<>
								{item.file.mimeType?.startsWith("image") ? (
									<Image
										// @ts-ignore
										source={item.file.uri}
										transition={300}
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
							<>
								{item.file.mimeType?.startsWith("image") ? (
									<Image
										// @ts-ignore
										placeholder={item.file.blurhash}
										placeholderContentFit="cover"
										// @ts-ignore
										source={item.file.url}
										transition={300}
										contentFit="cover"
										style={styles.image}
									/>
								) : // TODO: add video
								item.file.mimeType?.startsWith("image") ? (
									<Image
										// @ts-ignore
										placeholder={item.file.blurhash}
										placeholderContentFit="cover"
										// @ts-ignore
										source={item.file.url}
										transition={300}
										contentFit="cover"
										style={styles.image}
									/>
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
					<Text className="text-xs text-gray-200">
						{new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
					</Text>
					{me &&
						(optimistic ? <CheckIcon size={14} color="#e5e5e5e5" /> : <CheckCheckIcon size={14} color="#55c0ff" />)}
				</View>
			</View>
		</View>
	);
});

// for debugging in react devtools
Item.displayName = "Item";

const styles = StyleSheet.create({
	image: {
		width: 140,
		height: 180,
		borderRadius: 6,
	},
});
