import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableContainer,
  Paper,
  MenuItem,
  Menu,
  CircularProgress,
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
import FilterListIcon from "@mui/icons-material/FilterList";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FA4616", // Orange color
    },
  },
});

const TableComponent = () => {
  const { customers, isLoading, error, deleteCustomer, refetchCustomers } =
    useCustomers();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(customers, [
    "name",
    "surname",
    "customer_id",
  ]);
  const { currentItems, currentPage, handlePageChange } = usePagination(
    filteredItems,
    15
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleCustomerIdFilter = (customerId) => {
    setSelectedCustomerId(customerId);
    setSearchTerm(customerId);
    handleFilterClose();
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsPopupOpen(true);
  };

  const handleDelete = async (customer_id) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteCustomer(customer_id); // ใช้ await ตรวจสอบการลบที่ frontend
      await refetchCustomers(); // ดึงข้อมูลใหม่ทันทีหลังจากลบ
    } catch (error) {
      console.error("Deletion failed:", error.message);
      setDeleteError("Failed to delete customer, please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRowClick = (customer_ID) => {
    setExpandedRows((prev) =>
      prev.includes(customer_ID)
        ? prev.filter((rowCustomer_Id) => rowCustomer_Id !== customer_ID)
        : [...prev, customer_ID]
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ mr: 2 }}>
            รายชื่อคนยืมพัสดุ
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontSize: "1rem",
                minWidth: "150px",
              }}
              onClick={() => {
                setEditingCustomer(null, setIsPopupOpen(true));
              }}
            >
              เพิ่มรายชื่อคนยืมพัสดุ
            </Button>
          </ThemeProvider>

          <ThemeProvider theme={theme}>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                ml: 2,
                fontSize: "1rem",
                minWidth: "150px",
                textTransform: "none",
              }}
              onClick={handleFilterClick}
            >
              <FilterListIcon sx={{ mr: 1 }} />
              Filters
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleFilterClose}
            >
              {customers.map((customer) => (
                <MenuItem
                  key={customer.customer_id}
                  onClick={() => handleCustomerIdFilter(customer.customer_id)}
                >
                  {customer.customer_id}
                </MenuItem>
              ))}
            </Menu>
          </ThemeProvider>
        </Box>
      </Box>

      {isDeleting && <CircularProgress sx={{ margin: "20px auto" }} />}
      {deleteError && (
        <Typography color="error" variant="body1" sx={{ mb: 2 }}>
          {deleteError}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHeader />
          <TableBody>
            {currentItems
              .sort((a, b) => a.customer_id - b.customer_id) // Sort the items by customer_id
              .map((row, index) => (
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
