import { Path, Svg, SvgProps } from "react-native-svg";


export default function CubeFillIcon(props: SvgProps) {
	return (
		<Svg viewBox="0 0 24 24" fill="currentColor" {...props}>
			<Path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
		</Svg>
	);
}
