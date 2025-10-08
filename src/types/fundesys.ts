import { Media } from "./media";


export interface Fundesys {
	id: string;
	date: string;
	file: Media;
	excel: Media;
	video: Media;
	updatedAt: string;
	createdAt: string;
}
