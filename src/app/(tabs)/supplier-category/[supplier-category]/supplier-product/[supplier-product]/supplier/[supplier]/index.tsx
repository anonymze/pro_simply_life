import { getSupplierQuery } from "@/api/queries/supplier-queries";
import { Brochure } from "@/components/brochure";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { Supplier } from "@/types/supplier";
import { cn } from "@/utils/cn";
import { SCREEN_DIMENSIONS } from "@/utils/helper";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { HrefObject, Link, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ChevronRight, CopyIcon, KeyRoundIcon, LinkIcon, MailIcon, PhoneIcon } from "lucide-react-native";
import React from "react";
import { Alert, Linking, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

const DEFAULT_MAX_VALUE = 5_000_000;

export default function Page() {
	const horizontalScrollRef = React.useRef<ScrollView>(null);
	const verticalScrollRef = React.useRef<ScrollView>(null);
	const [currentIndex, setCurrentIndex] = React.useState(0);

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
			</View>
			<BackgroundLayout className="px-4">
				{/* SCPI */}
				{!!data?.other_information?.length && (
					<FlashList
						showsHorizontalScrollIndicator={false}
						data={[
							{
								title: "Contact",
								subtitle: "",
							},
							...data.other_information.map((info) => {
								return {
									title: info.scpi || "SCPI sans titre",
									subtitle: info.theme,
								};
							}),
						]}
						horizontal
						className="my-4"
						estimatedItemSize={100}
						renderItem={({ item, index }) => {
							const isActive = currentIndex === index;

							return (
								<Pressable
									hitSlop={5}
									className={cn(
										"mr-3.5 flex h-12 items-center justify-center rounded-lg px-3.5",
										isActive ? "bg-primary" : "bg-darkGray",
									)}
									onPress={() => {
										setCurrentIndex(index);

										if (index === 0) {
											horizontalScrollRef.current?.scrollTo({ x: 0, animated: true });
											verticalScrollRef.current?.scrollTo({ y: 0, animated: true });
										} else {
											const scrollX = index * (SCREEN_DIMENSIONS.width - 28 + 16);
											horizontalScrollRef.current?.scrollTo({ x: scrollX, animated: true });
											verticalScrollRef.current?.scrollTo({ y: 0, animated: true });
										}
									}}
								>
									<Text className={cn("font-bold text-sm", isActive ? "text-white" : "text-primary")}>
										{item.title}
									</Text>
									{item.subtitle && (
										<Text className={cn("text-xs", isActive ? "text-white" : "text-primary")}>{item.subtitle}</Text>
									)}
								</Pressable>
							);
						}}
					></FlashList>
				)}

				{/* PRIVATE EQUITY */}
				{!!data?.fond?.length && (
					<FlashList
						showsHorizontalScrollIndicator={false}
						data={[
							{
								title: "Contact",
								subtitle: "",
							},
							...data.fond.map((info, idx) => {
								return {
									title:
										idx === 0 ? "Entrepreneur croissance" : idx === 1 ? "Entrepreneur secondaire" : "Fond sans titre",
								};
							}),
						]}
						horizontal
						className="my-4"
						estimatedItemSize={100}
						renderItem={({ item, index }) => {
							const isActive = currentIndex === index;

							return (
								<Pressable
									hitSlop={5}
									className={cn(
										"mr-3.5 flex h-12 items-center justify-center rounded-lg px-3.5",
										isActive ? "bg-primary" : "bg-darkGray",
									)}
									onPress={() => {
										setCurrentIndex(index);

										if (index === 0) {
											horizontalScrollRef.current?.scrollTo({ x: 0, animated: true });
											verticalScrollRef.current?.scrollTo({ y: 0, animated: true });
										} else {
											const scrollX = index * (SCREEN_DIMENSIONS.width - 28 + 16);
											horizontalScrollRef.current?.scrollTo({ x: scrollX, animated: true });
											verticalScrollRef.current?.scrollTo({ y: 0, animated: true });
										}
									}}
								>
									<Text className={cn("font-bold text-sm", isActive ? "text-white" : "text-primary")}>
										{item.title}
									</Text>
								</Pressable>
							);
						}}
					></FlashList>
				)}

				<ScrollView
					ref={verticalScrollRef}
					showsVerticalScrollIndicator={false}
					style={{ backgroundColor: config.theme.extend.colors.background }}
					contentContainerStyle={{ paddingBottom: 10 }}
				>
					{!data?.other_information?.length && !data?.fond?.length ? (
						<View className="mt-4 gap-4">
							{data?.enveloppe && data.enveloppe.amount && (
								<View className="rounded-2xl  bg-white p-4 shadow-sm shadow-defaultGray/10">
									<Text className="text-md mt-5 font-semibold text-primary">Taux de remplissage actuel</Text>
									<View className="mt-5">
										<View className="flex-row">
											<View
												className="gap-1"
												// @ts-ignore
												style={{
													width:
														data.enveloppe.amount >= DEFAULT_MAX_VALUE
															? "100%"
															: data.enveloppe.amount / DEFAULT_MAX_VALUE < 0.1
																? "10%"
																: (data.enveloppe.amount / DEFAULT_MAX_VALUE) * 100 + "%",
												}}
											>
												<View className="h-1.5 w-full rounded-full bg-production" />
											</View>
										</View>
									</View>
									<View className="mt-6 flex-row items-center gap-2">
										<View className="size-2 rounded-full bg-production" />
										<Text className="text-backgroundChat">Montant enveloppe disponible</Text>
										<Text className="ml-auto font-light text-sm text-primaryLight">
											{data.enveloppe.amount.toLocaleString("fr-FR")}€
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Echéance de l'enveloppe</Text>
										<Text className="ml-auto font-light text-sm text-primaryLight">
											{data.enveloppe.echeance
												? new Date(data.enveloppe.echeance).toLocaleDateString("fr-FR", {
														day: "numeric",
														month: "numeric",
														year: "numeric",
													})
												: "Inconnu"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Réduction d'impôt</Text>
										<Text className="ml-auto font-light text-sm text-primaryLight">
											{data.enveloppe.reduction ? data.enveloppe.reduction.toLocaleString("fr-FR") + "%" : "Inconnu"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Date d'actualisation</Text>
										<Text className="ml-auto font-light text-sm text-primaryLight">
											{data.enveloppe.actualisation
												? new Date(data.enveloppe.actualisation ?? "").toLocaleDateString("fr-FR", {
														day: "numeric",
														month: "numeric",
														year: "numeric",
													})
												: "Inconnu"}
										</Text>
									</View>
								</View>
							)}

							<ContactInfo
								phone={data.contact_info?.phone}
								email={data.contact_info?.email}
								firstname={data.contact_info?.firstname}
								lastname={data.contact_info?.lastname}
								website={data.website}
							/>
							{/*{(data.connexion?.email || data.connexion?.password) && (
								<Logs
									title="Identifiants généraux"
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
							)}*/}

							<Logs
								title="Identifiants personnels"
								link={{
									pathname:
										"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/perso/[perso]",
									params: {
										"supplier-category": supplierCategoryId,
										"supplier-product": supplierProductId,
										supplier: supplierId,
										perso: "hey",
									},
								}}
							/>
						</View>
					) : !!data?.fond?.length ? (
						<ScrollView
							ref={horizontalScrollRef}
							horizontal
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							decelerationRate={"fast"}
							contentContainerStyle={{ gap: 16 }}
						>
							<View className="gap-2" style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
								<ContactInfo
									phone={data.contact_info?.phone}
									email={data.contact_info?.email}
									firstname={data.contact_info?.firstname}
									lastname={data.contact_info?.lastname}
								/>
								{/*{(data.connexion?.email || data.connexion?.password) && (
									<Logs
										title="Identifiants généraux"
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
								)}*/}

								<Logs
									title="Identifiants personnels"
									link={{
										pathname:
											"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/perso/[perso]",
										params: {
											"supplier-category": supplierCategoryId,
											"supplier-product": supplierProductId,
											supplier: supplierId,
											perso: "hey",
										},
									}}
								/>
							</View>
							{data.fond?.map((fond, idx) => (
								<View key={idx} style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
									<FondComponent
										information={fond}
										supplierCategoryId={supplierCategoryId}
										supplierId={supplierId}
										supplierProductId={supplierProductId}
										updatedAt={data.updatedAt}
									/>
								</View>
							))}
						</ScrollView>
					) : (
						<ScrollView
							ref={horizontalScrollRef}
							horizontal
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							decelerationRate={"fast"}
							contentContainerStyle={{ gap: 16 }}
						>
							<View className="gap-2" style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
								<ContactInfo
									phone={data.contact_info?.phone}
									email={data.contact_info?.email}
									firstname={data.contact_info?.firstname}
									lastname={data.contact_info?.lastname}
								/>
								{/*{(data.connexion?.email || data.connexion?.password) && (
									<Logs
										title="Identifiants personnels"
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
								)}*/}

								<Logs
									title="Identifiants personnels"
									link={{
										pathname:
											"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/perso/[perso]",
										params: {
											"supplier-category": supplierCategoryId,
											"supplier-product": supplierProductId,
											supplier: supplierId,
											perso: "hey",
										},
									}}
								/>
							</View>
							{data.other_information?.map((information, idx) => (
								<View key={idx} style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
									<ScpiComponent
										information={information}
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

const Logs = ({ link, title }: { link: HrefObject; title: string }) => {
	return (
		<Link href={link} push asChild>
			<TouchableOpacity className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10">
				<View className="size-14 items-center justify-center rounded-lg bg-darkGray">
					<KeyRoundIcon size={20} color={config.theme.extend.colors.primary} />
				</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-primary">{title}</Text>
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
	website,
}: {
	phone?: string | null;
	email?: string | null;
	firstname?: string | null;
	lastname?: string | null;
	website?: string | null;
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
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="flex-shrink flex-grow-0 gap-2">
					<Text className="text-sm text-primaryLight">Adresse du site internet</Text>
					<Text selectable className="font-semibold text-base text-primary">
						{website}
					</Text>
				</View>
				{website && (
					<TouchableOpacity
						onPress={() => {
							if (!website) return;
							Clipboard.setStringAsync(website);
							Alert.alert("URL copiée");
						}}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						<CopyIcon size={16} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

const ScpiComponent = ({
	information,
	supplierCategoryId,
	supplierProductId,
	supplierId,
	updatedAt,
}: {
	information: NonNullable<Supplier["other_information"]>[number];
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	updatedAt: string;
}) => {
	return (
		<View className="gap-2">
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				<Text className="font-semibold text-sm text-primaryLight">SCPI</Text>
				<Text className="font-semibold text-sm text-primary">{information.scpi}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Thématique</Text>
				<Text className="font-semibold text-base text-primary">{information.theme}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<View className="flex flex-row items-center justify-between">
					<Text className="font-semibold text-sm text-primaryLight">Épargne</Text>
					<Text className="rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
						{information.epargne ? "Oui" : "Non"}
					</Text>
				</View>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Remarque</Text>
				<Text className="font-semibold text-base text-primary">{information.annotation}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Minimum de versement</Text>
				<Text className="font-semibold text-base text-primary">{information.minimum_versement}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Frais de souscription</Text>
				<Text className="font-semibold text-base text-primary">{information.subscription_fee}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Délai de jouissance</Text>
				<Text className="font-semibold text-base text-primary">{information.duration}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Rentabilité N1</Text>
				<Text className="font-semibold text-base text-primary">{information.rentability_n1}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-green-600">Commission pour le groupe Valorem</Text>
				<Text className="font-semibold text-base text-green-600">{information.commission_offer_group_valorem}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Commission pour l'offre publique</Text>
				<Text className="font-semibold text-base text-primary">{information.commission_public_offer}</Text>
			</View>
			{information.brochure && (
				<Brochure
					brochure={information.brochure}
					updatedAt={updatedAt}
					link={{
						pathname:
							"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/pdf/[pdf]",
						params: {
							"supplier-category": supplierCategoryId,
							"supplier-product": supplierProductId,
							supplier: supplierId,
							pdf: information.brochure.filename,
						},
					}}
				/>
			)}
		</View>
	);
};

const FondComponent = ({
	information,
	supplierCategoryId,
	supplierProductId,
	supplierId,
	updatedAt,
}: {
	information: NonNullable<Supplier["fond"]>[number];
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	updatedAt: string;
}) => {
	return (
		<View className="gap-2">
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				<Text className="font-semibold text-sm text-primaryLight">Durée</Text>
				<Text className="font-semibold text-sm text-primary">{information.duration}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Thèse d'investissement</Text>
				<Text className="font-semibold text-base text-primary">{information.investment}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Ticket mini</Text>
				<Text className="font-semibold text-base text-primary">{information.ticket}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Durée appel de fond</Text>
				<Text className="font-semibold text-base text-primary">{information.duration_found}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<View className="flex flex-row items-center justify-between">
					<Text className="font-semibold text-sm text-primaryLight">Distribution</Text>
					<Text className="rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
						{information.distribution ? "Oui" : "Non"}
					</Text>
				</View>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">TRI cible</Text>
				<Text className="font-semibold text-base text-primary">{information.tri}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Multiple cible</Text>
				<Text className="font-semibold text-base text-primary">{information.multiple}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Éligible 150 0b ter</Text>
				<Text className="font-semibold text-base text-primary">{information.eligibility}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Rétro upfront</Text>
				<Text className="font-semibold text-base text-primary">{information.upfront}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="font-semibold text-sm text-primaryLight">Rétro encours</Text>
				<Text className="font-semibold text-base text-primary">{information.encours}</Text>
			</View>
			{information.brochure && (
				<Brochure
					brochure={information.brochure}
					updatedAt={updatedAt}
					link={{
						pathname:
							"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/pdf/[pdf]",
						params: {
							"supplier-category": supplierCategoryId,
							"supplier-product": supplierProductId,
							supplier: supplierId,
							pdf: information.brochure.filename,
						},
					}}
				/>
			)}
		</View>
	);
};
