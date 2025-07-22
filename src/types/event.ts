export interface Event {
	id: string;
	title: string;
	annotation?: string | null;
	address?: string | null;
	type: "general" | "sport" | "seminaire" | "food" | "birthday" | "meeting";
	event_start: string;
	event_end: string;
	updatedAt: string;
	createdAt: string;
}

export const eventLabel: Record<Event["type"], string> = {
	general: "Général",
	sport: "Sport",
	seminaire: "Séminaire",
	food: "Restaurant",
	birthday: "Anniversaire",
	meeting: "Réunion",
} as const;
