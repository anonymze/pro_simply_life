export interface Sport {
	id: string;
	lastname: string;
	firstname: string;
	type: string;
	category: "international" | "fiscal";
	email?: string | null;
	phone?: string | null;
	updatedAt: string;
	createdAt: string;
}
