import { Directory, File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";

const destination = new Directory(Paths.document, "simply-life");

const downloadFile = async (url: string, filename: string, mimeType: string | undefined, sharing = false) => {
	try {
		console.log("FILENAME FROM DOWNLOAD FILE", filename);
		// File constructor handles uri encoding for you on the filename
		const existingFile = new File(destination, filename);

		console.log("FILE INSTANCE FROM DOWNLOAD FILE", existingFile);

		if (existingFile.exists) {
			if (sharing) await shareFile(existingFile.uri, mimeType);
			return existingFile;
		}

		if (!destination.exists) destination.create();

		const result = await File.downloadFileAsync(url, existingFile);

		if (sharing) await shareFile(result.uri, mimeType);

		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const getFile = (filename: string) => {
	console.log("FILENAME FROM GET FILE", filename);
	// File constructor handles uri encoding for you on the filename
	const file = new File(destination, filename);
	console.log("FILE INSTANCE FROM GET FILE", file);
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

const deleteFile = async (filename: string) => {
	// File constructor handles uri encoding for you on the filename
	const file = new File(destination, filename);
	if (file.exists) file.delete();
};

export { deleteFile, downloadFile, getFile };
