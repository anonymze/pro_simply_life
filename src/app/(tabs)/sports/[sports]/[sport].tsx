import { getSportQuery } from "@/api/queries/sport-queries";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/libs/tailwind";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { MailIcon, PhoneIcon } from "lucide-react-native";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const { sport: sportId, type } = useLocalSearchParams();

	const { data: sport } = useQuery({
		queryKey: ["sport", sportId],
		queryFn: getSportQuery,
		enabled: !!sportId,
	});

	if (!sport) return null;

	return (
		<BackgroundLayout className={cn("px-4 pb-4")}>
			<Title title={sport.type} />

			<ContactInfo phone={sport.phone} email={sport.email} firstname={sport.firstname} lastname={sport.lastname} />
		</BackgroundLayout>
	);
}

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
