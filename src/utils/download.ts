import { Directory, File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";

const destination = new Directory(Paths.document, "simply-life");

const downloadFile = async (url: string, filename: string, mimeType: string | undefined, sharing = false) => {
	try {
		// On Android, File constructor doesn't accept filenames with spaces
		const encodedFilename = encodeURIComponent(filename);
		const existingFile = new File(destination, encodedFilename);

		if (existingFile.exists) {
			if (sharing) await shareFile(existingFile.uri, mimeType);
			return existingFile;
		}

		if (!destination.exists) destination.create();

		const result = await File.downloadFileAsync(url, existingFile);

		if (sharing) await shareFile(result.uri, mimeType);

		return result as unknown as File;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const getFile = (filename: string) => {
	// On Android, File constructor doesn't accept filenames with spaces
	// We need to encode the filename first
	const encodedFilename = encodeURIComponent(filename);
	const file = new File(destination, encodedFilename);
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
	// On Android, File constructor doesn't accept filenames with spaces
	const encodedFilename = encodeURIComponent(filename);
	const file = new File(destination, encodedFilename);
	if (file.exists) file.delete();
};

export { deleteFile, downloadFile, getFile };
