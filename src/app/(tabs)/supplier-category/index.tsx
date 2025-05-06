import { getSupplierCategoriesQuery } from "@/api/queries/supplier-categories-queries";
import CardSupplierCategory from "@/components/card/card-supplier-category";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import InputSearch from "@/components/ui/input-search";
import Title from "@/components/ui/title";
import config from "tailwind.config";
import { View } from "react-native";


export default function Page() {
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
						showsVerticalScrollIndicator={false}
						style={{ backgroundColor: config.theme.extend.colors.background }}
					>
						<View className="mt-5 gap-2">
							{data?.docs?.map((supplierCategory) => (
								<CardSupplierCategory
									key={supplierCategory.id}
									supplierCategory={supplierCategory}
									icon={<ImagePlaceholder source={supplierCategory.logo?.url ?? ""} style={{ width: 22, height: 22 }} />}
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
