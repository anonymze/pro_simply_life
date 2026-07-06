import { getPrivateEquityQuery } from "@/api/queries/private-equity-queries";
import { getSupplierQuery } from "@/api/queries/supplier-queries";
import { Brochure } from "@/components/brochure";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { Media } from "@/types/media";
import { FOND_LABELS, PrivateEquity } from "@/types/private-equity";
import {
	Supplier,
	SupplierBlockAssuranceVie,
	SupplierBlockCapitalisation,
	SupplierBlockCif,
	SupplierBlockClubDeals,
	SupplierBlockCrypto,
	SupplierBlockPea,
	SupplierBlockPer,
	SupplierBlockScpi,
	SupplierInformationBlock,
} from "@/types/supplier";
import { userHierarchy } from "@/types/user";
import { cn } from "@/utils/cn";
import { downloadFile } from "@/utils/download";
import { SCREEN_DIMENSIONS } from "@/utils/helper";
import { getStorageUserInfos } from "@/utils/store";
import { LegendList } from "@legendapp/list";
import { useQuery } from "@tanstack/react-query";
import { useEvent } from "expo";
import * as Clipboard from "expo-clipboard";
import { Href, Link, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import * as WebBrowser from "expo-web-browser";
import { ChevronRight, CopyIcon, KeyRoundIcon, LinkIcon, MailIcon, PhoneIcon } from "lucide-react-native";
import React from "react";
import {
	ActivityIndicator,
	Alert,
	DimensionValue,
	Linking,
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import config from "tailwind.config";

const DEFAULT_MAX_VALUE = 5_000_000;

// regle client : seuls les champs remplis apparaissent dans l'appli
const hasValue = (v: unknown): boolean => v != null && v !== "";

const BLOCK_TYPE_LABELS: Record<SupplierInformationBlock["blockType"], string> = {
	assurance_vie: "Assurance Vie / Luxembourg",
	per: "PER",
	capitalisation: "Contrat de Capitalisation",
	crypto: "Crypto",
	scpi: "SCPI",
	pea: "PEA",
	cif: "Girardin Industriel",
	club_deals: "Club Deals",
};

// titre d'onglet : nom de la fiche -> blockName -> intitule du type
const ficheTabTitle = (block: SupplierInformationBlock): string => {
	const name = block.blockType === "scpi" ? block.scpi : "name" in block ? block.name : null;
	if (name != null && name !== "") return name;
	if (block.blockName != null && block.blockName !== "") return block.blockName;
	return BLOCK_TYPE_LABELS[block.blockType];
};

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

	const videoUrl = data?.video?.url ?? null;
	const [isVideoLoading, setIsVideoLoading] = React.useState(false);
	const player = useVideoPlayer(null);

	const { status: videoStatus } = useEvent(player, "statusChange", { status: player.status });

	if (videoStatus === "readyToPlay" && isVideoLoading) {
		setIsVideoLoading(false);
	}

	React.useEffect(() => {
		if (!videoUrl) return;

		setIsVideoLoading(true);
		const filename = videoUrl.split("/").pop() ?? "video.mp4";

		downloadFile(videoUrl, filename, "video/mp4")
			.then((file) => {
				player.replaceAsync(file.uri);
			})
			.catch((e) => console.error("Video load error:", e));
	}, [videoUrl]);

	const { data: privateEquity } = useQuery({
		queryKey: ["private-supplier", privateEquityId],
		queryFn: getPrivateEquityQuery,
		enabled: !!privateEquityId,
	});

	// Hide fonds whose end_date_product is in the past
	const visibleFonds = React.useMemo(() => {
		const fonds = privateEquity?.fond ?? [];
		const now = Date.now();
		return fonds.filter((f) => !f.end_date_product || new Date(f.end_date_product).getTime() >= now);
	}, [privateEquity]);

	// atterrissage sur l'onglet enveloppes (girardin / club deals) quand il existe
	const landingAppliedRef = React.useRef(false);
	React.useEffect(() => {
		if (!data || landingAppliedRef.current) return;
		landingAppliedRef.current = true;

		if (visibleFonds.length > 0) return;

		const hasEnveloppeBlocks = (data.other_information_blocks ?? []).some(
			(b) => b.blockType === "cif" || b.blockType === "club_deals",
		);
		if (hasEnveloppeBlocks) {
			setCurrentIndex(1);
			requestAnimationFrame(() => {
				horizontalScrollRef.current?.scrollTo({ x: SCREEN_DIMENSIONS.width - 28 + 16, animated: false });
			});
		}
	}, [data, visibleFonds]);

	if (!data || !appUser?.user) return null;

	const blocks = data.other_information_blocks ?? [];
	const girardinBlocks = blocks.filter((b): b is SupplierBlockCif => b.blockType === "cif");
	const clubDealsBlocks = blocks.filter((b): b is SupplierBlockClubDeals => b.blockType === "club_deals");
	const ficheBlocks = blocks.filter(
		(b): b is Exclude<SupplierInformationBlock, SupplierBlockCif | SupplierBlockClubDeals> =>
			b.blockType !== "cif" && b.blockType !== "club_deals",
	);

	// vue fonds private equity inchangee, sinon un onglet par fiche produit
	const showFondsView = visibleFonds.length > 0;

	const tabs = [
		{ title: "Contact" },
		...(girardinBlocks.length > 0 ? [{ title: "Girardin Industriel" }] : []),
		...(clubDealsBlocks.length > 0 ? [{ title: "Club Deals" }] : []),
		...ficheBlocks.map((b) => ({ title: ficheTabTitle(b) })),
	];
	const hasTabs = showFondsView || tabs.length > 1;

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
				{/* onglets fiches produit */}
				{!showFondsView && tabs.length > 1 && (
					<LegendList
						showsHorizontalScrollIndicator={false}
						data={tabs}
						horizontal
						className="h-15 my-4"
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
								</Pressable>
							);
						}}
					></LegendList>
				)}

				{/* PRIVATE EQUITY */}
				{showFondsView && (
					<LegendList
						showsHorizontalScrollIndicator={false}
						data={[
							{
								title: "Contact",
								subtitle: "",
							},
							...visibleFonds.map((fond) => ({
								title: fond.name,
							})),
						]}
						horizontal
						className="h-15 my-4"
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
					contentContainerStyle={{ paddingBottom: 10, paddingTop: !hasTabs ? 16 : 0 }}
				>

					{showFondsView ? (
						<ScrollView
							scrollViewRef={horizontalScrollRef as React.RefObject<ScrollView>}
							horizontal
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							decelerationRate={"fast"}
							contentContainerStyle={{ gap: 16 }}
						>
							<View className="gap-2" style={{ width: SCREEN_DIMENSIONS.width - 32 }}>
								<ContactInfo
									supplierId={supplierId}
									supplierCategoryId={supplierCategoryId}
									supplierProductId={supplierProductId}
									phone={data.contact_info?.phone}
									email={data.contact_info?.email}
									website={data.website}
									firstname={data.contact_info?.firstname}
									lastname={data.contact_info?.lastname}
									brochures={data.brochures}
									previousCategories
									photo={data.contact_info.photo}
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
							{visibleFonds.map((fond, idx) => (
								<View key={idx} style={{ width: SCREEN_DIMENSIONS.width - 32 }}>
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
							ref={horizontalScrollRef}
							horizontal
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							decelerationRate={"fast"}
							contentContainerStyle={{ gap: 16 }}
						>
							<View className="gap-2" style={{ width: SCREEN_DIMENSIONS.width - 32 }}>
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
									photo={data.contact_info.photo}
									player={player}
									videoUrl={videoUrl}
									isVideoLoading={isVideoLoading}
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

							{girardinBlocks.length > 0 && (
								<View className="gap-4" style={{ width: SCREEN_DIMENSIONS.width - 32 }}>
									{girardinBlocks.map((enveloppe, idx) => {
										if (enveloppe.amount == null) return null;

										const amount = enveloppe.amount;
										const global = enveloppe.global || DEFAULT_MAX_VALUE;
										const ratio = amount / global;
										const widthPercent: DimensionValue =
											amount >= global ? "100%" : ratio < 0.1 ? "10%" : `${ratio * 100}%`;

										return (
											<View
												key={enveloppe.id ?? idx}
												className="rounded-2xl bg-white p-4 shadow-sm shadow-defaultGray/10"
											>
												{amount > 0 && (
													<Text className="text-md mt-5 font-semibold text-primary">
														Taux de remplissage{girardinBlocks.length > 1 ? ` (enveloppe ${idx + 1})` : ""}
													</Text>
												)}
												{amount > 0 && (
													<View className="mt-5">
														<View className="flex-row">
															<View className="gap-1" style={{ width: widthPercent }}>
																<View className="h-1.5 w-full rounded-full bg-green-600" />
															</View>
														</View>
													</View>
												)}
												<View className="mb-3 mt-6 flex-row items-center gap-2">
													<View className="size-2 rounded-full bg-green-600" />
													{amount === 0 ? (
														<Text className="text-backgroundChat">Enveloppe ouverte</Text>
													) : (
														<>
															<Text className="text-backgroundChat">Montant enveloppe disponible</Text>
															<Text className="ml-auto text-sm font-light text-primaryLight">
																{amount.toLocaleString("fr-FR")}€
															</Text>
														</>
													)}
												</View>
												{enveloppe.echeance != null && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-sm text-backgroundChat">Echéance de l'enveloppe</Text>
														<Text className="ml-auto text-sm font-light text-primaryLight">
															{new Date(enveloppe.echeance).toLocaleDateString("fr-FR", {
																day: "numeric",
																month: "numeric",
																year: "numeric",
															})}
														</Text>
													</View>
												)}
												{hasValue(enveloppe.reduction) && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-sm text-backgroundChat">Réduction d'impôt</Text>
														<Text className="ml-auto text-sm font-light text-primaryLight">{enveloppe.reduction}</Text>
													</View>
												)}
												{enveloppe.actualisation != null && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-sm text-backgroundChat">Date d'actualisation</Text>
														<Text className="ml-auto text-sm font-light text-primaryLight">
															{new Date(enveloppe.actualisation).toLocaleDateString("fr-FR", {
																day: "numeric",
																month: "numeric",
																year: "numeric",
															})}
														</Text>
													</View>
												)}
												{hasValue(enveloppe.commission) && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-sm text-backgroundChat">Commissions</Text>
														<Text className="ml-auto text-sm font-light text-primaryLight">{enveloppe.commission}</Text>
													</View>
												)}
												{hasValue(enveloppe.commission_valorem) && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-xs text-green-600">Commissions négociées Groupe Valorem</Text>
														<Text className="ml-auto text-xs font-light text-green-600">
															{enveloppe.commission_valorem}
														</Text>
													</View>
												)}
												{hasValue(enveloppe.droits) && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-sm text-backgroundChat">Plein droit</Text>
														<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
															{enveloppe.droits === "yes" ? "Oui" : "Non"}
														</Text>
													</View>
												)}
												{hasValue(enveloppe.agrement) && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-sm text-backgroundChat">Agrément</Text>
														<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
															{enveloppe.agrement === "yes" ? "Oui" : "Non"}
														</Text>
													</View>
												)}
												{hasValue(enveloppe.assurance) && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-sm text-backgroundChat">Garantie de bonne fin fiscale</Text>
														<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
															{enveloppe.assurance === "yes"
																? "Oui"
																: enveloppe.assurance === "maybe"
																	? "Parfois"
																	: "Non"}
														</Text>
													</View>
												)}
												{hasValue(enveloppe.investisseur) && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-sm text-backgroundChat">Garantie individuelle investisseur</Text>
														<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
															{enveloppe.investisseur === "yes" ? "Oui" : "Non"}
														</Text>
													</View>
												)}
												{hasValue(enveloppe.close) && (
													<View className="mt-3 flex-row items-center gap-2">
														<Text className="text-sm text-backgroundChat">Clause de non retour</Text>
														<Text className="ml-auto rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
															{enveloppe.close === "yes" ? "Oui" : "Non"}
														</Text>
													</View>
												)}
												{hasValue(enveloppe.remarque) && (
													<View className="mt-3 gap-2">
														<Text className="text-sm text-backgroundChat">Remarques :</Text>
														<Text className="text-sm font-light text-primaryLight">{enveloppe.remarque}</Text>
													</View>
												)}
											</View>
										);
									})}
								</View>
							)}

							{clubDealsBlocks.length > 0 && (
								<View className="gap-4" style={{ width: SCREEN_DIMENSIONS.width - 32 }}>
									{clubDealsBlocks.map((clubDeal, idx) => (
										<ClubDealComponent
											key={clubDeal.id ?? idx}
											information={clubDeal}
											supplierCategoryId={supplierCategoryId}
											supplierProductId={supplierProductId}
											supplierId={supplierId}
											previousCategories={previousCategories}
											updatedAt={data.updatedAt}
										/>
									))}
								</View>
							)}

							{ficheBlocks.map((block, idx) => (
								<View key={block.id ?? idx} style={{ width: SCREEN_DIMENSIONS.width - 32 }}>
									{block.blockType === "scpi" ? (
										<ScpiComponent
											previousCategories={previousCategories}
											information={block}
											supplierCategoryId={supplierCategoryId}
											supplierId={supplierId}
											supplierProductId={supplierProductId}
											updatedAt={data.updatedAt}
										/>
									) : block.blockType === "pea" ? (
										<PEAComponent information={block} />
									) : block.blockType === "crypto" ? (
										<CryptoComponent
											previousCategories={previousCategories}
											information={block}
											supplierCategoryId={supplierCategoryId}
											supplierId={supplierId}
											supplierProductId={supplierProductId}
											updatedAt={data.updatedAt}
										/>
									) : (
										<ContratComponent
											previousCategories={previousCategories}
											information={block}
											supplierCategoryId={supplierCategoryId}
											supplierId={supplierId}
											supplierProductId={supplierProductId}
											updatedAt={data.updatedAt}
										/>
									)}
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
	photo,
	brochures,
	previousCategories,
	supplierCategoryId,
	supplierProductId,
	supplierId,
	player,
	videoUrl,
	isVideoLoading,
}: {
	previousCategories: boolean;
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	photo?: Media | null;
	phone?: string | null;
	email?: string | null;
	firstname?: string | null;
	lastname?: string | null;
	website?: string | null;
	brochures?: Supplier["brochures"];
	player?: ReturnType<typeof useVideoPlayer>;
	videoUrl?: string | null;
	isVideoLoading?: boolean;
}) => {
	const numbersString = phone?.replace(",", " / ");
	const numbers = numbersString?.split(" / ").map((number) => number.replace(/^\s+|\s+$/g, ""));

	return (
		<View className="gap-3">
			<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				<View className="flex-row items-center justify-between gap-2">
					<View className="shrink gap-2">
						<Text className="text-sm text-primaryLight">Prénom et nom</Text>
						<Text selectable className="text-base font-semibold text-primary">
							{firstname} {lastname?.toUpperCase()}
						</Text>
					</View>
					{photo && (
						<ImagePlaceholder
							transition={300}
							contentFit="cover"
							placeholder={photo?.blurhash}
							placeholderContentFit="cover"
							source={photo?.url}
							// contentPosition="top"
							style={{ width: 90, height: 90, borderRadius: 8 }}
						/>
					)}
				</View>
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
			{videoUrl && player && (
				<View className="aspect-video items-center justify-center overflow-hidden rounded-xl">
					{isVideoLoading && (
						<View className="absolute inset-0 z-10 items-center justify-center bg-black/50">
							<ActivityIndicator size="large" color="#fff" />
						</View>
					)}
					<VideoView
						player={player}
						style={{
							width: "100%",
							height: "100%",
						}}
						fullscreenOptions={{ enable: true }}
						nativeControls
						// onFullscreenEnter={handleFullscreenEnter}
						// onFullscreenExit={handleFullscreenExit}
					/>
				</View>
			)}
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
	information: SupplierBlockScpi;
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	previousCategories: boolean;
	updatedAt: string;
}) => {
	const items: React.ReactNode[] = [];

	if (hasValue(information.theme))
		items.push(
			<View key="theme">
				<Text className="text-sm font-semibold text-primaryLight">Thématique</Text>
				<Text className="text-base font-semibold text-primary">{information.theme}</Text>
			</View>,
		);

	if (hasValue(information.epargne))
		items.push(
			<View key="epargne" className="flex flex-row items-center justify-between">
				<Text className="text-sm font-semibold text-primaryLight">Épargne</Text>
				<Text className="rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
					{information.epargne ? "Oui" : "Non"}
				</Text>
			</View>,
		);

	if (hasValue(information.nue))
		items.push(
			<View key="nue" className="flex flex-row items-center justify-between">
				<Text className="text-sm font-semibold text-primaryLight">Nue Propriété</Text>
				<Text className="rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
					{information.nue ? "Oui" : "Non"}
				</Text>
			</View>,
		);

	if (hasValue(information.minimum_versement))
		items.push(
			<View key="minimum_versement">
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement}</Text>
			</View>,
		);

	if (hasValue(information.minimum_versement_programme))
		items.push(
			<View key="minimum_versement_programme">
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement programmé</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement_programme}</Text>
			</View>,
		);

	if (hasValue(information.subscription_fee))
		items.push(
			<View key="subscription_fee">
				<Text className="text-sm font-semibold text-primaryLight">Frais de souscription</Text>
				<Text className="text-base font-semibold text-primary">{information.subscription_fee}</Text>
			</View>,
		);

	if (hasValue(information.duration))
		items.push(
			<View key="duration">
				<Text className="text-sm font-semibold text-primaryLight">Délai de jouissance</Text>
				<Text className="text-base font-semibold text-primary">{information.duration}</Text>
			</View>,
		);

	if (hasValue(information.rentability_n1))
		items.push(
			<View key="rentability_n1">
				<Text className="text-sm font-semibold text-primaryLight">Rentabilité N1</Text>
				<Text className="text-base font-semibold text-primary">{information.rentability_n1}</Text>
			</View>,
		);

	if (hasValue(information.commission_offer_group_valorem))
		items.push(
			<View key="commission_offer_group_valorem">
				<Text className="text-sm font-semibold text-green-600">Commission pour le groupe Valorem</Text>
				<Text className="text-base font-semibold text-green-600">{information.commission_offer_group_valorem}</Text>
			</View>,
		);

	if (hasValue(information.commission_public_offer))
		items.push(
			<View key="commission_public_offer">
				<Text className="text-sm font-semibold text-primaryLight">Commission pour l'offre publique</Text>
				<Text className="text-base font-semibold text-primary">{information.commission_public_offer}</Text>
			</View>,
		);

	if (hasValue(information.annotation))
		items.push(
			<View key="annotation" className="mt-3 gap-2">
				<Text className="text-sm text-backgroundChat">Remarques :</Text>
				<Text className="text-sm font-light text-primaryLight">{information.annotation}</Text>
			</View>,
		);

	return (
		<View className="gap-2">
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				{items.map((item, idx) => (
					<React.Fragment key={idx}>
						{idx > 0 && <View className="my-2 h-px w-full bg-defaultGray/15" />}
						{item}
					</React.Fragment>
				))}
			</View>
			{information.brochure && typeof information.brochure === "object" && (
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

const ClubDealComponent = ({
	information,
	supplierCategoryId,
	supplierProductId,
	previousCategories,
	supplierId,
	updatedAt,
}: {
	information: SupplierBlockClubDeals;
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	previousCategories: boolean;
	updatedAt: string;
}) => {
	const amount = information.amount ?? 0;
	const global = information.global || DEFAULT_MAX_VALUE;
	const ratio = amount / global;
	const widthPercent: DimensionValue = amount >= global ? "100%" : ratio < 0.1 ? "10%" : `${ratio * 100}%`;

	const items: React.ReactNode[] = [];

	if (amount > 0)
		items.push(
			<View key="taux">
				<Text className="text-md font-semibold text-primary">Taux de remplissage</Text>
				<View className="mt-2">
					<View className="flex-row">
						<View className="gap-1" style={{ width: widthPercent }}>
							<View className="h-1.5 w-full rounded-full bg-green-600" />
						</View>
					</View>
				</View>
				<View className="mt-3 flex-row items-center gap-2">
					<View className="size-2 rounded-full bg-green-600" />
					<Text className="text-backgroundChat">Montant enveloppe disponible</Text>
					<Text className="ml-auto text-sm font-light text-primaryLight">{amount.toLocaleString("fr-FR")}€</Text>
				</View>
			</View>,
		);

	if (information.amount != null && amount === 0)
		items.push(
			<View key="enveloppe_ouverte" className="flex-row items-center gap-2">
				<View className="size-2 rounded-full bg-green-600" />
				<Text className="text-backgroundChat">Enveloppe ouverte</Text>
			</View>,
		);

	if (hasValue(information.minimum_versement))
		items.push(
			<View key="minimum_versement">
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement}</Text>
			</View>,
		);

	if (hasValue(information.subscription_fee))
		items.push(
			<View key="subscription_fee">
				<Text className="text-sm font-semibold text-primaryLight">Frais de souscription</Text>
				<Text className="text-base font-semibold text-primary">{information.subscription_fee}</Text>
			</View>,
		);

	if (hasValue(information.duration))
		items.push(
			<View key="duration">
				<Text className="text-sm font-semibold text-primaryLight">Durée</Text>
				<Text className="text-base font-semibold text-primary">{information.duration}</Text>
			</View>,
		);

	if (hasValue(information.operation))
		items.push(
			<View key="operation">
				<Text className="text-sm font-semibold text-primaryLight">Opération</Text>
				<Text className="text-base font-semibold text-primary">{information.operation}</Text>
			</View>,
		);

	if (hasValue(information.rentability_n1))
		items.push(
			<View key="rentability_n1">
				<Text className="text-sm font-semibold text-primaryLight">Rentabilité</Text>
				<Text className="text-base font-semibold text-primary">{information.rentability_n1}</Text>
			</View>,
		);

	if (hasValue(information.ventilation))
		items.push(
			<View key="ventilation">
				<Text className="text-sm font-semibold text-primaryLight">Distribution au client</Text>
				<Text className="text-base font-semibold text-primary capitalize">{information.ventilation}</Text>
			</View>,
		);

	if (hasValue(information.commission_offer_group_valorem))
		items.push(
			<View key="commission_offer_group_valorem">
				<Text className="text-sm font-semibold text-green-600">Commission pour le groupe Valorem</Text>
				<Text className="text-base font-semibold text-green-600">{information.commission_offer_group_valorem}</Text>
			</View>,
		);

	if (hasValue(information.commission_public_offer))
		items.push(
			<View key="commission_public_offer">
				<Text className="text-sm font-semibold text-primaryLight">Commission pour l'offre publique</Text>
				<Text className="text-base font-semibold text-primary">{information.commission_public_offer}</Text>
			</View>,
		);

	if (hasValue(information.annotation))
		items.push(
			<View key="annotation" className="mt-3 gap-2">
				<Text className="text-sm text-backgroundChat">Remarques :</Text>
				<Text className="text-sm font-light text-primaryLight">{information.annotation}</Text>
			</View>,
		);

	return (
		<View className="gap-2">
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				{items.map((item, idx) => (
					<React.Fragment key={idx}>
						{idx > 0 && <View className="my-2 h-px w-full bg-defaultGray/15" />}
						{item}
					</React.Fragment>
				))}
			</View>
			{information.brochure && typeof information.brochure === "object" && (
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
					.filter(([key]) => key !== "brochure" && key !== "id")
					.filter(([, value]) => hasValue(value))
					.map(([key, value], idx, arr) => {
						const display =
							key === "end_date_product" && value
								? new Date(value as string).toLocaleDateString("fr-FR", {
										day: "numeric",
										month: "numeric",
										year: "numeric",
									})
								: ((value as string) ?? "");

						return (
							<React.Fragment key={key}>
								<Text className="text-sm font-semibold text-primaryLight">{FOND_LABELS[key] || key}</Text>
								<Text className="text-sm font-semibold text-primary">{display}</Text>
								{idx < arr.length - 1 && <View className="my-2 h-px w-full bg-defaultGray/15" />}
							</React.Fragment>
						);
					})}
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

const PEAComponent = ({ information }: { information: SupplierBlockPea }) => {
	const items: React.ReactNode[] = [];

	if (hasValue(information?.banque))
		items.push(
			<View key="banque">
				<Text className="text-sm font-semibold text-primaryLight">Banque dépositaire</Text>
				<Text className="text-sm font-semibold text-primary">{information?.banque}</Text>
			</View>,
		);

	if (hasValue(information?.title_vif))
		items.push(
			<View key="title_vif" className="flex flex-row items-center justify-between">
				<Text className="text-sm font-semibold text-primaryLight">Titre vif</Text>
				<Text className="rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
					{information?.title_vif === "yes" ? "Oui" : "Non"}
				</Text>
			</View>,
		);

	if (hasValue(information?.architecture_open))
		items.push(
			<View key="architecture_open" className="flex flex-row items-center justify-between">
				<Text className="text-sm font-semibold text-primaryLight">Architecture ouverte</Text>
				<Text className="rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
					{information?.architecture_open === "yes" ? "Oui" : "Non"}
				</Text>
			</View>,
		);

	if (hasValue(information?.fonds))
		items.push(
			<View key="fonds">
				<Text className="text-sm font-semibold text-primaryLight">Nombre de fonds</Text>
				<Text className="text-base font-semibold text-primary">{information?.fonds}</Text>
			</View>,
		);

	if (hasValue(information?.vp))
		items.push(
			<View key="vp" className="flex flex-row items-center justify-between">
				<Text className="text-sm font-semibold text-primaryLight">Versement programmé</Text>
				<Text className="rounded-lg bg-backgroundChat px-2 py-1.5 font-semibold text-white">
					{information?.vp === "yes" ? "Oui" : "Non"}
				</Text>
			</View>,
		);

	if (hasValue(information?.retrocession_gestion_libre))
		items.push(
			<View key="retrocession_gestion_libre">
				<Text className="text-sm font-semibold text-primaryLight">Retrocession gestion libre</Text>
				<Text className="text-base font-semibold text-primary">{information?.retrocession_gestion_libre}</Text>
			</View>,
		);

	if (hasValue(information?.retrocession_gestion_mandat))
		items.push(
			<View key="retrocession_gestion_mandat">
				<Text className="text-sm font-semibold text-primaryLight">Retrocession gestion sous mandat</Text>
				<Text className="text-base font-semibold text-primary">{information?.retrocession_gestion_mandat}</Text>
			</View>,
		);

	if (hasValue(information?.passage_order))
		items.push(
			<View key="passage_order">
				<Text className="text-sm font-semibold text-primaryLight">Coût passage d'ordre</Text>
				<Text className="text-base font-semibold text-primary">{information?.passage_order}</Text>
			</View>,
		);

	if (hasValue(information?.interface))
		items.push(
			<View key="interface">
				<Text className="text-sm font-semibold text-primaryLight">Interface</Text>
				<Text className="text-base font-semibold text-primary">{information?.interface}</Text>
			</View>,
		);

	return (
		<View className="gap-2">
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				{items.map((item, idx) => (
					<React.Fragment key={idx}>
						{idx > 0 && <View className="my-2 h-px w-full bg-defaultGray/15" />}
						{item}
					</React.Fragment>
				))}
			</View>
		</View>
	);
};

const ContratComponent = ({
	information,
	supplierCategoryId,
	supplierProductId,
	previousCategories,
	supplierId,
	updatedAt,
}: {
	information: SupplierBlockAssuranceVie | SupplierBlockPer | SupplierBlockCapitalisation;
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	previousCategories: boolean;
	updatedAt: string;
}) => {
	const items: React.ReactNode[] = [];

	if (hasValue(information.minimum_versement_initial))
		items.push(
			<View key="minimum_versement_initial">
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement initial</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement_initial}</Text>
			</View>,
		);

	if (hasValue(information.minimum_versement_libre))
		items.push(
			<View key="minimum_versement_libre">
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement libre</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement_libre}</Text>
			</View>,
		);

	if (hasValue(information.minimum_versement_programme))
		items.push(
			<View key="minimum_versement_programme">
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement programmé</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement_programme}</Text>
			</View>,
		);

	if (hasValue(information.frais_souscription))
		items.push(
			<View key="frais_souscription">
				<Text className="text-sm font-semibold text-primaryLight">Frais de souscription</Text>
				<Text className="text-base font-semibold text-primary">{information.frais_souscription}</Text>
			</View>,
		);

	if ("personne_physique_morale" in information && hasValue(information.personne_physique_morale))
		items.push(
			<View key="personne_physique_morale">
				<Text className="text-sm font-semibold text-primaryLight">Personne Physique et/ou Personne Morale</Text>
				<Text className="text-base font-semibold text-primary">{information.personne_physique_morale}</Text>
			</View>,
		);

	if (hasValue(information.frais_arbitrage))
		items.push(
			<View key="frais_arbitrage">
				<Text className="text-sm font-semibold text-primaryLight">Frais d'arbitrage</Text>
				<Text className="text-base font-semibold text-primary">{information.frais_arbitrage}</Text>
			</View>,
		);

	if (hasValue(information.bonus_fournisseur))
		items.push(
			<View key="bonus_fournisseur">
				<Text className="text-sm font-semibold text-primaryLight">Bonus fournisseur</Text>
				<Text className="text-base font-semibold text-primary">{information.bonus_fournisseur}</Text>
			</View>,
		);

	if (hasValue(information.commission_groupe_valorem))
		items.push(
			<View key="commission_groupe_valorem">
				<Text className="text-sm font-semibold text-green-600">Sur commission Groupe Valorem</Text>
				<Text className="text-base font-semibold text-green-600">{information.commission_groupe_valorem}</Text>
			</View>,
		);

	return (
		<View className="gap-2">
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				{items.map((item, idx) => (
					<React.Fragment key={idx}>
						{idx > 0 && <View className="my-2 h-px w-full bg-defaultGray/15" />}
						{item}
					</React.Fragment>
				))}
			</View>
			{information.brochure && typeof information.brochure === "object" && (
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

const CryptoComponent = ({
	information,
	supplierCategoryId,
	supplierProductId,
	previousCategories,
	supplierId,
	updatedAt,
}: {
	information: SupplierBlockCrypto;
	supplierCategoryId: string | string[];
	supplierProductId: string | string[];
	supplierId: string | string[];
	previousCategories: boolean;
	updatedAt: string;
}) => {
	const items: React.ReactNode[] = [];

	if (hasValue(information.minimum_versement_initial_mandat))
		items.push(
			<View key="minimum_versement_initial_mandat">
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement initial par mandat</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement_initial_mandat}</Text>
			</View>,
		);

	if (hasValue(information.minimum_versement_libre_mandat))
		items.push(
			<View key="minimum_versement_libre_mandat">
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement libre par mandat</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement_libre_mandat}</Text>
			</View>,
		);

	if (hasValue(information.minimum_versement_programme_mandat))
		items.push(
			<View key="minimum_versement_programme_mandat">
				<Text className="text-sm font-semibold text-primaryLight">Minimum de versement programmé par mandat</Text>
				<Text className="text-base font-semibold text-primary">{information.minimum_versement_programme_mandat}</Text>
			</View>,
		);

	if (hasValue(information.frais_souscription))
		items.push(
			<View key="frais_souscription">
				<Text className="text-sm font-semibold text-primaryLight">Frais de souscription</Text>
				<Text className="text-base font-semibold text-primary">{information.frais_souscription}</Text>
			</View>,
		);

	return (
		<View className="gap-2">
			<View className="flex-1 gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
				{items.map((item, idx) => (
					<React.Fragment key={idx}>
						{idx > 0 && <View className="my-2 h-px w-full bg-defaultGray/15" />}
						{item}
					</React.Fragment>
				))}
			</View>
			{information.brochure && typeof information.brochure === "object" && (
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
