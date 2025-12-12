import { getAppUserQuery, getAppUsersProfilQuery } from "@/api/queries/app-user-queries";
import { Brochure } from "@/components/brochure";
import { BrochureExcel } from "@/components/brochure-excel";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { getStorageUserInfos } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import config from "tailwind.config";

export default function Page() {
	const appUser = getStorageUserInfos();
	const insets = useSafeAreaInsets();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["app-user", appUser?.user.id],
		queryFn: getAppUserQuery,
		enabled: !!appUser?.user.id,
	});

	const { data: appUsersProfil, isLoading: isLoadingProfil } = useQuery({
		queryKey: ["app-user-profil", appUser?.user.id],
		queryFn: getAppUsersProfilQuery,
		enabled: !!appUser?.user.id,
	});

	if (isError) {
		return (
			<View className="flex-1 items-center justify-center">
				<Text className="text-sm text-defaultGray">Erreur</Text>
			</View>
		);
	}

	if (isLoading) {
		return (
			<ActivityIndicator
				className="absolute bottom-0 left-0 right-0 top-0"
				size="large"
				color={config.theme.extend.colors.primary}
			/>
		);
	}

	if (!data) return;

	const appUserProfil = appUsersProfil?.docs[0];

	return (
		<BackgroundLayout style={{ paddingTop: insets.top }}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 10 }}
			>
				<View className="items-center rounded-b-2xl bg-white pb-4 pt-4">
					<ImagePlaceholder
						transition={300}
						contentFit="cover"
						placeholder={data.photo?.blurhash}
						placeholderContentFit="cover"
						source={data.photo?.url}
						// contentPosition="top"
						style={{ width: 150, height: 150, borderRadius: 99 }}
					/>
					<View className="mt-1 items-center gap-3">
						<Text className="text-xl font-bold">{data.firstname + " " + data.lastname}</Text>
					</View>
				</View>
				<View className="mt-4 px-4">
					<ContactInfo phone={data.phone} email={data.email} emailPro={data.email_pro} />
				</View>
				<View className="mt-4 px-4">
					<Text className="text-lg font-semibold text-primary">Mes fichiers déposés :</Text>
					<View className="mt-4 gap-3">
						{isLoadingProfil ? (
							<ActivityIndicator size="small" color={config.theme.extend.colors.primary} />
						) : !appUserProfil?.files?.length ? (
							<Text className="text-sm text-defaultGray text-center mt-3">Aucun fichier déposé</Text>
						) : (
							appUserProfil?.files?.map((file) => {
								const isNotOpenable =
									!file.file.mimeType?.startsWith("application/pdf") && !file.file.mimeType?.startsWith("image/");
								const isImage = file.file.mimeType?.startsWith("image/");

								if (isNotOpenable) {
									return (
										<BrochureExcel
											key={file.id}
											title="Fichier"
											brochure={file.file}
											updatedAt={appUserProfil.updatedAt}
										/>
									);
								}

								return (
									<Brochure
										key={file.id}
										title="Fichier"
										brochure={file.file}
										updatedAt={appUserProfil.updatedAt}
										link={
											isImage
												? {
														pathname: "/(tabs)/profil/image/[image]",
														params: {
															image: file.file.filename || "",
														},
													}
												: {
														pathname: "/(tabs)/profil/pdf/[pdf]",
														params: {
															pdf: file.file.filename || "",
														},
													}
										}
									/>
								);
							})
						)}
					</View>
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}

const ContactInfo = ({
	phone,
	email,
	emailPro,
}: {
	phone?: string | null;
	email?: string | null;
	emailPro?: string | null;
}) => {
	const numbersString = phone?.replace(",", " / ");

	return (
		<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Téléphone</Text>
					<Text className="text-base font-semibold text-primary">{numbersString}</Text>
				</View>
			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">E-mail</Text>
					<Text className="text-base font-semibold text-primary">{emailPro ? emailPro : email}</Text>
				</View>
			</View>
		</View>
	);
};
