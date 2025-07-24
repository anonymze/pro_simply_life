import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { View } from "react-native";
import PdfRendererView from "react-native-pdf-renderer";
import config from "tailwind.config";

export default function Page() {
	const [pdfPath, setPdfPath] = useState<string | null>(null);

	useEffect(() => {
		const loadPdf = async () => {
			const asset = Asset.fromModule(require("@/assets/pdfs/adobe.pdf"));
			await asset.downloadAsync();
			setPdfPath(asset.localUri);
		};
		loadPdf();
	}, []);

	if (!pdfPath) {
		return <View className="flex-1" />;
	}

	return (
		<View className="flex-1">
			<PdfRendererView
				style={{ backgroundColor: config.theme.extend.colors.background }}
				source={pdfPath}
				distanceBetweenPages={16}
				maxZoom={5}
			/>
		</View>
	);
}
