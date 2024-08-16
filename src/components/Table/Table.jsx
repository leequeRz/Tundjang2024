import React, { useState, useEffect, useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Box,
	InputBase,
	Button,
	Pagination as MuiPagination,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import PatientRow from "./PatientRow";
import PatientPopup from "./PatientPopup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Main TableComponent
const TableComponent = ({ setSelectedSidebarItem }) => {
	const [editingPatient, setEditingPatient] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedRows, setExpandedRows] = useState([]);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const rowsPerPage = 15;

	const queryClient = useQueryClient();

	const {
		data: patients = [],
		isLoading,
		error,
	} = useQuery(["patients"], async () => {
		const response = await fetch("http://localhost:3000/api/v1/patients/get");
		if (!response.ok) throw new Error("Error fetching data");
		return response.json();
	});

	const deleteMutation = useMutation({
		mutationFn: async (HN) => {
			const response = await fetch(
				`http://localhost:3000/api/v1/patients/delete/${HN}`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) throw new Error("Error deleting patient");
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["patients"]);
		},
	});

	const handleDelete = (HN) => {
		deleteMutation.mutate(HN);
	};

	const handleEdit = (patient) => {
		setEditingPatient(patient);
		setIsPopupOpen(true);
	};

	const handleOpenPopup = () => {
		setEditingPatient(null);
		setIsPopupOpen(true);
	};

	const handleClosePopup = () => {
		setIsPopupOpen(false);
	};

	const handleRowClick = (hn) => {
		setExpandedRows((prev) =>
			prev.includes(hn) ? prev.filter((rowHn) => rowHn !== hn) : [...prev, hn]
		);
	};

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	const filteredRows = useMemo(() => {
		return patients.filter(
			(row) =>
				row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				row.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
				row.HN.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [patients, searchTerm]);

	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;
	const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

	const paddedRows = [
		...currentRows,
		...Array(Math.max(rowsPerPage - currentRows.length, 0)).fill({
			HN: "",
			prefix: "",
			name: "",
			surname: "",
			gender: "",
			DOB: "",
			lastUpdate: "",
		}),
	];

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
				<Typography variant="h6" component="div">
					All Patients
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							backgroundColor: "background.paper",
							borderRadius: 1,
							p: 0.5,
						}}
					>
						<SearchIcon sx={{ mr: 1 }} />
						<InputBase
							placeholder="Search by Name, Surname or HN"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							sx={{ width: { xs: 200, sm: 300 } }}
						/>
					</Box>
					<Button
						variant="contained"
						color="primary"
						sx={{ ml: 2 }}
						onClick={handleOpenPopup}
					>
						New Patient
					</Button>
					<PatientPopup
						open={isPopupOpen}
						onClose={handleClosePopup}
						patientData={editingPatient}
					/>
				</Box>
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{[
								{ label: "HN", key: "HN" },
								{ label: "Prefix", key: "Prefix" },
								{ label: "Name", key: "Name" },
								{ label: "Surname", key: "Surname" },
								{ label: "Gender", key: "Gender" },
								{ label: "Age", key: "Age" },
								{ label: "Last Update", key: "Last Update" },
								{ label: "", key: "Details" },
							].map(({ label, key }) => (
								<TableCell
									key={key}
									sx={{
										fontWeight: "bold", // Make text bold
										fontSize: "1.05rem", // Increase font size
										backgroundColor: "#f5f5f5", // Light background color for headers
									}}
								>
									{label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{paddedRows.map((row, index) => (
							<PatientRow
								key={index}
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

			{filteredRows.length > rowsPerPage && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mt: 2,
					}}
				>
					<Typography>
						Showing {indexOfFirstRow + 1} to{" "}
						{Math.min(indexOfLastRow, filteredRows.length)} of{" "}
						{filteredRows.length} entries
					</Typography>
					<MuiPagination
						count={Math.ceil(filteredRows.length / rowsPerPage)}
						page={currentPage}
						onChange={handlePageChange}
						color="primary"
						showFirstButton
						showLastButton
					/>
				</Box>
			)}
		</Box>
	);
};

export default TableComponent;
