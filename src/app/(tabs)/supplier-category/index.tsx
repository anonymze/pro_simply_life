import { getSupplierCategoriesQuery } from "@/api/queries/supplier-categories-queries";
import CardSupplierCategory from "@/components/card/card-supplier-category";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import InputSearch from "@/components/ui/input-search";
import { useQueryClient } from "@tanstack/react-query";
import Title from "@/components/ui/title";
import { useRouter } from "expo-router";
import config from "tailwind.config";
import { View } from "react-native";


interface SupplierCategory {
	id: string;
	name: string;
	product_suppliers: Array<{
		id: string;
		name: string;
	}>;
}

export default function Page() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const handleNavigate = (supplierCategory: SupplierCategory) => {
		// store the supplier category data in react-query cache
		queryClient.setQueryData(["supplier-category", supplierCategory.id], supplierCategory);

		router.push({
			pathname: `/supplier-category/[supplier-category]/supplier-product`,
			params: {
				"supplier-category": supplierCategory.id,
			},
		});
	};

	return withQueryWrapper(
		{
			queryKey: ["supplier-categories", { depth: 3 }],
			queryFn: getSupplierCategoriesQuery,
		},
		({ data }) => {
			return (
				<BackgroundLayout className="p-4">
					<Title title="Répertoire des fournisseurs" />
					<InputSearch onSubmit={() => {}} />
					<ScrollView
						className="flex-1"
						showsVerticalScrollIndicator={false}
						style={{ backgroundColor: config.theme.extend.colors.background }}
					>
						<View className="mt-5 gap-2">
							{data?.docs?.map((supplierCategory) => (
								<CardSupplierCategory
									key={supplierCategory.id}
									supplierCategory={supplierCategory}
									link={{
										pathname: `/supplier-category/[supplier-category]/supplier-product`,
										params: {
											"supplier-category": supplierCategory.id,
										},
									}}
								/>
							))}
						</View>
					</ScrollView>
				</BackgroundLayout>
			);
		},
	)();
}
