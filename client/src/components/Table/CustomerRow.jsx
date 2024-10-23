import React, { useState } from "react";
import { TableRow, TableCell, Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import { calculateAge } from "../../utils/helper";

import CustomerRecordRow from "./CustomerRecordRow";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";

const CustomerRow = ({ row, isExpanded, handleRowClick, onEdit, onDelete }) => {
  const { customer_id, name, surname, phone, tel, role, group } = row;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const isCustomer_idPresent = !!customer_id;

  // Define a media query to check if the screen is mobile-sized
  // const isMobile = useMediaQuery('(max-width:600px)');

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setCustomerToDelete(customer_id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(customerToDelete);
    setDialogOpen(false);
  };

  return (
    <>
      <TableRow onClick={() => handleRowClick(customer_id)}>
        <TableCell>{customer_id || ""}</TableCell>
        {/* {!isMobile && <TableCell>{prefix || ""}</TableCell>} */}
        <TableCell>{name || ""}</TableCell>
        <TableCell>{surname || ""}</TableCell>
        <TableCell>{phone || ""}</TableCell>
        <TableCell>{tel || ""}</TableCell>
        <TableCell>{role || ""}</TableCell>
        <TableCell>{group || ""}</TableCell>

        <TableCell>
          <Tooltip title="Edit Customer">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              color="primary"
              disabled={!isCustomer_idPresent}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer">
            <IconButton
              onClick={handleDeleteClick}
              color="error"
              disabled={!isCustomer_idPresent}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      {isExpanded && <CustomerRecordRow customer={row} />}

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

export default CustomerRow;
