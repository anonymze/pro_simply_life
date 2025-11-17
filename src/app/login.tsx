import { forgotPasswordQuery, loginQuery } from "@/api/queries/login-queries";
import { useSonnerRN } from "@/components/sonner/context/sonner-context";
import { useNotification } from "@/context/push-notifications";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import BackgroundLayout from "@/layouts/background-layout";
import { VERSION_NUMBER } from "@/utils/helper";
import { setStorageFirstLogin, setStorageUserInfos } from "@/utils/store";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { FadeInDown, FadeOut, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import config from "tailwind.config";
import { z } from "zod";

export default function Page() {
	const { toast } = useSonnerRN();
	const insets = useSafeAreaInsets();
	const { expoPushToken } = useNotification();
	const { height } = useReanimatedKeyboardAnimation();
	const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);
	const [showPassword, setShowPassword] = React.useState(false);
	const emailInputRef = React.useRef<TextInput>(null);
	const passwordInputRef = React.useRef<TextInput>(null);

	const formSchema = React.useMemo(
		() =>
			z.object({
				email: z.string().email({
					message: i18n[languageCode]("ERROR_EMAIL_INVALID"),
				}),
				password: z.string().min(8, {
					message: i18n[languageCode]("ERROR_PASSWORD_MIN_LENGTH"),
				}),
			}),
		[],
	);

	const mutationLogin = useMutation({
		mutationFn: loginQuery,
		onError: (error) => {
			console.log(error);
			Alert.alert(i18n[languageCode]("ERROR_LOGIN"), i18n[languageCode]("ERROR_LOGIN_MESSAGE"));
		},
		onSuccess: async (data) => {
			setStorageUserInfos(data);
			if (true) {
				setStorageFirstLogin(true);
				toast("Bienvenue dans Simply Life !", {
					description: "Appuyer sur cette notification pour découvrir notre présentation.",
					action: {
						label: "Voir",
						onPress: () => {
							router.push("/(tabs)/help");
						},
					},
				});
			}
			router.replace("/(tabs)");
		},
	});

	const mutationForgotPassword = useMutation({
		mutationFn: forgotPasswordQuery,
		onError: (error) => {
			console.log(error);
			// Alert.alert("Une erreur est survenue, contactez l'administrateur.");
		},
		// onSuccess: async (data) => {
		// },
	});

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
		<BackgroundLayout className="m-6" style={{ paddingTop: insets.top }}>
			<Animated.View className="flex-1 justify-center gap-3" style={animatedStyle}>
				<Image source={require("@/assets/images/logo.png")} style={{ height: 80, width: 80 }} contentFit="contain" />
				<Text className="mt-2 max-w-[90%] text-start text-lg font-semibold text-primary">
					{i18n[languageCode]("SUBTITLE_LOGIN")}
				</Text>

				<View className="mt-4 w-full gap-3">
					<Text className="text-md self-start text-primary">{i18n[languageCode]("INPUT_EMAIL_LOGIN")}</Text>
					<form.Field name="email">
						{(field) => (
							<React.Fragment>
								<TextInput
									ref={emailInputRef}
									testID="email-input"
									returnKeyType="done"
									autoCapitalize="none"
									keyboardType="email-address"
									textContentType="oneTimeCode"
									placeholder="exemple@email.fr"
									autoCorrect={false}
									className="w-full rounded-xl border border-transparent  bg-darkGray  p-5 placeholder:text-primaryLight focus:border-primaryLight"
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
								<View className="relative">
									<TextInput
										ref={passwordInputRef}
										testID="password-input"
										secureTextEntry={!showPassword}
										returnKeyType="done"
										autoCapitalize="none"
										keyboardType="default"
										textContentType="oneTimeCode"
										placeholder="**********"
										className="w-full rounded-xl border border-transparent bg-darkGray p-5 pr-12 placeholder:text-primaryLight focus:border-primaryLight"
										defaultValue={field.state.value}
										onChangeText={field.handleChange}
									/>
									<Pressable
										onPress={() => setShowPassword(!showPassword)}
										className="absolute right-4 top-1/2 -translate-y-1/2"
										hitSlop={10}
									>
										<Ionicons
											name={showPassword ? "eye-off" : "eye"}
											size={20}
											color={config.theme.extend.colors.primaryLight}
										/>
									</Pressable>
								</View>

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
						<Animated.View entering={FadeInDown.springify(300)} exiting={FadeOut.duration(300)}>
							<ActivityIndicator size="small" color="white" />
						</Animated.View>
					) : (
						<Animated.Text
							entering={FadeInDown.springify(300)}
							className="text-center text-lg font-semibold text-white"
						>
							{i18n[languageCode]("BUTTON_LOGIN")}
						</Animated.Text>
					)}
				</Pressable>

				<TouchableOpacity
					onPress={async () => {
						await form.validateField("email", "submit");
						form.resetField("password");

						if (form.getFieldMeta("email")?.isValid) {
							mutationForgotPassword.mutate(form.getFieldValue("email"));
							form.reset();
							Alert.alert(
								"Un email pour réinitialiser votre mot de passe vient d'être envoyé. Si vous n'avez rien reçu c'est que cet email n'existe pas chez nous.",
							);

							emailInputRef.current?.blur();
							passwordInputRef.current?.blur();
						}
					}}
					className="mt-4"
					hitSlop={6}
				>
					<Animated.Text
						entering={FadeInDown.springify().duration(800)}
						className="text-center text-sm font-semibold text-primaryLight underline"
					>
						Mot de passe oublié ?
					</Animated.Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => {
						WebBrowser.openBrowserAsync("https://rgpd-and-confidentiality.vercel.app/simply_life/rgpd.html");
					}}
					className="mt-4"
					hitSlop={6}
				>
					<Text className="text-center text-xs font-semibold text-primaryLight underline">
						Politique de confidentialité
					</Text>
				</TouchableOpacity>

				<Text className="mt-1 text-center text-xs text-primaryLight">Version {VERSION_NUMBER}</Text>
			</Animated.View>
		</BackgroundLayout>
	);
}
