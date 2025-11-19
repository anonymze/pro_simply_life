import * as WebBrowser from "expo-web-browser";
import { SquareArrowOutUpRightIcon } from "lucide-react-native";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import PdfRendererView from "react-native-pdf-renderer";
import config from "tailwind.config";

interface PdfViewerProps {
	uri: string;
	link?: string | string[];
}

export default function PdfViewer({ uri, link }: PdfViewerProps) {
	// Android PdfRenderer needs decoded URI (no %20 etc)
	// Other file operations (sharing, downloading) need encoded URI
	const pdfSource = Platform.OS === "android" ? decodeURIComponent(uri) : uri;

	return (
		<View className="flex-1">
			{typeof link === "string" && link && (
				<View className="flex-row items-center justify-between gap-3 bg-white px-5 pb-4">
					<Text className="font-semibold text-base text-primary flex-1">{link}</Text>
					<TouchableOpacity
						onPress={async () => {
							await WebBrowser.openBrowserAsync(link);
						}}
						className="rounded-full bg-primaryUltraLight p-3"
					>
						<SquareArrowOutUpRightIcon size={16} color={config.theme.extend.colors.primary} />
					</TouchableOpacity>
				</View>
			)}
			<PdfRendererView
				style={{ backgroundColor: config.theme.extend.colors.background }}
				source={pdfSource}
				distanceBetweenPages={16}
				maxZoom={5}
			/>
		</View>
	);
}
