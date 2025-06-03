import { Text, TouchableOpacity, View } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { HrefObject, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import config from "tailwind.config";
import { User } from "@/types/user";
import React from "react";


export default function CardSupplier({ icon, user, link }: { icon: React.ReactNode; user: User; link: HrefObject }) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["app-user", user.id], user);
	}, [link]);

	return (
		<Link href={link} push asChild>
			<TouchableOpacity
				onPressIn={onPress}
				className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10"
			>
				{icon}
				<View className="flex-1">
					<Text className="font-semibold text-lg text-primary">{user.firstname + " " + user.lastname}</Text>
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</TouchableOpacity>
		</Link>
	);
}
