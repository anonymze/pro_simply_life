import { Text, TouchableOpacity, View } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { HrefObject, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import { Supplier } from "@/types/supplier";
import config from "tailwind.config";
import React from "react";


export default function CardSupplier({
	icon,
	supplier,
	link,
}: {
	icon: React.ReactNode;
	supplier: Supplier;
	link: HrefObject;
}) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["supplier", link.params?.["supplier"]], supplier);
	}, [link]);

return (
		<Link href={link} push asChild >
			<TouchableOpacity onPressIn={onPress} className="w-full flex-row items-center gap-3 rounded-xl  p-2 bg-white shadow-sm shadow-defaultGray/10">
				<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">
					{icon}
				</View>
				<View className="flex-1">
					<Text className="text-lg font-semibold text-dark">{supplier.name}</Text>
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</TouchableOpacity>
		</Link>
	);
}
