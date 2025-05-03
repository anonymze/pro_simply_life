import SignPdf from "@/components/sign-pdf/sign-pdf";
import { View } from "react-native";


export default function Page() {
	return <View style={{ flex: 1, backgroundColor: "green" }}>
			<SignPdf dom={{
        matchContents: true,
        scrollEnabled: true
      }} />
	</View>
}
