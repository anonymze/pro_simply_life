import { Media } from "./media";
import { Supplier } from "./supplier";

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
