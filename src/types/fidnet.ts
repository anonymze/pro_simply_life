import { Media } from "./media";

export interface Fidnet {
	id: string;
	date: string;
	file: string | Media;
	video: string | Media;
	updatedAt: string;
	createdAt: string;
}
