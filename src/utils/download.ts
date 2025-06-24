import { Directory, File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";


const destination = new Directory(Paths.document, "simply-life");

const downloadFile = async (url: string, filename: string, mimeType: string | undefined, noSharing = false) => {
	// console.log("downloadFile", url, filename, mimeType, noSharing);

	console.log(url);
	console.log(filename);

	try {
		const existingFile = new File(destination, filename);

		if (existingFile.exists && !noSharing) {
			await shareFile(existingFile.uri, mimeType);
			return existingFile;
		}

		if (!destination.exists) destination.create();

		const result = await File.downloadFileAsync(url, destination);

		await shareFile(result.uri, mimeType);

		return result;
	} catch (error) {
		throw error;
	}
};

const getFile = (filename: string) => {
	const file = new File(destination, filename);
	return file;
};

const shareFile = async (uri: File["uri"], mimeType: string | undefined) => {
	if (await Sharing.isAvailableAsync()) {
		await Sharing.shareAsync(uri, {
			mimeType: mimeType,
			dialogTitle: "Sauvegarder le fichier",
		});
	}
};

export { downloadFile, getFile, shareFile };
