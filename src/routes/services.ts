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
		id: 14,
		name: "Page de connexion",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/login",
		theme: "text-blue-600",
		pastille: true,
	},
];

export default services;
