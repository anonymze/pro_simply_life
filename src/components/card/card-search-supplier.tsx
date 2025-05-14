import { Supplier } from "@/types/supplier";
import { Text, View } from "react-native";

import ImagePlaceholder from "../ui/image-placeholder";
import CardSupplier from "./card-supplier";


export default function CardSearchSupplier({
	supplier,
}: {
	supplier: Supplier & { productName: string; productId: string; categoryName: string };
}) {
	return (
		<View>
			<Text className="text-md mb-3 font-semibold text-defaultGray">{supplier.productName}</Text>
			<CardSupplier
				icon={
					<ImagePlaceholder source={supplier.logo_mini?.url ?? ""} style={{ width: 26, height: 26, borderRadius: 4 }} />
				}
				supplier={supplier}
				link={{
					pathname: `/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]`,
					params: {
						"supplier-category": supplier.productId,
						"supplier-category-name": supplier.categoryName,
						"supplier-product-name": supplier.productName,
						supplier: supplier.id,
					},
				}}
			/>
		</View>
	);
}
