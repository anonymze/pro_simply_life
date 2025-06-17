import { Media } from "./media";


export interface Commission {
	id: string;
	date: string;
	file:  Media;
	updatedAt: string;
	createdAt: string;
}
