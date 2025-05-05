import { getSupplierCategoriesQuery } from "@/api/queries/supplier-categories-queries";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { SupplierCategory } from "@/types/supplier";
import { Text } from "react-native";
import { Link } from "expo-router";


export default function Page() {
	return withQueryWrapper<SupplierCategory>(
		{
			queryKey: ["supplier-categories"],
			queryFn: getSupplierCategoriesQuery,
		},
		({ data }) => {
			return (
				<BackgroundLayout>
					{
						data.docs.map((category) => (
							<Link key={category.id} href={{
								pathname: "/supplier-category/[supplier-category]",
								params: {
									"supplier-category": category.id,
									categoryJSON: JSON.stringify(category),
								},
							}} className="bg-white rounded-lg p-4 mt-4">
								<Text className="text-lg font-bold text-black">{category.name}</Text>
							</Link>
						))
					}
				</BackgroundLayout>
			);
		},
	)();
}
