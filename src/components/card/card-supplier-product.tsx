import { queryClient } from "@/api/_queries";
import { SupplierProduct } from "@/types/supplier";
import { HrefObject, Link } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import config from "tailwind.config";

export default function CardSupplierProduct({
	supplierProduct,
	link,
	// multipleSupplierProducts = [],
}: {
	// multipleSupplierProducts?: SupplierProduct[];
	supplierProduct: SupplierProduct;
	link: HrefObject;
}) {
	const onPress = React.useCallback(() => {
		// for (const product of multipleSupplierProducts) {
		// 	queryClient.setQueryData(["supplier-product", product.id], product);
		// }
		queryClient.setQueryData(["supplier-product", supplierProduct.id], supplierProduct);
	}, [supplierProduct]);

	return (
		<Link href={link} push asChild>
			<TouchableOpacity
				onPressIn={onPress}
				className="w-full flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm shadow-defaultGray/10"
			>
				<Text className="flex-shrink font-semibold text-lg text-primary">{supplierProduct.name}</Text>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} />
			</TouchableOpacity>
		</Link>
	);
}
