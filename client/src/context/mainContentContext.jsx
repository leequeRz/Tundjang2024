// SelectedItemContext.js
import React, { createContext, useContext, useState } from "react";

const SelectedItemContext = createContext();

export const useSelectedItem = () => {
	return useContext(SelectedItemContext);
};

export const SelectedItemProvider = ({ children }) => {
	const [selectedSidebarItem, setSelectedSidebarItem] = useState("Dashboard");

	return (
		<SelectedItemContext.Provider
			value={{ selectedSidebarItem, setSelectedSidebarItem }}
		>
			{children}
		</SelectedItemContext.Provider>
	);
};
