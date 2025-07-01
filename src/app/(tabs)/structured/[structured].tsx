import { getFundesysQuery } from "@/api/queries/fundesys";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/libs/tailwind";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function Page() {
	const { fundesys: fundesysId } = useLocalSearchParams();
	const [loading, setLoading] = React.useState(false);

	const { data: fundesys } = useQuery({
		queryKey: ["fundesys", fundesysId],
		queryFn: getFundesysQuery,
		enabled: !!fundesysId,
	});

	return (
		<BackgroundLayout className={cn("px-4 pb-4")}>
			<Title title={"Loading..."} />
		</BackgroundLayout>
	);
}
