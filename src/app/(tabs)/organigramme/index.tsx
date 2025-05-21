import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { Text, TouchableOpacity, View } from "react-native";
import CardEmployee from "@/components/card/card-employee";
import BackgroundLayout from "@/layouts/background-layout";
import InputSearch from "@/components/ui/input-search";
import { useQuery } from "@tanstack/react-query";
import Carousel from "@/components/carousel";
import Title from "@/components/ui/title";
import { HrefObject } from "expo-router";
import config from "tailwind.config";
import { User } from "@/types/user";
import { Link } from "expo-router";


export default function Page() {
	return withQueryWrapper<User>(
		{
			queryKey: ["app-users"],
			queryFn: getAppUsersQuery,
		},
		({ data }) => {
			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Organigramme" />
					<InputSearch placeholder="Rechercher un employé..." />
					<Text className="mb-3 mt-5 font-semibold text-xl">Associés</Text>
					<Carousel data={data.docs.filter((item) => item.role === "associate")}>
						{(data) => {
							return data.map((item) => (
								<CardEmployee
									key={item.id}
									width={200}
									user={item}
									link={{
										pathname: "/organigramme/[organigramme]",
										params: {
											organigramme: item.id,
										},
									}}
								/>
							));
						}}
					</Carousel>
					<View className="mt-6 gap-2">
						<Card
							title="Employés"
							icon={require("@/assets/icons/employee.svg")}
							link={{
								pathname: "/organigramme",
								params: {
									employee: "1",
								},
							}}
						/>
						<Card
							title="Indépendants"
							icon={require("@/assets/icons/independant.svg")}
							link={{
								pathname: "/organigramme",
								params: {
									employee: "1",
								},
							}}
						/>
					</View>
				</BackgroundLayout>
			);
		},
	)();
}

const Card = ({ link, icon, title }: { link: HrefObject; icon: any; title: string }) => {
	return (
		<Link href={link} push asChild>
			<TouchableOpacity className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10">
				<View className="size-14 items-center justify-center rounded-lg bg-secondaryLight">
					<ImagePlaceholder
						source={icon}
						placeholder={icon}
						style={{ width: 24, height: 24 }}
					/>
				</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-dark">{title}</Text>
				</View>
			</TouchableOpacity>
		</Link>
	);
};
