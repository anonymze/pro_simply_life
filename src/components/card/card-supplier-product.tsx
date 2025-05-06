import { SupplierCategory, SupplierProduct } from "@/types/supplier";
import { Text, TouchableOpacity, View } from "react-native";
import { HrefObject, Link, LinkProps } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { queryClient } from "@/api/_queries";
import config from "tailwind.config";
import { Image } from "expo-image";
import React from "react";


export default function CardSupplierProduct({
	supplierProduct,
	link,
}: {
	supplierProduct: SupplierProduct;
	link: HrefObject;
}) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["supplier-product", link.params?.["supplier-product"]], supplierProduct);
	}, [link]);
	return (
		<Link href={link} push asChild onPressIn={onPress}>
			<TouchableOpacity className="w-full flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm shadow-defaultGray/10">
				<Text className="flex-shrink text-lg font-semibold text-dark">{supplierProduct.name}</Text>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} />
			</TouchableOpacity>
		</Link>
	);
}
