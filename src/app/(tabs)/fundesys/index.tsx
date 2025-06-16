import { withQueryWrapper } from "@/utils/libs/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { getFundesysQuery } from "@/api/queries/fundesys";
import { View, Text } from "react-native";
import config from "tailwind.config";
import React from "react";


export default function Page() {
	return withQueryWrapper(
		{
			queryKey: ["reservations"],
			queryFn: getFundesysQuery,
		},
		({ data }) => {
			return (
				<BackgroundLayout className="pt-safe px-4">
					<Text>Fundesys</Text>
				</BackgroundLayout>
			);
		},
	)();
}
