import { Image, ImageProps } from "expo-image";

export default function ImagePlaceholder(props: ImageProps) {
	return (
		<Image
			{...props}
			transition={props.transition ?? 300}
			placeholder={props.placeholder ?? require("@/assets/images/icon.png")}
			placeholderContentFit={props.placeholderContentFit ?? "contain"}
		/>
	);
}
