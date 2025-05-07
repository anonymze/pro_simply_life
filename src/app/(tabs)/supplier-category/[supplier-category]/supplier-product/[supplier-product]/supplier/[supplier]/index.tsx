import { ArrowRight, Download, EyeIcon, FileIcon, KeyboardIcon, KeyIcon, KeyRoundIcon, MailIcon, PhoneIcon, } from "lucide-react-native";
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { HrefObject, Link, router, useLocalSearchParams } from "expo-router";
import { getSupplierQuery } from "@/api/queries/supplier-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { downloadFile, getFile } from "@/utils/download";
import { useQuery } from "@tanstack/react-query";
import type { Media } from "@/types/media";
import config from "tailwind.config";
import React from "react";


export default function Page() {
	const {
		supplier: supplierId,
		"supplier-product": supplierProductId,
		"supplier-category": supplierCategoryId,
	} = useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["supplier", supplierId],
		queryFn: getSupplierQuery,
		enabled: !!supplierId,
	});

	if (!data) return null;

	return (
		<>
			<View className="items-center rounded-2xl bg-white pb-4">
				<ImagePlaceholder contentFit="contain" source={data.logo?.url} style={{ width: "100%", height: 60 }} />
				<Text className="mt-4 text-xl font-bold">{data.name}</Text>
				{/* <View className="mt-2 flex-row flex-wrap items-center gap-2">
					<Tag title="Fournisseur" />
					<Tag title="Fournisseur" />
				</View> */}
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
			>
				<BackgroundLayout className="p-4">
					<ContactInfo
						phone={data.contact_info?.phone}
						email={data.contact_info?.email}
						firstname={data.contact_info?.firstname}
						lastname={data.contact_info?.lastname}
					/>
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
									pdf: data.brochure?.filename,
								},
							}}
						/>
					)}
					{data.connexion && (
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
				</BackgroundLayout>
			</ScrollView>
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
							<ActivityIndicator size="small" color={config.theme.extend.colors.primary} />
						) : (
							<EyeIcon size={16} color={config.theme.extend.colors.primary} />
						)}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const Tag = ({ title }: { title: string }) => {
	return (
		<View className="rounded-md bg-defaultGray/10 px-2 py-1.5">
			<Text className="text-xs font-semibold text-defaultGray">{title}</Text>
		</View>
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
	return (
		<View className="w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="text-sm font-semibold text-defaultGray">Contact</Text>
			<Text className="text-base font-semibold text-dark">
				{firstname} {lastname}
			</Text>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm font-semibold text-defaultGray">Téléphone</Text>
					<Text className="text-base font-semibold text-dark">{phone}</Text>
				</View>
				{phone && (
					<TouchableOpacity
						onPress={() => Linking.openURL(`tel:${phone}`)}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						<PhoneIcon size={16} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				)}
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
