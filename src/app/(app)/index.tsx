import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import CardLink from "@/components/card-link";
import services from "@/routes/services";
import { View } from "react-native";

export default function Page() {
	return (
		<View className="flex-1">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<BackgroundLayout className="p-4">
					<View className="flex-1 flex-row flex-wrap gap-4">
						{services.map((service) => (
							<CardLink key={service.id} service={service} pastille={service.pastille} />
						))}
					</View>
				</BackgroundLayout>
			</ScrollView>
		</View>
	);
}
