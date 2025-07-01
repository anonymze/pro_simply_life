import { Supplier } from "./supplier";

export interface StructuredProduct {
	id: string;
	supplier: Supplier;
	max: number;
	current: number;
	coupon: number;
	barrier: number;
	constatation: string;
	insurer: string;
	updatedAt: string;
	createdAt: string;
}
