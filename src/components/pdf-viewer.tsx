import { Platform, View } from "react-native";
import PdfRendererView from "react-native-pdf-renderer";
import config from "tailwind.config";

interface PdfViewerProps {
	uri: string;
}

export default function PdfViewer({ uri }: PdfViewerProps) {
	// Android PdfRenderer needs decoded URI (no %20 etc)
	// Other file operations (sharing, downloading) need encoded URI
	const pdfSource = Platform.OS === 'android' ? decodeURIComponent(uri) : uri;

	return (
		<View className="flex-1">
			<PdfRendererView
				style={{ backgroundColor: config.theme.extend.colors.background }}
				source={pdfSource}
				distanceBetweenPages={16}
				maxZoom={5}
			/>
		</View>
	);
}
