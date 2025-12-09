import { getAppUserQuery } from "@/api/queries/app-user-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { userRoleLabels } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { MailIcon, PhoneIcon } from "lucide-react-native";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const { organigramme: userId } = useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["app-user", userId],
		queryFn: getAppUserQuery,
		enabled: !!userId,
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
				<View className="mt-1 items-center gap-3">
					<Text className="font-bold text-xl">{data.firstname + " " + data.lastname}</Text>
					<Tag title={userRoleLabels[data.role]} />
				</View>
			</View>
			<BackgroundLayout className="mt-4 px-4">
				<ContactInfo phone={data.phone} email={data.email} entryDate={data.entry_date} emailPro={data.email_pro} birthday={data.birthday} cabinet={data.cabinet} />
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

const ContactInfo = ({
	phone,
	email,
	entryDate,
	birthday,
	cabinet,
	emailPro
}: {
	phone?: string | null;
	email?: string | null;
	entryDate?: string | null;
	birthday?: string | null;
	cabinet?: string | null;
		emailPro?: string | null
}) => {
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
					<Text className="font-semibold text-base text-primary">{emailPro ? emailPro : email}</Text>
				</View>
				{(email || emailPro) ? (
					<TouchableOpacity
						onPress={() => Linking.openURL(`mailto:${email}`)}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						<MailIcon size={16} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				): null}
			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Cabinet</Text>
					<Text className="font-semibold text-base text-primary">
					{cabinet}
					</Text>
				</View>
			</View>
			{/*<View className="my-2 h-px w-full bg-defaultGray/15" />*/}
			{/*<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Date de naissance</Text>
					<Text className="font-semibold text-base text-primary">
						{birthday
							? new Date(birthday).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "2-digit",
									year: "numeric",
								})
							: ""}
					</Text>
				</View>
			</View>*/}
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Date d'entrée</Text>
					<Text className="font-semibold text-base text-primary">
						{entryDate
							? new Date(entryDate).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "2-digit",
									year: "numeric",
								})
							: ""}
					</Text>
				</View>
			</View>
		</View>
	);
};
