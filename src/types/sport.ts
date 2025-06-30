export interface Sport {
	id: string;
	lastname: string;
	first_name: string;
	email?: string | null;
	phone?: string | null;
	type?: string | null;
	category: "international" | "fiscal";
	updatedAt: string;
	createdAt: string;
}
