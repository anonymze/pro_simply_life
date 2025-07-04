import HeaderGrabberIos from "@/layouts/header-grabber-ios";
import HeaderLayout from "@/layouts/headert-layout";
import { Platform } from "react-native";
import { Stack } from "expo-router";


export default function SupplierLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				gestureEnabled: true,
				fullScreenGestureEnabled: true,
				animation: Platform.OS === "ios" ? "simple_push" : "fade_from_bottom",
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen
				options={{
					headerShown: true,
					header: () => <HeaderLayout />,
				}}
				name="[supplier-category]/supplier-product/index"
			/>
			<Stack.Screen
				options={{
					headerShown: true,
					header: () => <HeaderLayout />,
				}}
				name="[supplier-category]/supplier-product/[supplier-product]/supplier/index"
			/>
			<Stack.Screen
				options={{
					presentation: "modal",
					header: () => Platform.OS === "ios" ? <HeaderGrabberIos className="bg-white" /> : <HeaderLayout backgroundColor="bg-white" />,
					headerShown: true,
				}}
				name="[supplier-category]/supplier-product/pdf/[pdf]"
			/>
			<Stack.Screen
				options={{
					headerShown: true,
					// gestureEnabled: false,
					header: () => <HeaderLayout backgroundColor="bg-white" />,
				}}
				name="[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/index"
			/>
			<Stack.Screen
				options={{
					presentation: "modal",
					header: () => Platform.OS === "ios" ? <HeaderGrabberIos className="bg-white" /> : <HeaderLayout backgroundColor="bg-white" />,
					headerShown: true,
				}}
				name="[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/pdf/[pdf]"
			/>
			<Stack.Screen
				options={{
					presentation: Platform.OS === "ios" ? "formSheet" : "modal",
					sheetAllowedDetents: Platform.OS === "ios" ? "fitToContents" : undefined,
					headerShown: true,
					header: () => Platform.OS === "ios" ? <HeaderGrabberIos noMarginBottom /> : <HeaderLayout  />,
				}}
				name="[supplier-category]/supplier-product/[supplier-product]/supplier/[supplier]/logs/[logs]"
			/>
		</Stack>
	);
}
