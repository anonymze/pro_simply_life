import { Supplier } from "./supplier";

export interface FinancingCredit {
	id: string;
	supplier: string | Supplier;
	updatedAt: string;
	createdAt: string;
}
