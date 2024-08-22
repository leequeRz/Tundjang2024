import { TableCell, TableHead, TableRow } from "@mui/material";

const TableHeader = () => (
	<TableHead>
		<TableRow>
			{[
				{ label: "HN", key: "HN" },
				{ label: "Prefix", key: "Prefix" },
				{ label: "Name", key: "Name" },
				{ label: "Surname", key: "Surname" },
				{ label: "Gender", key: "Gender" },
				{ label: "Age", key: "Age" },
				{ label: "Last Update", key: "Last Update" },
				{ label: "", key: "Details" },
			].map(({ label, key }) => (
				<TableCell
					key={key}
					sx={{
						fontWeight: "bold",
						fontSize: "1.05rem",
						backgroundColor: "#f5f5f5",
					}}
				>
					{label}
				</TableCell>
			))}
		</TableRow>
	</TableHead>
);

export default TableHeader;
