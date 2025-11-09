import EmployeesIcon from "@/components/emloyees-icon";
import { truncateText } from "@/utils/helper";
import { cn } from "@/utils/libs/tailwind";
import { Href, Link, LinkProps, router } from "expo-router";
import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import config from "tailwind.config";

interface HeaderLayoutProps extends Partial<LinkProps> {
	title?: string;
	chat?: {
		description: string;
		link: Href;
	};
	sheet?: {
		link: LinkProps["href"];
	};
	backLink?: string;
	backgroundColor?: string;
	backButton?: boolean;
}

export default function HeaderLayout({ title, chat, sheet, backgroundColor, backLink, backButton = true }: HeaderLayoutProps) {
	return (
		<View className={cn("pt-safe flex-row items-center justify-between bg-background px-2 pb-2", backgroundColor)}>
			{backButton ? (
				<Link className={cn("w-24 p-2", chat && "w-10")} dismissTo href={chat?.link ? "/chat"  : backLink ? "/" : "../"} asChild>
					<TouchableOpacity className="flex-row items-center gap-3" hitSlop={10}>
						<ArrowLeftIcon size={20} color={config.theme.extend.colors.primary} />
						{!chat && <Text className="font-semibold text-primary">Retour</Text>}
					</TouchableOpacity>
				</Link>
			) : (
				<View className="w-24" />
			)}

			{chat ? (
				<Link href={chat.link}>
					<View className="flex-row items-center gap-3">
						<View className="size-12 items-center justify-center rounded-full bg-darkGray">
							<EmployeesIcon color={config.theme.extend.colors.primary} />
						</View>
						<View className="">
							<Text className="font-bold text-lg">{truncateText(title || "", 26)}</Text>
							<Text className="text-sm text-primaryLight">{truncateText(chat?.description || "", 30)}</Text>
						</View>
					</View>
				</Link>
			) : (
				<Text className="font-bold text-lg">{truncateText(title || "", 24)}</Text>
			)}

			{sheet ? (
				<TouchableOpacity
					className="w-24 items-end p-2"
					onPress={() => {
						router.push(sheet.link);
					}}
				>
					<PlusCircleIcon size={24} color={config.theme.extend.colors.primary} />
				</TouchableOpacity>
			) : (
				<View className={cn("w-24", chat && "w-10")} />
			)}
		</View>
	);
}
