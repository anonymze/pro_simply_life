import PdfViewer from "@/components/pdf-viewer";
import { getFile } from "@/utils/download";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function SupplierPdf() {
	const { pdf } = useLocalSearchParams();

	if (!pdf || typeof pdf !== "string") return <Redirect href="../" />;

	const file = getFile(pdf);

	if (!file.exists) return <Redirect href="../" />;

	return <PdfViewer uri={file.uri} />;
}
