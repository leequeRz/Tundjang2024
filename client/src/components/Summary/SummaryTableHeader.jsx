import { TableCell, TableHead, TableRow } from "@mui/material";

const SummaryTableHeader = () => (
  <TableHead>
    <TableRow>
      {[
        { label: "UID", key: "customer_id" },
        // { label: "Prefix", key: "Prefix", hiddenOnMobile: true },
        { label: "ชื่อ", key: "Name" },
        { label: "นามสกุล", key: "Surname" },
        // { label: "Gender", key: "Gender", hiddenOnMobile: true },
        // { label: "Age", key: "Age", hiddenOnMobile: true },
        // { label: "Last Update", key: "Last Update", hiddenOnMobile: true },
        { label: "หมายเลขโทรศัพท์", key: "Phone" },
        { label: "หมายเลขโทรศัพท์ภายใน", key: "tel" },
        { label: "ตำแหน่ง", key: "role" },
        { label: "สังกัด", key: "group" },
        //   { label: "Edit & Delete", key: "" },
        //   { label: "Export PDF", key: "" },
      ].map(({ label, key, hiddenOnMobile }) => (
        <TableCell
          key={key}
          sx={{
            fontWeight: "bold",
            fontSize: "1.05rem",
            backgroundColor: "white",
            // borderTop: "2px solid black", // Add solid border
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

export default SummaryTableHeader;
