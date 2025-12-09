import { getAppUserQuery } from "@/api/queries/app-user-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import BackgroundLayout from "@/layouts/background-layout";
import { userRoleLabels } from "@/types/user";
import { getStorageUserInfos } from "@/utils/store";
import { useQuery } from "@tanstack/react-query";
import { MailIcon, PhoneIcon } from "lucide-react-native";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const appUser = getStorageUserInfos();

	const { data } = useQuery({
		queryKey: ["app-user", appUser?.user.id],
		queryFn: getAppUserQuery,
		enabled: !!appUser?.user.id,
	});

	if (!data) return null;

	return (
		<BackgroundLayout>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 10 }}
			>
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
						<Text className="text-xl font-bold">{data.firstname + " " + data.lastname}</Text>
					</View>
				</View>
				<View className="mt-4 px-4">
					<ContactInfo
						phone={data.phone}
						email={data.email}
						emailPro={data.email_pro}
					/>
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}

const Tag = ({ title }: { title: string }) => {
	return (
		<View className="rounded-md bg-darkGray px-2 py-1.5">
			<Text className="text-xs font-semibold text-primaryLight">{title}</Text>
		</View>
	);
};

const ContactInfo = ({
	phone,
	email,
	emailPro,
}: {
	phone?: string | null;
	email?: string | null;
	emailPro?: string | null;
}) => {
	const numbersString = phone?.replace(",", " / ");

	return (
		<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">Téléphone</Text>
					<Text className="text-base font-semibold text-primary">{numbersString}</Text>
				</View>

			</View>
			<View className="my-2 h-px w-full bg-defaultGray/15" />
			<View className="flex-row items-center justify-between gap-2">
				<View className="gap-2">
					<Text className="text-sm text-primaryLight">E-mail</Text>
					<Text className="text-base font-semibold text-primary">{emailPro ? emailPro : email}</Text>
				</View>
			</View>
		</View>
	);
};
