import { Text, TouchableOpacity, View } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { HrefObject, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import { Supplier } from "@/types/supplier";
import { Fundesys } from "@/types/fundesys";
import { Fidnet } from "@/types/fidnet";
import config from "tailwind.config";
import React from "react";


export default function CardNewsletter({
	icon,
	newsletter,
	link,
	queryKey,
}: {
	icon: React.ReactNode;
	newsletter: Fundesys | Fidnet;
	link: HrefObject;
	queryKey: "fundesys" | "fidnet";
}) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData([queryKey, newsletter.id], newsletter);
	}, [link]);

	return (
		<Link href={link} push asChild>
			<TouchableOpacity
				onPressIn={onPress}
				className="w-full flex-row items-center gap-3 rounded-xl  bg-white p-2 shadow-sm shadow-defaultGray/10"
			>
				<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">{icon}</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-primary">
						{new Date(newsletter.date).toLocaleDateString("fr-FR", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</Text>
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</TouchableOpacity>
		</Link>
	);
}
