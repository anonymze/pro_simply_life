import { Image, ImageProps } from "expo-image";
import { useEffect, useState } from "react";


export default function ImagePlaceholder(props: ImageProps) {
	const [isCached, setIsCached] = useState(false);

	useEffect(() => {
		// Check if image is cached
		Image.getCachePathAsync(props.source as string)
			.then((path) => {
				if (path) {
					setIsCached(true);
				}
			})
			.catch(() => {
				setIsCached(false);
			});
	}, [props.source]);

	return (
		<Image
			{...props}
			transition={isCached ? 0 : props.transition ?? 250}
			placeholder={isCached ? undefined : props.placeholder ?? require("@/assets/images/icon.png")}
			placeholderContentFit={props.placeholderContentFit ?? "contain"}
		/>
	);
}
