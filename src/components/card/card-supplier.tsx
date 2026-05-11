import { queryClient } from "@/api/_queries";
import { PrivateEquity } from "@/types/private-equity";
import { Supplier } from "@/types/supplier";
import { cn } from "@/utils/cn";
import { Href, Link } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { DimensionValue, Text, View } from "react-native";
import config from "tailwind.config";
import { MyTouchableScaleOpacity } from "../my-pressable";

const DEFAULT_MAX_VALUE = 5_000_000;

export default function CardSupplier({
	icon,
	supplier,
	link,
	description,
	enveloppe = false,
	clubDeals = false,
	privateEquity,
	queryName = "supplier",
}: {
	icon: React.ReactNode;
	supplier: Supplier;
	link: Href;
	description?: string | null;
	privateEquity?: PrivateEquity;
	enveloppe?: boolean;
	clubDeals?: boolean;
	queryName?: string;
}) {
	const onPress = React.useCallback(() => {
		const params = typeof link === "object" ? link.params : undefined;
		queryClient.setQueryData([queryName, params?.["supplier"]], supplier);

		if (privateEquity) {
			queryClient.setQueryData(["private-supplier", privateEquity.id], privateEquity);
		}
	}, [link, supplier, queryName]);

	return (
		<Link href={link} push asChild>
			<MyTouchableScaleOpacity
				onPressIn={onPress}
				className="w-full flex-row items-center gap-3 rounded-xl  bg-white p-2 shadow-sm shadow-defaultGray/10"
			>
				<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">{icon}</View>
				<View className="flex-1">
					<Text className="text-lg font-semibold text-primary">{supplier.name}</Text>
					{description && <Text className="text-md text-primary">{description}</Text>}

					{privateEquity?.disponible_a_partir_de != null && (
						<View className="mt-3 flex-row items-center gap-2">
							<View className="size-2 rounded-full bg-green-600" />
							<Text className="text-[11px] text-backgroundChat">À partir de</Text>
							<Text className="ml-auto text-xs font-light text-primaryLight">
								{privateEquity.disponible_a_partir_de.toLocaleString("fr-FR")}€
							</Text>
						</View>
					)}

					{(enveloppe || clubDeals) &&
						(() => {
							const enveloppes = clubDeals ? supplier.enveloppes_club_deals : supplier.enveloppes;

							if (!Array.isArray(enveloppes) || enveloppes.length === 0) {
								return null;
							}

							const hasAnyAmount = enveloppes.some((env) => env.amount != null);

							if (!hasAnyAmount) {
								return null;
							}

							if (enveloppes.length === 1) {
								const env = enveloppes[0];
								const amount = env.amount ?? 0;
								const global = env.global || DEFAULT_MAX_VALUE;
								const ratio = amount / global;
								const widthPercent: DimensionValue = amount >= global ? "100%" : ratio < 0.1 ? "10%" : `${ratio * 100}%`;

								if (amount === 0) {
									return (
										<View>
											<View className="mt-3 flex-row items-center gap-2">
												<View className="size-2 rounded-full bg-green-600" />
												<Text className="text-[11px] text-backgroundChat">Enveloppe ouverte</Text>
											</View>
											{!clubDeals && "echeance" in env && (
												<View className="mt-0 flex-row items-center gap-2">
													<Text className="text-[11px] text-backgroundChat">Date d'echéance</Text>
													<Text className="ml-auto text-xs font-light text-primaryLight">
														{env.echeance
															? new Date(env.echeance).toLocaleDateString("fr-FR", {
																	day: "numeric",
																	month: "numeric",
																	year: "numeric",
																})
															: "Inconnu"}
													</Text>
												</View>
											)}
										</View>
									);
								}

								return (
									<View>
										<View className="mt-3">
											<View className="flex-row">
												<View className="gap-1" style={{ width: widthPercent }}>
													<View className="h-1.5 w-full rounded-full bg-green-600" />
												</View>
											</View>
										</View>
										<View className="mt-3 flex-row items-center gap-2">
											<View className="size-2 rounded-full bg-green-600" />
											<Text className="text-[11px] text-backgroundChat">Montant enveloppe disponible</Text>
											<Text className="ml-auto text-xs font-light text-primaryLight">
												{amount.toLocaleString("fr-FR")}€
											</Text>
										</View>
										{!clubDeals && "echeance" in env && (
											<View className="mt-0 flex-row items-center gap-2">
												<Text className="text-[11px] text-backgroundChat">Date d'echéance</Text>
												<Text className="ml-auto text-xs font-light text-primaryLight">
													{env.echeance
														? new Date(env.echeance).toLocaleDateString("fr-FR", {
																day: "numeric",
																month: "numeric",
																year: "numeric",
															})
														: "Inconnu"}
												</Text>
											</View>
										)}
									</View>
								);
							}

							const totalAmount = enveloppes.reduce((acc, env) => acc + (env.amount ?? 0), 0);

							return (
								<View className="mt-3 flex-row items-center gap-2">
									<Text className="text-[11px] text-backgroundChat">Montant enveloppes cumulés</Text>
									<Text className="ml-auto text-xs font-light text-primaryLight">
										{totalAmount.toLocaleString("fr-FR")}€
									</Text>
								</View>
							);
						})()}
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</MyTouchableScaleOpacity>
		</Link>
	);
}
