import { Media } from "./media";
import { Supplier } from "./supplier";

export interface PrivateEquity {
	id: string;
	supplier: string | Supplier;
	type: "capital" | "dettes" | "assurance";
	fond?:
		| {
				id?: string | null;
				name: string;
				brochure?: Media;
				versement?: string | null;
				arbitrage?: string | null;
				allocation?: string | null;
				liquidite?: string | null;
				penalite?: string | null;
				tri?: string | null;
				retrocession?: string | null;
				"sous-jacent"?: string | null;
		  }[]
		| null;
	updatedAt: string;
	createdAt: string;
}
