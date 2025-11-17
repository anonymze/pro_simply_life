import { queryClient } from "@/api/_queries";
import { SupplierProduct } from "@/types/supplier";
import { ALL_SCPI_ID, SCPI_CATEGORY_ID } from "@/utils/helper";
import { Href, Link, Redirect } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";
import config from "tailwind.config";
import { MyTouchableScaleOpacity } from "../my-pressable";

export default function CardSupplierProduct({
	supplierProduct,
	link,
	// multipleSupplierProducts = [],
}: {
	// multipleSupplierProducts?: SupplierProduct[];
	supplierProduct: SupplierProduct;
	link: Href;
}) {
	const onPress = React.useCallback(() => {
		// for (const product of multipleSupplierProducts) {
		// 	queryClient.setQueryData(["supplier-product", product.id], product);
		// }
		queryClient.setQueryData(["supplier-product", supplierProduct.id], supplierProduct);
	}, [supplierProduct]);

	if (supplierProduct.id === ALL_SCPI_ID) {
		queryClient.setQueryData(["supplier-product", supplierProduct.id], supplierProduct);
		return (
			<Redirect
				href={{
					pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier`,
					params: {
						"supplier-category": SCPI_CATEGORY_ID,
						"supplier-category-name": "SCPI",
						"supplier-product": supplierProduct.id,
						"supplier-product-name": supplierProduct.name
					},
				}}
			/>
		);
	}

	return (
		<Link href={link} push asChild>
			<MyTouchableScaleOpacity
				onPressIn={onPress}
				className="w-full flex-row items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm shadow-defaultGray/10"
			>
				<Text className="shrink text-lg font-semibold text-primary">{supplierProduct.name}</Text>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} />
			</MyTouchableScaleOpacity>
		</Link>
	);
}
