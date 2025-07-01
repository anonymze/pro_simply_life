import { getFundesysesQuery } from "@/api/queries/fundesys";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { Text } from "react-native";

export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["fundesys"],
			queryFn: getFundesysesQuery,
		},
		({ data }) => {
			// Convert grouped data to flat array for FlatList

			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Fundesys" />
					<Text className="mb-5 text-sm text-defaultGray">Newsletter hebdomadaire</Text>
				</BackgroundLayout>
			);
		},
	)();
}
