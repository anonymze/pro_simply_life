import { BriefcaseBusinessIcon, NewspaperIcon } from "lucide-react-native";
import ProfileDashboard from "@/components/profile-dashboard";
import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import CardLink from "@/components/card-link";
import { Text, View } from "react-native";
import config from "tailwind.config";
import { User } from "@/types/user";


export default function Page() {
	const { userJSON } = useLocalSearchParams<{ userJSON: string }>();
	const { firstname, lastname, photo, createdAt } = JSON.parse(userJSON) as Pick<
		User,
		"firstname" | "lastname" | "photo" | "createdAt"
	>;

	return (
		<View className="flex-1">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<BackgroundLayout className="p-4">
					<ProfileDashboard firstname={firstname} lastname={lastname} photo={photo} createdAt={createdAt} />
					<Text className="mt-8 text-xl font-bold">Vie d'agence Valorem</Text>
					<Text className="mb-5 mt-8 text-xl font-bold">Fonctionnalités</Text>
					<View className="gap-2">
						<CardLink
							icon={<NewspaperIcon size={20} color={config.theme.extend.colors.secondaryDark} />}
							title="Fundesys"
							description="Newsletter hebdomadaire de Fundesys"
							link={"/"}
						/>
						<CardLink
							icon={<NewspaperIcon size={20} color={config.theme.extend.colors.secondaryDark} />}
							title="Fidnet"
							description="Newsletter hebdomadaire de Fidnet"
							link={"/"}
						/>
						<CardLink
							icon={<BriefcaseBusinessIcon size={20} color={config.theme.extend.colors.secondaryDark} />}
							title="Valorem"
							description="Organigramme du groupe Valorem"
							link={"/"}
						/>
						<CardLink
							icon={<NewspaperIcon size={20} color={config.theme.extend.colors.secondaryDark} />}
							title="Fournisseurs"
							description="Répertoire d'informations des fournisseurs"
							link={"/"}
						/>
					</View>
				</BackgroundLayout>
			</ScrollView>
		</View>
	);
}
