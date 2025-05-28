import { Text, TouchableOpacity, View } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import { MenuIcon } from "lucide-react-native";
import { Media } from "@/types/media";
import { logout } from "@/utils/auth";
import config from "tailwind.config";
import { Image } from "expo-image";


export default function ProfileDashboard({
	firstname,
	lastname,
	photo,
	createdAt,
}: {
	firstname: string;
	lastname: string;
	createdAt: string;
	photo?: Media;
}) {
	return (
		<View className="flex-row items-center gap-3">
			{photo ? (
				<Image source={photo.url} placeholder={require("@/assets/icons/placeholder_user.svg")} />
			) : (
				<View className="size-12 items-center justify-center rounded-full bg-secondary">
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
						<TouchableOpacity className="p-3">
							<View className="size-9 items-center justify-center rounded-full bg-white shadow-sm shadow-defaultGray/20">
								<MenuIcon size={18} color={config.theme.extend.colors.dark} />
							</View>
						</TouchableOpacity>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item key="help" onSelect={() => console.log("item-1 selected")}>
							<DropdownMenu.ItemTitle>Centre d'aide</DropdownMenu.ItemTitle>
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
											dark: config.theme.extend.colors.primary,
											light: config.theme.extend.colors.primary,
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
