import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";

const PatientRecordRow = ({ record }) => {
	return (
		<TableRow>
			<TableCell colSpan={8}>
				<div className="sub-row">
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Timestamp</TableCell>
								<TableCell>Detail</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{record.map((entry) => (
								<TableRow key={entry.timestamp}>
									<TableCell>{entry.timestamp}</TableCell>
									<TableCell>{entry.detail}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</TableCell>
		</TableRow>
	);
};

export default PatientRecordRow;
