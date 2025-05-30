import { QueryFunction, QueryKey, useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Text } from "react-native";
import { PaginatedResponse } from "@/types/response";
import config from "tailwind.config";
import { View } from "react-native";
import { User } from "@/types/user";


// HOC pattern
export function withQueryWrapper<T>(
	query: {
		queryKey: QueryKey;
		queryFn: QueryFunction<PaginatedResponse<T>>;
		select?: (data: PaginatedResponse<T>) => PaginatedResponse<T>;
		refetchInterval?: number;
	},
	Component: React.ComponentType<{ data: PaginatedResponse<T> }>,
	ignoreNullable?: boolean,
) {
	// need to return this anonymous capitalized (convention for components name) function component to call the hooks, because withQueryWrapper is a regular function
	return function ComponentWrapperQuery() {
		const { data, isLoading, isError, isFetching } = useQuery({
			queryKey: query.queryKey,
			queryFn: query.queryFn,
			select: query.select,
			refetchInterval: query.refetchInterval,
		});

		console.log("isFetching", isFetching);
		console.log("isLoading", isLoading);

		if (isError) {
			return (
				<View className="flex-1 items-center justify-center">
					<Text className="text-sm text-defaultGray">Erreur</Text>
				</View>
			);
		}

		if (isLoading) {
			return (
				<ActivityIndicator
					className="absolute bottom-0 left-0 right-0 top-0"
					size="large"
					color={config.theme.extend.colors.primary}
				/>
			);
		}

		if (!data) {
			return (
				<View className="flex-1 items-center justify-center">
					<Text className="text-sm text-defaultGray">Erreur</Text>
				</View>
			);
		}

		if (!data?.docs?.length && !ignoreNullable) {
			return (
				<View className="flex-1 items-center justify-center">
					<Text className="text-sm text-defaultGray">Pas de contenu</Text>
				</View>
			);
		}

		return <Component data={data!} />;
	};
}
