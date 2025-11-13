import { Media } from "./media";

export interface AppUser {
	exp: number;
	token: string;
	user: User;
}

export interface User {
	id: string;
	lastname: string;
	firstname: string;
	email: string;
	role: UserRole;
	birthday?: string | undefined;
	cabinet?: string | undefined;
	phone?: string;
	photo?: Media;
	entry_date?: string;
	notifications_token?: string | null;
	latitude?: string;
	longitude?: string;
	createdAt: string;
	updatedAt: string;
}

export interface UserContact {
	id: string;
	lastname: string;
	firstname: string;
	cabinet?: string | undefined;
	phone?: string;
	latitude?: string;
	longitude?: string;
}

type UserRole = "associate" | "independent" | "visitor" | "employee";

export const userHierarchy: Record<UserRole, number> = {
	associate: 0,
	employee: 1,
	independent: 2,
	visitor: 3,
} as const;

export const userRoleLabels: Record<UserRole, string> = {
	associate: "Associé",
	employee: "Staff",
	independent: "Indépendant",
	visitor: "Visiteur",
} as const;
