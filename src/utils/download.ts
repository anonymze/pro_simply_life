import { Directory, File, Paths } from "expo-file-system/next";


const destination = new Directory(Paths.cache, "simply-life");

const downloadFile = async (url: string) => {
	if (!destination.exists) destination.create();
	return File.downloadFileAsync(url, destination);
};

const getFile = (filename: string) => {
	const file = new File(destination, filename);
	return file;
};

export { downloadFile, getFile };
