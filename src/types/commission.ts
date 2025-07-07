import { Media } from "./media";
import { Supplier } from "./supplier";

// export interface Commission {
// 	id: string;
// 	app_user: AppUser;
// 	pdf?: Media | null;
// 	suppliers: Supplier[];
// 	structured_product?: boolean | null;
// 	informations?: {
// 		date: string;
// 		encours?: number | null;
// 		production?: number | null;
// 		title?: string | null;
// 		up_front?: number | null;
// 		broqueur?: string | null;
// 	};
// 	updatedAt: string;
// 	createdAt: string;
// }

export interface CommissionLight {
	id: string;
	suppliers: Supplier[];
	structured_product?: boolean | null;
	pdf?: Media | null;
	informations?: {
		date?: string | null;
		encours?: number | null;
		production?: number | null;
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
		};
		comparison?: {
			difference: number;
			percentageChange: number;
			previousMonthTotal: number;
		};
	}>;
}
