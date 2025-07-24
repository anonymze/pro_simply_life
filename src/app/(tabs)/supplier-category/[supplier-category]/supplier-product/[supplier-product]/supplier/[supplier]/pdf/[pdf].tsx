import { getFile } from "@/utils/download";
import { Redirect, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import PdfRendererView from "react-native-pdf-renderer";
import config from "tailwind.config";

export default function Page() {
	const { pdf } = useLocalSearchParams();

	if (!pdf || typeof pdf !== "string") return <Redirect href="../" />;

	const file = getFile(pdf);

	if (!file.exists) return <Redirect href="../" />;

	return (
		<View className="flex-1">
			<PdfRendererView
				style={{ backgroundColor: config.theme.extend.colors.background }}
				source={file.uri}
				distanceBetweenPages={16}
				maxZoom={5}
			/>
		</View>
	);
}
