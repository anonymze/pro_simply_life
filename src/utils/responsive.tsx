export const TabletMediaQuery = ({ children, screenWidth }: { children: React.ReactNode, screenWidth: number }) => {
	if (screenWidth < 400) return null;
	return children;
};

export const MobileMediaQuery = ({ children, screenWidth }: { children: React.ReactNode, screenWidth: number }) => {
	if (screenWidth >= 400) return null;
	return children;
};