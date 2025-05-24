import { HrefObject, Link, Redirect, useLocalSearchParams } from "expo-router";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";
import { MailIcon, PhoneIcon, PlusIcon } from "lucide-react-native";
import { getChatRoomQuery } from "@/api/queries/chat-room-queries";
import IndependantIcon from "@/components/independant-icon";
import BackgroundLayout from "@/layouts/background-layout";
import EmployeesIcon from "@/components/emloyees-icon";
import { useQuery } from "@tanstack/react-query";
import config from "tailwind.config";
import { Text } from "react-native";


export default function Page() {
	const { chat } = useLocalSearchParams<{ chat?: string }>();

	const { data: chatRoom } = useQuery({
		queryKey: ["chat-rooms", chat],
		queryFn: getChatRoomQuery,
		enabled: !!chat,
	});

	if (!chatRoom) return null;

	return (
		<BackgroundLayout className="px-4 pb-4 pt-10">
			<View className="items-center gap-2 rounded-2xl bg-white p-4 mb-4">
				<View className="size-20 items-center justify-center rounded-full bg-secondaryLight">
					<EmployeesIcon width={36} height={36} color={config.theme.extend.colors.primary} />
				</View>
				<Text className="font-bold text-xl text-dark">{chatRoom.name}</Text>
				<Text className="text-md text-defaultGray">{chatRoom.description}</Text>
			</View>
			<ContactInfo
					firstname={chatRoom.app_user.firstname}
					lastname={chatRoom.app_user.lastname}
				/>
			<View className="mt-5 flex-row items-center justify-between">
				<Text className="font-semibold text-xl">{chatRoom.guests.length} Membres</Text>
				{/* <Link href="/chat/new-room" asChild> */}
				<TouchableOpacity className="rounded-full bg-primaryUltraLight p-2.5">
					<PlusIcon size={18} color={config.theme.extend.colors.primary} />
				</TouchableOpacity>
				{/* </Link> */}
			</View>
			<ScrollView
				className="flex-1 mt-4"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 16 }}
			>
				<View className="mb-4 gap-2">
					{chatRoom.guests.map((guest) => (
						<Card key={guest} icon={<IndependantIcon />} title={guest} />
					))}
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}

const Card = ({ icon, title }: { icon: any; title: string }) => {
	return (
		<View className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2">
			<View className="size-14 items-center justify-center rounded-lg bg-secondaryLight">{icon}</View>
			<View className="flex-1">
				<Text className="font-semibold text-lg text-dark">{title}</Text>
			</View>
		</View>
	);
};

const ContactInfo = ({
	firstname,
	lastname,
}: {
	firstname?: string | null;
	lastname?: string | null;
}) => {
	return (
		<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="font-semibold text-sm text-defaultGray">Créateur du groupe de conversation</Text>
			<Text selectable className="font-semibold text-base text-dark">
				{firstname} {lastname?.toUpperCase()}
			</Text>
		
		</View>
	);
};
