import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getSupplierQuery } from "@/api/queries/supplier-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { getAppUserQuery } from "@/api/queries/app-user-queries";
import BackgroundLayout from "@/layouts/background-layout";
import { MailIcon, PhoneIcon } from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { userRoleLabels } from "@/types/user";
import config from "tailwind.config";


export default function Page() {
	const { organigramme: organigrammeId } = useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["app-user", organigrammeId],
		queryFn: getAppUserQuery,
		enabled: !!organigrammeId,
	});

	if (!data) return null;

	return (
		<>
			<View className="items-center rounded-b-2xl bg-white pb-4">
				<ImagePlaceholder
					transition={300}
					contentFit="cover"
					placeholder={data.photo?.blurhash}
					placeholderContentFit="cover"
					source={data.photo?.url}
					// contentPosition="top"
					style={{ width: 150, height: 150, borderRadius: 99 }}
				/>
				<View className="mt-4 items-center gap-3">
					<Text className="font-bold text-xl">{data.firstname + " " + data.lastname}</Text>
					<Tag title={userRoleLabels[data.role]} />
				</View>
			</View>
			<BackgroundLayout className="mt-4 px-4">
				<ContactInfo phone={data.phone} email={data.email} />
			</BackgroundLayout>
		</>
	);
}

const Tag = ({ title }: { title: string }) => {
	return (
		<View className="rounded-md bg-darkGray px-2 py-1.5">
			<Text className="font-semibold text-xs text-primaryLight">{title}</Text>
		</View>
	);
};

const ContactInfo = ({ phone, email }: { phone?: string | null; email?: string | null }) => {
	const numbersString = phone?.replace(",", " / ");
	const numbers = numbersString?.split(" / ").map((number) => number.replace(/^\s+|\s+$/g, ""));

	return (
		<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Téléphone</Text>
					<Text className="font-semibold text-base text-primary">{numbersString}</Text>
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
					<Text className="text-sm text-primaryLight">E-mail</Text>
					<Text className="font-semibold text-base text-primary">{email}</Text>
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
