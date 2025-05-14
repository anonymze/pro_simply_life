import { ArrowRight, ChevronRight, Download, EyeIcon, FileIcon, KeyRoundIcon, LinkIcon, MailIcon, PhoneIcon, } from "lucide-react-native";
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View, Dimensions } from "react-native";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
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


const heightContact = 195;
const heightOtherInformation = 794;


export default function Page() {
	const scrollRef = React.useRef<Animated.ScrollView>(null);
	const heightScrollView = useSharedValue(195);

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
					<Text className="text-sm font-semibold text-primary ">{supplierCategoryName}</Text>
					<ChevronRight size={14} color={config.theme.extend.colors.primary} />
					<Text className="text-sm font-semibold text-primary">{supplierProductName}</Text>
				</View>
				<ImagePlaceholder
					transition={300}
					contentFit="contain"
					source={data.logo_full?.url}
					style={{ width: "95%", height: 60 }}
				/>
				<View className="mt-4 flex-row items-center gap-3">
					<Text className="text-xl font-bold">{data.name}</Text>
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
			<BackgroundLayout className="px-4 pt-4">
				{hasMoreInformation && (
					<Picker
						style={{ width: 260, marginBottom: 10, marginTop: 5, marginHorizontal: "auto" }}
						variant="segmented"
						options={["Contact", "Produit"]}
						selectedIndex={null}
						onOptionSelected={({ nativeEvent: { index } }) => {
							if (index === 0) {
								scrollRef.current?.scrollTo({ x: 0, animated: true });
								heightScrollView.value = withTiming(heightContact, {
									easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
									// duration: 300,
								});
							} else {
								scrollRef.current?.scrollToEnd({ animated: true });
								heightScrollView.value = withTiming(heightOtherInformation, {
									easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
									// duration: 300,
								});
							}
						}}
					/>
				)}
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={{ backgroundColor: config.theme.extend.colors.background }}
					contentContainerStyle={{ paddingBottom: 10 }}
				>
					{!hasMoreInformation ? (
						<ContactInfo
							phone={data.contact_info?.phone}
							email={data.contact_info?.email}
							firstname={data.contact_info?.firstname}
							lastname={data.contact_info?.lastname}
						/>
					) : (
						<Animated.ScrollView
							ref={scrollRef}
							horizontal
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							decelerationRate={"fast"}
							style={{ height: heightScrollView }}
							contentContainerStyle={{ gap: 16 }}
						>
							<View style={{ width: Dimensions.get("window").width - 28, height: heightContact }}>
								<ContactInfo
									phone={data.contact_info?.phone}
									email={data.contact_info?.email}
									firstname={data.contact_info?.firstname}
									lastname={data.contact_info?.lastname}
								/>
							</View>
							<View style={{ width: Dimensions.get("window").width - 28, height: heightOtherInformation }}>
								<OtherInformation otherInformation={data.other_information} />
							</View>
						</Animated.ScrollView>
					)}
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
				</ScrollView>
			</BackgroundLayout>
		</>
	);
}

const Logs = ({ link }: { link: HrefObject }) => {
	return (
		<Link href={link} push asChild>
			<TouchableOpacity className="mt-4 w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10">
				<View className="size-14 items-center justify-center rounded-lg bg-secondaryLight">
					<KeyRoundIcon size={18} color={config.theme.extend.colors.secondaryDark} />
				</View>
				<View className="flex-1">
					<Text className="text-lg font-semibold text-dark">Identifiants de connexion</Text>
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</TouchableOpacity>
		</Link>
	);
};

const Brochure = ({ brochure, updatedAt, link }: { brochure: Media; updatedAt: string; link: HrefObject }) => {
	const [loadingDownload, setLoadingDownload] = React.useState(false);
	const [loadingOpen, setLoadingOpen] = React.useState(false);

	return (
		<View className="mt-4 w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="text-sm font-semibold text-defaultGray">Brochure</Text>
			<View className="flex-row items-center justify-between gap-2">
				<View className="flex-shrink flex-row items-center gap-2">
					<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">
						<FileIcon size={18} color={config.theme.extend.colors.defaultGray} />
					</View>
					<View className="flex-shrink">
						<Text className="text-sm font-semibold text-dark">{brochure.filename}</Text>
						<Text className="text-sm font-semibold text-defaultGray">
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
	const numbers = phone?.split(",").map((number) => number.replace(/^\s+|\s+$/g, ""));
	return (
		<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="text-sm font-semibold text-defaultGray">Prénom et Nom</Text>
			<Text className="text-base font-semibold text-dark">
				{firstname} {lastname?.toUpperCase()}
			</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm font-semibold text-defaultGray">Téléphone</Text>
					{numbers?.map((number) => {
						if (!number) return null;

						return (
							<Text key={number} className="text-base font-semibold text-dark">
								{number}
							</Text>
						);
					})}
				</View>
				{numbers?.map((number) => {
					if (!number) return null;

					return (
						<TouchableOpacity
							key={number}
							onPress={() => Linking.openURL(`tel:${number}`)}
							className="rounded-full bg-primaryUltraLight p-3"
						>
							<PhoneIcon size={16} color={config.theme.extend.colors.primary} />
						</TouchableOpacity>
					);
				})}
			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm font-semibold text-defaultGray">E-mail</Text>
					<Text className="text-base font-semibold text-dark">{email}</Text>
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
			<Text className="text-sm font-semibold text-defaultGray">Thématique</Text>
			<Text className="text-base font-semibold text-dark">{otherInformation.theme}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="text-sm font-semibold text-defaultGray">Remarque</Text>
			<Text className="text-base font-semibold text-dark">{otherInformation.annotation}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="text-sm font-semibold text-defaultGray">Frais de souscription</Text>
			<Text className="text-base font-semibold text-dark">{otherInformation.subscription_fee}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="text-sm font-semibold text-defaultGray">Durée</Text>
			<Text className="text-base font-semibold text-dark">{otherInformation.duration}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="text-sm font-semibold text-defaultGray">Rentabilité</Text>
			<Text className="text-base font-semibold text-dark">{otherInformation.rentability}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="text-sm font-semibold text-defaultGray">Rentabilité N1</Text>
			<Text className="text-base font-semibold text-dark">{otherInformation.rentability_n1}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="text-sm font-semibold text-defaultGray">Commission</Text>
			<Text className="text-base font-semibold text-dark">{otherInformation.commission}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="text-sm font-semibold text-defaultGray">Commission pour l'offre publique</Text>
			<Text className="text-base font-semibold text-dark">{otherInformation.commission_public_offer}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="text-sm font-semibold text-defaultGray">Commission pour le groupe Valorem</Text>
			<Text className="text-base font-semibold text-dark">{otherInformation.commission_offer_group_valorem}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="text-sm font-semibold text-defaultGray">SCPI</Text>
			{otherInformation.scpi?.split(",").map((scpi) => {
				if (!scpi) return null;
				return (
					<Text key={scpi} className="text-sm font-semibold text-dark">
						{scpi.replace(/^\s+|\s+$/g, "")}
					</Text>
				);
			})}
		</View>
	);
};
