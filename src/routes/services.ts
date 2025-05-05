import { LinkProps } from "expo-router";


export interface Service {
	id: number;
	name: string;
	description: string;
	icon: string;
	link: LinkProps["href"] | null;
	theme?: string;
	pastille?: boolean;
}

const services: Service[] = [
	{
		id: 4,
		name: "Canaux de discussion / Conversations",
		description: "Suivez votre plan nutritionnel",
		icon: require("@/assets/images/logo.png"),
		link: "/chat",
		theme: "text-green-600",
		pastille: false,
	},
	{
		id: 14,
		name: "Page de connexion",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/login",
		theme: "text-blue-600",
		pastille: false,
	},
	{
		id: 15,
		name: "Visionneuse PDF",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/pdf",
		theme: "text-blue-600",
		pastille: false,
	},
	{
		id: 16,
		name: "Carte des contacts",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/contact",
		theme: "text-blue-600",
		pastille: false,
	},
	{
		id: 17,
		name: "Fournisseurs",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/supplier-category",
		theme: "text-blue-600",
		pastille: true,
	},
];

export default services;
