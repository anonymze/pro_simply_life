import BouncyCheckbox, { BouncyCheckboxHandle } from "react-native-bouncy-checkbox";
import { Text, View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { User, userRoleLabels } from "@/types/user";
import config from "tailwind.config";
import React from "react";

import ImagePlaceholder from "./ui/image-placeholder";
import IndependentIcon from "./independant-icon";
import InputSearch from "./ui/input-search";
import EmployeesIcon from "./emloyees-icon";


const lengthSearch = 3;

export function NewGroup({ data }: { data: User[] }) {
	const [search, setSearch] = React.useState("");
	const [selectedIds, setSelectedIds] = React.useState<Set<User["id"]>>(new Set());

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

	console.log(groupedUsers);

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
								setSelectedIds={setSelectedIds}
								selectedIds={selectedIds}
							/>
							<CardGroup
								users={employees}
								icon={<EmployeesIcon />}
								title="Employés"
								description={employees.length + " personnes"}
								setSelectedIds={setSelectedIds}
								selectedIds={selectedIds}
							/>
							<CardGroup
								users={independents}
								icon={<IndependentIcon />}
								title="Indépendants"
								description={independents.length + " personnes"}
								setSelectedIds={setSelectedIds}
								selectedIds={selectedIds}
							/>
						</View>
					)}
					<View className="mt-2 gap-2">
						{Object.keys(groupedUsers).map((letter) => (
							<View key={letter} className="gap-2">
								<Text className="mb-2 mt-4 font-semibold text-base text-defaultGray">{letter}</Text>
								{groupedUsers[letter].map((user) => (
									<CardIndividual key={user.id} user={user} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
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
	setSelectedIds,
	selectedIds,
}: {
	users: User[];
	icon: any;
	title: string;
	description: string;
	setSelectedIds: (ids: Set<User["id"]>) => void;
	selectedIds: Set<User["id"]>;
}) => {
	const ref = React.useRef<BouncyCheckboxHandle>(null);
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
				ref={ref}
				size={18}
				fillColor={config.theme.extend.colors.primary}
				unFillColor="#FFFFFF"
				bounceEffectIn={0.94}
				bounceEffectOut={1}
				style={{ marginLeft: "auto", width: 30, height: 30 }}
				innerIconStyle={{ borderWidth: 2, borderColor: config.theme.extend.colors.primary }}
				onPress={(isChecked: boolean) => {
					if (isChecked) {
						// have to create a new reference to the set
						const newSet = new Set(selectedIds);
						users.forEach((user) => newSet.add(user.id));
						setSelectedIds(newSet);
					} else {
						const newSet = new Set(selectedIds);
						users.forEach((user) => newSet.delete(user.id));
						setSelectedIds(newSet);
					}
				}}
			/>
		</Pressable>
	);
};

const CardIndividual = ({
	user,
	selectedIds,
	setSelectedIds,
}: {
	user: User;
	selectedIds: Set<User["id"]>;
	setSelectedIds: (ids: Set<User["id"]>) => void;
}) => {
	const ref = React.useRef<BouncyCheckboxHandle>(null);
	return (
		<Pressable onPress={() => ref.current?.onCheckboxPress()} className="w-full flex-row items-center gap-3 rounded-xl bg-white p-2 shadow-sm shadow-defaultGray/10">
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
				ref={ref}
				size={18}
				fillColor={config.theme.extend.colors.primary}
				unFillColor="#FFFFFF"
				bounceEffectIn={0.94}
				bounceEffectOut={1}
				style={{ marginLeft: "auto", width: 30, height: 30 }}
				innerIconStyle={{ borderWidth: 2, borderColor: config.theme.extend.colors.primary }}
				onPress={(isChecked: boolean) => {
					if (isChecked) {
						// have to create a new reference to the set
						const newSet = new Set(selectedIds);
						newSet.add(user.id);
						setSelectedIds(newSet);
					} else {
						const newSet = new Set(selectedIds);
						newSet.delete(user.id);
						setSelectedIds(newSet);
					}
				}}
			/>
		</Pressable>
	);
};
