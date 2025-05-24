import BouncyCheckbox, { BouncyCheckboxHandle } from "react-native-bouncy-checkbox";
import { Text, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { ActionReducer } from "@/app/(tabs)/chat/new-room";
import { User, userRoleLabels } from "@/types/user";
import config from "tailwind.config";
import React from "react";

import ImagePlaceholder from "./ui/image-placeholder";
import IndependentIcon from "./independant-icon";
import InputSearch from "./ui/input-search";
import EmployeesIcon from "./emloyees-icon";


const lengthSearch = 3;

export function NewGroup({
	data,
	selectedIds,
	dispatch,
}: {
	data: User[];
	selectedIds: Set<User["id"]>;
	dispatch: React.Dispatch<ActionReducer>;
}) {
	const [search, setSearch] = React.useState("");

	const { associates, employees, independents } = React.useMemo(
		() =>
			data.reduce(
				(acc, user) => {
					switch (user.role) {
						case "associate":
							acc.associates.push(user);
							break;
						case "employee":
							acc.employees.push(user);
							break;
						case "independent":
							acc.independents.push(user);
							break;
					}
					return acc;
				},
				{ associates: [], employees: [], independents: [] } as Record<string, User[]>,
			),
		[data],
	);

	const filteredUsers = React.useMemo(() => {
		if (!search) return null;

		const searchTerm = search.toLowerCase();
		// filter users based on search term
		return data.filter(
			(item) => item.firstname.toLowerCase().includes(searchTerm) || item.lastname.toLowerCase().includes(searchTerm),
		);
	}, [data, search]);

	const groupedUsers = React.useMemo(() => {
		const dataToFilter = !!filteredUsers?.length && search.length >= lengthSearch ? filteredUsers : data;

		return dataToFilter
			.slice()
			.sort((a, b) => a.firstname.localeCompare(b.firstname, "fr"))
			.reduce(
				(acc, supplier) => {
					const letter = supplier.firstname[0].toUpperCase();
					if (!acc[letter]) acc[letter] = [];
					acc[letter].push(supplier);
					return acc;
				},
				{} as Record<string, typeof data>,
			);
	}, [data, filteredUsers]);

	return (
		<>
			<InputSearch
				placeholder="Rechercher un employé..."
				onSubmitEditing={(input) => {
					setSearch(input.nativeEvent.text);
				}}
				onClear={() => {
					setSearch("");
				}}
			/>
			{search.length < lengthSearch || !!filteredUsers?.length ? (
				<ScrollView
					className="flex-1"
					showsVerticalScrollIndicator={false}
					style={{ backgroundColor: config.theme.extend.colors.background }}
					contentContainerStyle={{ paddingBottom: 16 }}
				>
					{search.length < lengthSearch && (
						<View className="mt-5 gap-2">
							<Text className="font-medium text-lg text-defaultGray">Groupes</Text>
							<CardGroup
								users={associates}
								icon={<EmployeesIcon />}
								title="Associés"
								description={associates.length + " personnes"}
								dispatch={dispatch}
								selectedIds={selectedIds}
							/>
							<CardGroup
								users={employees}
								icon={<EmployeesIcon />}
								title="Employés"
								description={employees.length + " personnes"}
								dispatch={dispatch}
								selectedIds={selectedIds}
							/>
							<CardGroup
								users={independents}
								icon={<IndependentIcon />}
								title="Indépendants"
								description={independents.length + " personnes"}
								dispatch={dispatch}
								selectedIds={selectedIds}
							/>
						</View>
					)}
					<View className="mt-2 gap-2">
						{Object.keys(groupedUsers).map((letter) => (
							<View key={letter} className="gap-2">
								<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{letter}</Text>
								{groupedUsers[letter].map((user) => (
									<CardIndividual key={user.id} user={user} selectedIds={selectedIds} dispatch={dispatch} />
								))}
							</View>
						))}
					</View>
				</ScrollView>
			) : (
				<View className="flex-1 items-center justify-center">
					<Text className="text-sm text-defaultGray">Aucun employé trouvé</Text>
				</View>
			)}
		</>
	);
}

const CardGroup = ({
	users,
	icon,
	title,
	description,
	dispatch,
	selectedIds,
}: {
	users: User[];
	icon: any;
	title: string;
	description: string;
	dispatch: React.Dispatch<ActionReducer>;
	selectedIds: Set<User["id"]>;
}) => {
	const ref = React.useRef<BouncyCheckboxHandle>(null);
	const isChecked = users.every((user) => selectedIds.has(user.id));

	return (
		<Pressable
			onPress={() => ref.current?.onCheckboxPress()}
			className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10"
		>
			<View className="size-14 items-center justify-center rounded-full bg-secondaryLight">{icon}</View>
			<View className="mr-auto">
				<Text className="font-semibold text-lg text-dark">{title}</Text>
				<Text className="text-sm text-defaultGray">{description}</Text>
			</View>
			<BouncyCheckbox
				isChecked={isChecked}
				ref={ref}
				size={18}
				fillColor={config.theme.extend.colors.primary}
				unFillColor="#FFFFFF"
				bounceEffectIn={0.94}
				bounceEffectOut={1}
				style={{ marginLeft: "auto", width: 30, height: 30 }}
				innerIconStyle={{ borderWidth: 2, borderColor: config.theme.extend.colors.primary }}
				onPress={(isChecked) => {
					dispatch({
						type: isChecked ? "ADD" : "REMOVE",
						ids: users.map((user) => user.id),
					});
				}}
			/>
		</Pressable>
	);
};

const CardIndividual = ({
	user,
	selectedIds,
	dispatch,
}: {
	user: User;
	selectedIds: Set<User["id"]>;
	dispatch: React.Dispatch<ActionReducer>;
}) => {
	const ref = React.useRef<BouncyCheckboxHandle>(null);
	const isChecked = selectedIds.has(user.id);

	return (
		<Pressable
			onPress={() => ref.current?.onCheckboxPress()}
			className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10"
		>
			<ImagePlaceholder
				contentFit="cover"
				placeholderContentFit="cover"
				placeholder={user.photo?.blurhash}
				source={user.photo?.url}
				style={{ width: 44, height: 44, borderRadius: 99 }}
			/>
			<View className="mr-auto">
				<Text className="font-semibold text-lg text-dark">
					{user.firstname} {user.lastname}
				</Text>
				<Text className="text-sm text-defaultGray">{userRoleLabels[user.role]}</Text>
			</View>
			<BouncyCheckbox
				isChecked={isChecked}
				ref={ref}
				size={18}
				fillColor={config.theme.extend.colors.primary}
				unFillColor="#FFFFFF"
				bounceEffectIn={0.94}
				bounceEffectOut={1}
				style={{ marginLeft: "auto", width: 30, height: 30 }}
				innerIconStyle={{ borderWidth: 2, borderColor: config.theme.extend.colors.primary }}
				onPress={(isChecked) => {
					dispatch({
						type: isChecked ? "ADD" : "REMOVE",
						ids: [user.id],
					});
				}}
			/>
		</Pressable>
	);
};
