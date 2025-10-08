import { getFidnetQuery } from "@/api/queries/fidnet";
import { Brochure } from "@/components/brochure";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { cn } from "@/utils/libs/tailwind";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
	const { fidnet: fidnetId } = useLocalSearchParams();

	const { data: fidnet } = useQuery({
		queryKey: ["fidnet", fidnetId],
		queryFn: getFidnetQuery,
		enabled: !!fidnetId,
	});

	if (!fidnet) return null;

	return (
		<BackgroundLayout className={cn("px-4 pb-4")}>
			<Title
				title={`Newsletter du ${new Date(fidnet.date).toLocaleDateString("fr-FR", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}`}
			/>

			<Brochure
				title="Newsletter PDF"
				brochure={fidnet.file}
				updatedAt={fidnet.updatedAt}
				link={{
					pathname: "/fidnet/pdf/[pdf]",
					params: {
						pdf: fidnet.file.filename,
					},
				}}
			/>
		</BackgroundLayout>
	);
}
