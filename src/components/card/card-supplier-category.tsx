import { Text, TouchableOpacity, View } from "react-native";
import { SupplierCategory } from "@/types/supplier";
import { HrefObject, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import { Image } from "expo-image";
import React from "react";


export default function CardSupplierCategory({
	icon,
	supplierCategory,
	backgroundIcon,
	link,
}: {
	backgroundIcon?: string;
	icon?: React.ReactNode;
	supplierCategory: SupplierCategory;
	link: HrefObject;
}) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["supplier-category", link.params?.["supplier-category"]], supplierCategory);
	}, [link]);

	const description = React.useMemo(() => {
		return supplierCategory.product_suppliers.length === 0
			? ""
			: supplierCategory.product_suppliers
					.slice(0, 2)
					.map((supplier) => supplier.name)
					.join(", ") + (supplierCategory.product_suppliers.length > 2 ? "..." : "");
	}, [supplierCategory]);

	return (
		<Link href={link} push asChild>
			<TouchableOpacity
				onPressIn={onPress}
				className="flex-1 items-center rounded-2xl bg-white p-4 shadow-sm shadow-defaultGray/10"
			>
				<View className="size-24 items-center justify-center rounded-2xl" style={{ backgroundColor: backgroundIcon }}>
					{icon ? icon : <Image source={require("@/assets/images/logo.png")} style={{ width: 24, height: 24 }} />}
				</View>
				<Text className="font-semibold text-lg text-primary mt-3">{supplierCategory.name}</Text>
				{description && <Text className="text-primaryLight text-center">{description}</Text>}

				{/* <ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10, alignSelf: "flex-end" }} /> */}
			</TouchableOpacity>
		</Link>
	);
}
