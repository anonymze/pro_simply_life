import { Link, Redirect, useLocalSearchParams } from "expo-router";
import BackgroundLayout from "@/layouts/background-layout";
import { SupplierCategory } from "@/types/supplier";
import { Text, View } from "react-native";


export default function Page() {
	const { "supplier-category": supplierCategoryId, categoryJSON } = useLocalSearchParams<{
		"supplier-category": string;
		categoryJSON: string;
	}>();

	if (!supplierCategoryId || !categoryJSON) return <Redirect href="../" />;

	const supplierCategory = JSON.parse(categoryJSON) as SupplierCategory;

	return (
		<BackgroundLayout>
			{supplierCategory.product_suppliers.map((product) => (
				<Link
					key={product.id}
					href={{
						pathname: "/supplier-category/[supplier-category]/supplier-product",
						params: {
							"supplier-category": supplierCategoryId,
							"supplier-product": product.id,
							productJSON: JSON.stringify(product),
						},
					}}
					className="mt-4 rounded-lg bg-white p-4"
				>
					<Text className="text-lg font-bold text-black">{product.name}</Text>
				</Link>
			))}
		</BackgroundLayout>
	);
}
