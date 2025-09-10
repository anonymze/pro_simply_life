import { queryClient } from "@/api/_queries";
import { Supplier } from "@/types/supplier";
import { HrefObject, Link } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

export default function CardSupplier({
	icon,
	supplier,
	link,
	enveloppe = false,
	queryName = "supplier",
}: {
	icon: React.ReactNode;
	supplier: Supplier;
	link: HrefObject;
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

					{enveloppe && (
						<>
							<View className="flex flex-row items-center">
								<View className="my-1 flex-1 border-t border-primaryLight" />
								<Text className="px-2 text-sm text-primaryLight">Enveloppe</Text>
								<View className="my-1 flex-1 border-t border-primaryLight" />
							</View>

							{supplier.enveloppe?.amount ? (
								<>
									<View className="flex-row items-center justify-between">
										<Text className=" text-xs text-primaryLight">
											Montant restant<Text className="font-semibold"> {supplier.enveloppe.amount}€</Text>
										</Text>
										<Text className="text-xs text-primaryLight">
											Echéance{" "}
											<Text className="font-semibold">
												{" "}
												{supplier.enveloppe.echeance
													? new Date(supplier.enveloppe.echeance ?? "").toLocaleDateString("fr-FR", {
															day: "numeric",
															month: "numeric",
														})
													: "Inconnu"}
											</Text>
										</Text>
									</View>
									<View className="mt-1 flex-row items-center justify-between">
										<Text className="text-xs text-primaryLight">
											Réduction impôt{" "}
											<Text className="font-semibold">
												{supplier.enveloppe.reduction ? supplier.enveloppe.reduction : "Inconnu"}
											</Text>
										</Text>
										<Text className="text-xs text-primaryLight">
											Actualisé{" "}
											<Text className="font-semibold">
												{" "}
												{supplier.enveloppe.actualisation
													? new Date(supplier.enveloppe.actualisation ?? "").toLocaleDateString("fr-FR", {
															day: "numeric",
															month: "numeric",
														})
													: "Inconnu"}
											</Text>
										</Text>
									</View>
								</>
							) : (
								<Text className="text-xs text-primaryLight">Pas d'enveloppe</Text>
							)}
						</>
					)}
				</View>
				<ArrowRight size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</TouchableOpacity>
		</Link>
	);
}
