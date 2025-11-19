import { Media } from "./media";
import { Supplier } from "./supplier";

export const FOND_LABELS: Record<string, string> = {
	name: "Nom",
	duration: "Durée",
	blocage_minimum: "Blocage minimum",
	strategy_investissement: "Stratégie d'investissement",
	liquidity: "Liquidité",
	subscription: "Souscription",
	ticket_mini_direct: "Ticket minimum direct",
	ticket_max: "Ticket maximum",
	allocation_max: "Allocation maximum",
	constraint: "Contrainte",
	tri_cible: "TRI cible",
	retro_upfront: "Rétro upfront",
	retro_encours: "Rétro encours",
	form: "Forme",
	duration_minimum: "Durée minimum",
	duration_prolongation: "Durée prolongation",
	duration_appel_found: "Durée appel fonds",
	these_investissement: "Thèse d'investissement",
	retro_subscription: "Rétro souscription",
	"150_0_b_ter": "150-0 B ter",
	"163_quinquies_b": "163 quinquies B",
	multi_cible: "Multi cible",
	tri_cible_in_fine: "TRI cible in fine",
	tri_cible_distribute: "TRI cible distribué",
};

export interface PrivateEquity {
	id: string;
	type: "capital" | "dettes" | "assurance";
	supplier?: Supplier;
	fond?:
		| {
				name: string;
				brochure?: Media;
				duration?: string | null;
				blocage_minimum?: string | null;
				strategy_investissement?: string | null;
				liquidity?: string | null;
				subscription?: string | null;
				ticket_mini_direct?: string | null;
				ticket_max?: string | null;
				allocation_max?: string | null;
				constraint?: string | null;
				tri_cible?: string | null;
				retro_upfront?: string | null;
				retro_encours?: string | null;
				form?: string | null;
				duration_minimum?: string | null;
				duration_prolongation?: string | null;
				duration_appel_found?: string | null;
				these_investissement?: string | null;
				retro_subscription?: string | null;
				"150_0_b_ter"?: string | null;
				"163_quinquies_b"?: string | null;
				multi_cible?: string | null;
				tri_cible_in_fine?: string | null;
				tri_cible_distribute?: string | null;
				id?: string | null;
		  }[]
		| null;
	updatedAt: string;
	createdAt: string;
}
