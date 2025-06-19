import { Supplier } from "./supplier";
import { AppUser } from "./user";
import { Media } from "./media";


export interface Commission {
	id: string;
	app_user: AppUser;
	supplier: Supplier;
	structured_product?: boolean | null;
	informations?: {
		date?: string | null;
		encours?: number | null;
		production?: number | null;
		pdf?: Media | null;
		title?: string | null;
		up_front?: number | null;
		broqueur?: string | null;
	};
	updatedAt: string;
	createdAt: string;
}

interface CommissionLight {
	id: string;
	supplier: Pick<Supplier, "id" | "name" | "logo_mini">;
	structured_product?: boolean | null;
	informations?: {
		date?: string | null;
		encours?: number | null;
		production?: number | null;
		pdf?: Media | null;
		title?: string | null;
		up_front?: number | null;
		broqueur?: string | null;
	};
	updatedAt: string;
}

export interface CommissionMonthlyData {
	totalAmount: number;
	monthlyData: {
		month: string;
		year: number;
		commissions: CommissionLight[];
		totalAmount: number;
		groupedData: {
			encours: number;
			production: number;
			structured_product: number;
			total: number;
		};
		comparison?: {
			difference: number;
			percentageChange: number;
			previousMonthTotal: number;
		};
	};
}
