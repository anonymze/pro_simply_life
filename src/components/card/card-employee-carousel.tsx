import { queryClient } from "@/api/_queries";
import { User } from "@/types/user";
import { isNewEmployee } from "@/utils/helper";
import { HrefObject, Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import ImagePlaceholder from "../ui/image-placeholder";

export default function CardEmployeeCarousel({
	user,
	link,
	associate = false,
}: {
	user: User;
	link: HrefObject;
	associate?: boolean;
}) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["app-user", user.id], user);
	}, [user]);

	const isNew = isNewEmployee(user.entry_date);

	return (
		<Link href={link} asChild>
			<TouchableOpacity onPressIn={onPress} hitSlop={5} className="items-center">
				<View className="relative" style={{ overflow: "visible" }}>
					<ImagePlaceholder
						transition={300}
						contentFit="cover"
						// contentPosition="top"
						placeholder={user.photo?.blurhash}
						placeholderContentFit="cover"
						source={user.photo?.url}
						className="rounded-full"
						style={{ width: associate ? 70 : 65, height: associate ? 70 : 65, borderRadius: 99 }}
					/>
					{isNew && (
						<View
							className="absolute h-4 w-4 rounded-full border-2 border-white bg-green-500"
							style={{ top: 0, right: 0 }}
						/>
					)}
				</View>
				<Text m className="mt-2 text-sm text-primary text-center">{user.firstname + " " + user.lastname}</Text>
			</TouchableOpacity>
		</Link>
	);
}
