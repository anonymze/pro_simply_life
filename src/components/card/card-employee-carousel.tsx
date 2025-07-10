import { Text, TouchableOpacity, View } from "react-native";
import { HrefObject, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import { isNewEmployee } from "@/utils/helper";
import { User } from "@/types/user";
import React from "react";

import ImagePlaceholder from "../ui/image-placeholder";


export default function CardEmployeeCarousel({ user, link }: { user: User; link: HrefObject }) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["app-user", user.id], user);
	}, [user]);
	
	const isNew = isNewEmployee(user.entry_date);
	
	return (
		<Link href={link} asChild>
			<TouchableOpacity
				onPressIn={onPress}
				hitSlop={5}
				className="items-center"
			>
				<View className="relative" style={{ overflow: 'visible' }}>
					<ImagePlaceholder
						transition={300}
						contentFit="cover"
						// contentPosition="top"
						placeholder={user.photo?.blurhash}
						placeholderContentFit="cover"
						source={user.photo?.url}
						className="rounded-full"
						style={{ width: 65, height: 65, borderRadius: 99 }}
					/>
					{isNew && (
						<View className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white" style={{ top: -2, right: -2 }} />
					)}
				</View>
				<Text className="text-sm text-primary mt-2">{user.firstname + " " + user.lastname}</Text>
			</TouchableOpacity>
		</Link>
	);
}
