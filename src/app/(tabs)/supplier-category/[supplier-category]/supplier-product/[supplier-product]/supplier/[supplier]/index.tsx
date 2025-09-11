import { getSupplierQuery } from "@/api/queries/supplier-queries";
import { Brochure } from "@/components/brochure";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { Supplier } from "@/types/supplier";
import { Picker, Switch } from "@expo/ui/swift-ui";
import { useQuery } from "@tanstack/react-query";
import { HrefObject, Link, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ChevronRight, KeyRoundIcon, LinkIcon, MailIcon, PhoneIcon } from "lucide-react-native";
import React from "react";
import { Dimensions, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

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
							onPress={async () => await WebBrowser.openBrowserAsync(data.website!)}
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
				{!!data?.other_information?.length && (
					<Picker
						style={{ width: 320, marginBottom: 16, marginTop: 20, marginHorizontal: "auto" }}
						variant="segmented"
						options={["Contact", ...data.other_information.map(info => info.scpi || "SCPI sans titre")]}
						selectedIndex={null}
						onOptionSelected={({ nativeEvent: { index } }) => {
							if (index === 0) {
								horizontalScrollRef.current?.scrollTo({ x: 0, animated: true });
								verticalScrollRef.current?.scrollTo({ y: 0, animated: true });
							} else {
								const scrollX = index * (Dimensions.get("window").width - 28 + 16);
								horizontalScrollRef.current?.scrollTo({ x: scrollX, animated: true });
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
					{!data?.other_information?.length ? (
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
							{data.other_information?.map((information, idx) => (
								<View key={idx} style={{ width: Dimensions.get("window").width - 28 }}>
									<OtherInformation
										otherInformation={information}
										supplierCategoryId={supplierCategoryId}
										supplierId={supplierId}
										supplierProductId={supplierProductId}
										updatedAt={data.updatedAt}
									/>
								</View>
							))}
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

const OtherInformation = ({
	otherInformation,
	supplierCategoryId,
	supplierProductId,
	supplierId,
	updatedAt,
}: {
	otherInformation: NonNullable<Supplier["other_information"]>[number];
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	updatedAt: string;
}) => {
	return (
		<View className="gap-2">
			{otherInformation.brochure && (
				<Brochure
					brochure={otherInformation.brochure}
					updatedAt={updatedAt}
					link={{
						pathname:
							"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/pdf/[pdf]",
						params: {
							"supplier-category": supplierCategoryId,
							"supplier-product": supplierProductId,
							supplier: supplierId,
							pdf: otherInformation.brochure.filename,
						},
					}}
				/>
			)}
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				<Text className="font-semibold text-sm text-primaryLight">SCPI</Text>
				<Text className="font-semibold text-sm text-primary">{otherInformation.scpi}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Thématique</Text>
				<Text className="font-semibold text-base text-primary">{otherInformation.theme}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />

				<View className="flex flex-row items-center justify-between">
					<Text className="font-semibold text-sm text-primaryLight">Épargne</Text>
					<Switch
						value={otherInformation.epargne ?? false}
						label=""
						onValueChange={() => {}}
						// onValueChange={(checked) => {
						// 	setChecked(checked);
						// }}
						// label="Epargne"
						color={config.theme.extend.colors.primaryLight}
						variant="switch"
						style={{ pointerEvents: 'none' }}
					/>
				</View>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Remarque</Text>
				<Text className="font-semibold text-base text-primary">{otherInformation.annotation}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Minimum de versement</Text>
				<Text className="font-semibold text-base text-primary">{otherInformation.minimum_versement}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Frais de souscription</Text>
				<Text className="font-semibold text-base text-primary">{otherInformation.subscription_fee}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Délai de jouissance</Text>
				<Text className="font-semibold text-base text-primary">{otherInformation.duration}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Rentabilité N1</Text>
				<Text className="font-semibold text-base text-primary">{otherInformation.rentability_n1}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-green-600">Commission pour le groupe Valorem</Text>
				<Text className="font-semibold text-base text-green-600">
					{otherInformation.commission_offer_group_valorem}
				</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Commission pour l'offre publique</Text>
				<Text className="font-semibold text-base text-primary">{otherInformation.commission_public_offer}</Text>
			</View>
		</View>
	);
};
