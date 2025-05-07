import { SearchIcon } from "lucide-react-native";
import { TextInput, View } from "react-native";
import config from "tailwind.config";
import { cn } from "@/utils/cn";

import CardSupplierCategory from "../card/card-supplier-category";


export default function InputSearch({
	onSubmit,
	editable = true,
	placeholder = "Rechercher...",
	className,
}: {
	onSubmit: (search: string) => void;
	editable?: boolean;
	placeholder?: string;
	className?: string;
}) {
	return (
		<View>
			<TextInput
				editable={editable}
				returnKeyType="search"
				autoCapitalize="none"
				keyboardType="default"
				textContentType="oneTimeCode"
				placeholder={placeholder}
				autoCorrect={false}
				className={cn(
					"w-full rounded-lg bg-defaultGray/15 py-5 pl-4 pr-12 text-dark placeholder:text-defaultGray",
					className,
				)}
				onSubmitEditing={(text) => {
					onSubmit(text.nativeEvent.text);
				}}
			/>
			<SearchIcon
				style={{ position: "absolute", right: 15, top: "50%", transform: [{ translateY: "-50%" }] }}
				size={18}
				color={config.theme.extend.colors.primary}
			/>
		</View>
	);
}
