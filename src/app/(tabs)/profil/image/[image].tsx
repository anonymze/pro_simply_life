import ImagePlaceholder from "@/components/ui/image-placeholder";
import { getFile } from "@/utils/download";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function Page() {
	const { image } = useLocalSearchParams();

	if (!image || typeof image !== "string") return <Redirect href="../" />;

	const file = getFile(image);

	if (!file.exists) return <Redirect href="../" />;

	return (
		<ImagePlaceholder
			transition={0}
			contentFit="cover"
			source={file}
			style={{ height: "50%" }}
		/>
	);
}
