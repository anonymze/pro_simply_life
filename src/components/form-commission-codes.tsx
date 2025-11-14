import { createAppUserCommissionCodeQuery, getAppUserCommissionCodesQuery } from "@/api/queries/commission-queries";
import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/cn";
import { getStorageUserInfos, setStorageFirstCommission } from "@/utils/store";
import { LegendList } from "@legendapp/list";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { FadeInDown, FadeOut, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import config from "tailwind.config";
import { z } from "zod";
import Title from "./ui/title";

interface CommissionCodeInputProps {
	provider: { id: string; name: string };
	index: number;
	form: any;
}

function CommissionCodeInput({ provider, index, form }: CommissionCodeInputProps) {
	const lastProviderId = React.useRef(provider.id);

	if (provider.id !== lastProviderId.current) {
		lastProviderId.current = provider.id;
	}

	return (
		<View className={cn("mt-4 w-full gap-3", index === 0 && "mt-0")}>
			<Text className="text-md self-start text-primary">{provider.name}</Text>
			<form.Field name={provider.id} key={provider.id}>
				{(field: any) => (
					<React.Fragment>
						<TextInput
							key={`${provider.id}-input`}
							returnKeyType="done"
							autoCapitalize="none"
							keyboardType="numbers-and-punctuation"
							placeholder="Sous code"
							autoCorrect={false}
							className="w-full rounded-xl border border-transparent bg-darkGray p-5 placeholder:text-primaryLight focus:border-primaryLight"
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
	);
}

export default function FormCommissionCodes() {
    const insets = useSafeAreaInsets();
	const { height } = useReanimatedKeyboardAnimation();
	const appUser = getStorageUserInfos();

	if (!appUser) return;

	const {
		data: userCommissionCodes,
		isLoading: userCommissionCodesLoading,
		error,
	} = useQuery({
		queryKey: ["userCommissionCodes"],
		queryFn: getAppUserCommissionCodesQuery,
	});

	const mutation = useMutation({
		mutationFn: createAppUserCommissionCodeQuery,
		onSuccess: async (_) => {
			setStorageFirstCommission(true);
			router.replace("/(tabs)/commissions");
		},
		onError: (error) => {
			Alert.alert("Erreur lors de la création des codes. Un des codes a peut être déjà été utilisé.");
		},
	});

	const form = useForm({
		defaultValues: Object.fromEntries(
			commissionProviders.map((provider) => {
				const existingCode = userCommissionCodes?.docs?.[0]?.code?.find(
					(codeItem) => codeItem.supplier?.id === provider.id,
				);
				return [provider.id, existingCode?.code || ""];
			}),
		),
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			const transformedData = {
				app_user: appUser.user.id,
				code: Object.entries(value)
					.filter(([_, code]) => code.trim() !== "")
					.map(([supplierId, code]) => ({
						code,
						supplier: supplierId,
					})),
			};
			mutation.mutate(transformedData);
		},
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: height.value / 2.5 }],
		};
	});

	return (
		<BackgroundLayout className="px-4" style={{ paddingTop: insets.top }}>
			<Animated.View style={[animatedStyle, { flex: 1 }]}>
				<Title title="Vos codes commissions" />

				<Text>
					Avant de continuer sur la page de statistiques des commissions, vérifiez vos codes de commissions par
					fournisseur et entrez ceux manquants.
				</Text>

				{userCommissionCodesLoading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size={"large"} color={config.theme.extend.colors.primary} />
					</View>
				) : (
					<LegendList
						data={commissionProviders}
						showsVerticalScrollIndicator={false}
						// contentContainerStyle={{ paddingBottom: 16 }}
						className="mt-6"
						renderItem={({ item: provider, index }) => (
							<CommissionCodeInput provider={provider} index={index} form={form} />
						)}
					/>
				)}
			</Animated.View>
			<Pressable
				onPress={form.handleSubmit}
				disabled={mutation.isPending}
				className="mb-6 mt-6 h-14 w-full items-center justify-center rounded-xl bg-primary disabled:opacity-70"
			>
				{mutation.isPending ? (
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
		</BackgroundLayout>
	);
}
// soirée
const commissionProviders = [
	{ id: "a5d3ab30-996b-4e2e-b4d1-b04cf75a0f5f", name: "123 Investment Managers" },
	{ id: "dd3e5348-4113-422d-9c46-7b6776e3b773", name: "Alderan" },
	{ id: "6ad6bef3-d413-4b82-835f-4a8d4c3da1d4", name: "April" },
	{ id: "1f1b83f1-e9b4-499b-a58d-3cff9663251b", name: "Arkea" },
	{ id: "0e9f1d1e-c9a7-401e-aec6-3afbdbfca33e", name: "Atland Voisin" },
	{ id: "63a0524b-f229-4afa-88ef-49e568efd730", name: "AXA Banque" },
	{ id: "51878c0f-6536-47f3-93f2-6d99d93740b3", name: "AXA Wealth Digital" },
	{ id: "1df031fb-7ede-483a-aba8-ea986816da48", name: "AXA Wealth Europe" },
	{ id: "e0f8cb69-08b1-49b7-9115-cf53a0242bf4", name: "Cardif" },
	{ id: "fd6cdb64-a0ea-4896-b99e-0c1ad2b78c60", name: "Cardif Luxembourg" },
	{ id: "3481cfd8-7557-4492-8d49-51ceee4c87b6", name: "Corum" },
	{ id: "7635799d-fa88-46e4-aac8-5202eb4d839a", name: "Epsicad" },
	{ id: "e700d5a5-4003-4692-ac71-67579b819f8b", name: "Eres" },
	{ id: "4eec0017-c5ec-4355-8362-a9f12ac5fa3d", name: "Euryale" },
	{ id: "95a6fec3-4c1a-4bdb-97c6-0ed9042fe02e", name: "Generali Patrimoine" },
	{ id: "e07a3d19-eb73-4e6f-8f68-9c042523ce8f", name: "Inter Gestion Reim" },
	{ id: "1581910e-c62d-4289-a495-af725ef0208e", name: "Iroko" },
	{ id: "7afc882b-b3de-42cf-a59c-be7426ab8d2c", name: "La française" },
	{ id: "19f99bc1-181f-4bdc-8c63-0b73f748ea0e", name: "MNK" },
	{ id: "26e58f78-1af6-4036-adff-515a93ae8702", name: "My consultim" },
	{ id: "fb278d5e-5360-471d-b1ac-ccacaed9aca9", name: "Norma capital" },
	{ id: "4871f56d-4a11-4dea-8b57-673587bce7e3", name: "Novaxia" },
	{ id: "833e617a-e637-45bb-a838-80d7ecc5cb03", name: "ODDO BHF" },
	{ id: "5034a31a-bb35-4811-bcd9-42b645f036a8", name: "Oradea Vie" },
	{ id: "838f328c-dc00-4bb8-a064-d6ecb3c002fa", name: "UAF LIFE" },
	{ id: "8a5f6045-f6e8-4d44-bca2-ed81c003b96a", name: "Perial" },
	{ id: "1d7461b1-38da-4c11-8987-3fbee7de506b", name: "Primonial" },
	{ id: "917d444b-1037-4e61-8c85-4c9ddee1e760", name: "Remake" },
	{ id: "54ac7c62-dfab-4cfc-b404-8540da13481a", name: "Sofidy" },
	{ id: "91879698-6615-4917-9be7-79660d7a2159", name: "Sogelife" },
	{ id: "5751b326-135c-4cd2-b615-b864b5c82eab", name: "Suravenir" },
	{ id: "7c1711bf-518e-4643-b314-153cd7163f17", name: "Swiss Life" },
	{ id: "19bb9991-9e71-4995-8533-04066de17e0e", name: "Swiss Life Luxembourg" },
	{ id: "cb5011bd-e427-4dcd-949a-d966ffac29c3", name: "Urban Premium" },
	// { id: "1f2fc416-f162-400e-9c81-fdb6f038cc2e", name: "Vie +" },
	{ id: "115f3c48-802b-4b07-b496-b7381a471779", name: "Wealins" },
];

const formSchema = z.object(
	Object.fromEntries(
		commissionProviders.map((provider) => [
			provider.id,
			z.string().nonempty({
				message: "Ce champ est obligatoire",
			}),
		]),
	),
);
