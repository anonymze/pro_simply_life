import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, withSequence, Easing, SharedValue, } from "react-native-reanimated";
import { createMessageQuery, createMessageWithFilesQuery, getMessagesQuery } from "@/api/queries/message-queries";
import { View, TextInput, Text, Platform, TouchableOpacity, Pressable, Alert } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageIcon, PaperclipIcon, SendIcon } from "lucide-react-native";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { UIImagePickerPresentationStyle } from "expo-image-picker";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Message, MessageOptimistic } from "@/types/chat";
import { FlatList } from "react-native-gesture-handler";
import { getStorageUserInfos } from "@/utils/store";
import * as ImagePicker from "expo-image-picker";
import { FlashList } from "@shopify/flash-list";
// import useWebSocket from "@/hooks/use-websocket";
import { useForm } from "@tanstack/react-form";
import { Item } from "@/components/item-chat";
import { queryClient } from "@/api/_queries";
import config from "tailwind.config";
import { cn } from "@/utils/cn";
import React from "react";
import { z } from "zod";

import { MAX_MESSAGES } from "./index";


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Page() {
	const { chat: chatId, title } = useLocalSearchParams<{ chat?: string; title?: string }>();

	const appUser = React.useMemo(() => getStorageUserInfos(), []);

	if (!chatId || !appUser) {
		return <Redirect href="/chat" />;
	}

	const [maxMessages, setMaxMessages] = React.useState(MAX_MESSAGES);
	const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);
	const { height } = useReanimatedKeyboardAnimation();
	const bottomSafeAreaView = useSafeAreaInsets().bottom;
	const translateY = useSharedValue(0);
	const translateX = useSharedValue(0);
	const opacity = useSharedValue(1);

	const mutateMessages = React.useCallback(
		async (newMessage: MessageOptimistic) => {
			// cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["messages", chatId, maxMessages] });

			// snapshot the previous value
			const previousMessages = queryClient.getQueryData(["messages", chatId, maxMessages]);

			if (newMessage.file) {
				const newMessages = newMessage.file.map((file) => ({
					...newMessage,
					id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
					file: file,
				}));

				// optimistically update to the new value
				queryClient.setQueryData(["messages", chatId, maxMessages], (old: Message[]) => {
					return [...newMessages, ...old];
				});
			} else {
				// optimistically update to the new value
				queryClient.setQueryData(["messages", chatId, maxMessages], (old: Message[]) => {
					return [newMessage, ...old];
				});
			}

			// return old messages before optimistic update for the context in onError
			return previousMessages;
		},
		[chatId, maxMessages],
	);

	const mutationMessages = useMutation({
		mutationFn: createMessageQuery,
		// when mutate is called:
		onMutate: mutateMessages,
		// if the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			Alert.alert(i18n[languageCode]("ERROR_GENERIC_PART1"), err.message);
			queryClient.setQueryData(["messages", chatId, maxMessages], context);
		},
		// always refetch after error or success:
		onSettled: () => {
			// if you are on settled the mutation is still in pending status
			// so we check if we have more than 1 mutation then we don't invalidate the query
			const pendingMutations = queryClient
				.getMutationCache()
				.getAll()
				.filter((mutation) => mutation.state.status === "pending");

			if (pendingMutations.length > 1) return;
			queryClient.invalidateQueries({ queryKey: ["messages", chatId, maxMessages] });
		},
	});

	const mutationMessagesFile = useMutation({
		mutationFn: createMessageWithFilesQuery,
		onMutate: mutateMessages,
		onError: (err, newMessage, context) => {
			Alert.alert(i18n[languageCode]("ERROR_GENERIC_PART1"), err.message);
			queryClient.setQueryData(["messages", chatId, maxMessages], context);
		},
		onSettled: () => {
			const pendingMutations = queryClient
				.getMutationCache()
				.getAll()
				.filter((mutation) => mutation.state.status === "pending");

			if (pendingMutations.length > 1) return;
			queryClient.invalidateQueries({ queryKey: ["messages", chatId, maxMessages] });
		},
	});

	const { data: messages, isLoading: loadingMessages } = useQuery({
		queryKey: ["messages", chatId, maxMessages],
		queryFn: getMessagesQuery,
		placeholderData: (prev) => prev,
		structuralSharing: false,
		refetchInterval: () => {
			// pause refetching while a message is being sent
			if (mutationMessages.isPending || mutationMessagesFile.isPending) return false;
			return 6000;
		},
		select: (data) => {
			return data;
		},
	});

	const formSchema = React.useMemo(
		() =>
			z.object({
				// prevent only white spaces
				message: z.string().regex(/.*\S.*/),
			}),
		[],
	);

	const form = useForm({
		defaultValues: {
			message: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			translateX.value = withSequence(
				withTiming(-5, {
					duration: 300,
					easing: Easing.bezier(0.25, 0.1, 0.25, 1),
				}),
				// cubic
				withTiming(75, { easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
			);
			translateY.value = withSequence(
				withTiming(5, {
					duration: 300,
					easing: Easing.bezier(0.25, 0.1, 0.25, 1),
				}),
				// ease
				withTiming(-75, { easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
			);
			opacity.value = withTiming(0, { easing: Easing.bezier(0, 0.1, 0, 0.1), duration: 600 }, (finished) => {
				if (finished) {
					translateY.value = 0;
					translateX.value = 0;
					opacity.value = withTiming(1, { duration: 350 });
				}
			});

			form.reset();

			// we have to set an id otherwise the list will not have a key extractor, and a date to show
			mutationMessages.mutate({
				id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
				app_user: appUser.user,
				chat_room: chatId,
				message: value.message,
				createdAt: new Date().toISOString(),
				// we flag it to show it as a pending message
				optimistic: true,
			});
		},
	});

	const pickImage = React.useCallback(async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images", "videos"],
			allowsEditing: false,
			aspect: [1, 1],
			quality: 0.4,
			allowsMultipleSelection: true,
			presentationStyle: UIImagePickerPresentationStyle.POPOVER,
		});

		if (result.canceled) return;

		mutationMessagesFile.mutate({
			// id is set later (to have differents ids for each file)
			id: "",
			app_user: appUser.user,
			chat_room: chatId,
			// following the order of the files selected
			file: result.assets.reverse(),
			createdAt: new Date().toISOString(),
			// we flag it to show it as a pending message
			optimistic: true,
		});
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		const spacing = 12;
		return {
			transform: [{ translateY: height.value ? height.value + bottomSafeAreaView - spacing : 0 }],
			// otherwise the top of the list is cut
			marginTop: height.value ? -(height.value + bottomSafeAreaView - spacing) : 0,
		};
	});

	const handleSubmit = React.useCallback(() => {
		// delay to the next frame to avoid autocorrect messing up
		requestAnimationFrame(() => {
			form.handleSubmit();
		});
	}, [form]);

	return (
		<BackgroundLayout className="px-6">
			<TitleHeader title={title} />
			{/* <View className={cn("absolute left-4 top-4 size-4 bg-red-500", websocketConnected && "bg-green-500")} /> */}
			<Animated.View className="flex-1" style={animatedStyle}>
				<View className="flex-1">
					{!!messages?.length ? (
						<FlashList
							contentContainerStyle={{}}
							// ListEmptyComponent={() => {
							// 	return (
							// 		<View className="flex-1 items-center justify-center">
							// 			<Text className="text-gray-500">Pas de message</Text>
							// 		</View>
							// 	);
							// }}
							// drawDistance={300}
							keyExtractor={(item) => item.id}
							showsVerticalScrollIndicator={false}
							data={messages}
							inverted={true}
							estimatedItemSize={50}
							renderItem={({ item, index }) => {
								const lastMessageUser = messages[index + 1]?.app_user.id !== item.app_user.id;
								const newMessageUser = messages[index - 1]?.app_user.id !== item.app_user.id;
								return (
									<Item
										key={item.id}
										languageCode={languageCode}
										stateMessage={{
											lastMessageUser,
											newMessageUser,
										}}
										firstMessage={index === 0 ? true : false}
										item={item}
										appUser={appUser}
									/>
								);
							}}
							// don't invert on empty list
							// inverted={true}

							// disableRecycling={true}
							onEndReached={() => {
								// add more messages when on end scroll
								if (!!messages.length && messages.length >= maxMessages) {
									setMaxMessages((props) => props + 20);
								}
							}}
							onEndReachedThreshold={0.1}
						/>
					) : (
						<View className="flex-1 items-center justify-center">
							{loadingMessages ? (
								<Text className="text-sm text-defaultGray">Chargement...</Text>
							) : (
								<Text className="text-sm text-defaultGray">Pas de message</Text>
							)}
						</View>
					)}

					<View className="flex-row items-center gap-0.5">
						<View className={cn("mb-3 flex-shrink flex-row items-center rounded-xl border border-lightGray")}>
							<form.Field name="message">
								{(field) => (
									<TextInput
										placeholderTextColor={config.theme.extend.colors.lightGray}
										returnKeyType="default"
										autoCapitalize="none"
										keyboardType="default"
										submitBehavior="newline"
										multiline={true}
										placeholder={`${i18n[languageCode]("MESSAGE")}...`}
										className="flex-1 p-3 pr-0"
										onChangeText={field.handleChange}
										defaultValue={field.state.value}
									/>
								)}
							</form.Field>
							<Actions pickImage={pickImage} />
						</View>
						<SendButton
							handleSubmit={handleSubmit}
							loadingMessages={loadingMessages}
							opacity={opacity}
							translateX={translateX}
							translateY={translateY}
						/>
					</View>
				</View>
			</Animated.View>
		</BackgroundLayout>
	);
}

// const onMessageWebsocket = (event: any) => {
// 	const { data, success } = messageReceivedSchema.safeParse(JSON.parse(event));
// 	if (!success) return;

// 	queryClient.invalidateQueries({ queryKey: ["messages", chatId, maxMessages] });
// };

// const websocketConnected = useWebSocket(chatId, onMessageWebsocket);

const SendButton = React.memo(
	({
		handleSubmit,
		loadingMessages,
		opacity,
		translateX,
		translateY,
	}: {
		handleSubmit: () => void;
		loadingMessages: boolean;
		opacity: SharedValue<number>;
		translateX: SharedValue<number>;
		translateY: SharedValue<number>;
	}) => {
		return (
			<AnimatedPressable
				onPress={handleSubmit}
				disabled={loadingMessages}
				style={{
					opacity: loadingMessages ? 0.5 : opacity,
					transform: [{ translateX }, { translateY }],
				}}
				className={cn("p-1.5 pr-0", Platform.OS === "android" && "mb-3")}
			>
				<SendIcon size={20} color={config.theme.extend.colors.primaryLight} />
			</AnimatedPressable>
		);
	},
);

const Actions = React.memo(({ pickImage }: { pickImage: () => void }) => {
	return (
		<>
			<TouchableOpacity
				onPress={() => {
					pickImage();
				}}
				className="px-2 py-2.5"
			>
				<ImageIcon size={18} color={config.theme.extend.colors.primaryLight} />
			</TouchableOpacity>
			<TouchableOpacity onPress={() => {}} className="py-2.5 pl-2 pr-2.5">
				<PaperclipIcon size={17} color={config.theme.extend.colors.primaryLight} />
			</TouchableOpacity>
		</>
	);
});

const TitleHeader = React.memo(({ title }: { title: string | undefined }) => {
	return <Stack.Screen options={{ title }} />;
});
