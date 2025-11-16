import { PortalHost } from "@rn-primitives/portal";
import React from "react";

const PORTAL_HOST_KEY = "__PORTAL_HOST_MOUNTED__";

export const PortalHostInternal = () => {
	React.useEffect(() => {
		if ((globalThis as any)[PORTAL_HOST_KEY]) {
			// does not works for PortalHost outside our provider (need to find a solution)
			console.error("⚠️ Multiple PortalHost detected! Only one PortalHost should be mounted.");
		}
		(globalThis as any)[PORTAL_HOST_KEY] = true;
		return () => {
			(globalThis as any)[PORTAL_HOST_KEY] = false;
		};
	}, []);

	return <PortalHost />;
};
