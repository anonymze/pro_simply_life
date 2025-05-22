import { Platform, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react-native";
import HeaderLayout from "@/layouts/headert-layout";
import { Link, router, Stack } from "expo-router";
import { truncateText } from "@/utils/helper";
import { cn } from "@/utils/libs/tailwind";
import config from "tailwind.config";


export default function ChatLayout() {
	return (
		<Stack
			screenOptions={{
				gestureEnabled: true,
				fullScreenGestureEnabled: true,
				animation: Platform.OS === "ios" ? "simple_push" : "fade_from_bottom",
			}}
		>
			<Stack.Screen
				name="index"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="new-room"
				options={{
					headerShown: true,
					sheetGrabberVisible: true,
					presentation: "modal",
					// sheetAllowedDetents: Platform.OS === "ios" ? "fitToContents" : undefined,
					header: () => (
						<View className={cn("pt-8 flex-row items-center justify-between bg-background px-2 pb-2")}>
							<Link className="w-24 p-2" dismissTo href="../" asChild>
								<TouchableOpacity>
									<Text className="font-semibold text-sm text-primary">Annuler</Text>
								</TouchableOpacity>
							</Link>

							<Text className="font-bold text-lg">Nouveau groupe</Text>
							<TouchableOpacity
								className="w-24 items-end p-2"
								onPress={() => {
									// router.push(sheet.link);
								}}
							>
									<Text className="font-semibold text-sm text-primary">Suivant</Text>
							</TouchableOpacity>
						</View>
					),
				}}
			/>
			<Stack.Screen
				name="[chat]"
				options={{
					header: (props) => <HeaderLayout title={truncateText(props.options.title || "", 22)} />,
				}}
			/>
		</Stack>
	);
}
