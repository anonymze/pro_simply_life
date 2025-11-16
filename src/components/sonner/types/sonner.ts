export declare namespace SonnerRN {
	type ToastTitle = string;
	interface ToastOptions {
		description?: string;
		type?: "foreground" | "background";
		duration?: number;
		damping?: number;
		stiffness?: number;
		mass?: number;
		action?: {
			label: string;
			onPress: () => void;
		};
	}

	interface ToastArgs extends ToastOptions {
		title: SonnerRN.ToastTitle;
	}

	type ToastId = string;

	interface Toast {
		toast: (title: ToastTitle, options?: ToastOptions) => void;
	}

	type ToastDispatch =
		| {
				id: ToastId;
				type: "ADD";
				toast: SonnerRN.ToastArgs;
		  }
		| {
				id: ToastId;
				type: "REMOVE";
		  }
		| {
				type: "CLEAR";
		  };
}
