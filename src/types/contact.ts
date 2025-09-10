import { ImageRef } from "expo-image";

import { Media } from "./media";


export interface Contact {
	id: string;
	name: string;
	latitude: string;
	longitude: string;
	category: ContactCategory;
	specialisation?: string
	phone?: string | null;
	logo?: ImageRef;
	website?: string | null;
	address?: string | null;
	updatedAt: string;
	createdAt: string;
}

export interface ContactCategory {
	id: string;
	name: string;
	updatedAt: string;
	createdAt: string;
}
