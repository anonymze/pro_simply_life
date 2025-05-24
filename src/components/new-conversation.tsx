import { ActivityIndicator, Pressable, Text, View, TextInput, Alert } from "react-native";
import Animated, { FadeInDown, FadeOut, runOnJS } from "react-native-reanimated";
import { createChatRoomQuery } from "@/api/queries/chat-room-queries";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { PaginatedResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { queryClient } from "@/api/_queries";
import { ChatRoom } from "@/types/chat";
import { router } from "expo-router";
import { User } from "@/types/user";
import React from "react";
import { z } from "zod";


export function NewConversation({ 
	currentUser,
	selectedIds,
}: { 
	currentUser: User;
	selectedIds: User["id"][];
}) {
	const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);

	const mutationChatRoom = useMutation({
		mutationFn: createChatRoomQuery,
		onError: (error) => {
			Alert.alert(i18n[languageCode]("ERROR_GENERIC_PART1"), i18n[languageCode]("ERROR_GENERIC_PART2"));
		},
		onSuccess: async (data) => {
			queryClient.setQueryData(["chat-rooms"], (prev: PaginatedResponse<ChatRoom>) => {
				return {
					...prev,
					docs: [data.doc, ...prev.docs],
				};
			});
		},
	});

	const formSchema = React.useMemo(
		() =>
			z.object({
				name: z
					.string()
					.trim()
					.min(2, {
						message: i18n[languageCode]("ERROR_INPUT_MIN_LENGTH"),
					}),
				description: z.string().trim(),
			}),
		[],
	);

	const form = useForm({
		defaultValues: {
			name: "",
			description: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			mutationChatRoom.mutate({
				...value,
				app_user: currentUser.id,
				guests: selectedIds,
				color: null,
			});
		},
	});

	return (
		<>
			<View className="w-full gap-3">
				<Text className="text-md self-start text-gray-500">{i18n[languageCode]("INPUT_NAME_NEW_ROOM")}</Text>
				<form.Field name="name">
					{(field) => (
						<React.Fragment>
							<TextInput
								returnKeyType="done"
								autoCapitalize="none"
								keyboardType="default"
								textContentType="oneTimeCode"
								placeholder="Ex : fournisseurs"
								className="w-full rounded-lg bg-defaultGray/15 p-5 text-dark placeholder:text-defaultGray/75 border border-transparent focus:border-primary"
								defaultValue={field.state.value}
								onChangeText={field.handleChange}
							/>
							{field.state.meta.errors.length > 0 && (
								<Text className="text-sm text-red-500">{field.state.meta.errors[0]?.message}</Text>
							)}
						</React.Fragment>
					)}
				</form.Field>
			</View>
			<View className="mt-3 w-full gap-3">
				<Text className="text-md self-start text-gray-500">{i18n[languageCode]("INPUT_DESCRIPTION_NEW_ROOM")}</Text>
				<form.Field name="description">
					{(field) => (
						<React.Fragment>
							<TextInput
								multiline={true}
								returnKeyType="done"
								autoCapitalize="none"
								keyboardType="default"
								placeholder="Ex : informations sur les fournisseurs"
								className="min-h-24 w-full rounded-lg border border-transparent bg-defaultGray/15 p-5 text-dark placeholder:text-defaultGray/75 focus:border-primary"
								defaultValue={field.state.value}
								onChangeText={field.handleChange}
							/>
						</React.Fragment>
					)}
				</form.Field>
			</View>
			<Pressable
				onPress={form.handleSubmit}
				disabled={mutationChatRoom.isPending}
				className="mt-4 h-14 w-full items-center justify-center rounded-lg bg-primary disabled:opacity-70"
			>
				{mutationChatRoom.isPending ? (
					<Animated.View
						entering={FadeInDown.springify().duration(1200)}
						exiting={FadeOut.duration(300).withCallback((finished) => {
							if (finished) {
								runOnJS(router.back)();
							}
						})}
					>
						<ActivityIndicator size="small" color="white" />
					</Animated.View>
				) : (
					<Animated.Text entering={FadeInDown.springify().duration(1200)} className="text-center text-white">
						{i18n[languageCode]("BUTTON_CREATE_ROOM")}
					</Animated.Text>
				)}
			</Pressable>
		</>
	);
}
