import { AppUsersCommissionsCode, CommissionMonthlyAndYearlyData } from "@/types/commission";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";
import { PaginatedResponse } from "@/types/response";
import { Supplier } from "@/types/supplier";

export async function getCommissionMonthlyAndYearlyDataQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, userId] = queryKey;

	const response = await api.get<CommissionMonthlyAndYearlyData>(`/api/commissions/extra/${userId}`);

	return response.data;
}

export async function getAppUserCommissionCodesQuery({
  queryKey,
}: {
  queryKey: QueryKey;
}) {
  const [, filters] = queryKey;

  const response = await api.get<PaginatedResponse<AppUsersCommissionsCode>>(
    "/api/app-users-commissions-code",
    { params: filters },
  );

  return response.data;
}

export const createAppUserCommissionCodeQuery = async (data: {
  app_user: string;
  code: { code: string; supplier: Supplier["id"] }[];
}) => {
  const response = await api.post("/api/app-users-commissions-code/create", data);
  return response.data;
};
