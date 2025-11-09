import { Pressable, Text, TouchableOpacity } from "react-native";
import { SupplierProduct } from "@/types/supplier";
import { ArrowRight } from "lucide-react-native";
import { Commission } from "@/types/commission";
import { Href, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import config from "tailwind.config";
import React from "react";


export default function CardCommission({ commission, link }: { commission: Commission; link: Href }) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["commission", commission.id], commission);
	}, [commission]);

	return (
		<Link href={link} push asChild>
			<TouchableOpacity
				onPressIn={onPress}
				className="w-full flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm shadow-defaultGray/10"
			>
				<Text className="flex-shrink font-semibold text-lg text-primary">{new Date(commission.createdAt).toLocaleDateString("fr-FR", {
					month: "long",
					// year: "numeric",
				})}</Text>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} />
			</TouchableOpacity>
		</Link>
	);
}
