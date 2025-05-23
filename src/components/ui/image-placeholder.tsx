import { Image, ImageProps } from "expo-image";


export default function ImagePlaceholder(props: ImageProps) {
	return (
		<Image
			{...props}
			placeholder={props.placeholder ?? require("@/assets/images/icon.png")}
			placeholderContentFit={props.placeholderContentFit ?? "contain"}
		/>
	);
}
