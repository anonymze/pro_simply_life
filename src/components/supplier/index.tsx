import { getPrivateEquityQuery } from "@/api/queries/private-equity-queries";
import { getSupplierQuery } from "@/api/queries/supplier-queries";
import { Brochure } from "@/components/brochure";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { PrivateEquity } from "@/types/private-equity";
import { Supplier } from "@/types/supplier";
import { userHierarchy } from "@/types/user";
import { cn } from "@/utils/cn";
import { SCREEN_DIMENSIONS } from "@/utils/helper";
import { getStorageUserInfos } from "@/utils/store";
import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { Href, Link, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ChevronRight, CopyIcon, KeyRoundIcon, LinkIcon, MailIcon, PhoneIcon } from "lucide-react-native";
import React from "react";
import { Alert, Linking, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

const DEFAULT_MAX_VALUE = 5_000_000;

export default function Page({ previousCategories = true }: { previousCategories?: boolean }) {
	const appUser = getStorageUserInfos();
	const horizontalScrollRef = React.useRef<ScrollView>(null);
	const verticalScrollRef = React.useRef<ScrollView>(null);
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const {
		supplier: supplierId,
		"supplier-product": supplierProductId,
		"supplier-category": supplierCategoryId,
		"supplier-category-name": supplierCategoryName,
		"supplier-product-name": supplierProductName,
		"private-equity": privateEquityId,
	} = useLocalSearchParams<{
		supplier: string;
		"supplier-product": string;
		"supplier-category": string;
		"supplier-category-name": string;
		"supplier-product-name": string;
		"private-equity"?: string;
	}>();

	const { data } = useQuery({
		queryKey: ["supplier", supplierId],
		queryFn: getSupplierQuery,
		enabled: !!supplierId,
	});

	const { data: privateEquity } = useQuery({
		queryKey: ["private-supplier", privateEquityId],
		queryFn: getPrivateEquityQuery,
		enabled: !!privateEquityId,
	});

	if (!data || !appUser?.user) return null;

	return (
		<>
			<View className="items-center rounded-b-2xl bg-white pb-4">
				{previousCategories && (
					<View className="mb-4 flex-row items-center gap-2">
						<Text className="text-sm font-semibold text-primary ">{supplierCategoryName}</Text>
						<ChevronRight size={14} color={config.theme.extend.colors.primary} />
						<Text className="text-sm font-semibold text-primary">{supplierProductName}</Text>
					</View>
				)}
				<ImagePlaceholder
					transition={300}
					contentFit="contain"
					placeholder={data.logo_full?.blurhash}
					source={data.logo_full?.url}
					style={{ width: "95%", height: 60 }}
				/>
				<View className="mt-4 flex-row items-center gap-3">
					<Text className="text-xl font-bold">{data.name}</Text>
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
					<LegendList
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
						className="my-4 h-14"
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
									<Text className={cn("text-sm font-bold", isActive ? "text-white" : "text-primary")}>
										{item.title}
									</Text>
									{item.subtitle && (
										<Text className={cn("text-xs", isActive ? "text-white" : "text-primary")}>{item.subtitle}</Text>
									)}
								</Pressable>
							);
						}}
					></LegendList>
				)}

				{/* PRIVATE EQUITY */}
				{!!privateEquity?.fond?.length && (
					<LegendList
						showsHorizontalScrollIndicator={false}
						data={[
							{
								title: "Contact",
								subtitle: "",
							},
							...privateEquity.fond.map((fond) => ({
								title: fond.name,
							})),
						]}
						horizontal
						className="my-4 h-14"
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
									<Text className={cn("text-sm font-bold", isActive ? "text-white" : "text-primary")}>
										{item?.title}
									</Text>
								</Pressable>
							);
						}}
					/>
				)}

				<ScrollView
					ref={verticalScrollRef}
					showsVerticalScrollIndicator={false}
					style={{ backgroundColor: config.theme.extend.colors.background }}
					contentContainerStyle={{ paddingBottom: 10 }}
				>
					{!data?.other_information?.length && !privateEquity?.fond?.length ? (
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
														data.enveloppe.amount >= (data.enveloppe.global || DEFAULT_MAX_VALUE)
															? "100%"
															: data.enveloppe.amount / (data.enveloppe.global || DEFAULT_MAX_VALUE) < 0.1
																? "10%"
																: (data.enveloppe.amount / (data.enveloppe.global || DEFAULT_MAX_VALUE)) * 100 + "%",
												}}
											>
												<View
													className={cn(
														"h-1.5 w-full rounded-full bg-green-600",
														data.enveloppe.amount <= 0 && "bg-production",
													)}
												/>
											</View>
										</View>
									</View>
									<View className="mb-3 mt-6 flex-row items-center gap-2">
										<View
											className={cn("size-2 rounded-full bg-green-600", data.enveloppe.amount <= 0 && "bg-production")}
										/>
										<Text className="text-backgroundChat">Montant enveloppe disponible</Text>
										<Text className="ml-auto text-sm font-light text-primaryLight">
											{data.enveloppe.amount.toLocaleString("fr-FR")}€
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Echéance de l'enveloppe</Text>
										<Text className="ml-auto text-sm font-light text-primaryLight">
											{data.enveloppe.echeance
												? new Date(data.enveloppe.echeance).toLocaleDateString("fr-FR", {
														day: "numeric",
														month: "numeric",
														year: "numeric",
													})
												: "Non renseigné"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Réduction d'impôt</Text>
										<Text className="ml-auto text-sm font-light text-primaryLight">
											{data.enveloppe.reduction
												? data.enveloppe.reduction.toLocaleString("fr-FR") + "%"
												: "Non renseigné"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Date d'actualisation</Text>
										<Text className="ml-auto text-sm font-light text-primaryLight">
											{data.enveloppe.actualisation
												? new Date(data.enveloppe.actualisation ?? "").toLocaleDateString("fr-FR", {
														day: "numeric",
														month: "numeric",
														year: "numeric",
													})
												: "Non renseigné"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Commissions</Text>
										<Text className="ml-auto text-sm font-light text-primaryLight">
											{data.enveloppe.commission ? data.enveloppe.commission + "%" : "Non renseigné"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-xs text-green-600">Commissions négociées Groupe Valorem</Text>
										<Text className="ml-auto text-xs font-light text-green-600">
											{data.enveloppe.commission_valorem ? data.enveloppe.commission_valorem + "%" : "Non renseigné"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Plein droit</Text>
										<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
											{data.enveloppe.droits === "yes" ? "Oui" : "Non"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Agrément</Text>
										<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
											{data.enveloppe.agrement === "yes" ? "Oui" : "Non"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Garantie de bonne fin fiscale</Text>
										<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
											{data.enveloppe.assurance === "yes"
												? "Oui"
												: data.enveloppe.assurance === "maybe"
													? "Parfois"
													: "Non"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Garantie individuelle investisseur</Text>
										<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
											{data.enveloppe.investisseur === "yes" ? "Oui" : "Non"}
										</Text>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<Text className="text-sm text-backgroundChat">Clause de non retour</Text>
										<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
											{data.enveloppe.close === "yes" ? "Oui" : "Non"}
										</Text>
									</View>
									<View className="mt-3 gap-2">
										<Text className="text-sm text-backgroundChat">Remarques :</Text>
										<Text className=" text-sm font-light text-primaryLight">{data.enveloppe.remarque}</Text>
									</View>
								</View>
							)}

							<ContactInfo
								supplierId={supplierId}
								supplierCategoryId={supplierCategoryId}
								supplierProductId={supplierProductId}
								phone={data.contact_info?.phone}
								email={data.contact_info?.email}
								firstname={data.contact_info?.firstname}
								lastname={data.contact_info?.lastname}
								website={data.website}
								brochures={data.brochures}
								previousCategories={previousCategories}
							/>

							{userHierarchy[appUser.user.role] < 2 &&
								(data.connexion?.email || data.connexion?.password || data.connexion?.remarques) && (
									<Logs
										title="Identifiants généraux"
										link={
											previousCategories
												? {
														pathname:
															"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/logs/[logs]",
														params: {
															"supplier-category": supplierCategoryId,
															"supplier-product": supplierProductId,
															supplier: supplierId,
															logs: JSON.stringify(data.connexion),
														},
													}
												: {
														pathname: "/selection/[supplier]/logs/[logs]",
														params: {
															supplier: supplierId,
															logs: JSON.stringify(data.connexion),
														},
													}
										}
									/>
								)}

							<Logs
								title="Identifiants personnels"
								link={
									previousCategories
										? {
												pathname:
													"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/perso/[perso]",
												params: {
													"supplier-category": supplierCategoryId,
													"supplier-product": supplierProductId,
													supplier: supplierId,
													perso: "hey",
												},
											}
										: {
												pathname: "/selection/[supplier]/perso/[perso]",
												params: {
													supplier: supplierId,
													perso: "hey",
												},
											}
								}
							/>
						</View>
					) : !!privateEquity?.fond?.length ? (
						<ScrollView
							scrollViewRef={horizontalScrollRef as React.RefObject<ScrollView>}
							horizontal
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							decelerationRate={"fast"}
							contentContainerStyle={{ gap: 16 }}
						>
							<View className="gap-2" style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
								<ContactInfo
									supplierId={supplierId}
									supplierCategoryId={supplierCategoryId}
									supplierProductId={supplierProductId}
									phone={data.contact_info?.phone}
									email={data.contact_info?.email}
									firstname={data.contact_info?.firstname}
									lastname={data.contact_info?.lastname}
									brochures={data.brochures}
									previousCategories
								/>

								{userHierarchy[appUser.user.role] < 2 &&
									(data.connexion?.email || data.connexion?.password || data.connexion?.remarques) && (
										<Logs
											title="Identifiants généraux"
											link={
												previousCategories
													? {
															pathname:
																"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/logs/[logs]",
															params: {
																"supplier-category": supplierCategoryId,
																"supplier-product": supplierProductId,
																supplier: supplierId,
																logs: JSON.stringify(data.connexion),
															},
														}
													: {
															pathname: "/selection/[supplier]/logs/[logs]",
															params: {
																supplier: supplierId,
																logs: JSON.stringify(data.connexion),
															},
														}
											}
										/>
									)}

								<Logs
									title="Identifiants personnels"
									link={
										previousCategories
											? {
													pathname:
														"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/perso/[perso]",
													params: {
														"supplier-category": supplierCategoryId,
														"supplier-product": supplierProductId,
														supplier: supplierId,
														perso: "hey",
													},
												}
											: {
													pathname: "/selection/[supplier]/perso/[perso]",
													params: {
														supplier: supplierId,
														perso: "hey",
													},
												}
									}
								/>
							</View>
							{privateEquity.fond.map((fond, idx) => (
								<View key={idx} style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
									<FondComponent
										previousCategories={previousCategories}
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
							scrollViewRef={horizontalScrollRef as React.RefObject<ScrollView>}
							horizontal
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							decelerationRate={"fast"}
							contentContainerStyle={{ gap: 16 }}
						>
							<View className="gap-2" style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
								<ContactInfo
									supplierId={supplierId}
									supplierCategoryId={supplierCategoryId}
									supplierProductId={supplierProductId}
									phone={data.contact_info?.phone}
									email={data.contact_info?.email}
									firstname={data.contact_info?.firstname}
									lastname={data.contact_info?.lastname}
									brochures={data.brochures}
									previousCategories
								/>

								{userHierarchy[appUser.user.role] < 2 &&
									(data.connexion?.email || data.connexion?.password || data.connexion?.remarques) && (
										<Logs
											title="Identifiants généraux"
											link={
												previousCategories
													? {
															pathname:
																"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/logs/[logs]",
															params: {
																"supplier-category": supplierCategoryId,
																"supplier-product": supplierProductId,
																supplier: supplierId,
																logs: JSON.stringify(data.connexion),
															},
														}
													: {
															pathname: "/selection/[supplier]/logs/[logs]",
															params: {
																supplier: supplierId,
																logs: JSON.stringify(data.connexion),
															},
														}
											}
										/>
									)}

								<Logs
									title="Identifiants personnels"
									link={
										previousCategories
											? {
													pathname:
														"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/perso/[perso]",
													params: {
														"supplier-category": supplierCategoryId,
														"supplier-product": supplierProductId,
														supplier: supplierId,
														perso: "hey",
													},
												}
											: {
													pathname: "/selection/[supplier]/perso/[perso]",
													params: {
														supplier: supplierId,
														perso: "hey",
													},
												}
									}
								/>
							</View>
							{data.other_information?.map((information, idx) => (
								<View key={idx} style={{ width: SCREEN_DIMENSIONS.width - 28 }}>
									<ScpiComponent
										previousCategories={previousCategories}
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

const Logs = ({ link, title }: { link: Href; title: string }) => {
	return (
		<Link href={link} push asChild>
			<TouchableOpacity className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10">
				<View className="size-14 items-center justify-center rounded-lg bg-darkGray">
					<KeyRoundIcon size={20} color={config.theme.extend.colors.primary} />
				</View>
				<View className="flex-1">
					<Text className="text-lg font-semibold text-primary">{title}</Text>
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
	brochures,
	previousCategories,
	supplierCategoryId,
	supplierProductId,
	supplierId,
}: {
	previousCategories: boolean;
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	phone?: string | null;
	email?: string | null;
	firstname?: string | null;
	lastname?: string | null;
	website?: string | null;
	brochures?: Supplier["brochures"];
}) => {
	const numbersString = phone?.replace(",", " / ");
	const numbers = numbersString?.split(" / ").map((number) => number.replace(/^\s+|\s+$/g, ""));

	return (
		<View className="gap-3">
			<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				<Text className="text-sm text-primaryLight">Prénom et Nom</Text>
				<Text selectable className="font-semibold text-primary">
					{firstname} {lastname?.toUpperCase()}
				</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<View className="flex-row items-center justify-between gap-2">
					<View className="shrink gap-2">
						<Text className="text-sm text-primaryLight">Téléphone</Text>
						<Text selectable className="text-base font-semibold text-primary">
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
					<View className="shrink grow-0 gap-2">
						<Text className="text-sm text-primaryLight">E-mail</Text>
						<Text selectable className="text-base font-semibold text-primary">
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
					<View className="shrink grow-0 gap-2">
						<Text className="text-sm text-primaryLight">Adresse du site internet</Text>
						<Text selectable className="text-base font-semibold text-primary">
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
			{brochures?.map((brochure) => (
				<Brochure
					key={brochure.brochure.id}
					brochure={brochure.brochure}
					updatedAt={brochure.brochure.updatedAt}
					title={brochure.name}
					link={
						previousCategories
							? {
									pathname:
										"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/pdf/[pdf]",
									params: {
										"supplier-category": supplierCategoryId as string,
										"supplier-product": supplierProductId as string,
										supplier: supplierId as string,
										pdf: brochure.brochure.filename || "",
									},
								}
							: {
									pathname: "/selection/[supplier]/pdf/[pdf]",
									params: {
										supplier: supplierId as string,
										pdf: brochure.brochure.filename || "",
									},
								}
					}
				/>
			))}
		</View>
	);
};

const ScpiComponent = ({
	information,
	supplierCategoryId,
	supplierProductId,
	previousCategories,
	supplierId,
	updatedAt,
}: {
	information: NonNullable<Supplier["other_information"]>[number];
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	previousCategories: boolean;
	updatedAt: string;
}) => {
	return (
		<View className="gap-2">
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				<Text className="text-sm font-semibold text-primaryLight">SCPI</Text>
				<Text className="text-sm font-semibold text-primary">{information.scpi}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="text-sm font-semibold text-primaryLight">Thématique</Text>
				<Text className="text-base font-semibold text-primary">{information.theme}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<View className="flex flex-row items-center justify-between">
					<Text className="text-sm font-semibold text-primaryLight">Épargne</Text>
					<Text className="rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
						{information.epargne ? "Oui" : "Non"}
					</Text>
				</View>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="text-sm font-semibold text-primaryLight">Remarque</Text>
				<Text className="text-base font-semibold text-primary">{information.annotation}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="text-sm font-semibold text-primaryLight">Frais de souscription</Text>
				<Text className="text-base font-semibold text-primary">{information.subscription_fee}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="text-sm font-semibold text-primaryLight">Délai de jouissance</Text>
				<Text className="text-base font-semibold text-primary">{information.duration}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="text-sm font-semibold text-primaryLight">Rentabilité N1</Text>
				<Text className="text-base font-semibold text-primary">{information.rentability_n1}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="text-sm font-semibold text-green-600">Commission pour le groupe Valorem</Text>
				<Text className="text-base font-semibold text-green-600">{information.commission_offer_group_valorem}</Text>
				<View className="my-2 h-px w-full bg-defaultGray/15" />
				<Text className="text-sm font-semibold text-primaryLight">Commission pour l'offre publique</Text>
				<Text className="text-base font-semibold text-primary">{information.commission_public_offer}</Text>
			</View>
			{information.brochure && (
				<Brochure
					brochure={information.brochure}
					updatedAt={updatedAt}
					link={
						previousCategories
							? {
									pathname:
										"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/pdf/[pdf]",
									params: {
										"supplier-category": supplierCategoryId as string,
										"supplier-product": supplierProductId as string,
										supplier: supplierId as string,
										pdf: information.brochure.filename || "",
									},
								}
							: {
									pathname: "/selection/[supplier]/pdf/[pdf]",
									params: {
										supplier: supplierId as string,
										pdf: information.brochure.filename || "",
									},
								}
					}
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
	previousCategories,
	updatedAt,
}: {
	information: NonNullable<PrivateEquity["fond"]>[number];
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	previousCategories: boolean;
	updatedAt: string;
}) => {
	return (
		<View className="gap-2">
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				{Object.entries(information)
					.filter(([key, value]) => key !== "brochure" && key !== "id" && value)
					.map(([key, value], idx, arr) => (
						<React.Fragment key={key}>
							<Text className="text-sm font-semibold text-primaryLight">{key}</Text>
							<Text className="text-sm font-semibold text-primary">{value as string}</Text>
							{idx < arr.length - 1 && <View className="my-2 h-px w-full bg-defaultGray/15" />}
						</React.Fragment>
					))}
			</View>
			{information.brochure && (
				<Brochure
					brochure={information.brochure}
					updatedAt={updatedAt}
					link={
						previousCategories
							? {
									pathname:
										"/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/pdf/[pdf]",
									params: {
										"supplier-category": supplierCategoryId as string,
										"supplier-product": supplierProductId as string,
										supplier: supplierId as string,
										pdf: information.brochure.filename || "",
									},
								}
							: {
									pathname: "/selection/[supplier]/pdf/[pdf]",
									params: {
										supplier: supplierId as string,
										pdf: information.brochure.filename || "",
									},
								}
					}
				/>
			)}
		</View>
	);
};
