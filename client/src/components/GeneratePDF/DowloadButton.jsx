// import React, { useRef } from "react";

// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const DownloadButton = () => {
//   const pdfRef = useRef();
//   const downloadPDF = () => {
//     const input = pdfRef.current;
//     html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
//       const pdf = new jsPDF("p", "mm", "a4", true);

//       const padding = 10; // Set padding in mm

//       const pdfWidth = 210; // A4 width in mm
//       const pdfHeight = 297; // A4 height in mm
//       const contentWidth = pdfWidth - padding * 2; // Width with padding
//       const imgHeight = (canvas.height * contentWidth) / canvas.width; // Scale image height proportionally

//       let position = padding; // Start position with padding
//       let remainingHeight = imgHeight;

//       const imgData = canvas.toDataURL("image/png");

//       // Add pages if the content height is larger than A4 page height
//       while (remainingHeight > 0) {
//         pdf.addImage(
//           imgData,
//           "PNG",
//           padding,
//           position,
//           contentWidth,
//           imgHeight
//         );
//         remainingHeight -= pdfHeight - padding * 2; // Adjust height by removing the padding from both sides
//         position -= pdfHeight - padding * 2;

//         if (remainingHeight > 0) {
//           pdf.addPage();
//           position = padding; // Reset position for new page
//         }
//       }

//       pdf.save("test.pdf");
//     });
//   };

//   return (
//     <div className="row text-center mt-5">
//       <button className="btn btn-primary" onClick={downloadPDF}>
//         Download PDF
//       </button>
//     </div>
//   );
// };

// export default DownloadButton;
