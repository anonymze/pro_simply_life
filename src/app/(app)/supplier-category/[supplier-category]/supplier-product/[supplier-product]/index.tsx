import { Supplier, SupplierCategory, SupplierProduct } from "@/types/supplier";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import BackgroundLayout from "@/layouts/background-layout";
import { Text, View } from "react-native";


export default function Page() {
	const { "supplier-category": supplierCategoryId, "supplier-product": supplierProductId, supplierJSON } = useLocalSearchParams<{
		"supplier-category": string;
		"supplier-product": string;
		"supplier": string;
		supplierJSON: string;
	}>();

	if (!supplierCategoryId || !supplierProductId || !supplierJSON) return <Redirect href="../" />;

	const supplier = JSON.parse(supplierJSON) as Supplier;

	return (
		<BackgroundLayout>

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

		</BackgroundLayout>
	);
}
