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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useCustomers } from "../../context/customerContext";
import { usePagination } from "../../hooks/usePagination";
import { useSearch } from "../../hooks/useSearch";
import SearchBar from "../SearchBar";
import TableHeader from "./TableHeader";
import CustomerRow from "./CustomerRow";
import PaginationFooter from "./PaginationFooter";
import CustomerPopup from "./CustomerPopup";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFC72C", // Orange color
    },
  },
});

const TableComponent = () => {
  const { customers, isLoading, error, deleteCustomer } = useCustomers();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(customers, [
    "name",
    "surname",
    "customer_id",
  ]);
  const { currentItems, currentPage, handlePageChange } = usePagination(
    filteredItems,
    15
  );

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsPopupOpen(true);
  };

  const handleDelete = (customer_id) => {
    deleteCustomer(customer_id);
  };

  const handleRowClick = (customer_ID) => {
    setExpandedRows((prev) =>
      prev.includes(customer_ID) ? prev.filter((rowCustomer_Id) => rowCustomer_Id !== customer_ID) : [...prev, customer_ID]
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
        <Typography variant="h6">รายชื่อคนยืมพัสดุ</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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

      <TableContainer component={Paper}>
        <Table>
          <TableHeader />
          <TableBody>
            {currentItems.map((row, index) => (
              <CustomerRow
                key={row.customer_id || index}
                row={row}
                isExpanded={expandedRows.includes(row.customer_id)}
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

      <CustomerPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        customerData={editingCustomer}
      />
    </Box>
  );
};

export default TableComponent;
