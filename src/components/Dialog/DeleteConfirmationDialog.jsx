import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from "@mui/material";

const DeleteConfirmationDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm Deletion",
	contentText = "Are you sure you want to delete this item?",
	confirmButtonText = "Delete",
	cancelButtonText = "Cancel",
	confirmButtonColor = "error",
	additionalContent,
}) => {
	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{contentText}</DialogContentText>
				{additionalContent}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>{cancelButtonText}</Button>
				<Button
					variant="contained"
					color={confirmButtonColor}
					onClick={onConfirm}
				>
					{confirmButtonText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteConfirmationDialog;
