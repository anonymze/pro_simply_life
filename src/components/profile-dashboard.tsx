import { Media } from "@/types/media";
import { logout } from "@/utils/auth";
import { MenuIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";
import * as DropdownMenu from "zeego/dropdown-menu";

import { router } from "expo-router";
import ImagePlaceholder from "./ui/image-placeholder";
import { MyTouchableScale } from "./my-pressable";

export default function ProfileDashboard({
	firstname,
	lastname,
	photo,
}: {
	firstname: string;
	lastname: string;
	photo?: Media;
}) {
	return (
		<View className="flex-row items-center gap-3">
			{photo ? (
				<ImagePlaceholder
					transition={300}
					contentFit="cover"
					source={photo?.url}
					style={{ width: 40, height: 40, borderRadius: 99 }}
				/>
			) : (
				<View className="size-12 items-center justify-center rounded-full bg-primaryLight">
					<Text className="text-sm uppercase tracking-[-1px] text-white">
						{firstname.charAt(0)} {lastname.charAt(0)}
					</Text>
				</View>
			)}
			<View>
				<Text className="text-sm text-defaultGray">Bonjour,</Text>
				<Text className="font-semibold text-lg text-primary">
					{firstname} {lastname}
				</Text>
			</View>
			<View className="ml-auto">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<MyTouchableScale className="p-3" hitSlop={5}>
							<View className="size-10 items-center justify-center rounded-full bg-white shadow-sm shadow-defaultGray/20">
								<MenuIcon size={20} color={config.theme.extend.colors.primary} />
							</View>
						</MyTouchableScale>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item
							key="help"
							onSelect={() => {
								router.push("/(tabs)/help");
							}}
						>
							<DropdownMenu.ItemTitle>Guide du débutant</DropdownMenu.ItemTitle>
							<DropdownMenu.ItemIcon
								// androidIconName="arrow_down_float"
								ios={{
									name: "questionmark.circle",
									pointSize: 21,
									paletteColors: [
										{
											dark: config.theme.extend.colors.primary,
											light: config.theme.extend.colors.primary,
										},
									],
								}}
							/>
						</DropdownMenu.Item>

						<DropdownMenu.Separator />
						<DropdownMenu.Item key="logout" onSelect={() => logout()}>
							<DropdownMenu.ItemTitle>Se déconnecter</DropdownMenu.ItemTitle>
							<DropdownMenu.ItemIcon
								// androidIconName="arrow_down_float"
								ios={{
									name: "rectangle.portrait.and.arrow.right",
									pointSize: 18,
									weight: "semibold",
									paletteColors: [
										{
											dark: "#B42318",
											light: "#B42318",
										},
									],
								}}
							/>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</View>
		</View>
	);
}
