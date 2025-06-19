import { Supplier } from "./supplier";
import { AppUser } from "./user";
import { Media } from "./media";


export interface Commission {
	id: string;
	app_user: AppUser;
	supplier: Supplier;
	structured_product?: boolean | null;
	informations?: {
		date?: string | null;
		encours?: number | null;
		production?: number | null;
		pdf?: Media | null;
		title?: string | null;
		up_front?: number | null;
		broqueur?: string | null;
	};
	updatedAt: string;
	createdAt: string;
}

export interface CommissionExtra {
	id: string;
	supplier: Pick<Supplier, "id" | "name" | "logo_mini">;
	structured_product?: boolean | null;
	informations?: {
		date?: string | null;
		encours?: number | null;
		production?: number | null;
		pdf?: Media | null;
		title?: string | null;
		up_front?: number | null;
		broqueur?: string | null;
	};
	updatedAt: string;
	createdAt: string;
}
