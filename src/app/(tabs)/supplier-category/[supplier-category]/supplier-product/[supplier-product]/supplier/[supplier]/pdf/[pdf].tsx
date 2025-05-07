import { Redirect, useLocalSearchParams } from "expo-router";
import PdfRendererView from "react-native-pdf-renderer";
import { getFile } from "@/utils/download";
import config from "tailwind.config";
import { View } from "react-native";


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
				// onPageChange={(current, total) => {
				// 	console.log(current, total);
				// }}
			/>
		</View>
	);
}
