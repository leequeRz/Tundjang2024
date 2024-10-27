import { Typography, Box, Pagination as MuiPagination } from "@mui/material";

const PaginationSummary = ({
  total,
  currentPage,
  rowsPerPage,
  onPageChange,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mt: 2,
    }}
  >
    {/* <Typography>
      Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
      {Math.min(currentPage * rowsPerPage, total)} of {total} entries
    </Typography> */}
    <MuiPagination
      count={Math.ceil(total / rowsPerPage)}
      page={currentPage}
      onChange={onPageChange}
      color="primary"
      showFirstButton
      showLastButton
    />
  </Box>
);

export default PaginationSummary;
