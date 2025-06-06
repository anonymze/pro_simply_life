import CardEmployeeCarousel from "@/components/card/card-employee-carousel";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { withQueryWrapper } from "@/utils/libs/react-query";
import CardEmployee from "@/components/card/card-employee";
import BackgroundLayout from "@/layouts/background-layout";
import InputSearch from "@/components/ui/input-search";
import { queryClient } from "@/api/_queries";
import Title from "@/components/ui/title";
import { HrefObject } from "expo-router";
import config from "tailwind.config";
import { User } from "@/types/user";
import { Link } from "expo-router";
import React from "react";


// utility function to split array into chunks
const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}
	return chunks;
};

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

			const classifiedUsers = React.useMemo(() => {
				return data.docs.reduce(
					(acc, item) => {
						if (!acc[item.role]) acc[item.role] = [];
						acc[item.role].push(item);
						return acc;
					},
					{
						associate: [],
						independent: [],
						employee: [],
						visitor: [],
					} as Record<User["role"], typeof data.docs>,
				);
			}, [data]);

			// split employees into chunks of 9
			const employeeChunks = React.useMemo(() => {
				return chunkArray(classifiedUsers.employee, 9);
			}, [classifiedUsers.employee]);

			const independentChunks = React.useMemo(() => {
				return chunkArray(classifiedUsers.independent, 9);
			}, [classifiedUsers.independent]);

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
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: 16 }}
							className="mt-4"
						>
							<Title title="Associés" />
							<View className="flex-row flex-wrap gap-x-8 gap-y-4">
								{classifiedUsers.associate.map((item) => (
									<CardEmployeeCarousel
										key={item.id}
										user={item}
										link={{
											pathname: "/organigramme/[organigramme]",
											params: {
												organigramme: item.id,
											},
										}}
									/>
								))}
							</View>
							<View className="mb-4 mt-7 flex-row items-center justify-between">
								<Title title="Employés" className="mb-0 mt-0" />
								<Link
									href={{
										pathname: "/organigramme/role/[role]",
										params: {
											role: "employee",
										},
									}}
									asChild
								>
									<TouchableOpacity
										hitSlop={10}
										onPress={() => {
											queryClient.setQueryData(["app-users", "employee"], {
												docs: classifiedUsers.employee,
											});
										}}
									>
										<Text className="font-semibold text-primaryLight">Voir tout</Text>
									</TouchableOpacity>
								</Link>
							</View>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								className="-mr-4"
								decelerationRate={0.1}
								contentContainerStyle={{ paddingRight: 16, gap: 16 }} // keep right padding for last card
								scrollEventThrottle={undefined}
								style={{ flexGrow: 0 }}
							>
								{employeeChunks.map((employeePage) => {
									return (
										<View key={employeePage[0].id} className="flex-row flex-wrap gap-x-8 gap-y-4">
											{employeePage.map((employee) => (
												<CardEmployeeCarousel
													key={employee.id}
													user={employee}
													link={{
														pathname: "/organigramme/[organigramme]",
														params: {
															organigramme: employee.id,
														},
													}}
												/>
											))}
										</View>
									);
								})}
							</ScrollView>
							<View className="mb-4 mt-7 flex-row items-center justify-between">
								<Title title="Indépendants" className="mb-0 mt-0" />
								<Link
									href={{
										pathname: "/organigramme/role/[role]",
										params: {
											role: "independent",
										},
									}}
									asChild
								>
									<TouchableOpacity
										hitSlop={10}
										onPress={() => {
											queryClient.setQueryData(["app-users", "independent"], {
												docs: classifiedUsers.independent,
											});
										}}
									>
										<Text className="font-semibold text-primaryLight">Voir tout</Text>
									</TouchableOpacity>
								</Link>
							</View>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								className="-mr-4"
								decelerationRate={0.1}
								contentContainerStyle={{ paddingRight: 16, gap: 16 }} // keep right padding for last card
								scrollEventThrottle={undefined}
								style={{ flexGrow: 0 }}
							>
								{independentChunks.map((independentPage) => {
									return (
										<View key={independentPage[0].id} className="flex-row flex-wrap gap-x-8 gap-y-4">
											{independentPage.map((independent) => (
												<CardEmployeeCarousel
													key={independent.id}
													user={independent}
													link={{
														pathname: "/organigramme/[organigramme]",
														params: {
															organigramme: independent.id,
														},
													}}
												/>
											))}
										</View>
									);
								})}
							</ScrollView>
						</ScrollView>
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
									<View className="mt-2 gap-2">
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
				<View className="size-14 items-center justify-center rounded-lg bg-darkGray">{icon}</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-primary">{title}</Text>
				</View>
			</TouchableOpacity>
		</Link>
	);
};
