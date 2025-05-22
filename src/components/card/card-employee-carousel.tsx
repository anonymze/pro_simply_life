import { Text, TouchableOpacity } from "react-native";
import { HrefObject, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import { User } from "@/types/user";
import React from "react";

import ImagePlaceholder from "../ui/image-placeholder";


export default function CardEmployeeCarousel({ user, width, link }: { user: User; width: number; link: HrefObject }) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["app-user", user.id], user);
	}, [user]);
	return (
		<Link href={link} asChild>
			<TouchableOpacity
				onPressIn={onPress}
				className="items-center gap-2 rounded-2xl bg-primary pb-2 pt-2"
				style={{ width }}
			>
				<ImagePlaceholder
					transition={300}
					contentFit="cover"
					// contentPosition="top"
					placeholder={user.photo?.blurhash}
					placeholderContentFit="cover"
					style={{ width: width - 16, height: width, borderRadius: 8 }}
					source={user.photo?.url}
				/>
				<Text className="font-semibold text-lg text-white">{user.firstname + " " + user.lastname}</Text>
			</TouchableOpacity>
		</Link>
	);
}
