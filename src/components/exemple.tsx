import { Portal } from "@rn-primitives/portal";
import * as ToastPrimitive from "@rn-primitives/toast";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Example() {
	const [open, setOpen] = React.useState(false);
	const [seconds, setSeconds] = React.useState(3);
	const insets = useSafeAreaInsets();

	React.useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;

		if (open) {
			interval = setInterval(() => {
				setSeconds((prevSeconds) => {
					if (prevSeconds <= 1) {
						setOpen(false);
						if (interval) {
							clearInterval(interval);
						}
						return 3;
					}
					return prevSeconds - 1;
				});
			}, 1000);
		} else {
			if (interval) {
				clearInterval(interval);
			}
			setSeconds(3);
		}

		if (interval && !open) {
			clearInterval(interval);
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [open, seconds]);

	return (
		<>
			{open && (
				<Portal name="toast-example">
					<View style={{ top: insets.top + 4 }} className="absolute w-full px-4">
						<ToastPrimitive.Root
							type="foreground"
							open={open}
							onOpenChange={setOpen}
							className="border-border flex-row items-center justify-between rounded-xl bg-secondary p-4 opacity-95"
						>
							<View className="gap-1.5">
								<ToastPrimitive.Title className="text-foreground text-3xl">Here is a toast</ToastPrimitive.Title>
								<ToastPrimitive.Description className="text-foreground text-lg">
									It will disappear in {seconds} seconds
								</ToastPrimitive.Description>
							</View>
							<View className="gap-2">
								<ToastPrimitive.Action className="border border-primary px-4 py-2">
									<Text className="text-foreground">Action</Text>
								</ToastPrimitive.Action>
								<ToastPrimitive.Close className="border border-primary px-4 py-2">
									<Text className="text-foreground">Close</Text>
								</ToastPrimitive.Close>
							</View>
						</ToastPrimitive.Root>
					</View>
				</Portal>
			)}
			<View className="flex-1 items-center justify-center gap-12 p-6">
				<Pressable onPress={() => setOpen((prev) => !prev)}>
					<Text className="text-foreground text-xl">Show Toast</Text>
				</Pressable>
			</View>
		</>
	);
}
