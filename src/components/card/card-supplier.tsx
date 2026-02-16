import { queryClient } from "@/api/_queries";
import { PrivateEquity } from "@/types/private-equity";
import { Supplier } from "@/types/supplier";
import { cn } from "@/utils/cn";
import { Href, Link } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";
import { MyTouchableScaleOpacity } from "../my-pressable";

const DEFAULT_MAX_VALUE = 5_000_000;

export default function CardSupplier({
	icon,
	supplier,
	link,
	description,
	enveloppe = false,
	privateEquity,
	queryName = "supplier",
}: {
	icon: React.ReactNode;
	supplier: Supplier;
	link: Href;
	description?: string | null;
	privateEquity?: PrivateEquity;
	enveloppe?: boolean;
	queryName?: string;
}) {
	const onPress = React.useCallback(() => {
		const params = typeof link === 'object' ? link.params : undefined;
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
					<Text className="font-semibold text-lg text-primary">{supplier.name}</Text>
					{description && <Text className="text-md text-primary">{description}</Text>}

					{enveloppe ? (
						<>
							{(() => {
								if (!Array.isArray(supplier.enveloppes) || supplier.enveloppes.length === 0) {
									return <Text className="text-xs text-primaryLight">Pas d'enveloppe</Text>;
								}

								const totalAmount = supplier.enveloppes.reduce((acc, env) => acc + (env.amount || 0), 0);

								if (totalAmount === 0) {
									return <Text className="text-xs text-primaryLight">Pas d'enveloppe</Text>;
								}

								if (supplier.enveloppes.length === 1) {
									return (
										<>
											<View className="mt-3">
												<View className="flex-row">
													<View
														className="gap-1"
														// @ts-ignore
														style={{
															width:
																supplier.enveloppes[0].amount! >= (supplier.enveloppes[0].global || DEFAULT_MAX_VALUE)
																	? "100%"
																	: supplier.enveloppes[0].amount! / (supplier.enveloppes[0].global || DEFAULT_MAX_VALUE) < 0.1
																		? "10%"
																		: (supplier.enveloppes[0].amount! / (supplier.enveloppes[0].global || DEFAULT_MAX_VALUE)) * 100 +
																			"%",
														}}
													>
														<View
															className={cn(
																"h-1.5 w-full rounded-full bg-green-600",
																supplier.enveloppes[0].amount! <= 0 && "bg-production",
															)}
														/>
													</View>
												</View>
											</View>
											<View className="mt-3 flex-row items-center gap-2">
												<View
													className={cn(
														"size-2 rounded-full bg-green-600",
														supplier.enveloppes[0].amount! <= 0 && "bg-production",
													)}
												/>
												<Text className="text-[11px] text-backgroundChat">Montant enveloppe disponible</Text>
												<Text className="ml-auto font-light text-xs text-primaryLight">
													{supplier.enveloppes[0].amount?.toLocaleString("fr-FR")}€
												</Text>
											</View>
											<View className="mt-0 flex-row items-center gap-2">
												<Text className="text-[11px] text-backgroundChat">Date d'echéance</Text>
												<Text className="ml-auto font-light text-xs text-primaryLight">
													{supplier.enveloppes[0].actualisation
														? new Date(supplier.enveloppes[0].echeance ?? "").toLocaleDateString("fr-FR", {
																day: "numeric",
																month: "numeric",
																year: "numeric",
															})
														: "Inconnu"}
												</Text>
											</View>
										</>
									);
								}

								return (
									<>
										<View className="mt-3 flex-row items-center gap-2">
											<Text className="text-[11px] text-backgroundChat">Montant enveloppes cumulés</Text>
										<Text className="ml-auto font-light text-xs text-primaryLight">
											{totalAmount.toLocaleString("fr-FR")}€
										</Text>
										</View>
									</>
								);
							})()}
						</>
					) : null}
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</MyTouchableScaleOpacity>
		</Link>
	);
}
