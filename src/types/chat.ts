import * as ImagePicker from "expo-image-picker";

import { Media } from "./media";
import { User } from "./user";


export interface ChatRoom {
	id: string;
	app_user: User["id"]
	name: string;
	description: string | null;
	private: boolean | null;
	color: string | null;
	category: string | null;
	createdAt: string;
	updatedAt: string;
}


export interface Message {
	id: string;
	app_user: User;
	chat_room: ChatRoom["id"];
	message?: string;
	file?: Media | ImagePicker.ImagePickerAsset;
	createdAt: string;
	updatedAt: string;
	optimistic?: boolean;
}

export interface MessageOptimistic {
	id: Message["id"];
	app_user: User;
	chat_room: Message["chat_room"];
	message?: Message["message"];
	file?: ImagePicker.ImagePickerAsset[];
	createdAt: Message["createdAt"];
	optimistic: true;
}

