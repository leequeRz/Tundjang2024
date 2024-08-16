// Pagination Component
const Pagination = ({
	currentPage,
	indexOfFirstRow,
	indexOfLastRow,
	totalRows,
	onPageChange,
}) => {
	return (
		<div className="pagination">
			<span>
				Showing data {indexOfFirstRow + 1} to{" "}
				{Math.min(indexOfLastRow, totalRows)} of {totalRows} entries
			</span>
			<div className="pagination-controls">
				<button
					onClick={() => onPageChange("prev")}
					disabled={currentPage === 1}
				>
					{"<"}
				</button>
				<button
					onClick={() => onPageChange("next")}
					disabled={indexOfLastRow >= totalRows}
				>
					{">"}
				</button>
			</div>
		</div>
	);
};

export default Pagination;
