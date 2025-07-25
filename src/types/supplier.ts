import { Media } from "./media";


export interface Supplier {
	id: string;
	name: string;
	website?: string | null;
	logo_mini?: Media | null;
	logo_full?: Media | null;
	brochure?: Media | null;
	contact_info: {
		lastname?: string | null;
		firstname?: string | null;
		email?: string | null;
		phone?: string | null;
	};
	connexion: {
		email?: string | null;
		password?: string | null;
	};
	other_information: {
		theme?: string | null;
		annotation?: string | null;
		subscription_fee?: string | null;
		duration?: string | null;
		rentability?: string | null;
		rentability_n1?: string | null;
		commission?: string | null;
		commission_public_offer?: string | null;
		commission_offer_group_valorem?: string | null;
		scpi?: string | null;
	};
	updatedAt: string;
	createdAt: string;
}

export interface SupplierProduct {
	id: string;
	name: string;
	suppliers: Supplier[];
	updatedAt: string;
	createdAt: string;
}

export interface SupplierCategory {
	id: string;
	name: "IAS" | "SCPI" | "Immobilier" | "CIF";
	product_suppliers: SupplierProduct[];
	offers?:
		| {
				name: string;
				file: Media;
				description?: string | null;
				id?: string | null;
		  }[]
		| null;
	updatedAt: string;
	createdAt: string;
}
