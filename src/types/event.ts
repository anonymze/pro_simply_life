export interface Event {
	id: string;
	title: string;
	annotation?: string | null;
	address?: string | null;
	type: string;
	event_start: string;
	event_end: string;
	updatedAt: string;
	createdAt: string;
}
