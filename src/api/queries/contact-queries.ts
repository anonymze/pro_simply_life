import { PaginatedResponse } from "@/types/response";
import { getAndroidIcon } from "@/utils/icon-maps";
import { QueryKey } from "@tanstack/react-query";
import { Contact } from "@/types/contact";
import { Platform } from "react-native";
import { Image } from "expo-image";

import { api } from "../_config";


export async function getContactsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Contact>>("/api/contacts", { params: filters });

	if (Platform.OS === "ios") return response.data;

	const dataWithIcon = await Promise.all(
		response.data.docs.map(async (contact) => {
			return {
				...contact,
				logo: await Image.loadAsync(getAndroidIcon(contact.category.name)).catch(() => undefined),
			};
		}),
	);

	response.data.docs = dataWithIcon;

	return response.data;
}

