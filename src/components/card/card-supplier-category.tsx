import { Text, TouchableOpacity, View } from "react-native";
import { SupplierCategory } from "@/types/supplier";
import { Href, Link } from "expo-router";
import { queryClient } from "@/api/_queries";
import { Image } from "expo-image";
import React from "react";
import { MyTouchableScaleOpacity } from "../my-pressable";

export default function CardSupplierCategory({
	icon,
	supplierCategory,
	backgroundIcon,
	link,
}: {
	backgroundIcon?: string;
	icon?: React.ReactNode;
	supplierCategory: SupplierCategory;
	link: Href;
}) {
	const isFinancing = supplierCategory.name === "Financement / Crédit";
	const directSupplierProduct =
		isFinancing && supplierCategory.product_suppliers.length === 1
			? supplierCategory.product_suppliers[0]
			: undefined;
	const href: Href = directSupplierProduct
		? {
				pathname: "/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier",
				params: {
					"supplier-category": supplierCategory.id,
					"supplier-category-name": supplierCategory.name,
					"supplier-product": directSupplierProduct.id,
					"supplier-product-name": directSupplierProduct.name,
				},
			}
		: link;
	const onPress = React.useCallback(() => {
		queryClient.setQueryData(["supplier-category", supplierCategory.id], supplierCategory);
		if (directSupplierProduct)
			queryClient.setQueryData(["supplier-product", directSupplierProduct.id], directSupplierProduct);
	}, [supplierCategory, directSupplierProduct]);

	const description = React.useMemo(() => {
		if (isFinancing) return "Financement";
		return supplierCategory.product_suppliers.length === 0
			? ""
			: supplierCategory.product_suppliers
					.slice(0, 2)
					.map((supplier) => supplier.name)
					.join(", ") + (supplierCategory.product_suppliers.length > 2 ? "..." : "");
	}, [supplierCategory, isFinancing]);

	return (
		<Link href={href} push asChild>
			<MyTouchableScaleOpacity
				onPressIn={onPress}
				className="flex-1 items-center rounded-2xl bg-white p-4 shadow-sm shadow-defaultGray/10"
			>
				<View className="size-24 items-center justify-center rounded-2xl" style={{ backgroundColor: backgroundIcon }}>
					{icon ? icon : <Image source={require("@/assets/images/logo.png")} style={{ width: 24, height: 24 }} />}
				</View>
				<Text className="mt-3 text-center text-lg font-semibold text-primary">
					{isFinancing ? "Crédit" : supplierCategory.name}
				</Text>
				{description && <Text className="text-center text-primaryLight">{description}</Text>}

				{/* <ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10, alignSelf: "flex-end" }} /> */}
			</MyTouchableScaleOpacity>
		</Link>
	);
}
