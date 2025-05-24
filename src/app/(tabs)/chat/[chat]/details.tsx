import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundLayout from "@/layouts/background-layout";
import EmployeesIcon from "@/components/emloyees-icon";
import { ScrollView, View } from "react-native";
import config from "tailwind.config";
import { Text } from "react-native";


export default function Page() {
	return (
		<BackgroundLayout className="p-4 mt-4">
			<View className="p-4 gap-2 items-center bg-white rounded-2xl">
				<View className="size-20 items-center justify-center rounded-full bg-secondaryLight">
					<EmployeesIcon width={32} height={32} color={config.theme.extend.colors.primary} />
				</View>
				<Text className="font-semibold text-lg text-dark">Nom de la conversation</Text>
				<Text className="text-sm text-defaultGray">Description de la conversation</Text>
			</View>
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: config.theme.extend.colors.background }}
				contentContainerStyle={{ paddingBottom: 16 }}
			>
				<Text>Details</Text>
			</ScrollView>
		</BackgroundLayout>
	);
}
