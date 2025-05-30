import BackgroundLayout from "@/layouts/background-layout";
import Title from "@/components/ui/title";
import { Text, View } from "react-native";


export default function Page() {
	return (
		<BackgroundLayout className="pt-safe px-4 pb-4">
			<Title title="Réservation de bureaux" />
		</BackgroundLayout>
	);
}
