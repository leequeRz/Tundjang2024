import { Box, InputBase } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "background.paper",
      borderRadius: 1,
      p: 0.5,
    }}
  >
    <SearchIcon sx={{ mr: 1 }} />
    <InputBase
      placeholder="ค้นหาชื่อ นามสกุล เลข UID"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ width: { xs: 200, sm: 300 } }}
    />
  </Box>
);

export default SearchBar;
