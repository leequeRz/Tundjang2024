// Table.jsx
import React, { useState } from "react";
import {
	Box,
	Typography,
	Button,
	Table,
	TableBody,
	TableContainer,
	Paper,
} from "@mui/material";
import { usePatients } from "../../context/patientContext";
import { usePagination } from "../../hooks/usePagination";
import { useSearch } from "../../hooks/useSearch";
import SearchBar from "../SearchBar";
import TableHeader from "./TableHeader";
import PatientRow from "./PatientRow";
import PaginationFooter from "./PaginationFooter";
import PatientPopup from "./PatientPopup";

const TableComponent = () => {
	const { patients, isLoading, error, deletePatient } = usePatients();
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [editingPatient, setEditingPatient] = useState(null);
	const [expandedRows, setExpandedRows] = useState([]);

	const { searchTerm, setSearchTerm, filteredItems } = useSearch(patients, [
		"name",
		"surname",
		"HN",
	]);
	const { currentItems, currentPage, handlePageChange } = usePagination(
		filteredItems,
		15
	);

	const handleEdit = (patient) => {
		setEditingPatient(patient);
		setIsPopupOpen(true);
	};

	const handleDelete = (HN) => {
		deletePatient(HN);
	};

	const handleRowClick = (hn) => {
		setExpandedRows((prev) =>
			prev.includes(hn) ? prev.filter((rowHn) => rowHn !== hn) : [...prev, hn]
		);
	};

	if (isLoading) return <Typography>Loading...</Typography>;
	if (error) return <Typography>Error: {error}</Typography>;

	return (
		<Box sx={{ p: 2 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<Typography variant="h6">All Patients</Typography>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
					<Button
						variant="contained"
						color="primary"
						sx={{ ml: 2 }}
						onClick={() => {
							setEditingPatient(null, setIsPopupOpen(true));
						}}
					>
						New Patient
					</Button>
				</Box>
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHeader />
					<TableBody>
						{currentItems.map((row, index) => (
							<PatientRow
								key={row.HN || index}
								row={row}
								isExpanded={expandedRows.includes(row.HN)}
								handleRowClick={handleRowClick}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<PaginationFooter
				total={filteredItems.length}
				currentPage={currentPage}
				rowsPerPage={15}
				onPageChange={handlePageChange}
			/>

			<PatientPopup
				open={isPopupOpen}
				onClose={() => setIsPopupOpen(false)}
				patientData={editingPatient}
			/>
		</Box>
	);
};

export default TableComponent;
