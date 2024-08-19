import React from "react";
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
	filterItems,
	onFilterSelected,
}) => {
	const [selectedFilter, setSelectedFilter] = React.useState(filterItems[0]);

	const handleFilterChange = (event) => {
		const selectedValue = event.target.value;
		setSelectedFilter(selectedValue);
		onFilterSelected(selectedValue);
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				backgroundColor: "background.paper",
				borderRadius: 1,
				p: 0.5,
			}}
		>
			<FormControl sx={{ minWidth: 240, mr: 2 }}>
				<InputLabel>Filter By</InputLabel>
				<Select
					value={selectedFilter}
					label="Filter By"
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
				placeholder={`Search by `}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				sx={{ width: { xs: 200, sm: 300 } }}
			/>
		</Box>
	);
};

export default SearchFilterBar;
