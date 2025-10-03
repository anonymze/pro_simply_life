import { Media } from "./media";

export interface Supplier {
	id: string;
	name: string;
	website?: string | null;
	logo_mini?: Media | null;
	logo_full?: Media | null;
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
	enveloppe?: {
		amount?: number | null;
		reduction?: number | null;
		echeance?: string | null;
		actualisation?: string | null;
	};
	selection?: {
		selection?: boolean | null;
		category?: string | null;
		brochure?: null | Media;
	};
	other_information?:
		| {
				id?: string | null;
				scpi?: string | null;
				theme?: string | null;
				brochure?: Media | null;
				annotation?: string | null;
				epargne?: boolean | null;
				minimum_versement?: string | null;
				subscription_fee?: string | null;
				duration?: string | null;
				rentability_n1?: string | null;
				commission_offer_group_valorem?: string | null;
				commission_public_offer?: string | null;
		  }[]
		| null;
	fond?:
		| {
				id?: string | null;
				duration?: string | null;
				investment?: string | null;
				ticket?: string | null;
				duration_found?: string | null;
				distribution?: boolean | null;
				tri?: string | null;
				multiple?: string | null;
				eligibility?: string | null;
				upfront?: string | null;
				encours?: string | null;
				brochure?: Media | null;
		  }[]
		| null;
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
