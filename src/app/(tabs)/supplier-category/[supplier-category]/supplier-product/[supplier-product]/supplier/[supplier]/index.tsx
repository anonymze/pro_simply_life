import { Download, EyeIcon, FileIcon, MailIcon, PhoneIcon } from "lucide-react-native";
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getSupplierQuery } from "@/api/queries/supplier-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import Image from "@/components/ui/image-placeholder";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Supplier } from "@/types/supplier";
import { StatusBar } from "expo-status-bar";
import config from "tailwind.config";
import React from "react";


export default function Page() {
	const { supplier: supplierId } = useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["supplier", supplierId],
		queryFn: getSupplierQuery,
		enabled: !!supplierId,
	});

	if (!data) return null;

	console.log(data);

	return (
		<>
			<View className="items-center rounded-2xl bg-white pb-4">
				<ImagePlaceholder contentFit="contain" source={data.logo?.url} style={{ width: "100%", height: 60 }} />
				<Text className="mt-4 text-xl font-bold">{data.name}</Text>
				<View className="mt-2 flex-row flex-wrap items-center gap-2">
					<Tag title="Fournisseur" />
					<Tag title="Fournisseur" />
				</View>
			</View>
			<BackgroundLayout className="p-4">
				<ContactInfo
					phone={data.contact_info?.phone}
					email={data.contact_info?.email}
					firstname={data.contact_info?.firstname}
					lastname={data.contact_info?.lastname}
				/>
				<Brochure data={data} />
			</BackgroundLayout>
		</>
	);
}

const Brochure = ({ data }: { data: Supplier }) => {
	return (
		<View className="mt-4 w-full gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="text-sm font-semibold text-defaultGray">Brochure</Text>
			<View className="flex-row items-center justify-between gap-2">
				<View className="flex-shrink flex-row items-center gap-2">
					<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">
						<FileIcon size={18} color={config.theme.extend.colors.defaultGray} />
					</View>
					<View className="flex-shrink">
						<Text className="text-sm font-semibold text-dark">{data.name}</Text>
						<Text className="text-sm font-semibold text-defaultGray">
							{new Date(data.updatedAt).toLocaleDateString("fr-FR", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							})}
						</Text>
					</View>
				</View>
				<View className="flex-row gap-3">
					<TouchableOpacity onPress={() => {}} className="rounded-full bg-primaryUltraLight p-3">
						<Download size={16} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => {}} className="rounded-full bg-primaryUltraLight p-3">
						<EyeIcon size={16} color={config.theme.extend.colors.primary} />
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
