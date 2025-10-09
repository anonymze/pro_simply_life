import { queryClient } from "@/api/_queries";
import { Supplier } from "@/types/supplier";
import { HrefObject, Link } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

const DEFAULT_MAX_VALUE = 1_000_000;

export default function CardSupplier({
	icon,
	supplier,
	link,
	description,
	enveloppe = false,
	queryName = "supplier",
}: {
	icon: React.ReactNode;
	supplier: Supplier;
	link: HrefObject;
	description?: string | null;
	enveloppe?: boolean;
	queryName?: string;
}) {
	const onPress = React.useCallback(() => {
		queryClient.setQueryData([queryName, link.params?.["supplier"]], supplier);
	}, [link]);

	return (
		<Link href={link} push asChild>
			<TouchableOpacity
				onPressIn={onPress}
				className="w-full flex-row items-center gap-3 rounded-xl  bg-white p-2 shadow-sm shadow-defaultGray/10"
			>
				<View className="size-14 items-center justify-center rounded-lg bg-defaultGray/10">{icon}</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-primary">{supplier.name}</Text>
					{description && <Text className="text-md text-primary">{description}</Text>}

					{enveloppe ? (
						<>
							{supplier.enveloppe?.amount ? (
								<>
									<View className="mt-3">
										<View className="flex-row">
											<View
												className="gap-1"
												// @ts-ignore
												style={{
													// minWidth: structuredProduct.max / structuredProduct.current,
													width:
														supplier.enveloppe.amount >= DEFAULT_MAX_VALUE
															? "100%"
															: (supplier.enveloppe.amount / DEFAULT_MAX_VALUE) < 0.1
																? "10%"
																: (supplier.enveloppe.amount / DEFAULT_MAX_VALUE) * 100 + "%",
												}}
											>
												<View className="h-1.5 w-full rounded-full bg-production" />
											</View>
										</View>
									</View>
									<View className="mt-3 flex-row items-center gap-2">
										<View className="size-2 rounded-full bg-production" />
										<Text className="text-xs text-backgroundChat">Enveloppe montant restant</Text>
										<Text className="ml-auto font-light text-sm text-primaryLight">{supplier.enveloppe.amount.toLocaleString('fr-FR')}€</Text>
									</View>
									<View className="mt-0 flex-row items-center gap-2">
										<Text className="text-xs text-backgroundChat">Date d'echéance </Text>
										<Text className="ml-auto font-light text-sm text-primaryLight">
											{" "}
											{supplier.enveloppe.actualisation
												? new Date(supplier.enveloppe.actualisation ?? "").toLocaleDateString("fr-FR", {
														day: "numeric",
														month: "numeric",
														year: "numeric"
													})
												: "Inconnu"}
										</Text>
									</View>
								</>
							) : (
								<Text className="text-xs text-primaryLight">Pas d'enveloppe</Text>
							)}
						</>
					) : null}
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</TouchableOpacity>
		</Link>
	);
}
