import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { getStorageUserInfos } from "@/utils/store";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
	const insets = useSafeAreaInsets();

	return (
		<BackgroundLayout className="px-4" style={{ paddingTop: insets.top }}>
      <Title title="Formations" className="mb-6" />
      	<Text className="mb-3 text-base font-semibold text-primary">Formation déclaration des revenus</Text>
		</BackgroundLayout>
	);
}
