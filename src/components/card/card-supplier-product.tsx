import { SupplierProduct } from "@/types/supplier";
import { ArrowRight } from "lucide-react-native";
import { Pressable, Text } from "react-native";
import { HrefObject, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import config from "tailwind.config";
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
		<Link href={link} push asChild>
			<Pressable onPressIn={onPress} className="w-full flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm shadow-defaultGray/10 active:bg-primaryUltraLight">
				<Text className="flex-shrink font-semibold text-lg text-dark">{supplierProduct.name}</Text>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} />
			</Pressable>
		</Link>
	);
}
