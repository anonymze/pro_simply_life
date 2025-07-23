import { Supplier } from "./supplier";

export interface StructuredProduct {
	id: string;
	supplier: Supplier;
	broker: "kepler" | "irbis" | "silex";
	max: number;
	current: number;
	start_comm: string;
	end_comm: string;
	constatation: string;
	sousjacent: string;
	mature: string;
	coupon: string;
	frequency: string;
	refund: string;
	capital: string;
	updatedAt: string;
	createdAt: string;
}
