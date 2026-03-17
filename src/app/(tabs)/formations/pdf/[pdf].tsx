import { getFile } from "@/utils/download";
import { Redirect, useLocalSearchParams } from "expo-router";
import PdfViewer from "@/components/pdf-viewer";

export default function Page() {
	const { pdf } = useLocalSearchParams();

	if (!pdf || typeof pdf !== "string") return <Redirect href="../" />;

	const file = getFile(pdf);

	if (!file.exists) return <Redirect href="../" />;

	return <PdfViewer uri={file.uri} />;
}
