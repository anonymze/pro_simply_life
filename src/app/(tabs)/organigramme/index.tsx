import { queryClient } from "@/api/_queries";
import { getAppUsersQuery } from "@/api/queries/app-user-queries";
import CardEmployee from "@/components/card/card-employee";
import CardEmployeeCarousel from "@/components/card/card-employee-carousel";
import { MyTouchableOpacity } from "@/components/my-pressable";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import InputSearch from "@/components/ui/input-search";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { User } from "@/types/user";
import { cn } from "@/utils/cn";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { LegendList } from "@legendapp/list";
import { Href, Link } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Page() {
    const insets = useSafeAreaInsets();
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

			// sort and group suppliers by first letter
			const groupedUsers = React.useMemo(
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

			const searchSections = React.useMemo(
				() =>
					groupedUsers
						? Object.keys(groupedUsers).map((letter) => ({
								letter,
								users: groupedUsers[letter],
						  }))
						: [],
				[groupedUsers],
			);

			const classifiedUsers = React.useMemo(() => {
				const classified = data.docs.reduce(
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

				// Add 2 more employees for testing (duplicates of first two)
				// if (classified.employee.length > 0) {
				// 	classified.employee.push({ ...classified.employee[0], id: `${classified.employee[0].id}-duplicate1` });
				// 	if (classified.employee.length > 1) {
				// 		classified.employee.push({ ...classified.employee[1], id: `${classified.employee[1].id}-duplicate2` });
				// 	}
				// }

				// Sort associates and employees by firstname
				classified.associate.sort((a, b) => a.firstname.localeCompare(b.firstname, "fr"));
				classified.employee.sort((a, b) => a.firstname.localeCompare(b.firstname, "fr"));

				return classified;
			}, [data]);

			// Sort independents by firstname and group into columns of 2
			const independentColumns = React.useMemo(() => {
				const sorted = [...classifiedUsers.independent].sort((a, b) => a.firstname.localeCompare(b.firstname, "fr"));
				const columns: User[][] = [];
				for (let i = 0; i < sorted.length; i += 2) {
					columns.push(sorted.slice(i, i + 2));
				}
				return columns;
			}, [classifiedUsers.independent]);

			return (
				<BackgroundLayout className="px-4" style={{ paddingTop: insets.top }}>
					<Title title="Organigramme" />
					<InputSearch
						placeholder="Rechercher une personne..."
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
							className="mt-0 flex-1"
						>
							<Title title="Associés" />
							<View className="flex-row flex-wrap items-center justify-center gap-x-8 gap-y-4">
								{classifiedUsers.associate.map((item) => (
									<View key={item.id} className="w-[40%]">
										<CardEmployeeCarousel
											associate
											user={item}
											link={{
												pathname: "/organigramme/[organigramme]",
												params: {
													organigramme: item.id,
												},
											}}
										/>
									</View>
								))}
							</View>
							<Title title="Staff" className="mb-4 mt-7" />
							<View className="flex-row flex-wrap items-center justify-center gap-x-8 gap-y-4">
								{classifiedUsers.employee.map((item) => (
									<View key={item.id} className={cn(classifiedUsers.employee.length > 4 ? "w-[25%]" : "w-[40%]")}>
										<CardEmployeeCarousel
											user={item}
											link={{
												pathname: "/organigramme/[organigramme]",
												params: {
													organigramme: item.id,
												},
											}}
										/>
									</View>
								))}
							</View>
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
									<MyTouchableOpacity
										hitSlop={10}
										onPress={() => {
											queryClient.setQueryData(["app-users", "independent"], {
												docs: classifiedUsers.independent,
											});
										}}
									>
										<Text className="font-semibold text-primaryLight">Voir tout</Text>
									</MyTouchableOpacity>
								</Link>
							</View>
							<LegendList
								data={independentColumns}
								horizontal
								showsHorizontalScrollIndicator={false}
								estimatedItemSize={150}
								style={{ height: 210 }}
								contentContainerStyle={{ paddingRight: 16, paddingBottom: 16 }}
								ItemSeparatorComponent={() => <View style={{ width: 32 }} />}
								renderItem={({ item: column }) => (
									<View className="gap-y-4">
										{column.map((independent) => (
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
								)}
							/>
						</ScrollView>
					) : (
						<>
							{!filteredData?.length ? (
								<View className="flex-1 items-center justify-center ">
									<Text className="text-sm text-defaultGray">Aucune personne trouvée</Text>
								</View>
							) : (
								<LegendList
									className="flex-1"
									showsVerticalScrollIndicator={false}
									contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
									estimatedItemSize={200}
									data={searchSections}
									renderItem={({ item: section }) => (
										<View key={section.letter} className="gap-2">
											<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">
												{section.letter}
											</Text>
											{section.users.map((user) => (
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
									)}
								/>
							)}
						</>
					)}
				</BackgroundLayout>
			);
		},
	)();
}

const Card = ({ link, icon, title }: { link: Href; icon: any; title: string }) => {
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
