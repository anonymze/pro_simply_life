import { loginQuery } from "@/api/queries/login-queries";
import BackgroundLayout from "@/layouts/background-layout";
import { setStorageFirstCommission } from "@/utils/store";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { FadeInDown, FadeOut, useAnimatedStyle } from "react-native-reanimated";
import { z } from "zod";
import Title from "./ui/title";
import { cn } from "@/utils/cn";

const commissionProviders = [
	{ id: "5034a31a-bb35-4811-bcd9-42b645f036a8", name: "Oradea Vie" },
	{ id: "51878c0f-6536-47f3-93f2-6d99d93740b3", name: "AXA Thema" },
	// Add your 40 providers here
];

const formSchema = z.object(
	Object.fromEntries(
		commissionProviders.map(provider => [provider.id, z.string()])
	)
);

export default function FormCommissionCodes() {
	const { height } = useReanimatedKeyboardAnimation();
	const mutationLogin = useMutation({
		mutationFn: loginQuery,
		onSuccess: async (data) => {
			setStorageFirstCommission(true);
			router.reload();
		},
	});

	const form = useForm({
		defaultValues: Object.fromEntries(
			commissionProviders.map(provider => [provider.id, ""])
		),
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			console.log(value);
		},
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			// transform: [{ translateY: height.value / 3 }],
		};
	});

	return (
		<BackgroundLayout className="pt-safe px-4">
			<Animated.View style={animatedStyle}>
				<Title title="Vos codes commissions" />

				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
					<Text>
						Avant de continuer sur la page de statistiques des commissions, vérifiez vos codes de commissions par
						fournisseur et entrez ceux manquants.
					</Text>

					{commissionProviders.map((provider, idx) => (
						<View key={provider.id} className={cn("w-full gap-3", idx === 0 ? "mt-8" : "mt-4")}>
							<Text className="text-md self-start text-primary">{provider.name}</Text>
							<form.Field name={provider.id}>
								{(field) => (
									<React.Fragment>
										<TextInput
											returnKeyType="done"
											autoCapitalize="none"
											keyboardType="numbers-and-punctuation"
											placeholder="Code de commission unique"
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
					))}

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
							<Animated.Text
								entering={FadeInDown.springify().duration(1200)}
								className="text-center font-semibold text-lg text-white"
							>
								Enregistrer
							</Animated.Text>
						)}
					</Pressable>
				</ScrollView>
			</Animated.View>
		</BackgroundLayout>
	);
}
