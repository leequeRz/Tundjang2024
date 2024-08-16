import React, { useState, useEffect } from "react";
import "./Table.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const TableComponent = ({ setSelectedSidebarItem }) => {
	const [patients, setPatients] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedRows, setExpandedRows] = useState([]);
	const rowsPerPage = 15;

	useEffect(() => {
		fetch("http://localhost:3000/api/v1/patients/get")
			.then((response) => response.json())
			.then((data) => setPatients(data))
			.catch((error) => console.error("Error fetching data:", error));
	}, []);

	const handleRowClick = (hn) => {
		if (expandedRows.includes(hn)) {
			setExpandedRows(expandedRows.filter((rowHn) => rowHn !== hn));
		} else {
			setExpandedRows([...expandedRows, hn]);
		}
	};

	// Calculate age based on DOB
	const calculateAge = (dob) => {
		const birthDate = new Date(dob);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birthDate.getDate())
		) {
			age--;
		}
		return age;
	};

	// Filter and paginate data
	const filteredRows = patients.filter(
		(row) =>
			row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			row.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			row.HN.toLowerCase().includes(searchTerm.toLowerCase())
	);

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

	const handlePageChange = (direction) => {
		if (direction === "next" && indexOfLastRow < filteredRows.length) {
			setCurrentPage(currentPage + 1);
		} else if (direction === "prev" && currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<div className="container-table">
			<div className="header-container">
				<div className="header-left">
					<div className="header-title">All Patients</div>
				</div>
				<div className="header-right">
					<input
						type="text"
						className="search-input"
						placeholder="Search by Name, Surname or HN"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button
						className="new-pt-button"
						onClick={() => setSelectedSidebarItem("Form")}
					>
						New PT
					</button>
				</div>
			</div>

			<TableContainer component={Paper}>
				<Table className="Table">
					<TableHead>
						<TableRow>
							<TableCell>HN</TableCell>
							<TableCell>Prefix</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Surname</TableCell>
							<TableCell>Gender</TableCell>
							<TableCell>Age</TableCell> {/* Changed from DOB to Age */}
							<TableCell>Last Update</TableCell>
							<TableCell>Details</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paddedRows.map((row, index) => (
							<React.Fragment key={index}>
								<TableRow onClick={() => handleRowClick(row.HN)}>
									<TableCell>{row.HN || ""}</TableCell>
									<TableCell>{row.prefix || ""}</TableCell>
									<TableCell>{row.name || ""}</TableCell>
									<TableCell>{row.surname || ""}</TableCell>
									<TableCell>{row.gender || ""}</TableCell>
									<TableCell>{row.DOB ? calculateAge(row.DOB) : ""}</TableCell>
									<TableCell>{row.lastUpdate || ""}</TableCell>
									<TableCell>
										{row.HN ? (
											<button onClick={() => handleRowClick(row.HN)}>
												Show Details
											</button>
										) : (
											<button disabled>No Details</button>
										)}
									</TableCell>
								</TableRow>
								{expandedRows.includes(row.HN) && (
									<TableRow key={`${index}-subrow`}>
										<TableCell colSpan={8}>
											<div className="sub-row">
												<Table size="small">
													<TableHead>
														<TableRow>
															<TableCell>Timestamp</TableCell>
															<TableCell>Detail</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{/* Replace with actual record data */}
														<TableRow>
															<TableCell>Sample Timestamp</TableCell>
															<TableCell>Sample Detail</TableCell>
														</TableRow>
													</TableBody>
												</Table>
											</div>
										</TableCell>
									</TableRow>
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{filteredRows.length > rowsPerPage && (
				<div className="pagination">
					<span>
						Showing data {indexOfFirstRow + 1} to{" "}
						{Math.min(indexOfLastRow, filteredRows.length)} of{" "}
						{filteredRows.length} entries
					</span>
					<div className="pagination-controls">
						<button
							onClick={() => handlePageChange("prev")}
							disabled={currentPage === 1}
						>
							{"<"}
						</button>
						<button
							onClick={() => handlePageChange("next")}
							disabled={indexOfLastRow >= filteredRows.length}
						>
							{">"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TableComponent;
