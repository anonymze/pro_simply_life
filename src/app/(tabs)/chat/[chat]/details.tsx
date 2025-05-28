import { Linking, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { HrefObject, Link, Redirect, useLocalSearchParams } from "expo-router";
import { MailIcon, PhoneIcon, PlusIcon } from "lucide-react-native";
import { getChatRoomQuery } from "@/api/queries/chat-room-queries";
import IndependantIcon from "@/components/independant-icon";
import BackgroundLayout from "@/layouts/background-layout";
import EmployeesIcon from "@/components/emloyees-icon";
import { User, userRoleLabels } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import config from "tailwind.config";
import { Text } from "react-native";
import { cn } from "@/utils/cn";


export default function Page() {
	const { chat } = useLocalSearchParams<{ chat?: string }>();

	const { data: chatRoom } = useQuery({
		queryKey: ["chat-rooms", chat],
		queryFn: getChatRoomQuery,
		enabled: !!chat,
	});

	if (!chatRoom) return null;

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-2")}>
			<View className="mb-4 items-center gap-2 rounded-2xl bg-white p-4">
				<View className="size-20 items-center justify-center rounded-full bg-secondaryLight">
					<EmployeesIcon width={36} height={36} color={config.theme.extend.colors.primary} />
				</View>
				<Text className="font-bold text-xl text-primary">{chatRoom.name}</Text>
				<Text className="text-md text-defaultGray">{chatRoom.description}</Text>
			</View>
			<ContactInfo firstname={chatRoom.app_user.firstname} lastname={chatRoom.app_user.lastname} />
			<View className="mt-4 flex-row items-center justify-between">
				<Text className="font-semibold text-xl">{chatRoom.guests.length} Membres</Text>
				{/* <Link href="/chat/new-room" asChild> */}
				<TouchableOpacity className="rounded-full bg-primaryUltraLight p-2.5">
					<PlusIcon size={18} color={config.theme.extend.colors.primary} />
				</TouchableOpacity>
				{/* </Link> */}
			</View>
			<ScrollView
				className="mt-4 flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 16 }}
			>
				<View className="mb-4 gap-2">
					{chatRoom.guests.map((guest) => (
						<Card key={guest.id} icon={<IndependantIcon />} firstname={guest.firstname} lastname={guest.lastname} role={guest.role} />
					))}
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}

const Card = ({ icon, firstname, lastname, role }: { icon: any; firstname: string; lastname: string; role: User["role"] }) => {
	return (
		<View className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2">
			<View className="size-14 items-center justify-center rounded-lg bg-secondaryLight">{icon}</View>
			<View className="flex-1">
				<Text className="font-semibold text-lg text-primary">{firstname} {lastname}</Text>
				<Text className="text-sm text-defaultGray">{userRoleLabels[role]}</Text>
			</View>
		</View>
	);
};

const ContactInfo = ({ firstname, lastname }: { firstname?: string | null; lastname?: string | null }) => {
	return (
		<View className="gap-2 rounded-xl border border-defaultGray/10 bg-white p-4">
			<Text className="font-semibold text-sm text-defaultGray">Créateur du groupe de conversation</Text>
			<Text selectable className="font-semibold text-base text-primary">
				{firstname} {lastname?.toUpperCase()}
			</Text>
		</View>
	);
};
