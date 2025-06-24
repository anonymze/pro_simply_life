import { ChevronRight, KeyRoundIcon, LinkIcon, MailIcon, PhoneIcon } from "lucide-react-native";
import { Linking, ScrollView, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { HrefObject, Link, useLocalSearchParams } from "expo-router";
import { getSupplierQuery } from "@/api/queries/supplier-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { Picker } from "@expo/ui/jetpack-compose";
import { useQuery } from "@tanstack/react-query";
import { Brochure } from "@/components/brochure";
import { Supplier } from "@/types/supplier";
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
						style={{ width: 260, marginTop: 20, marginHorizontal: "auto", marginBottom: 10 }}
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
				<View className="size-14 items-center justify-center rounded-lg bg-darkGray">
					<KeyRoundIcon size={20} color={config.theme.extend.colors.primary} />
				</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-primary">Identifiants de connexion</Text>
				</View>
				{/* <ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} /> */}
			</TouchableOpacity>
		</Link>
	);
};

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
			<Text className="text-sm text-primaryLight">Prénom et Nom</Text>
			<Text selectable className="font-semibold text-primary">
				{firstname} {lastname?.toUpperCase()}
			</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="flex-shrink gap-2">
					<Text className="text-sm text-primaryLight">Téléphone</Text>
					<Text selectable className="font-semibold text-base text-primary">
						{numbersString}
					</Text>
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
				<View className="flex-shrink flex-grow-0 gap-2">
					<Text className="text-sm text-primaryLight">E-mail</Text>
					<Text selectable className="font-semibold text-base text-primary">
						{email}
					</Text>
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
			<Text className="font-semibold text-sm text-primaryLight">Thématique</Text>
			<Text className="font-semibold text-base text-primary">{otherInformation.theme}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-primaryLight">Remarque</Text>
			<Text className="font-semibold text-base text-primary">{otherInformation.annotation}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-primaryLight">Frais de souscription</Text>
			<Text className="font-semibold text-base text-primary">{otherInformation.subscription_fee}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-primaryLight">Durée</Text>
			<Text className="font-semibold text-base text-primary">{otherInformation.duration}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-primaryLight">Rentabilité</Text>
			<Text className="font-semibold text-base text-primary">{otherInformation.rentability}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-primaryLight">Rentabilité N1</Text>
			<Text className="font-semibold text-base text-primary">{otherInformation.rentability_n1}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-primaryLight">Commission</Text>
			<Text className="font-semibold text-base text-primary">{otherInformation.commission}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-primaryLight">Commission pour l'offre publique</Text>
			<Text className="font-semibold text-base text-primary">{otherInformation.commission_public_offer}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-primaryLight">Commission pour le groupe Valorem</Text>
			<Text className="font-semibold text-base text-primary">{otherInformation.commission_offer_group_valorem}</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<Text className="font-semibold text-sm text-primaryLight">SCPI</Text>
			<Text className="font-semibold text-sm text-primary">{otherInformation.scpi}</Text>
		</View>
	);
};
