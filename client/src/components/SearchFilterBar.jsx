import React, { useState } from "react";
import {
	Box,
	InputBase,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const SearchFilterBar = ({
	searchTerm,
	setSearchTerm,
	selectedValue,
	filterItems,
	onFilterSelected,
	label = "Filter by",
	searchLabel = "Filter by",
	placeholder = "Search by",
	required = false,
}) => {
	const [selectedFilter, setSelectedFilter] = useState(
		selectedValue?.id || selectedValue || null
	);

	const handleFilterChange = (event) => {
		const selectedId = event.target.value;
		setSelectedFilter(selectedId);

		const selectedItem = filterItems.find((item) => item.id === selectedId);
		onFilterSelected(selectedItem);
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				backgroundColor: "background.paper",
				borderRadius: 1,
			}}
		>
			<FormControl sx={{ minWidth: 240, mr: 2 }}>
				<InputLabel required={required}>{label}</InputLabel>
				<Select
					value={selectedFilter}
					label={searchLabel}
					onChange={handleFilterChange}
				>
					{filterItems.map((item) => (
						<MenuItem key={item.id} value={item.id}>
							{item.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<SearchIcon sx={{ mr: 1 }} />
			<InputBase
				placeholder={placeholder}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				sx={{ width: { xs: 200, sm: 300 } }}
			/>
		</Box>
	);
};

export default SearchFilterBar;
