import { Calendar1Icon, CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react-native";
import BackgroundLayout from "@/layouts/background-layout";
import { Text, View } from "react-native";
import config from "tailwind.config";


export default function Page() {
	return (
		<BackgroundLayout className="px-4">
			<View className="gap-5">
				<View className="items-center gap-2 rounded-2xl bg-white p-5">
					<View className="mx-auto mt-1 self-start rounded-[0.5rem] bg-darkGray px-2 py-1.5">
						<Text className="text-md font-semibold text-primaryLight">heyyyyy</Text>
					</View>
					<Text className="text-center font-bold text-xl text-primary">Réunion mensuelle du Groupe Valorem !</Text>
					<Text className="text-center text-lg text-primaryLight">
						Masterclass ze ohigzehihiozegho zeiog zehiogho zegihzeghizghiozoghizhogi
					</Text>
				</View>
				<View className="flex-row gap-5">
					<View className="flex-grow items-center gap-2 rounded-2xl bg-white p-5">
						<CalendarIcon size={30} color={config.theme.extend.colors.primaryLight} />
						<Text className="text-center font-semibold text-lg text-primary">Lundi 16 juin</Text>
					</View>
					<View className="flex-grow items-center gap-2 rounded-2xl bg-white p-5">
						<ClockIcon size={30} fill={config.theme.extend.colors.primaryLight} color={"#fff"} />
						<Text className="text-center font-semibold text-lg text-primary">00:00 - 00:00</Text>
					</View>
				</View>
				<View className="flex-row items-center gap-3 rounded-2xl bg-white p-5">
					<MapPinIcon size={32} fill={config.theme.extend.colors.primaryLight} color={"#fff"} />
					<View className="gap-1">
						<Text className="font-semibold text-lg text-primary">27 rue de quelquechose</Text>
						<Text className=" text-md font-light text-primary">31000 Toulouse, France</Text>
					</View>
				</View>
			</View>
		</BackgroundLayout>
	);
}
