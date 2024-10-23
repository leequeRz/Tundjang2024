import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
	IconButton,
	CircularProgress,
	Button,
	Box,
	Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomerRecordPopup from "./CustomerRecordPopup";
import { useCustomerRecords } from "../../context/customerRecordContext";
import { useSelectedItem } from "../../context/mainContentContext";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";
import { formatDateToThai } from "../../utils/helper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RecordPopup from "./RecordPopup";
import { useCustomers } from "../../context/customerContext";
import { useSearch } from "../../hooks/useSearch";

const theme = createTheme({
	palette: {
		primary: {
			main: "#FFC72C", // Orange color
		},
	},
});

const CustomerRecordRow = ({ customer }) => {
	// Hooks must be called at the top level
	const [PopupOpen, setPopupOpen] = useState(false);
	const { customers, isLoading, error, deleteCustomer } = useCustomers();
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [editingCustomer, setEditingCustomer] = useState(null);
	const [expandedRows, setExpandedRows] = useState([]);

	
	const [customerRecord, setCustomerRecord] = useState({
		start_date: "",
		end_date: "",
		detail1: "",
		detail2: "",
		// Item: "",
		// count: "",
		// Responsible_person: "",
		// Item_number: "",
		// Status: "",

	});
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [recordToDelete, setRecordToDelete] = useState({
		customer_id: customer.customer_id,
		docId: null,
	});
	const { useFetchRecords, setCurrentEditRecord, deleteRecord } = useCustomerRecords();
	const { setSelectedSidebarItem } = useSelectedItem();

	// Conditional rendering logic should come after all hooks
	if (isLoading) return <Typography>Loading...</Typography>;
	if (error) return <Typography>Error: {error}</Typography>;

	const handleEdit = (customer) => {
		setEditingCustomer(customer);
		setIsPopupOpen(true);
	};

	const handleDelete = (customer_id) => {
		deleteCustomer(customer_id);
	};

	const handleRowClick = (customer_ID) => {
		setExpandedRows((prev) =>
			prev.includes(customer_ID)
				? prev.filter((rowCustomer_Id) => rowCustomer_Id !== customer_ID)
				: [...prev, customer_ID]
		);
	};

	const handleNewClick = (e, docId) => {
		e.stopPropagation();
		setCurrentEditRecord((prev) => ({
			customer_id: customer.customer_id,
			docId: { id: "create-new", label: "Create New Record" },
		}));
		setSelectedSidebarItem("Form");
	};

	const handleDeleteClick = (e, docId) => {
		e.stopPropagation();
		setRecordToDelete((prev) => ({ customer_id: prev.customer_id, docId: docId }));
		setDialogOpen(true);
	};

	const handleEditClick = (e, customer_id, docId) => {
		e.stopPropagation();
		setCurrentEditRecord({
			customer_id: customer_id,
			docId: { id: docId, label: docId },
		});
		setSelectedSidebarItem("Form");
	};

	const confirmDelete = () => {
		deleteRecord(recordToDelete);
		setDialogOpen(false);
	};

	const openPopup = () => setPopupOpen(true);
	const closePopup = () => setPopupOpen(false);

	// Fetch records for the given customer customer_id
	const CustomerRecordsDisplay = () => {
		const { data: records = [], isLoading, isError } = useFetchRecords(customer.customer_id);

		if (isLoading) return <CircularProgress />;
		if (isError) return <div>Error loading records</div>;

		// Sort records by timestamp in descending order (latest first)
		const sortedRecords = records.slice().sort((a, b) => {
			return new Date(b.create_time) - new Date(a.create_time);
		});

		return sortedRecords.map((entry) => (
			<TableRow
				key={entry.id}
				onClick={() => {
					setCustomerRecord(entry);
					openPopup();
				}}
			>
				<TableCell>{formatDateToThai(entry.create_time)}</TableCell>
				<TableCell>{entry.notes}</TableCell>
				<TableCell>
					<Tooltip title="Edit Customer">
						<IconButton
							onClick={(e) => {
								handleEditClick(e, customer.customer_id, entry.id);
							}}
							color="primary"
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete customer">
						<IconButton
							onClick={(e) => {
								handleDeleteClick(e, entry.id);
							}}
							color="error"
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
		));
	};

	return (
		<>
			<TableRow>
				<TableCell colSpan={8}>
					<div className="sub-row">
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Time</TableCell>
									<TableCell>Detail</TableCell>
									<TableCell>
										<Button onClick={handleNewClick}>Add New Record</Button>
									</TableCell>
									{/* <TableCell>
										
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
													mb: 2,
												}}
											>
								
												<Box sx={{ display: "flex", alignItems: "center" }}>
												
													<ThemeProvider theme={theme}>
														<Button
															variant="contained"
															color="primary"
															sx={{ ml: 2 }}
															onClick={() => {
																setEditingCustomer(null, setIsPopupOpen(true));
															}}
														>
															เพิ่มรายชื่อคนยืมพัสดุ
														</Button>
													</ThemeProvider>
												</Box>
											</Box>
											<RecordPopup
												open={isPopupOpen}
												onClose={() => setIsPopupOpen(false)}
												customerData={editingCustomer}
											/>
										
									</TableCell> */}
								</TableRow>
							</TableHead>
							<TableBody>
								<CustomerRecordsDisplay />
							</TableBody>
						</Table>
					</div>
				</TableCell>
			</TableRow>

			<CustomerRecordPopup
				open={PopupOpen}
				onClose={closePopup}
				customer={customer}
				record={customerRecord}
			/>
			<DeleteConfirmationDialog
				isOpen={isDialogOpen}
				onClose={() => setDialogOpen(false)}
				onConfirm={confirmDelete}
				title="Confirm Deletion"
				contentText={`Are you sure you want to delete the record with id: ${recordToDelete.docId}?`}
			/>
		</>
	);
};

export default CustomerRecordRow;
