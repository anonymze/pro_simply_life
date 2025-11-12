import { queryClient } from "@/api/_queries";
import { deleteChatRoomQuery, getChatRoomQuery, leaveChatRoomQuery } from "@/api/queries/chat-room-queries";
import EmployeesIcon from "@/components/emloyees-icon";
import IndependantIcon from "@/components/independant-icon";
import BackgroundLayout from "@/layouts/background-layout";
import { ChatRoom } from "@/types/chat";
import { PaginatedResponse } from "@/types/response";
import { User, userRoleLabels } from "@/types/user";
import { cn } from "@/utils/cn";
import { getStorageUserInfos } from "@/utils/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, router, useLocalSearchParams } from "expo-router";
import { LogOutIcon, PlusIcon, TrashIcon } from "lucide-react-native";
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function Page() {
	const { chat: chatId } = useLocalSearchParams();
	const appUser = getStorageUserInfos();
	const deleteChatRoom = useMutation({
		mutationFn: deleteChatRoomQuery,
		onSuccess: () => {
			queryClient.setQueryData(["chat-rooms"], (old: PaginatedResponse<ChatRoom>) => {
				return {
					...old,
					docs: old.docs.filter((chatRoom) => chatRoom.id !== chatId),
				};
			});
			router.back();
			router.back();
		},
		onError: () => {
			Alert.alert("Erreur", "Le groupe n'existe plus ou vous n'êtes pas autorisé à le supprimer.");
			router.back();
		},
	});

	const leaveChatRoom = useMutation({
		mutationFn: leaveChatRoomQuery,
		onSuccess: () => {
			queryClient.setQueryData(["chat-rooms"], (old: PaginatedResponse<ChatRoom>) => {
				return {
					...old,
					docs: old.docs.filter((chatRoom) => chatRoom.id !== chatId),
				};
			});
			router.back();
			router.back();
		},
		onError: (error) => {
			Alert.alert("Erreur", "Le groupe n'existe plus ou vous n'êtes pas autorisé à le quitter.");
			router.back();
		},
	});

	const { data: chatRoom } = useQuery({
		queryKey: ["chat-room", chatId],
		queryFn: getChatRoomQuery,
		enabled: !!chatId,
	});

	if (!chatRoom || !appUser) return null;

	const isOwner = chatRoom.app_user.id === appUser.user.id;

	return (
		<BackgroundLayout className={cn("px-4 pb-4", Platform.OS === "ios" ? "pt-0" : "pt-2")}>
			<View className="mb-4 items-center gap-2 rounded-2xl bg-white p-4">
				<View className="size-20 items-center justify-center rounded-full bg-darkGray">
					<EmployeesIcon width={36} height={36} color={config.theme.extend.colors.primary} />
				</View>
				<Text className="font-bold text-xl text-primary">{chatRoom.name}</Text>
				<Text className="text-md text-defaultGray">{chatRoom.description}</Text>
			</View>
			<ContactInfo firstname={chatRoom.app_user.firstname} lastname={chatRoom.app_user.lastname} />

			{isOwner && (
				<TouchableOpacity
					disabled={deleteChatRoom.isPending}
					onPress={() => {
						deleteChatRoom.mutate(chatId as string);
					}}
					className="mt-4 flex-row items-center gap-3 rounded-xl bg-white p-2 shadow shadow-defaultGray/10"
				>
					<View className="size-14 items-center justify-center rounded-xl bg-red-200">
						<TrashIcon size={22} color={config.theme.extend.colors.red2} />
					</View>
					<Text className="text-md font-semibold text-red2">Supprimer le groupe</Text>
					{deleteChatRoom.isPending && (
						<ActivityIndicator size="small" className="ml-auto mr-3" color={config.theme.extend.colors.red2} />
					)}
				</TouchableOpacity>
			)}

			<TouchableOpacity
				disabled={deleteChatRoom.isPending}
				onPress={() => {
					if (isOwner) {
						Alert.alert(
							"Créateur du groupe",
							"Si vous quittez le groupe, celui-ci sera supprimé car vous êtes le créateur.",
							[
								{
									text: "Annuler",
									style: "cancel",
								},
								{
									text: "Quitter",
									style: "destructive",
									onPress: () => leaveChatRoom.mutate({ chatRoomId: chatId as string, userId: appUser.user.id }),
								},
							],
						);
						return;
					}
					leaveChatRoom.mutate({ chatRoomId: chatId as string, userId: appUser.user.id });
				}}
				className="mt-4 flex-row items-center gap-3 rounded-xl bg-white p-2 shadow shadow-defaultGray/10"
			>
				<View className="size-14 items-center justify-center rounded-xl bg-red-200">
					<LogOutIcon size={22} color={config.theme.extend.colors.red2} />
				</View>
				<Text className="text-md font-semibold text-red2">Quitter le groupe</Text>
				{leaveChatRoom.isPending && (
					<ActivityIndicator size="small" className="ml-auto mr-3" color={config.theme.extend.colors.red2} />
				)}
			</TouchableOpacity>

			<View className="mt-5 flex-row items-center justify-between">
				<Text className="font-semibold text-xl text-primary">{chatRoom.guests.length} membre(s)</Text>
				<Link
					href={{
						pathname: "/(tabs)/chat/[chat]/add",
						params: {
							chat: chatId as string,
						},
					}}
					asChild
				>
					<TouchableOpacity className="rounded-full bg-darkGray p-2.5">
						<PlusIcon size={18} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				</Link>
			</View>

			<ScrollView
				className="mt-4 flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 16 }}
			>
				<View className="mb-4 gap-2">
					{chatRoom.guests.map((guest) => (
						<Card
							key={guest.id}
							icon={<IndependantIcon color={config.theme.extend.colors.primary} />}
							firstname={guest.firstname}
							lastname={guest.lastname}
							role={guest.role}
						/>
					))}
				</View>
			</ScrollView>
		</BackgroundLayout>
	);
}

const Card = ({
	icon,
	firstname,
	lastname,
	role,
}: {
	icon: any;
	firstname: string;
	lastname: string;
	role: User["role"];
}) => {
	return (
		<View className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2">
			<View className="size-14 items-center justify-center rounded-lg bg-darkGray">{icon}</View>
			<View className="flex-1">
				<Text className="font-semibold text-lg text-primary">
					{firstname} {lastname}
				</Text>
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
				{firstname} {lastname}
			</Text>
		</View>
	);
};
