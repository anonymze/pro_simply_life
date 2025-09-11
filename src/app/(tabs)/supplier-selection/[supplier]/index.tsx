import { getSupplierSelectionQuery } from "@/api/queries/supplier-queries";
import { Brochure } from "@/components/brochure";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function Page() {
	const { supplier: supplierId } = useLocalSearchParams();

	const { data } = useQuery({
		queryKey: ["supplier-selection", supplierId],
		queryFn: getSupplierSelectionQuery,
		enabled: !!supplierId,
	});

	if (!data) return null;

	return (
		<BackgroundLayout className="pt-safe px-4">
			<Title title={data.name} />
			<Text className="mb-4">Catégorie : {data.selection?.category}</Text>
			{data.selection?.brochure && (
				<Brochure
					brochure={data.selection.brochure}
					updatedAt={data.updatedAt}
					link={{
						pathname: "/supplier-selection/[supplier]/pdf/[pdf]",
						params: {
							supplier: supplierId,
							pdf: data.selection.brochure.filename,
						},
					}}
				/>
			)}
		</BackgroundLayout>
	);
}
