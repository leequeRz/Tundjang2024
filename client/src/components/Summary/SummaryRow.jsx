import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import SummaryRecordRow from "./SummaryRecordRow";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";

const SummaryRow = ({ row, isExpanded, handleRowClick, onEdit, onDelete }) => {
  const { customer_id, name, surname, phone, tel, role, group } = row;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const isCustomer_idPresent = !!customer_id;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setCustomerToDelete(customer_id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(customerToDelete);
    setDialogOpen(false);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#FA4616", // Orange color
      },
    },
  });

  return (
    <>
      <TableRow onClick={() => handleRowClick(customer_id)}>
        <TableCell>{customer_id || ""}</TableCell>
        <TableCell>{name || ""}</TableCell>
        <TableCell>{surname || ""}</TableCell>
        <TableCell>{phone || ""}</TableCell>
        <TableCell>{tel || ""}</TableCell>
        <TableCell>{role || ""}</TableCell>
        <TableCell>{group || ""}</TableCell>
      </TableRow>
      {isExpanded && <SummaryRecordRow customer={row} />}

      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        contentText={`Are you sure you want to delete the Customer with customer_id: ${customer_id}?`}
      />
    </>
  );
};

export default SummaryRow;
