import { Text, TouchableOpacity, View } from "react-native";
import { Media } from "@/types/media";
import { Image } from "expo-image";


export default function ProfileDashboard({
	firstname,
	lastname,
	photo,
	createdAt,
}: {
	firstname: string;
	lastname: string;
	createdAt: string;
	photo?: Media;
}) {
	return (
		<View className="flex-row items-center justify-between">
			<View className="flex-row items-center gap-3">
				{photo ? (
					<Image source={photo.url} placeholder={require("@/assets/icons/placeholder_user.svg")} />
				) : (
					<View className="size-12 items-center justify-center rounded-full bg-secondary">
						<Text className="text-sm uppercase tracking-[-1px] text-white">
							{firstname.charAt(0)} {lastname.charAt(0)}
						</Text>
					</View>
				)}
				<View>
					<Text className="text-sm text-defaultGray">Bonjour,</Text>
					<Text className="text-dark text-base font-semibold">
						{firstname} {lastname}
					</Text>
				</View>
			</View>
			<TouchableOpacity className="py-2 pl-2">
				<View className="size-9 items-center justify-center rounded-full bg-white shadow-sm shadow-defaultGray/20">
					<Text className="text-defaultGray">?</Text>
				</View> 
			</TouchableOpacity>
		</View>
	);
}
