import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { Text, TouchableOpacity, View } from "react-native";
import BackgroundLayout from "@/layouts/background-layout";
import InputSearch from "@/components/ui/input-search";
import { useQuery } from "@tanstack/react-query";
import Title from "@/components/ui/title";
import { HrefObject } from "expo-router";
import config from "tailwind.config";
import { Link } from "expo-router";


export default function Organigramme() {
	const { data: appUsers, error } = useQuery({
		queryKey: ["app-users"],
		queryFn: getAppUsersQuery,
	});

	console.log(appUsers);
	console.log(error);
	return (
		<BackgroundLayout className="pt-safe px-4">
			<Title title="Organigramme" />
			<InputSearch placeholder="Rechercher un employé..." />
			<Text className="mt-6 font-semibold text-xl">Associés</Text>
			<View className="mt-6 gap-2">
				<CardEmployee
					icon={require("@/assets/icons/employee.svg")}
					link={{
						pathname: "/organigramme/employee/[employee]",
						params: {
							employee: "1",
						},
					}}
				/>
				<CardEmployee
					icon={require("@/assets/icons/independant.svg")}
					link={{
						pathname: "/organigramme/employee/[employee]",
						params: {
							employee: "1",
						},
					}}
				/>
			</View>
		</BackgroundLayout>
	);
}

const CardEmployee = ({ link, icon }: { link: HrefObject; icon: any }) => {
	return (
		<Link href={link} push asChild>
			<TouchableOpacity className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10">
				<View className="size-14 items-center justify-center rounded-lg bg-secondaryLight">
					<ImagePlaceholder
						source={icon}
						tintColor={config.theme.extend.colors.secondaryDark}
						style={{ width: 24, height: 24 }}
					/>
				</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-dark">Identifiants de connexion</Text>
				</View>
			</TouchableOpacity>
		</Link>
	);
};
