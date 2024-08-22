// usePagination.js
import { useState, useMemo } from "react";

export const usePagination = (items, itemsPerPage) => {
	const [currentPage, setCurrentPage] = useState(1);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;

	const currentItems = useMemo(
		() => items.slice(indexOfFirstItem, indexOfLastItem),
		[items, indexOfFirstItem, indexOfLastItem]
	);

	const totalPages = Math.ceil(items.length / itemsPerPage);

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	return { currentItems, currentPage, totalPages, handlePageChange };
};
