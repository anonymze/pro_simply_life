import CardEmployeeCarousel from "@/components/card/card-employee-carousel";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import IndependantIcon from "@/components/independant-icon";
import { withQueryWrapper } from "@/utils/libs/react-query";
import CardEmployee from "@/components/card/card-employee";
import BackgroundLayout from "@/layouts/background-layout";
import InputSearch from "@/components/ui/input-search";
import EmployeesIcon from "@/components/emloyees-icon";
import Carousel from "@/components/carousel";
import Title from "@/components/ui/title";
import { HrefObject } from "expo-router";
import config from "tailwind.config";
import { User } from "@/types/user";
import { Link } from "expo-router";
import React from "react";


export default function Page() {
	return withQueryWrapper<User>(
		{
			queryKey: ["app-users"],
			queryFn: getAppUsersQuery,
		},
		({ data }) => {
			const [search, setSearch] = React.useState("");

			const filteredData = React.useMemo(() => {
				if (!search) return null;

				const searchTerm = search.toLowerCase();
				// filter suppliers based on search term
				return data.docs.filter(
					(item) =>
						item.firstname.toLowerCase().includes(searchTerm) || item.lastname.toLowerCase().includes(searchTerm),
				);
			}, [data, search]);

			let groupedUsers: Record<string, User[]> | undefined = undefined;

			// sort and group suppliers by first letter
			groupedUsers = React.useMemo(
				() =>
					filteredData
						?.slice()
						.sort((a, b) => a.firstname.localeCompare(b.firstname, "fr"))
						.reduce(
							(acc, user) => {
								const letter = user.firstname[0].toUpperCase();
								if (!acc[letter]) acc[letter] = [];
								acc[letter].push(user);
								return acc;
							},
							{} as Record<string, typeof data.docs>,
						),
				[data, filteredData],
			);

			return (
				<BackgroundLayout className="pt-safe px-4">
					<Title title="Organigramme" />
					<InputSearch
						placeholder="Rechercher un employé..."
						onSubmitEditing={(input) => {
							setSearch(input.nativeEvent.text);
						}}
						onClear={() => {
							setSearch("");
						}}
					/>
					{search.length < 3 ? (
						<>
							<Text className="mb-3 mt-5 font-semibold text-xl">Associés</Text>
							<Carousel data={data.docs.filter((item) => item.role === "associate")}>
								{(data) => {
									return data.map((item) => (
										<CardEmployeeCarousel
											key={item.id}
											width={160}
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
									icon={<EmployeesIcon />}
									link={{
										pathname: "/organigramme",
										params: {
											employee: "1",
										},
									}}
								/>
								<Card
									title="Indépendants"
									icon={<IndependantIcon />}
									link={{
										pathname: "/organigramme",
										params: {
											employee: "1",
										},
									}}
								/>
							</View>
						</>
					) : (
						<>
							{!filteredData?.length ? (
								<View className="flex-1 items-center justify-center ">
									<Text className="text-sm text-defaultGray">Aucun employé trouvé</Text>
								</View>
							) : (
								<ScrollView
									className="flex-1"
									showsVerticalScrollIndicator={false}
									style={{ backgroundColor: config.theme.extend.colors.background }}
								>
									<View className="gap-2 mt-2 ">
										{Object.keys(groupedUsers!).map((letter) => (
											<View key={letter} className="gap-2">
												<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{letter}</Text>
												{groupedUsers?.[letter].map((user) => (
													<CardEmployee
														icon={
															<ImagePlaceholder
																contentFit="cover"
																placeholder={user?.photo?.blurhash}
																placeholderContentFit="cover"
																source={user?.photo?.url}
																style={{ width: 56, height: 56, borderRadius: 5 }}
															/>
														}
														key={user.id}
														user={user}
														link={{
															pathname: "/organigramme/[organigramme]",
															params: {
																organigramme: user.id,
															},
														}}
													/>
												))}
											</View>
										))}
									</View>
								</ScrollView>
							)}
						</>
					)}
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
					{icon}
				</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-dark">{title}</Text>
				</View>
			</TouchableOpacity>
		</Link>
	);
};

// 

//

//