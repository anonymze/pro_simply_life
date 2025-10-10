import { Media } from "./media";
import { Supplier } from "./supplier";

export type Selection = {
	id: string;
	supplier: Supplier;
	category: "girardin" | "immobilier";
	image?: Media;
	brochure?: Media;
	website?: string;
	updatedAt: string;
	createdAt: string;
}
