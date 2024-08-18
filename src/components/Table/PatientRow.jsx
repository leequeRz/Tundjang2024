import React, { useState } from "react";
import {
	TableRow,
	TableCell,
	Tooltip,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
	CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { calculateAge } from "../../utils/helper";
import usePatientRecord from "../../hooks/usePatientRecord";
import PatientRecordRow from "./PatientRecordRow";

const PatientRow = ({ row, isExpanded, handleRowClick, onEdit, onDelete }) => {
	const { HN, prefix, name, surname, gender, DOB, lastUpdate } = row;
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [patientToDelete, setPatientToDelete] = useState(null);

	const { record, isLoading } = usePatientRecord(HN);

	const isHNPresent = !!HN;

	const handleDeleteClick = (e) => {
		e.stopPropagation();
		setPatientToDelete(HN);
		setDialogOpen(true);
	};

	const confirmDelete = () => {
		onDelete(patientToDelete);
		setDialogOpen(false);
	};

	return (
		<>
			<TableRow onClick={() => handleRowClick(HN)}>
				<TableCell>{HN || ""}</TableCell>
				<TableCell>{prefix || ""}</TableCell>
				<TableCell>{name || ""}</TableCell>
				<TableCell>{surname || ""}</TableCell>
				<TableCell>{gender || ""}</TableCell>
				<TableCell>{DOB ? calculateAge(DOB) : ""}</TableCell>
				<TableCell>{lastUpdate || ""}</TableCell>
				<TableCell>
					<Tooltip title="Edit Patient">
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								onEdit(row);
							}}
							color="primary"
							disabled={!isHNPresent}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete Patient">
						<IconButton
							onClick={handleDeleteClick}
							color="error"
							disabled={!isHNPresent}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
			{isExpanded && (
				<>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={8} align="center">
								<CircularProgress />
							</TableCell>
						</TableRow>
					) : (
						<PatientRecordRow patient={row} record={record} />
					)}
				</>
			)}

			<Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete the patient with HN: {HN}?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
					<Button variant="contained" color="error" onClick={confirmDelete}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default PatientRow;
