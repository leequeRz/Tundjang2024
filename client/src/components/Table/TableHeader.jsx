import { TableCell, TableHead, TableRow } from "@mui/material";

const TableHeader = () => (
  <TableHead>
    <TableRow>
      {[
        { label: "Edit / Delete", key: "HN" },
        { label: "ชื่อผู้รับ", key: "Prefix", hiddenOnMobile: true },
        { label: "ตำแหน่ง", key: "Name" },
        { label: "ผู้รับผิดชอบ", key: "Surname" },
        { label: "สังกัดหน่วยงาน", key: "Gender", hiddenOnMobile: true },
        { label: "เบอร์โทรศัพท์", key: "Age", hiddenOnMobile: true },
        { label: "Last Update", key: "Last Update", hiddenOnMobile: true },
        { label: "", key: "Details" },
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
