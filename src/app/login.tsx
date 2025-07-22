import Animated, { FadeInDown, FadeOut, FadeOutUp, useAnimatedStyle } from "react-native-reanimated";
import { ActivityIndicator, Alert, Pressable, Text, View, TextInput } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { useNotification } from "@/context/push-notifications";
import BackgroundLayout from "@/layouts/background-layout";
import { loginQuery } from "@/api/queries/login-queries";
import { useMutation } from "@tanstack/react-query";
import { setStorageUserInfos } from "@/utils/store";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import { Image } from "expo-image";
import React from "react";
import { z } from "zod";


export default function Page() {
	const { expoPushToken } = useNotification();
	const { height } = useReanimatedKeyboardAnimation();
	const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);
	const mutationLogin = useMutation({
		mutationFn: loginQuery,
		onError: (error) => {
			console.log(error);
			Alert.alert(i18n[languageCode]("ERROR_LOGIN"), i18n[languageCode]("ERROR_LOGIN_MESSAGE"));
		},
		onSuccess: async (data) => {
			setStorageUserInfos(data);
			router.replace("/(tabs)");
		},
	});

	const formSchema = React.useMemo(
		() =>
			z.object({
				email: z.string().email({
					message: i18n[languageCode]("ERROR_EMAIL_INVALID"),
				}),
				password: z.string().min(10, {
					message: i18n[languageCode]("ERROR_PASSWORD_MIN_LENGTH"),
				}),
			}),
		[],
	);

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => mutationLogin.mutate({ ...value, expoPushToken }),
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: height.value / 1.4 }],
		};
	});

	return (
		<BackgroundLayout className="p-6">
			<Animated.View className="flex-1 justify-center gap-3" style={animatedStyle}>
				<Image source={require("@/assets/images/logo.png")} style={{ height: 80, width: 80 }} contentFit="contain" />
				<Text className="font-medium text-lg text-primary max-w-[90%] text-start mt-4">{i18n[languageCode]("SUBTITLE_LOGIN")}</Text>

				<View className="mt-8 w-full gap-3">
					<Text className="text-md self-start text-primary">{i18n[languageCode]("INPUT_EMAIL_LOGIN")}</Text>
					<form.Field name="email">
						{(field) => (
							<React.Fragment>
								<TextInput
									testID="email-input"
									returnKeyType="done"
									autoCapitalize="none"
									keyboardType="email-address"
									textContentType="oneTimeCode"
									placeholder="exemple@email.fr"
									autoCorrect={false}
									className="w-full rounded-xl bg-darkGray p-5 placeholder:text-primaryLight0 border border-transparent focus:border-primaryLight"
									defaultValue={field.state.value}
									onChangeText={field.handleChange}
								/>
								{field.state.meta.errors.length > 0 && (
									<Text className="text-red-500">{field.state.meta.errors[0]?.message}</Text>
								)}
							</React.Fragment>
						)}
					</form.Field>
				</View>

				<View className="mt-3 w-full gap-3">
					<Text className="text-md self-start text-primary">{i18n[languageCode]("INPUT_PASSWORD_LOGIN")}</Text>
					<form.Field name="password">
						{(field) => (
							<React.Fragment>
								<TextInput
									testID="password-input"
									secureTextEntry
									returnKeyType="done"
									autoCapitalize="none"
									keyboardType="default"
									textContentType="oneTimeCode"
									placeholder="**********"
									className="w-full rounded-xl bg-darkGray p-5 placeholder:text-primaryLight0 border border-transparent focus:border-primaryLight"
									defaultValue={field.state.value}
									onChangeText={field.handleChange}
								/>
								{field.state.meta.errors.length > 0 && (
									<Text className="text-red-500">{field.state.meta.errors[0]?.message}</Text>
								)}
							</React.Fragment>
						)}
					</form.Field>
				</View>
				<Pressable
					testID="login-button"
					onPress={form.handleSubmit}
					disabled={mutationLogin.isPending}
					className="mt-4 h-14 w-full items-center justify-center rounded-xl bg-primary disabled:opacity-70"
				>
					{mutationLogin.isPending ? (
						<Animated.View entering={FadeInDown.springify().duration(1200)} exiting={FadeOut.duration(300)}>
							<ActivityIndicator size="small" color="white" />
						</Animated.View>
					) : (
						<Animated.Text entering={FadeInDown.springify().duration(1200)} className="text-center text-white font-semibold text-lg">
							{i18n[languageCode]("BUTTON_LOGIN")}
						</Animated.Text>
					)}
				</Pressable>
			</Animated.View>
		</BackgroundLayout>
	);
}
