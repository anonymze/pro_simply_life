import { queryClient } from "@/api/_queries";
import { User } from "@/types/user";
import { isNewEmployee } from "@/utils/helper";
import { Href, Link } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";
import { MyTouchableOpacity } from "../my-pressable";

export default function CardSupplier({ icon, user, link }: { icon: React.ReactNode; user: User; link: Href }) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["app-user", user.id], user);
	}, [link]);

	const isNew = isNewEmployee(user.entry_date);

	return (
		<Link href={link} push asChild>
			<MyTouchableOpacity
				onPressIn={onPress}
				className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10"
			>
				<View className="relative" style={{ overflow: "visible" }}>
					{icon}
					{isNew && (
						<View
							className="absolute h-4 w-4 rounded-full border-2 border-white bg-green-500"
							style={{ top: 0, right: 0 }}
						/>
					)}
				</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-primary">{user.firstname + " " + user.lastname}</Text>
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</MyTouchableOpacity>
		</Link>
	);
}
