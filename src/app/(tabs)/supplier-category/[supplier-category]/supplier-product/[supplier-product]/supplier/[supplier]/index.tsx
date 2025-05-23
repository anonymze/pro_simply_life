import { ArrowRight, ChevronRight, Download, EyeIcon, FileIcon, KeyRoundIcon, LinkIcon, MailIcon, PhoneIcon, } from "lucide-react-native";
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { HrefObject, Link, router, useLocalSearchParams } from "expo-router";
import { getSupplierQuery } from "@/api/queries/supplier-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { downloadFile, getFile } from "@/utils/download";
import { useQuery } from "@tanstack/react-query";
import { Supplier } from "@/types/supplier";
import type { Media } from "@/types/media";
import { Picker } from "@expo/ui/swift-ui";
import config from "tailwind.config";
import React from "react";


export default function Page() {
	const horizontalScrollRef = React.useRef<ScrollView>(null);
	const verticalScrollRef = React.useRef<ScrollView>(null);

	const {
		supplier: supplierId,
		"supplier-product": supplierProductId,
		"supplier-category": supplierCategoryId,
		"supplier-category-name": supplierCategoryName,
		"supplier-product-name": supplierProductName,
	} = useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["supplier", supplierId],
		queryFn: getSupplierQuery,
		enabled: !!supplierId,
	});

	if (!data) return null;

	const hasMoreInformation = Object.values(data.other_information).some(Boolean);

	return (
		<>
			<View className="items-center rounded-b-2xl bg-white pb-4">
				<View className="mb-4 flex-row items-center gap-2">
					<Text className="font-semibold text-sm text-primary ">{supplierCategoryName}</Text>
					<ChevronRight size={14} color={config.theme.extend.colors.primary} />
					<Text className="font-semibold text-sm text-primary">{supplierProductName}</Text>
				</View>
				<ImagePlaceholder
					transition={300}
					contentFit="contain"
					placeholder={data.logo_full?.blurhash}
					source={data.logo_full?.url}
					style={{ width: "95%", height: 60 }}
				/>
				<View className="mt-4 flex-row items-center gap-3">
					<Text className="font-bold text-xl">{data.name}</Text>
					{data.website && (
						<TouchableOpacity
							className="rounded-full bg-primaryUltraLight p-2.5"
							onPress={() => Linking.openURL(data.website!)}
						>
							<LinkIcon size={14} color={config.theme.extend.colors.primary} />
						</TouchableOpacity>
					)}
				</View>
				{/* <View className="mt-2 flex-row flex-wrap items-center justify-center gap-2">
					{data.other_information?.theme?.split(",").map((tag) => {
						if (!tag) return null;
						return <Tag key={tag} title={tag.replace(/^\s+|\s+$/g, "")} />;
					})}
				</View> */}
			</View>
			<BackgroundLayout className="px-4">
				{(hasMoreInformation || data.brochure) && (
					<Picker
						style={{ width: 260, marginBottom: 16, marginTop: 20, marginHorizontal: "auto" }}
						variant="segmented"
						options={["Contact", "Produit"]}
						selectedIndex={null}
						onOptionSelected={({ nativeEvent: { index } }) => {
							if (index === 0) {
								horizontalScrollRef.current?.scrollTo({ x: 0, animated: true });
								verticalScrollRef.current?.scrollTo({ y: 0, animated: true });
							} else {
								horizontalScrollRef.current?.scrollToEnd({ animated: true });
								verticalScrollRef.current?.scrollTo({ y: 0, animated: true });
							}
						}}
					/>
				)}
				<ScrollView
					ref={verticalScrollRef}
					showsVerticalScrollIndicator={false}
					style={{ backgroundColor: config.theme.extend.colors.background }}
					contentContainerStyle={{ paddingBottom: 10 }}
				>
					{!hasMoreInformation && !data.brochure ? (
						<View className="mt-4 gap-4">
							<ContactInfo
								phone={data.contact_info?.phone}
								email={data.contact_info?.email}
								firstname={data.contact_info?.firstname}
								lastname={data.contact_info?.lastname}
							/>
							{(data.connexion?.email || data.connexion?.password) && (
								<Logs
									link={{
										pathname:
											"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/logs/[logs]",
										params: {
											"supplier-category": supplierCategoryId,
											"supplier-product": supplierProductId,
											supplier: supplierId,
											logs: JSON.stringify(data.connexion),
										},
									}}
								/>
							)}
						</View>
					) : (
						<ScrollView
							ref={horizontalScrollRef}
							horizontal
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							decelerationRate={"fast"}
							contentContainerStyle={{ gap: 16 }}
						>
							<View className="gap-2" style={{ width: Dimensions.get("window").width - 28 }}>
								<ContactInfo
									phone={data.contact_info?.phone}
									email={data.contact_info?.email}
									firstname={data.contact_info?.firstname}
									lastname={data.contact_info?.lastname}
								/>
								{(data.connexion?.email || data.connexion?.password) && (
									<Logs
										link={{
											pathname:
												"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/logs/[logs]",
											params: {
												"supplier-category": supplierCategoryId,
												"supplier-product": supplierProductId,
												supplier: supplierId,
												logs: JSON.stringify(data.connexion),
											},
										}}
									/>
								)}
							</View>
							<View style={{ width: Dimensions.get("window").width - 28 }}>
								<View className="gap-4">
									{data.brochure && (
										<Brochure
											brochure={data.brochure}
											updatedAt={data.updatedAt}
											link={{
												pathname:
													"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/pdf/[pdf]",
												params: {
													"supplier-category": supplierCategoryId,
													"supplier-product": supplierProductId,
													supplier: supplierId,
													pdf: data.brochure.filename,
												},
											}}
										/>
									)}
									{hasMoreInformation && <OtherInformation otherInformation={data.other_information} />}
								</View>
							</View>
						</ScrollView>
					)}
				</ScrollView>
			</BackgroundLayout>
		</>
	);
}

const Logs = ({ link }: { link: HrefObject }) => {
	return (
		<Link href={link} push asChild>
			<TouchableOpacity className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10">
				<View className="size-14 items-center justify-center rounded-lg bg-secondaryLight">
					<KeyRoundIcon size={18} color={config.theme.extend.colors.secondaryDark} />
				</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-dark">Identifiants de connexion</Text>
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</TouchableOpacity>
		</Link>
	);
};

export const Brochure = ({ brochure, updatedAt, link, title = "Brochure" }: { brochure: Media; updatedAt: string; link: HrefObject; title?: string }) => {
	const [loadingDownload, setLoadingDownload] = React.useState(false);
	const [loadingOpen, setLoadingOpen] = React.useState(false);

	return (
		<View className="w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="font-semibold text-sm text-defaultGray">{title}</Text>
			<View className="flex-row items-center justify-between gap-2">
				<View className="flex-shrink flex-row items-center gap-2">
					<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">
						<FileIcon size={18} color={config.theme.extend.colors.defaultGray} />
					</View>
					<View className="flex-shrink">
						<Text className="font-semibold text-sm text-dark">{brochure.filename}</Text>
						<Text className="font-semibold text-sm text-defaultGray">
							{new Date(updatedAt).toLocaleDateString("fr-FR", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							})}
						</Text>
					</View>
				</View>
				<View className="flex-row gap-3">
					<TouchableOpacity
						disabled={loadingDownload}
						onPress={() => {
							if (!brochure.url) return;

							setLoadingDownload(true);
							downloadFile(brochure.url)
								.then(() => {
									Alert.alert("Brochure téléchargée !");
								})
								.catch((_) => {
									Alert.alert(
										"La brochure n'a pas pu être téléchargée",
										"Vérifiez que le nom du fichier n'existe pas déjà sur votre appareil ou que vous avez assez d'espace de stockage.",
									);
								})
								.finally(() => {
									setLoadingDownload(false);
								});
						}}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						{loadingDownload ? (
							<ActivityIndicator
								size="small"
								style={{ width: 16, height: 16 }}
								color={config.theme.extend.colors.primary}
							/>
						) : (
							<Download size={16} color={config.theme.extend.colors.primary} />
						)}
					</TouchableOpacity>
					<TouchableOpacity
						disabled={loadingOpen}
						onPress={async () => {
							if (!brochure.filename || !brochure.url) return;

							const file = getFile(brochure.filename);

							if (file.exists) {
								router.push(link);
								return;
							}

							setLoadingOpen(true);

							downloadFile(brochure.url)
								.then((_) => {
									router.push(link);
								})
								.catch((_) => {
									Alert.alert(
										"La brochure n'a pas pu être téléchargée pour être visualisée",
										"Vérifiez que vous avez assez d'espace de stockage.",
									);
								})
								.finally(() => {
									setLoadingOpen(false);
								});
						}}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						{loadingOpen ? (
							<ActivityIndicator
								size="small"
								style={{ width: 16, height: 16 }}
								color={config.theme.extend.colors.primary}
							/>
						) : (
							<EyeIcon size={16} color={config.theme.extend.colors.primary} />
						)}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

// const Tag = ({ title }: { title: string }) => {
// 	return (
// 		<View className="rounded-md bg-defaultGray/10 px-2 py-1.5">
// 			<Text className="text-xs font-semibold text-defaultGray">{title}</Text>
// 		</View>
// 	);
// };

const ContactInfo = ({
	phone,
	email,
	firstname,
	lastname,
}: {
	phone?: string | null;
	email?: string | null;
	firstname?: string | null;
	lastname?: string | null;
}) => {
	const numbersString = phone?.replace(",", " / ");
	const numbers = numbersString?.split(" / ").map((number) => number.replace(/^\s+|\s+$/g, ""));

	return (
		<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="font-semibold text-sm text-defaultGray">Prénom et Nom</Text>
			<Text selectable className="font-semibold text-base text-dark">
				{firstname} {lastname?.toUpperCase()}
			</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="font-semibold text-sm text-defaultGray">Téléphone</Text>
					<Text selectable className="font-semibold text-base text-dark">{numbersString}</Text>
				</View>
				{phone && (
					<TouchableOpacity
						onPress={() => {
							Linking.openURL(`tel:${numbers?.[0]}`);
						}}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						<PhoneIcon size={16} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				)}
			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="font-semibold text-sm text-defaultGray">E-mail</Text>
					<Text selectable className="font-semibold text-base text-dark">{email}</Text>
				</View>
				{email && (
					<TouchableOpacity
						onPress={() => Linking.openURL(`mailto:${email}`)}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						<MailIcon size={16} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

const OtherInformation = ({ otherInformation }: { otherInformation: Supplier["other_information"] }) => {
	return (
		<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="font-semibold text-sm text-defaultGray">Thématique</Text>
			<Text className="font-semibold text-base text-dark">{otherInformation.theme}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-defaultGray">Remarque</Text>
			<Text className="font-semibold text-base text-dark">{otherInformation.annotation}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-defaultGray">Frais de souscription</Text>
			<Text className="font-semibold text-base text-dark">{otherInformation.subscription_fee}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-defaultGray">Durée</Text>
			<Text className="font-semibold text-base text-dark">{otherInformation.duration}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-defaultGray">Rentabilité</Text>
			<Text className="font-semibold text-base text-dark">{otherInformation.rentability}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-defaultGray">Rentabilité N1</Text>
			<Text className="font-semibold text-base text-dark">{otherInformation.rentability_n1}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-defaultGray">Commission</Text>
			<Text className="font-semibold text-base text-dark">{otherInformation.commission}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-defaultGray">Commission pour l'offre publique</Text>
			<Text className="font-semibold text-base text-dark">{otherInformation.commission_public_offer}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-defaultGray">Commission pour le groupe Valorem</Text>
			<Text className="font-semibold text-base text-dark">{otherInformation.commission_offer_group_valorem}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-defaultGray">SCPI</Text>
			<Text className="font-semibold text-sm text-dark">{otherInformation.scpi}</Text>
		</View>
	);
};
