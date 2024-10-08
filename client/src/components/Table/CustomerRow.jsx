import React, { useState } from "react";
import { TableRow, TableCell, Tooltip, IconButton, useMediaQuery } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { calculateAge } from "../../utils/helper";

import CustomerRecordRow from "./CustomerRecordRow";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";

const CustomerRow = ({ row, isExpanded, handleRowClick, onEdit, onDelete }) => {
  const { HN, prefix, name, surname, gender, DOB, lastUpdate } = row;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const isHNPresent = !!HN;
  
  // Define a media query to check if the screen is mobile-sized
  const isMobile = useMediaQuery('(max-width:600px)');

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
      <TableRow onClick={() => handleRowClick(HN)}>
        <TableCell>{HN || ""}</TableCell>
        {!isMobile && <TableCell>{prefix || ""}</TableCell>}
        <TableCell>{name || ""}</TableCell>
        <TableCell>{surname || ""}</TableCell>
        {!isMobile && <TableCell>{gender || ""}</TableCell>}
        {!isMobile && <TableCell>
          {DOB ? calculateAge(DOB) : ""}
        </TableCell>}
        {!isMobile && <TableCell>{lastUpdate || ""}</TableCell>}
        <TableCell>
          <Tooltip title="Edit Customer">
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
          <Tooltip title="Delete Customer">
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
      {isExpanded && <CustomerRecordRow customer={row} />}

      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        contentText={`Are you sure you want to delete the Customer with HN: ${customer_id}?`}
      />
    </>
  );
};

export default CustomerRow;
