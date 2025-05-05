import { SupplierCategory, SupplierProduct } from "@/types/supplier";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import BackgroundLayout from "@/layouts/background-layout";
import { Text, View } from "react-native";


export default function Page() {
	const { "supplier-category": supplierCategoryId, "supplier-product": supplierProductId, productJSON } = useLocalSearchParams<{
		"supplier-category": string;
		"supplier-product": string;
		productJSON: string;
	}>();

	if (!supplierCategoryId || !supplierProductId || !productJSON) return <Redirect href="../" />;

	const supplierProduct = JSON.parse(productJSON) as SupplierProduct;

	return (
		<BackgroundLayout>
			{supplierProduct.suppliers.map((supplier) => (
				<Link
					key={supplier.id}
					href={{
						pathname: "/supplier-category/[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]",
						params: {
							"supplier-category": supplierCategoryId,
							"supplier-product": supplierProductId,
							"supplier": supplier.id,
							supplierJSON: JSON.stringify(supplier),
						},
					}}
					className="mt-4 rounded-lg bg-white p-4"
				>
					<Text className="text-lg font-bold text-black">{supplier.name}</Text>
				</Link>
			))}
		</BackgroundLayout>
	);
}
