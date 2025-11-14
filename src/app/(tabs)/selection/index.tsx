import { getSelectionsQuery } from "@/api/queries/selection-queries";
import { MyTouchableScaleOpacity } from "@/components/my-pressable";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import Title from "@/components/ui/title";
import BackgroundLayout from "@/layouts/background-layout";
import { Media } from "@/types/media";
import { Selection } from "@/types/selection";
import { downloadFile, getFile } from "@/utils/download";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { Href, Link, router } from "expo-router";
import { ArrowRightIcon, SparklesIcon } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import config from "tailwind.config";

export default function Page() {
    const insets = useSafeAreaInsets();
	return withQueryWrapper<Selection>(
		{
			queryKey: ["selection"],
			queryFn: getSelectionsQuery,
		},
		({ data }) => {
			// Group selections by category
			const groupedSelections = useMemo(() => {
				const grouped: { [key: string]: Selection[] } = {};

				data.docs?.forEach((selection) => {
					const category = selection.category;

					// For immobilier, skip if no brochure
					if (category === "immobilier" && !selection.brochure) return;

					if (!grouped[category]) {
						grouped[category] = [];
					}
					grouped[category].push(selection);
				});

				return grouped;
			}, [data.docs]);

			// Category display names
			const categoryNames: { [key: string]: string } = {
				girardin: "Girardin Industriel",
				immobilier: "Immobilier",
				other: "Autre",
			};

			// Define the order of categories
			const categoryOrder = ["girardin", "immobilier", "other"];
			const orderedCategories = categoryOrder
				.filter((cat) => groupedSelections[cat])
				.map((cat) => [cat, groupedSelections[cat]] as [string, Selection[]]);

			return (
				<BackgroundLayout className="px-4" style={{ paddingTop: insets.top }}>
					<View className="flex-row items-center gap-3">
						<Title title="Notre sélection du moment" />
						<SparklesIcon size={15} color="#FDB022" fill="#FDB022" />
					</View>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 16 }}
						className="mt-3"
					>
						{orderedCategories.map(([category, selections]) => (
							<View key={category} className="mb-6">
								<Text className="mb-2 font-semibold text-base text-defaultGray">
									{categoryNames[category] || category}
								</Text>
								{category === "immobilier" || category === "other" ? (
									<View className="flex-row flex-wrap gap-5">
										{selections.map((selection) => (
											<ImmobilierCard
												website={selection.website}
												brochure={selection.brochure!}
												key={selection.id}
												image={selection.image}
											/>
										))}
									</View>
								) : (
									<View className="gap-3">
										{selections.map((selection) => (
											<Card
												key={selection.id}
												link={{
													pathname: `/selection/[supplier]`,
													params: {
														supplier: selection.supplier!.id,
													},
												}}
												icon={
													<ImagePlaceholder
														transition={300}
														contentFit="contain"
														placeholder={selection.supplier!.logo_mini?.blurhash}
														source={selection.supplier!.logo_mini?.url}
														style={{ width: 40, height: 40, borderRadius: 4 }}
													/>
												}
												title={selection.supplier!.name}
											/>
										))}
									</View>
								)}
							</View>
						))}
					</ScrollView>
				</BackgroundLayout>
			);
		},
	)();
}

const Card = ({ link, icon, title }: { link: Href; icon: any; title: string }) => {
	return (
		<Link href={link} push asChild>
			<MyTouchableScaleOpacity className="w-full flex-row items-center gap-3 rounded-lg bg-white p-2">
				<View className="size-14 items-center justify-center rounded-lg bg-amber-200">{icon}</View>
				<View className="flex-1">
					<Text className="font-semibold text-lg text-primary">{title}</Text>
				</View>
				<ArrowRightIcon size={18} color={config.theme.extend.colors.defaultGray} style={{ marginRight: 10 }} />
			</MyTouchableScaleOpacity>
		</Link>
	);
};

const ImmobilierCard = ({
	image,
	brochure,
	website,
}: {
	image: Media | undefined;
	brochure: Media;
	website?: string;
}) => {
	const [downloading, setDownloading] = useState(false);

	const handlePress = async () => {
		if (!brochure.url || !brochure.filename || !brochure.mimeType) return;

		try {
			const file = getFile(brochure.filename);

			if (!file.exists) {
				setDownloading(true);
				await downloadFile(brochure.url, brochure.filename, brochure.mimeType);
				setDownloading(false);
			}

			router.push({
				pathname: "/selection/pdf/[pdf]",
				params: {
					pdf: brochure.filename,
					link: website || "",
				},
			});
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	return (
		<MyTouchableScaleOpacity className="w-[46%] rounded-2xl border-2 border-amber-300" onPress={handlePress} enabled={!downloading}>
			<ImagePlaceholder
				transition={300}
				contentFit="cover"
				placeholder={image?.blurhash}
				placeholderContentFit="cover"
				source={image?.url}
				style={{ width: "100%", aspectRatio: 1, borderRadius: 12 }}
			/>
			{downloading && (
				<View className="absolute inset-0 items-center justify-center">
					<ActivityIndicator size="large" color={config.theme.extend.colors.primary} />
				</View>
			)}
		</MyTouchableScaleOpacity>
	);
};
