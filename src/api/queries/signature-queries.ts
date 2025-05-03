import { api } from "../_config";

export async function savePDFSignatureQuery({ files }: { files: string[] }) {
	const response = await api.post("/api/signatures/pdf", { files });
	return response.data;
}
