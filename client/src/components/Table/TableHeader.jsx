import { TableCell, TableHead, TableRow } from "@mui/material";

const TableHeader = () => (
  <TableHead>
    <TableRow>
      {[
        { label: "UID", key: "customer_id" },
        // { label: "Prefix", key: "Prefix", hiddenOnMobile: true },
        { label: "Name", key: "Name" },
        { label: "Surname", key: "Surname" },
        // { label: "Gender", key: "Gender", hiddenOnMobile: true },
        // { label: "Age", key: "Age", hiddenOnMobile: true },
        // { label: "Last Update", key: "Last Update", hiddenOnMobile: true },
        { label: "Phone", key: "Phone" },
        { label: "Tel_company", key: "tel" },
        { label: "Role", key: "role" },
        { label: "Group", key: "group" },
        { label: "Edit & Delete", key: "" },
        { label: "Export PDF", key: "" },
      ].map(({ label, key, hiddenOnMobile }) => (
        <TableCell
          key={key}
          sx={{
            fontWeight: "bold",
            fontSize: "1.05rem",
            backgroundColor: "#f5f5f5",
            display: hiddenOnMobile
              ? { xs: "none", sm: "table-cell" }
              : "table-cell",
          }}
        >
          {label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default TableHeader;
