import { queryClient } from "@/api/_queries";
import { createChatRoomQuery } from "@/api/queries/chat-room-queries";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { ChatRoom } from "@/types/chat";
import { PaginatedResponse } from "@/types/response";
import { User } from "@/types/user";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { z } from "zod";

export function NewConversation({ currentUser, selectedIds }: { currentUser: User; selectedIds: User["id"][] }) {
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

			router.back();
			router.push({
				pathname: `/chat/[chat]`,
				params: { chat: data.doc.id, title: data.doc.name, description: data.doc.description },
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
				<Text className="text-md self-start text-primary">{i18n[languageCode]("INPUT_NAME_NEW_ROOM")}</Text>
				<form.Field name="name">
					{(field) => (
						<React.Fragment>
							<TextInput
								returnKeyType="done"
								autoCapitalize="none"
								keyboardType="default"
								textContentType="oneTimeCode"
								placeholder="Ex : fournisseurs"
								className="w-full rounded-xl border border-transparent bg-darkGray p-5 placeholder:text-primaryLight focus:border-primaryLight"
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
				<Text className="text-md self-start text-primary">{i18n[languageCode]("INPUT_DESCRIPTION_NEW_ROOM")}</Text>
				<form.Field name="description">
					{(field) => (
						<React.Fragment>
							<TextInput
								multiline={true}
								returnKeyType="done"
								autoCapitalize="none"
								keyboardType="default"
								placeholder="Ex : informations sur les fournisseurs"
								className="min-h-24 w-full rounded-xl border border-transparent bg-darkGray p-5 placeholder:text-primaryLight focus:border-primaryLight"
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
						entering={FadeInDown.springify().duration(300)}
						exiting={FadeOut.duration(300).withCallback((finished) => {})}
					>
						<ActivityIndicator size="small" color="#fff" />
					</Animated.View>
				) : (
					<Animated.Text entering={FadeInDown.springify().duration(300)} className="text-center text-white">
						{i18n[languageCode]("BUTTON_CREATE_ROOM")}
					</Animated.Text>
				)}
			</Pressable>
		</>
	);
}
