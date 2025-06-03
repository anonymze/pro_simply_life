import { Text, TouchableOpacity } from "react-native";
import { HrefObject, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import { User } from "@/types/user";
import React from "react";

import ImagePlaceholder from "../ui/image-placeholder";


export default function CardEmployeeCarousel({ user, link }: { user: User; link: HrefObject }) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["app-user", user.id], user);
	}, [user]);
	return (
		<Link href={link} asChild>
			<TouchableOpacity
				onPressIn={onPress}
				hitSlop={5}
				className="items-center"
			>
				<ImagePlaceholder
					transition={300}
					contentFit="cover"
					// contentPosition="top"
					placeholder={user.photo?.blurhash}
					placeholderContentFit="cover"
					source={user.photo?.url}
					className="rounded-full size-20"
					style={{ width: 65, height: 65, borderRadius: 99 }}
				/>
				<Text className="text-sm text-primary mt-2">{user.firstname + " " + user.lastname}</Text>
			</TouchableOpacity>
		</Link>
	);
}
