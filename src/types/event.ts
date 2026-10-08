import { AppUser } from "./user";

export interface Event {
	id: string;
	title: string;
	intervenants?: Array<{
		name: string;
		theme?: string;
		company: string;
	}>;
	annotation?: string | null;
	address?: string | null;
	type:
		| "general"
		| "sport"
		| "seminaire"
		| "food"
		| "birthday"
		| "meeting"
		| "reunion_agence"
		| "reunion_bonne_pratique";
	event_start: string;
	event_end: string;
	teams_enabled?: boolean;
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
	reunion_agence: "Réunion d'agence",
	reunion_bonne_pratique: "Réunion bonne pratique",
} as const;

export interface EventStatus {
  id: string;
  app_user: AppUser;
  agency_life: Event;
  status: 'yes' | 'no';
  presence_mode?: ('presentiel' | 'visio') | null;
  meal?: ('yes' | 'no') | null;
  updatedAt: string;
  createdAt: string;
}
