import { Media } from "./media";

export interface Supplier {
	id: string;
	name: string;
	website?: string | null;
	logo_mini?: Media | null;
	logo_full?: Media | null;
	video?: Media;
	brochures?:
		| {
				name: string;
				brochure: Media;
				id?: string | null;
		  }[]
		| null;
	contact_info: {
		photo?: Media | null;
		lastname?: string | null;
		firstname?: string | null;
		email?: string | null;
		phone?: string | null;
	};
	connexion: {
		email?: string | null;
		password?: string | null;
		remarques?: string | null;
	};
	pea?: {
		banque?: string | null;
		title_vif?: ("yes" | "no") | null;
		architecture_open?: ("yes" | "no") | null;
		fonds?: string | null;
		vp?: ("yes" | "no") | null;
		retrocession_gestion_libre?: string | null;
		retrocession_gestion_mandat?: string | null;
		passage_order?: string | null;
		interface?: string | null;
	};
	enveloppes_club_deals?:
		| {
				global?: number | null;
				amount?: number | null;
				/**
				 * Le fichier doit être au format PDF.
				 */
				brochure?: (string | null) | Media;
				minimum_versement?: string | null;
				subscription_fee?: string | null;
				duration?: string | null;
				operation?: string | null;
				rentability_n1?: string | null;
				ventilation?: ("mensuel" | "trimestriel" | "semestriel" | "annuel") | null;
				commission_offer_group_valorem?: string | null;
				commission_public_offer?: string | null;
				annotation?: string | null;
				id?: string | null;
		  }[]
		| null;
	enveloppes?:
		| {
				global?: number | null;
				amount?: number | null;
				reduction?: number | null;
				echeance?: string | null;
				actualisation?: string | null;
				commission?: string | null;
				commission_valorem?: string | null;
				droits?: ("yes" | "no") | null;
				agrement?: ("yes" | "no") | null;
				investisseur?: ("yes" | "no") | null;
				assurance?: ("yes" | "no" | "maybe") | null;
				close?: ("yes" | "no") | null;
				remarque?: string | null;
				id?: string | null;
		  }[]
		| null;
	// enveloppe?: {
	// 	global?: number | null;
	// 	amount?: number | null;
	// 	reduction?: number | null;
	// 	echeance?: string | null;
	// 	actualisation?: string | null;
	// 	commission?: string | null;
	// 	commission_valorem?: string | null;
	// 	droits?: ("yes" | "no") | null;
	// 	agrement?: ("yes" | "no") | null;
	// 	assurance?: ("yes" | "no" | "maybe") | null;
	// 	investisseur?: ("yes" | "no") | null;
	// 	close?: ("yes" | "no") | null;
	// 	remarque?: string | null;
	// };
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
				nue?: boolean | null;
				minimum_versement?: string | null;
				minimum_versement_programme?: string | null;
				subscription_fee?: string | null;
				duration?: string | null;
				rentability_n1?: string | null;
				commission_offer_group_valorem?: string | null;
				commission_public_offer?: string | null;
		  }[]
		| null;
	other_information_blocks?: SupplierInformationBlock[] | null;
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

interface SupplierBlockBase {
	id?: string | null;
	blockName?: string | null;
}

interface SupplierBlockLegacyMarkers {
	legacy_source?: string | null;
	legacy_source_id?: string | null;
}

interface SupplierBlockContratFields extends SupplierBlockBase {
	name?: string | null;
	brochure?: (string | null) | Media;
	minimum_versement_initial?: string | null;
	minimum_versement_libre?: string | null;
	minimum_versement_programme?: string | null;
	frais_souscription?: string | null;
	frais_arbitrage?: string | null;
	bonus_fournisseur?: string | null;
	commission_groupe_valorem?: string | null;
}

export interface SupplierBlockAssuranceVie extends SupplierBlockContratFields {
	blockType: "assurance_vie";
	personne_physique_morale?: string | null;
}

export interface SupplierBlockPer extends SupplierBlockContratFields {
	blockType: "per";
}

export interface SupplierBlockCapitalisation extends SupplierBlockContratFields {
	blockType: "capitalisation";
	personne_physique_morale?: string | null;
}

export interface SupplierBlockCrypto
	extends SupplierBlockBase,
		SupplierBlockLegacyMarkers {
	blockType: "crypto";
	brochure?: (string | null) | Media;
	minimum_versement_initial_mandat?: string | null;
	minimum_versement_libre_mandat?: string | null;
	minimum_versement_programme_mandat?: string | null;
	frais_souscription?: string | null;
}

export interface SupplierBlockScpi
	extends SupplierBlockBase,
		SupplierBlockLegacyMarkers {
	blockType: "scpi";
	scpi?: string | null;
	theme?: string | null;
	brochure?: (string | null) | Media;
	epargne?: boolean | null;
	nue?: boolean | null;
	minimum_versement?: string | null;
	minimum_versement_programme?: string | null;
	subscription_fee?: string | null;
	duration?: string | null;
	rentability_n1?: string | null;
	commission_offer_group_valorem?: string | null;
	commission_public_offer?: string | null;
	annotation?: string | null;
}

export interface SupplierBlockPea
	extends SupplierBlockBase,
		SupplierBlockLegacyMarkers {
	blockType: "pea";
	banque?: string | null;
	title_vif?: ("yes" | "no") | null;
	architecture_open?: ("yes" | "no") | null;
	fonds?: string | null;
	vp?: ("yes" | "no") | null;
	retrocession_gestion_libre?: string | null;
	retrocession_gestion_mandat?: string | null;
	passage_order?: string | null;
	interface?: string | null;
}

export interface SupplierBlockCif
	extends SupplierBlockBase,
		SupplierBlockLegacyMarkers {
	blockType: "cif";
	global?: number | null;
	amount?: number | null;
	reduction?: string | null;
	echeance?: string | null;
	actualisation?: string | null;
	commission?: string | null;
	commission_valorem?: string | null;
	droits?: ("yes" | "no") | null;
	agrement?: ("yes" | "no") | null;
	investisseur?: ("yes" | "no") | null;
	assurance?: ("yes" | "no" | "maybe") | null;
	close?: ("yes" | "no") | null;
	remarque?: string | null;
}

export interface SupplierBlockClubDeals
	extends SupplierBlockBase,
		SupplierBlockLegacyMarkers {
	blockType: "club_deals";
	global?: number | null;
	amount?: number | null;
	brochure?: (string | null) | Media;
	minimum_versement?: string | null;
	subscription_fee?: string | null;
	duration?: string | null;
	operation?: string | null;
	rentability_n1?: string | null;
	ventilation?: ("mensuel" | "trimestriel" | "semestriel" | "annuel") | null;
	commission_offer_group_valorem?: string | null;
	commission_public_offer?: string | null;
	annotation?: string | null;
}

export type SupplierInformationBlock =
	| SupplierBlockAssuranceVie
	| SupplierBlockPer
	| SupplierBlockCapitalisation
	| SupplierBlockCrypto
	| SupplierBlockScpi
	| SupplierBlockPea
	| SupplierBlockCif
	| SupplierBlockClubDeals;

export interface SupplierProduct {
	id: string;
	name: string;
	suppliers: Supplier[];
	impot?: "yes" | "no";
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
