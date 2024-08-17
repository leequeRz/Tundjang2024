// useSearch.js
import { useState, useMemo } from "react";

export const useSearch = (items, searchKeys) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredItems = useMemo(
		() =>
			items.filter((item) =>
				searchKeys.some((key) =>
					item[key].toLowerCase().includes(searchTerm.toLowerCase())
				)
			),
		[items, searchKeys, searchTerm]
	);

	return { searchTerm, setSearchTerm, filteredItems };
};
