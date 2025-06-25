import { Supplier } from "./supplier";
import { AppUser } from "./user";
import { Media } from "./media";


export interface Commission {
	id: string;
	app_user: AppUser;
	supplier: Supplier;
	structured_product?: boolean | null;
	informations?: {
		date: string;
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

export interface CommissionLight {
	id: string;
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
}

export interface CommissionMonthlyAndYearlyData {
	monthlyData: Array<{
		id: string;
		labelDate: string;
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
	}>;
	yearlyData: Array<{
		id: string;
		labelDate: string;
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
	}>;
}
