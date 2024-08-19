import React, { useState } from "react";
import { TableRow, TableCell, Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { calculateAge } from "../../utils/helper";

import PatientRecordRow from "./PatientRecordRow";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";

const PatientRow = ({ row, isExpanded, handleRowClick, onEdit, onDelete }) => {
	const { HN, prefix, name, surname, gender, DOB, lastUpdate } = row;
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [patientToDelete, setPatientToDelete] = useState(null);

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
			{isExpanded && <PatientRecordRow patient={row} />}

			<DeleteConfirmationDialog
				isOpen={isDialogOpen}
				onClose={() => setDialogOpen(false)}
				onConfirm={confirmDelete}
				title="Confirm Deletion"
				contentText={`Are you sure you want to delete the patient with HN: ${HN}?`}
			/>
		</>
	);
};

export default PatientRow;
