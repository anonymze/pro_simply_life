import React from "react";
import { PortalHostInternal } from "../dependencies/rn-primitives";
import Sonner from "../sonner";
import { SonnerRN } from "../types/sonner";

const SonnerRNContext = React.createContext<SonnerRN.Toast>(null!);

const SonnerRNInternalProvider = ({ children }: { children: React.ReactNode }) => {
	const [triggerToast, dispatchToast] = React.useReducer(toastReducer, new Map<string, SonnerRN.ToastArgs>());

	const toast = React.useCallback((title: SonnerRN.ToastTitle, options?: SonnerRN.ToastOptions) => {
		// TODO
		const id = Math.random().toString(36).substring(2, 15);
		dispatchToast({
			id,
			type: "ADD",
			toast: {
				title,
				...options,
			},
		});
	}, []);

	return (
		<SonnerRNContext.Provider
			value={{
				toast,
			}}
		>
			{children}
			{Array.from(triggerToast).map(([id, toaster]) => {
				return <Sonner key={id} toastId={id} dispatchToast={dispatchToast} {...toaster} />;
			})}
		</SonnerRNContext.Provider>
	);
};

const SonnerRNProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<React.Fragment>
			<SonnerRNInternalProvider>{children}</SonnerRNInternalProvider>
			<PortalHostInternal />
		</React.Fragment>
	);
};

const useSonnerRN = () => {
	const context = React.useContext(SonnerRNContext);
	if (!context) throw new Error("useSonnerRN must be used within SonnerRNProvider");
	return context;
};

export { SonnerRNProvider, useSonnerRN };

function toastReducer(
	state: Map<string, SonnerRN.ToastArgs>,
	action: SonnerRN.ToastDispatch,
): Map<string, SonnerRN.ToastArgs> {
	const newSet = new Map(state);

	switch (action.type) {
		case "ADD":
			newSet.set(action.id, action.toast);
			break;
		case "REMOVE":
			newSet.delete(action.id);
			break;
		case "CLEAR":
			newSet.clear();
			break;
	}

	return newSet;
}
