import { Media } from "./media";


export interface Supplier {
	id: string;
	name: string;
	logo: string | Media;
	contact_info?: {
		lastname?: string | null;
		firstname?: string | null;
		email?: string | null;
		phone?: string | null;
	};
	connexion?: {
		id?: string | null;
		password?: string | null;
	};
	other_information?: {
		theme?: string | null;
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
  logo?: (string | null) | Media;
  suppliers: (string | Supplier)[];
  updatedAt: string;
  createdAt: string;
}

export interface SupplierCategory {
  id: string;
  name: string;
  logo?: (string | null) | Media;
  product_suppliers: (string | SupplierProduct)[];
  offers?:
    | {
        name: string;
        /**
         * Le fichier doit être au format PDF.
         */
        file: string | Media;
        description?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}