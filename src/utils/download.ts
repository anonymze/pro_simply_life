import { Directory, File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

const destination = new Directory(Paths.document, "simply-life");

const downloadFile = async (url: string, filename: string, mimeType: string | undefined, sharing = false) => {
	try {
		const sanitizedFilename = encodeURIComponent(filename);
		const existingFile = new File(destination, sanitizedFilename);

		// deleteFile(sanitizedFilename);
		// return;

		if (existingFile.exists) {
			if (sharing) await shareFile(existingFile.uri, mimeType);
			return existingFile;
		}

		if (!destination.exists) destination.create();

		const result = await File.downloadFileAsync(url, destination);

		if (sharing) await shareFile(result.uri, mimeType);

		return result;
	} catch (error) {
		throw error;
	}
};

const getFile = (filename: string) => {
	const sanitizedFilename = encodeURIComponent(filename);
	const file = new File(destination, sanitizedFilename);
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
	try {
		const file = new File(destination, filename);
		if (file.exists) file.delete();
	} catch (error) {
		Alert.alert(
			"La brochure n'a pas pu être téléchargée pour être visualisée",
			"Vérifiez que vous avez assez d'espace de stockage.",
		);
	}
};

export { deleteFile, downloadFile, getFile };
